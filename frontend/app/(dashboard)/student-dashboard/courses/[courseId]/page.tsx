"use client";

import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import confetti from "canvas-confetti";
import {
  LuPlay,
  LuBookOpen,
  LuCircleCheckBig,
  LuChevronRight,
  LuX,
} from "react-icons/lu";

const extractYouTubeId = (url: string) => {
  if (!url) return "";

  // watch?v=
  const watchMatch = url.match(/[?&]v=([^&]+)/);
  if (watchMatch) return watchMatch[1];

  // youtu.be/
  const shortMatch = url.match(/youtu\.be\/([^?&]+)/);
  if (shortMatch) return shortMatch[1];

  // embed/
  const embedMatch = url.match(/embed\/([^?&]+)/);
  if (embedMatch) return embedMatch[1];

  return url; // fallback (if already just ID)
};



export default function StudentCourseDetailPage() {
  const { courseId } = useParams();
  const router = useRouter();

  const [lessons, setLessons] = useState<any[]>([]);
  const [progress, setProgress] = useState<any>(null);
  const [activeLesson, setActiveLesson] = useState<any>(null);
  const [quiz, setQuiz] = useState<any>(null);

  const [sections, setSections] = useState<any[]>([]);
  const [currentSection, setCurrentSection] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [lessonCompleted, setLessonCompleted] = useState(false);

  const [showQuizModal, setShowQuizModal] = useState(false);
  const [lessonProgress, setLessonProgress] = useState<any>(null);

  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [localMilestone, setLocalMilestone] = useState(0);
  // local milestone state
  const [videoMilestone, setVideoMilestone] = useState(0);
  const videoMilestoneRef = React.useRef(0);
  const resumePercentRef = React.useRef(0);

  const playerRef = React.useRef<HTMLDivElement | null>(null);
  const ytPlayerRef = React.useRef<any>(null);
  const intervalRef = React.useRef<any>(null);
  const milestoneRequestRef = React.useRef(false);
  const lastTimeRef = React.useRef(0);

const saveMilestone = async (percentage: number) => {
  if (!activeLesson) return;
  if (videoMilestoneRef.current >= percentage) return;
  if (lessonProgress?.completed) return;

  //prevent duplicate concurrent calls
  if (milestoneRequestRef.current) return;
  milestoneRequestRef.current = true;

  try {
    const token = localStorage.getItem("token");

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/progress/lesson`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          lesson_id: activeLesson.lesson_id,
          progress_percentage: percentage,
        }),
      }
    );

    if (!res.ok) return;

    const updated = await res.json();
    if (!updated) return;

    videoMilestoneRef.current =
      updated.last_rewarded_percentage ?? percentage;

    setLessonProgress(updated);

    setProgress((prev: any) => {
      if (!prev) return prev;

      const updatedLessons = prev.completed_lessons
        ? prev.completed_lessons.map((l: any) =>
            l.lesson_id === updated.lesson_id ? updated : l
          )
        : [updated];

      return {
        ...prev,
        completed_lessons: updatedLessons,
      };
    });

    const percent = Number(updated.progress_percentage || 0);
    const points = Number(updated.points || 0);

    if (points > 0) {
      toast.success(
        `🎉 +${points} points! (${percent.toFixed(0)}% completed)`
      );
      confetti({ particleCount: 120, spread: 90 });
    }

    if (updated.completed) {
      setLessonCompleted(true);
    }

  } finally {
    // release lock
    milestoneRequestRef.current = false;
  }
};

  useEffect(() => {
    if (!lessonProgress) return;

    if (lessonProgress.completed) {
      setLessonCompleted(true);
    }
  }, [lessonProgress]);

  // fetching lessons and progress data

  useEffect(() => {
  const fetchData = async () => {
    const token = localStorage.getItem("token");

    const lessonsRes = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/lessons/course/${courseId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    const lessonsData = await lessonsRes.json();
    setLessons(lessonsData);

    const progressRes = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/progress`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    const progressData = await progressRes.json();
    setProgress(progressData);

    const inProgressLesson =
    lessonsData.find((lesson: any) => {
        const existing = progressData?.completed_lessons?.find(
        (l: any) => l.lesson_id === lesson.lesson_id
        );

        return existing && existing.progress_percentage > 0 && !existing.completed;
    });

    const notStartedLesson =
    lessonsData.find((lesson: any) => {
        const existing = progressData?.completed_lessons?.find(
        (l: any) => l.lesson_id === lesson.lesson_id
        );

        return !existing || existing.progress_percentage === 0;
    });

    const selectedLesson =
    inProgressLesson ||
    notStartedLesson ||
    lessonsData[0];

    setActiveLesson(selectedLesson);

    const existingLessonProgress =
    progressData?.completed_lessons?.find(
      (l: any) => l.lesson_id === selectedLesson.lesson_id
    ) || null;

    setLessonProgress(existingLessonProgress);

    setLoading(false);
  };

  fetchData();
}, [courseId]);

  useEffect(() => {
  if (!activeLesson || !progress) return;

  const existingLessonProgress =
    progress?.completed_lessons?.find(
      (l: any) => l.lesson_id === activeLesson.lesson_id
    ) || null;

  setLessonProgress(existingLessonProgress);
}, [activeLesson, progress]);

const saveReadingMilestone = async (percentage: number) => {
  const lastRewarded =
    lessonProgress?.last_rewarded_percentage ?? 0;

  if (percentage <= lastRewarded) return;

  const token = localStorage.getItem("token");

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/progress/lesson`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        lesson_id: activeLesson.lesson_id,
        progress_percentage: percentage,
      }),
    }
  );

  if (!res.ok) return;

  const updated = await res.json();
  setLessonProgress(updated);

  const percent = Number(updated.progress_percentage || 0);
  const points = Number(updated.points || 0);

  if (points > 0) {
    toast.success(
      `🎉 +${points} points! (${percent.toFixed(0)}% completed)`
    );
    confetti({ particleCount: 120, spread: 80 });
  }

  if (updated.completed) {
    setLessonCompleted(true);
  }

};

const markLessonStarted = async () => {
  if (!activeLesson) return;
  if (!progress) return;

  const existing = progress.completed_lessons?.find(
    (l: any) => l.lesson_id === activeLesson.lesson_id
  );

  // If lesson already has progress, do not send another request (prevents overwriting progress_percentage with 1)
  if (existing && existing.progress_percentage > 0) return;

  const token = localStorage.getItem("token");

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/progress/lesson`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        lesson_id: activeLesson.lesson_id,
        progress_percentage: 1,
      }),
    }
  );

  if (!res.ok) return;

  const updated = await res.json();
  setLessonProgress(updated);
  setLocalMilestone(1);
};

useEffect(() => {
  if (!activeLesson) return;

  if (activeLesson.content_type !== "reading") return;

  const timer = setTimeout(() => {
    markLessonStarted();
  }, 800);

  return () => clearTimeout(timer);
}, [activeLesson]);

  // formatting the backend reading 
  useEffect(() => {
  if (!activeLesson) return;
  if (activeLesson.content_type !== "reading") return;

  if (!activeLesson.content) {
    setSections([]);
    return;
  }

  const parts = activeLesson.content.split("⸻");

  const formatted = parts.map((p: string) => {
    const lines = p.trim().split("\n");
    return {
      title: lines[0] || "",
      body: lines.slice(1).join("\n"),
    };
  });

  setSections(formatted);

  const savedPercent = lessonProgress?.progress_percentage || 0;
  setLocalMilestone(savedPercent);

  if (formatted.length > 0 && savedPercent > 0) {
    const resumeIndex = Math.floor(
      (savedPercent / 100) * formatted.length
    );

    setCurrentSection(
      resumeIndex >= formatted.length
        ? formatted.length - 1
        : resumeIndex
    );
  } else {
    setCurrentSection(0);
  }

  setLessonCompleted(lessonProgress?.completed || false);
}, [activeLesson, lessonProgress]);

// initial video milestone setup based on existing progress
useEffect(() => {
  if (!lessonProgress) return;

  const rewarded = lessonProgress.last_rewarded_percentage ?? 0;

  videoMilestoneRef.current = rewarded;
}, [lessonProgress]);

useEffect(() => {
  if (!activeLesson) return;
  if (activeLesson.content_type !== "video") return;
  if (!lessonProgress) return;
  if (lessonProgress.completed) return;

  const loadPlayer = () => {
    if (!playerRef.current) return;

    // prevent duplicate players
    if (ytPlayerRef.current) {
      try {
        ytPlayerRef.current.destroy();
      } catch {}
      ytPlayerRef.current = null;
    }

    ytPlayerRef.current = new (window as any).YT.Player(
      playerRef.current,
      {
        videoId: extractYouTubeId(activeLesson.content),
        events: {
          onReady: () => {
            const player = ytPlayerRef.current;

            // Resume from saved progress
            const savedPercent = lessonProgress?.progress_percentage ?? 0;

            if (savedPercent > 1) {
              const waitForDuration = setInterval(() => {
                const duration = player.getDuration();

                if (duration && duration > 0) {
                  clearInterval(waitForDuration);

                  const seekToTime = (savedPercent / 100) * duration;
                  player.seekTo(seekToTime, true);
                }
              }, 300);
            }

            // clear previous interval if exists
            if (intervalRef.current) {
              clearInterval(intervalRef.current);
              intervalRef.current = null;
            }

            intervalRef.current = setInterval(() => {
              if (!player) return;

              const duration = player.getDuration();
              const current = player.getCurrentTime();

              // Detect skip
              if (lastTimeRef.current > 0) {
                const jump = current - lastTimeRef.current;

                if (jump > 3) {
                  toast.error("⚠️ Skipping is not allowed. Please watch properly.");
                  player.seekTo(lastTimeRef.current, true);
                  return;
                }
              }

              // update last watched time
              lastTimeRef.current = current;

              if (!duration || current === undefined) return;

              //Only track when actually playing
              if (
                !player.getPlayerState ||
                player.getPlayerState() !==
                  (window as any).YT.PlayerState.PLAYING
              ) {
                return;
              }

              const percentWatched = (current / duration) * 100;

              // 1% start trigger
              if (current > 1 && videoMilestoneRef.current < 1) {
                saveMilestone(1);
              }

              const milestones = [25, 50, 75, 100];

              for (const m of milestones) {
                if (
                  percentWatched >= m &&
                  videoMilestoneRef.current < m
                ) {
                  saveMilestone(m);
                  break;
                }
              }
            }, 1000);
          },

          onStateChange: (event: any) => {
          const YT = (window as any).YT;

          if (!YT) return;

          // When video fully ends
          if (event.data === YT.PlayerState.ENDED) {
            if (videoMilestoneRef.current < 100) {
              markLessonComplete();
            }
          }
        },

        },
      }
    );
  };

  if ((window as any).YT?.Player) {
    loadPlayer();
  } else {
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    document.body.appendChild(tag);

    (window as any).onYouTubeIframeAPIReady = loadPlayer;
  }

  return () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (ytPlayerRef.current) {
      try {
        ytPlayerRef.current.destroy();
      } catch {}
      ytPlayerRef.current = null;
    }
  };
}, [activeLesson]); 

  const markLessonComplete = async () => {
    const token = localStorage.getItem("token");

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/progress/lesson`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
            lesson_id: activeLesson.lesson_id,
            progress_percentage: 100,
        }),
        });

        const updated = await res.json();

        setLessonProgress(updated);
        setProgress((prev: any) => {
            if (!prev) return prev;

            const updatedLessons = prev.completed_lessons
                ? prev.completed_lessons.map((l: any) =>
                    l.lesson_id === updated.lesson_id ? updated : l
                )
                : [updated];

            return {
                ...prev,
                completed_lessons: updatedLessons,
            };
            });

        if (!updated || typeof updated !== "object") return;

            const percent = Number(updated.progress_percentage || 0);
            const points = Number(updated.points || 0);

            toast.success(
            `🎉 +${points} points! (${percent.toFixed(0)}% completed)`
            );

        confetti({ particleCount: 120, spread: 80 });

        setLessonCompleted(true);

        
  };

  // Reading lesson section navigation and milestone tracking

const nextSection = async () => {
  if (isProcessing) return;

  setIsProcessing(true);

  try {
    const total = sections.length;
    const nextIndex = currentSection + 1;

    // Move section FIRST
    if (currentSection < total - 1) {
      setCurrentSection(nextIndex);
    }

    const percent = Math.floor((nextIndex / total) * 100);

    // Determine next milestone based on localMilestone
    let milestoneToSend = 0;

    if (percent >= 100 && localMilestone < 100) {
      milestoneToSend = 100;
    } else if (percent >= 75 && localMilestone < 75) {
      milestoneToSend = 75;
    } else if (percent >= 50 && localMilestone < 50) {
      milestoneToSend = 50;
    } else if (percent >= 25 && localMilestone < 25) {
      milestoneToSend = 25;
    }

    if (milestoneToSend > 0) {
      await saveReadingMilestone(milestoneToSend);
      setLocalMilestone(milestoneToSend);
    }

  } finally {
    setIsProcessing(false);
  }
};

  if (loading)
    return (
      <div className="py-20 flex justify-center">
        <div className="w-12 h-12 border-4 border-[#3749a9] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );

  const completedIds =
    progress?.completed_lessons?.map((l: any) => l.lesson_id) || [];

  const progressPercent = lessonProgress?.progress_percentage || 0;

   const progressMap = new Map<string, number>();

    if (progress?.completed_lessons) {
    progress.completed_lessons.forEach((l: any) => {
        progressMap.set(l.lesson_id, l.progress_percentage);
    });
    }

    // override active lesson live progress
    if (lessonProgress?.lesson_id) {
    progressMap.set(
        lessonProgress.lesson_id,
        lessonProgress.progress_percentage
    );
    }

  return (
    <div className="py-8 space-y-8">

      {/* Hero section */}
      <div className="relative rounded-3xl p-10 text-white shadow-xl overflow-hidden bg-gradient-to-r from-[#3749a9] to-[#5b2d8a]">
        <h1 className="text-3xl font-bold">
          {activeLesson.course?.title}
        </h1>
        <p className="mt-3 text-white/80 line-clamp-2">
          {activeLesson.course?.description}
        </p>
      </div>

      {/* Lesson Content */}
      <div className="bg-white rounded-3xl p-8 shadow-md border border-[#e4e6f0]">

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="h-3 rounded-full bg-[#eef1ff] overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#3749a9] to-[#8b5cf6] transition-all duration-700"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

       <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">
            {activeLesson.title}
        </h2>

        {lessonProgress?.progress_percentage > 0 &&
            !lessonProgress?.completed && (
            <span className="text-sm font-semibold text-[#3749a9] bg-[#eef1ff] px-3 py-1 rounded-full">
                Continue
            </span>
        )}
        </div>
        <div className="mb-4">
            {activeLesson.content_type === "video" ? (
                <span className="px-4 py-1.5 rounded-full text-sm font-semibold bg-[#fef3c7] text-[#92400e]">
                🎬 Video Lesson
                </span>
            ) : (
                <span className="px-4 py-1.5 rounded-full text-sm font-semibold bg-[#e0f2fe] text-[#075985]">
                📖 Reading Lesson
                </span>
            )}
            </div>

        {activeLesson.content_type === "video" ? (
          <div className="rounded-2xl overflow-hidden shadow-lg border border-[#e4e6f0]">
        <div ref={playerRef} className="w-full h-[450px]" />
        </div>
        ) : (
          <>
            <div className="bg-[#f9faff] p-8 rounded-2xl">
              <h3 className="font-bold text-lg mb-4">
                {sections[currentSection]?.title}
              </h3>
              <div className="whitespace-pre-line leading-relaxed text-[#374151]">
                {sections[currentSection]?.body}
              </div>
            </div>

            <div className="flex justify-between mt-6">
              <button
                disabled={currentSection === 0 || isProcessing}
                onClick={() => {
                    if (currentSection > 0) {
                    setCurrentSection(prev => prev - 1);
                    }
                }}
                className="px-4 py-2 border rounded-xl disabled:opacity-50"
                >
                Previous
                </button>

              <button
                onClick={nextSection}
                disabled={isProcessing}
                className="px-6 py-2 bg-[#3749a9] text-white rounded-xl flex items-center justify-center gap-2 disabled:opacity-60"
                >
                {isProcessing ? (
                    <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Processing...
                    </>
                ) : currentSection === sections.length - 1 ? (
                    "Finish Lesson"
                ) : (
                    "Next Section"
                )}
                </button>
            </div>
          </>
        )}

        {/* Quiz Section */}
        {lessonCompleted && quiz && (
          <button
            onClick={() => setShowQuizModal(true)}
            className="mt-8 w-full py-3 bg-[#5b2d8a] text-white rounded-2xl font-semibold hover:opacity-90 transition"
          >
            Take Quiz
          </button>
        )}
      </div>

      {/* List of lessons */}
      <div className="bg-white rounded-3xl p-6 shadow border border-[#e4e6f0]">
        <h3 className="font-semibold mb-6">
          Course Lessons
        </h3>

        <div className="grid md:grid-cols-2 gap-5">
          {lessons.map((lesson: any) => {
            const completed =
              completedIds.includes(lesson.lesson_id);

            return (
              <div
                key={lesson.lesson_id}
                onClick={() => setActiveLesson(lesson)}
                className={`group relative rounded-2xl border p-5 cursor-pointer transition-all duration-300
                    ${
                    activeLesson.lesson_id === lesson.lesson_id
                        ? "border-[#3749a9] bg-[#f3f5ff] shadow-md"
                        : "border-[#edf0ff] hover:border-[#3749a9] hover:shadow-md"
                    }`}
                >

                {/* Placeholder image for lesson */}
                <div className="relative h-32 rounded-xl overflow-hidden mb-4">
                    <img
                    src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Status tag to show progress */}
                    <div className="absolute top-3 right-3">
                    {(() => {
                        const lessonData = progress?.completed_lessons?.find(
                            (l: any) => l.lesson_id === lesson.lesson_id
                        );

                        if (lessonData?.completed) {
                            return (
                            <span className="px-3 py-1 text-xs rounded-full bg-[#1b9e5a] text-white font-semibold">
                                Completed
                            </span>
                            );
                        }

                        if (lessonData?.progress_percentage > 0) {
                            return (
                            <span className="px-3 py-1 text-xs rounded-full bg-[#f59e0b] text-white font-semibold">
                                In Progress
                            </span>
                            );
                        }

                        return (
                            <span className="px-3 py-1 text-xs rounded-full bg-[#e5e7eb] text-[#374151] font-semibold">
                            Not Started
                            </span>
                        );
                        })()}
                    </div>
                </div>

                {/* Lesson Title */}
                <div className="flex items-center justify-between">
                    <div>
                    <h4 className="font-semibold text-[#0f1535] group-hover:text-[#3749a9] transition">
                        {lesson.title}
                    </h4>
                    <div className="mt-2">
                        {lesson.content_type === "video" ? (
                            <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full bg-[#fef3c7] text-[#92400e]">
                            <LuPlay size={12} />
                            Video
                            </span>
                        ) : (
                            <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full bg-[#e0f2fe] text-[#075985]">
                            <LuBookOpen size={12} />
                            Reading
                            </span>
                        )}
                        </div>
                    </div>

                    {completedIds.includes(lesson.lesson_id) && (
                    <LuCircleCheckBig className="text-[#1b9e5a]" size={20} />
                    )}
                </div>
                </div>
            );
          })}
        </div>
      </div>

      {/* Modal for the quiz */}
      {showQuizModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-8 w-[400px] relative">
            <button
              onClick={() => setShowQuizModal(false)}
              className="absolute top-4 right-4"
            >
              <LuX />
            </button>
            <h3 className="text-xl font-bold mb-4">
              Ready for the Quiz?
            </h3>
            <button
              onClick={() =>
                router.push(
                  `/student-dashboard/quiz/${quiz.quiz_id}`
                )
              }
              className="w-full py-3 bg-[#3749a9] text-white rounded-xl"
            >
              Start Quiz
            </button>
          </div>
        </div>
      )}
    </div>
  );
}