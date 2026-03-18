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

    const completedIds =
      progressData?.completed_lessons?.map((l: any) => l.lesson_id) || [];

    const firstUnfinished =
      lessonsData.find(
        (l: any) => !completedIds.includes(l.lesson_id)
      ) || lessonsData[0];

    setActiveLesson(firstUnfinished);

    const existingLessonProgress =
      progressData?.completed_lessons?.find(
        (l: any) => l.lesson_id === firstUnfinished.lesson_id
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

  if (lessonProgress && lessonProgress.progress_percentage > 0) return;

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

  toast.info("Lesson started! Keep going to earn points.");
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
    if (activeLesson?.content_type === "reading") {
      const parts = activeLesson.content.split("⸻");
      const formatted = parts.map((p: string) => {
        const lines = p.trim().split("\n");
        return {
          title: lines[0],
          body: lines.slice(1).join("\n"),
        };
      });
      setSections(formatted);
      setCurrentSection(0);
      setStartTime(Date.now());
      setLessonCompleted(false);
    }
  }, [activeLesson]);

  // fetching quiz details for a lesson if it exists

  useEffect(() => {
  if (!activeLesson?.lesson_id) return;

  const fetchQuiz = async () => {
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/quizzes/lesson/${activeLesson.lesson_id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!res.ok) {
        setQuiz(null);
        return;
      }

      const text = await res.text();
      if (!text) {
        setQuiz(null);
        return;
      }

      setQuiz(JSON.parse(text));
    } catch (err) {
      console.error("Quiz fetch error:", err);
      setQuiz(null);
    }
  };

  fetchQuiz();
}, [activeLesson]);




useEffect(() => {
  if (!activeLesson || activeLesson.content_type !== "video") return;

  let player: any;
  let interval: any;

  let watchedSeconds = 0;
  let lastTime = 0;
  let skipped = false;

  const saveMilestone = async (percentage: number) => {

  const lastRewarded =
    lessonProgress?.last_rewarded_percentage ?? 0;

  if (percentage <= lastRewarded) return;
  console.log("Trying milestone:", percentage);
console.log("Last rewarded:", lessonProgress?.last_rewarded_percentage);

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

  setLessonProgress(updated);

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
};

  const initializePlayer = () => {
    player = new (window as any).YT.Player("youtube-player", {
      videoId: extractYouTubeId(activeLesson.content),
      events: {
        onReady: () => {
            markLessonStarted();
          interval = setInterval(async () => {
            if (!player || !player.getDuration) return;

            const duration = player.getDuration();
            const current = player.getCurrentTime();
            if (!duration) return;

            const delta = current - lastTime;

            if (delta > 5) {
            skipped = true;
            toast.error("⏩ Skipping ahead is not allowed!");
            } else if (delta > 0 && delta <= 2) {
            watchedSeconds += delta;
            }

            lastTime = current;

            const m1 = duration * 0.25;
            const m2 = duration * 0.5;
            const m3 = duration * 0.75;
            const m4 = duration - 1;

            console.log("Watched:", watchedSeconds, "Duration:", duration);

            const percentWatched = (watchedSeconds / duration) * 100;

            if (percentWatched >= 25) saveMilestone(25);
            if (percentWatched >= 50) saveMilestone(50);
            if (percentWatched >= 75) saveMilestone(75);
            if (percentWatched >= 99) saveMilestone(100);

          }, 1000);
        },
      },
    });
  };

  if ((window as any).YT?.Player) {
    initializePlayer();
  } else {
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    document.body.appendChild(tag);

    (window as any).onYouTubeIframeAPIReady = () => {
      initializePlayer();
    };
  }

  return () => {
    if (interval) clearInterval(interval);
    if (player?.destroy) player.destroy();
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
  const total = sections.length;

  const nextIndex = currentSection + 1;
  const percent = Math.floor((nextIndex / total) * 100);

  if (percent >= 25) await saveReadingMilestone(25);
  if (percent >= 50) await saveReadingMilestone(50);
  if (percent >= 75) await saveReadingMilestone(75);

  if (currentSection === total - 1) {
    const minutes =
      (Date.now() - (startTime || 0)) / 60000;

    if (minutes < 2) {
      toast.error("⏳ Spend a little more time reading.");
      return;
    }

    await saveReadingMilestone(100);
    return;
  }

  setCurrentSection(prev => prev + 1);
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

        <h2 className="text-xl font-bold mb-6">
          {activeLesson.title}
        </h2>
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
        <div id="youtube-player" className="w-full h-[450px]" />
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
                disabled={currentSection === 0}
                onClick={() =>
                  setCurrentSection(prev => prev - 1)
                }
                className="px-4 py-2 border rounded-xl"
              >
                Previous
              </button>

              <button
                onClick={nextSection}
                className="px-6 py-2 bg-[#3749a9] text-white rounded-xl"
              >
                {currentSection === sections.length - 1
                  ? "Finish Lesson"
                  : "Next Section"}
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
                        const lessonProgressValue =
                        progressMap.get(lesson.lesson_id) ?? 0;

                        if (lessonProgressValue === 100) {
                        return (
                            <span className="px-3 py-1 text-xs rounded-full bg-[#1b9e5a] text-white font-semibold">
                            Completed
                            </span>
                        );
                        }

                        if (lessonProgressValue > 0) {
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