"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/footer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalculator,
  faBookOpen,
  faEarth,
  faDivide,
  faPencil,
  faFlask,
  faMap,
  faRulerCombined,
  faFileLines,
  faMicroscope,
  faLandmark,
  faLanguage,
  faVideo,
  faClock,
  faChevronLeft,
  faPlay,
  faCheckCircle,
  faStar,
  faArrowRight,
  faArrowLeft,
  faTrophy,
  faClipboardQuestion,
  
} from "@fortawesome/free-solid-svg-icons";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";

type Course = {
  id: string;
  title: string;
  subject: string;
  ageGroup: string;
  lessons: number;
  duration: string;
  icon: IconDefinition;
  iconColor: string;
  description: string;
};

type Lesson = {
  id: string;
  title: string;
  contentType: 'video' | 'reading';
  duration: string;
  points: number;
  completed?: boolean;
  content?: string;
  videoUrl?: string;
};

// Hardcoded courses data (same as in courses/page.tsx)
const COURSES: Course[] = [
  {
    id: "math-p1-p2",
    title: "Mathematics Basics",
    subject: "Mathematics",
    ageGroup: "P1–P2",
    lessons: 12,
    duration: "4 weeks",
    icon: faCalculator,
    iconColor: "#3749a9",
    description: "Learn numbers, counting, addition and subtraction through fun games and activities.",
  },
  {
    id: "english-p1-p2",
    title: "English for Beginners",
    subject: "English",
    ageGroup: "P1–P2",
    lessons: 10,
    duration: "3 weeks",
    icon: faBookOpen,
    iconColor: "#0e7490",
    description: "Build reading and writing foundations with simple words, letters, and basic sentences.",
  },
  {
    id: "science-p1-p2",
    title: "Exploring Our World",
    subject: "Science",
    ageGroup: "P1–P2",
    lessons: 8,
    duration: "3 weeks",
    icon: faEarth,
    iconColor: "#059669",
    description: "Discover plants, animals, and the environment through engaging video lessons.",
  },
  {
    id: "math-p3-p4",
    title: "Mathematics Intermediate",
    subject: "Mathematics",
    ageGroup: "P3–P4",
    lessons: 16,
    duration: "5 weeks",
    icon: faDivide,
    iconColor: "#3749a9",
    description: "Dive into multiplication, division, fractions, and basic geometry concepts.",
  },
  {
    id: "english-p3-p4",
    title: "English Grammar & Reading",
    subject: "English",
    ageGroup: "P3–P4",
    lessons: 14,
    duration: "4 weeks",
    icon: faPencil,
    iconColor: "#0e7490",
    description: "Strengthen grammar, comprehension, and writing skills with structured lessons.",
  },
  {
    id: "science-p3-p4",
    title: "Science & Nature",
    subject: "Science",
    ageGroup: "P3–P4",
    lessons: 12,
    duration: "4 weeks",
    icon: faFlask,
    iconColor: "#059669",
    description: "Explore physics, chemistry, and biology through hands-on experiments.",
  },
  {
    id: "social-p3-p4",
    title: "Social Studies Basics",
    subject: "Social Studies",
    ageGroup: "P3–P4",
    lessons: 10,
    duration: "3 weeks",
    icon: faMap,
    iconColor: "#7c3aed",
    description: "Learn about communities, cultures, and basic geography concepts.",
  },
  {
    id: "math-p5-p6",
    title: "Advanced Mathematics",
    subject: "Mathematics",
    ageGroup: "P5–P6",
    lessons: 20,
    duration: "6 weeks",
    icon: faRulerCombined,
    iconColor: "#3749a9",
    description: "Master advanced arithmetic, algebra basics, and complex problem-solving.",
  },
  {
    id: "english-p5-p6",
    title: "English Literature & Writing",
    subject: "English",
    ageGroup: "P5–P6",
    lessons: 18,
    duration: "5 weeks",
    icon: faFileLines,
    iconColor: "#0e7490",
    description: "Develop advanced reading comprehension and creative writing skills.",
  },
  {
    id: "science-p5-p6",
    title: "Advanced Science",
    subject: "Science",
    ageGroup: "P5–P6",
    lessons: 16,
    duration: "5 weeks",
    icon: faMicroscope,
    iconColor: "#059669",
    description: "Deep dive into advanced scientific concepts and research methods.",
  },
  {
    id: "social-p5-p6",
    title: "Civics & Geography",
    subject: "Social Studies",
    ageGroup: "P5–P6",
    lessons: 14,
    duration: "4 weeks",
    icon: faLandmark,
    iconColor: "#7c3aed",
    description: "Understand government, citizenship, and African geography through rich content.",
  },
  {
    id: "kinyarwanda-p5-p6",
    title: "Kinyarwanda Advanced",
    subject: "Kinyarwanda",
    ageGroup: "P5–P6",
    lessons: 12,
    duration: "4 weeks",
    icon: faLanguage,
    iconColor: "#b45309",
    description: "Improve reading, writing, and oral Kinyarwanda skills at an advanced level.",
  },
];

// Generate sample lessons for each course
const generateLessons = (courseId: string, lessonCount: number): Lesson[] => {
  const lessons: Lesson[] = [];
  const subjects = {
    math: ["Numbers & Counting", "Addition", "Subtraction", "Shapes", "Patterns", "Measurement", "Time", "Money", "Fractions", "Word Problems"],
    english: ["Letters & Sounds", "Reading Words", "Simple Sentences", "Story Time", "Writing Letters", "Vocabulary", "Grammar Basics", "Reading Comprehension", "Creative Writing", "Literature"],
    science: ["Plants", "Animals", "Weather", "Earth & Space", "Matter", "Energy", "Environment", "Human Body", "Experiments", "Research"],
    social: ["My Community", "Families", "Cultures", "Maps", "Countries", "Government", "History", "Geography", "Citizenship", "Global Awareness"],
    kinyarwanda: ["Basic Words", "Greetings", "Family", "Numbers", "Colors", "Food", "Animals", "Daily Activities", "Stories", "Writing"]
  };

  const subjectKey = courseId.split('-')[0] as keyof typeof subjects;
  const topicList = subjects[subjectKey] || subjects.math;

  for (let i = 1; i <= lessonCount; i++) {
    const contentType = Math.random() > 0.5 ? 'video' : 'reading';
    lessons.push({
      id: `${courseId}-lesson-${i}`,
      title: topicList[i - 1] || `Lesson ${i}`,
      contentType,
      duration: `${Math.floor(Math.random() * 20) + 10} min`,
      points: Math.floor(Math.random() * 50) + 20,
      completed: Math.random() > 0.7,
      content: contentType === 'reading'
        ? `This is the content for ${topicList[i - 1] || `Lesson ${i}`}. Here you will learn about various concepts related to the topic. The lesson includes interactive exercises and examples to help you understand the material better.`
        : undefined,
      videoUrl: contentType === 'video'
        ? `https://example.com/video/${courseId}-lesson-${i}.mp4`
        : undefined,
    });
  }

  return lessons;
};

export default function LessonDetailPage() {
  const params = useParams();
  const courseId = params.id as string;
  const lessonId = params.lessonId as string;
  const [course, setCourse] = useState<Course | null>(null);
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [allLessons, setAllLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    // Find course from hardcoded data
    const foundCourse = COURSES.find(c => c.id === courseId);
    if (foundCourse) {
      const lessons = generateLessons(courseId, foundCourse.lessons);
      const foundLesson = lessons.find(l => l.id === lessonId);

      setCourse(foundCourse);
      setAllLessons(lessons);
      setLesson(foundLesson || null);
      setCompleted(foundLesson?.completed || false);
    }
    setLoading(false);
  }, [courseId, lessonId]);

  const currentLessonIndex = allLessons.findIndex(l => l.id === lessonId);
  const nextLesson = currentLessonIndex < allLessons.length - 1 ? allLessons[currentLessonIndex + 1] : null;
  const prevLesson = currentLessonIndex > 0 ? allLessons[currentLessonIndex - 1] : null;

  const handleCompleteLesson = () => {
    setCompleted(true);
    // In a real app, this would make an API call to mark the lesson as completed
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div>Loading lesson...</div>
        </div>
        <Footer />
      </>
    );
  }

  if (!course || !lesson) {
    return (
      <>
        <Navbar />
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
          <h2>Lesson not found</h2>
          <Link href={`/courses/${courseId}`} style={{ color: "#3749a9", textDecoration: "none", marginTop: "16px" }}>
            ← Back to Course
          </Link>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main style={{ background: "#ffffff", minHeight: "100vh", fontFamily: "Poppins, Nunito, sans-serif" }}>

        {/* Header */}
        <section style={{
          backgroundImage: "linear-gradient(135deg, #131b46, #1b2561)",
          paddingTop: "120px",
          paddingBottom: "40px",
        }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px" }}>
            <div style={{ display: "flex", gap: "16px", alignItems: "center", marginBottom: "20px" }}>
              <Link
                href={`/courses/${courseId}`}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  color: "rgba(255,255,255,0.8)",
                  textDecoration: "none",
                  fontSize: "0.9rem",
                  fontWeight: 600,
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#ffffff")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.8)")}
              >
                <FontAwesomeIcon icon={faChevronLeft} style={{ width: "12px", height: "12px" }} />
                Back to Course
              </Link>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "16px" }}>
              <div style={{
                width: "48px", height: "48px", borderRadius: "12px",
                background: `${course.iconColor}25`,
                border: `2px solid ${course.iconColor}50`,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <FontAwesomeIcon
                  icon={course.icon}
                  style={{ width: "24px", height: "24px", color: course.iconColor }}
                />
              </div>
              <div>
                <h1 style={{
                  fontSize: "1.8rem", fontWeight: 800,
                  color: "#ffffff", marginBottom: "4px"
                }}>
                  {lesson.title}
                </h1>
                <p style={{ color: "rgba(255,255,255,0.8)", fontSize: "1rem" }}>
                  {course.title} • Lesson {currentLessonIndex + 1} of {allLessons.length}
                </p>
              </div>
            </div>

            {/* Progress Bar */}
            <div style={{ marginTop: "24px" }}>
              <div style={{
                width: "100%", height: "8px", background: "rgba(255,255,255,0.2)",
                borderRadius: "4px", overflow: "hidden"
              }}>
                <div style={{
                  width: `${((currentLessonIndex + 1) / allLessons.length) * 100}%`,
                  height: "100%",
                  background: "#10b981",
                  borderRadius: "4px",
                  transition: "width 0.3s ease"
                }}></div>
              </div>
              <div style={{
                display: "flex", justifyContent: "space-between",
                marginTop: "8px", fontSize: "0.85rem", color: "rgba(255,255,255,0.8)"
              }}>
                <span>Lesson {currentLessonIndex + 1} of {allLessons.length}</span>
                <span>{Math.round(((currentLessonIndex + 1) / allLessons.length) * 100)}% Complete</span>
              </div>
            </div>
          </div>
        </section>

        {/* Lesson Content */}
        <section style={{ padding: "40px 0" }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px" }}>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: "48px" }}>

              {/* Main Content */}
              <div>

                {/* Video or Reading Content */}
                {lesson.contentType === 'video' ? (
                  <div style={{
                    background: "#000",
                    borderRadius: "16px",
                    padding: "24px",
                    marginBottom: "32px",
                    textAlign: "center",
                    minHeight: "400px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}>
                    <div>
                      <FontAwesomeIcon
                        icon={faPlay}
                        style={{ width: "64px", height: "64px", color: "#ffffff", marginBottom: "16px" }}
                      />
                      <p style={{ color: "#ffffff", fontSize: "1.2rem", fontWeight: 600 }}>
                        Video Lesson: {lesson.title}
                      </p>
                      <p style={{ color: "rgba(255,255,255,0.8)", fontSize: "0.9rem", marginTop: "8px" }}>
                        Duration: {lesson.duration}
                      </p>
                      <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.8rem", marginTop: "16px" }}>
                        Video player would be embedded here
                      </p>
                    </div>
                  </div>
                ) : (
                  <div style={{
                    background: "#f8fafc",
                    borderRadius: "16px",
                    padding: "32px",
                    marginBottom: "32px",
                    border: "1px solid #e2e8f0",
                  }}>
                    <h2 style={{
                      fontSize: "1.5rem", fontWeight: 800,
                      color: "#1e293b", marginBottom: "20px",
                      display: "flex", alignItems: "center", gap: "12px"
                    }}>
                      <FontAwesomeIcon icon={faBookOpen} style={{ width: "20px", height: "20px", color: "#3749a9" }} />
                      Reading Material
                    </h2>
                    <div style={{
                      fontSize: "1.1rem", lineHeight: 1.7, color: "#374151",
                      marginBottom: "24px"
                    }}>
                      {lesson.content}
                    </div>
                    <div style={{
                      background: "#e0f2fe",
                      borderRadius: "12px",
                      padding: "20px",
                      border: "1px solid #0ea5e9",
                    }}>
                      <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#0c4a6e", marginBottom: "12px" }}>
                        Key Learning Points:
                      </h3>
                      <ul style={{ color: "#374151", margin: 0, paddingLeft: "20px" }}>
                        <li>Understand the core concepts presented in this lesson</li>
                        <li>Practice the examples provided</li>
                        <li>Complete the exercises to reinforce learning</li>
                        <li>Review the summary at the end of the lesson</li>
                      </ul>
                    </div>
                  </div>
                )}

                {/* Navigation */}
                <div style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  padding: "24px 0", borderTop: "1px solid #e2e8f0"
                }}>
                  {prevLesson ? (
                    <Link
                      href={`/courses/${courseId}/${prevLesson.id}`}
                      style={{
                        display: "flex", alignItems: "center", gap: "8px",
                        padding: "12px 20px", borderRadius: "50px",
                        background: "#f1f5f9", color: "#475569",
                        textDecoration: "none", fontWeight: 600,
                        transition: "all 0.2s",
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLAnchorElement).style.background = "#e2e8f0";
                        (e.currentTarget as HTMLAnchorElement).style.color = "#334155";
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLAnchorElement).style.background = "#f1f5f9";
                        (e.currentTarget as HTMLAnchorElement).style.color = "#475569";
                      }}
                    >
                      <FontAwesomeIcon icon={faArrowLeft} style={{ width: "14px", height: "14px" }} />
                      Previous Lesson
                    </Link>
                  ) : (
                    <div></div>
                  )}

                  <div style={{ display: "flex", gap: "12px" }}>
                    {!completed && (
                      <button
                        onClick={handleCompleteLesson}
                        style={{
                          display: "flex", alignItems: "center", gap: "8px",
                          padding: "12px 24px", borderRadius: "50px",
                          background: "#10b981", color: "#ffffff",
                          border: "none", fontWeight: 600, cursor: "pointer",
                          transition: "all 0.2s",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = "#059669")}
                        onMouseLeave={(e) => (e.currentTarget.style.background = "#10b981")}
                      >
                        <FontAwesomeIcon icon={faCheckCircle} style={{ width: "14px", height: "14px" }} />
                        Mark Complete
                      </button>
                    )}

                    {nextLesson ? (
                      <Link
                        href={`/courses/${courseId}/${nextLesson.id}`}
                        style={{
                          display: "flex", alignItems: "center", gap: "8px",
                          padding: "12px 24px", borderRadius: "50px",
                          backgroundImage: "radial-gradient(circle at 60% 40%, #3749a9, #1b2561)",
                          color: "#ffffff", textDecoration: "none", fontWeight: 600,
                          transition: "filter 0.2s",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.filter = "brightness(1.1)")}
                        onMouseLeave={(e) => (e.currentTarget.style.filter = "brightness(1)")}
                      >
                        Next Lesson
                        <FontAwesomeIcon icon={faArrowRight} style={{ width: "14px", height: "14px" }} />
                      </Link>
                    ) : (
                      <Link
                        href={`/courses/${courseId}`}
                        style={{
                          display: "flex", alignItems: "center", gap: "8px",
                          padding: "12px 24px", borderRadius: "50px",
                          background: "#f59e0b", color: "#ffffff",
                          textDecoration: "none", fontWeight: 600,
                          transition: "filter 0.2s",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.filter = "brightness(1.1)")}
                        onMouseLeave={(e) => (e.currentTarget.style.filter = "brightness(1)")}
                      >
                        <FontAwesomeIcon icon={faTrophy} style={{ width: "14px", height: "14px" }} />
                        Course Complete!
                      </Link>
                    )}
                  </div>
                </div> 
                                {/* Take Quiz */}
                <div style={{
                  marginTop: "32px", padding: "24px",
                  background: "linear-gradient(135deg, #1b2561, #290e42)",
                  borderRadius: "20px",
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  flexWrap: "wrap", gap: "16px",
                  boxShadow: "0 8px 32px rgba(19,27,70,0.2)",
                }}>
                  <div>
                    <p style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "rgba(255,255,255,0.5)", marginBottom: "4px" }}>
                      Ready?
                    </p>
                    <p style={{ fontSize: "1rem", fontWeight: 800, color: "#ffffff" }}>
                      Test your knowledge on this lesson
                    </p>
                  </div>
                  <Link
                    href={`/courses/${courseId}/${lessonId}/quiz`}
                    style={{
                      display: "flex", alignItems: "center", gap: "8px",
                      padding: "12px 28px", borderRadius: "50px",
                      backgroundImage: "radial-gradient(circle at 60% 40%, #3749a9, #1b2561)",
                      color: "#ffffff", fontSize: "0.95rem", fontWeight: 700,
                      textDecoration: "none",
                      boxShadow: "0 4px 16px rgba(55,73,169,0.4)",
                    }}
                  >
                    Take Quiz
                  </Link>
                </div>

              </div>

              {/* Sidebar */}
              <div>

                {/* Lesson Info */}
                <div style={{
                  background: "#f8fafc",
                  borderRadius: "16px",
                  padding: "24px",
                  marginBottom: "24px",
                  border: "1px solid #e2e8f0",
                }}>
                  <h3 style={{
                    fontSize: "1.2rem", fontWeight: 800,
                    color: "#1e293b", marginBottom: "16px"
                  }}>
                    Lesson Details
                  </h3>

                  <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <FontAwesomeIcon
                        icon={lesson.contentType === 'video' ? faVideo : faBookOpen}
                        style={{ width: "16px", height: "16px", color: "#64748b" }}
                      />
                      <span style={{ fontSize: "0.9rem", color: "#475569" }}>
                        {lesson.contentType === 'video' ? 'Video Lesson' : 'Reading Material'}
                      </span>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <FontAwesomeIcon icon={faClock} style={{ width: "16px", height: "16px", color: "#64748b" }} />
                      <span style={{ fontSize: "0.9rem", color: "#475569" }}>
                        {lesson.duration}
                      </span>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <FontAwesomeIcon icon={faStar} style={{ width: "16px", height: "16px", color: "#f59e0b" }} />
                      <span style={{ fontSize: "0.9rem", color: "#475569" }}>
                        {lesson.points} points
                      </span>
                    </div>

                    {completed && (
                      <div style={{
                        display: "flex", alignItems: "center", gap: "8px",
                        padding: "8px 12px", borderRadius: "20px",
                        background: "#dcfce7", border: "1px solid #bbf7d0"
                      }}>
                        <FontAwesomeIcon icon={faCheckCircle} style={{ width: "14px", height: "14px", color: "#16a34a" }} />
                        <span style={{ fontSize: "0.85rem", color: "#166534", fontWeight: 600 }}>
                          Completed
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Course Progress */}
                <div style={{
                  background: "#ffffff",
                  borderRadius: "16px",
                  padding: "24px",
                  border: "1px solid #e2e8f0",
                  boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
                }}>
                  <h3 style={{
                    fontSize: "1.2rem", fontWeight: 800,
                    color: "#1e293b", marginBottom: "16px"
                  }}>
                    Course Progress
                  </h3>

                  <div style={{ marginBottom: "16px" }}>
                    <div style={{
                      width: "100%", height: "8px", background: "#e2e8f0",
                      borderRadius: "4px", overflow: "hidden"
                    }}>
                      <div style={{
                        width: `${((currentLessonIndex + (completed ? 1 : 0)) / allLessons.length) * 100}%`,
                        height: "100%",
                        background: "#10b981",
                        borderRadius: "4px",
                        transition: "width 0.3s ease"
                      }}></div>
                    </div>
                    <div style={{
                      display: "flex", justifyContent: "space-between",
                      marginTop: "8px", fontSize: "0.8rem", color: "#64748b"
                    }}>
                      <span>{currentLessonIndex + (completed ? 1 : 0)} of {allLessons.length} lessons</span>
                      <span>{Math.round(((currentLessonIndex + (completed ? 1 : 0)) / allLessons.length) * 100)}%</span>
                    </div>
                  </div>

                  <Link
                    href={`/courses/${courseId}`}
                    style={{
                      display: "block", textAlign: "center",
                      padding: "12px", borderRadius: "50px",
                      background: "#f1f5f9", color: "#475569",
                      textDecoration: "none", fontWeight: 600,
                      transition: "all 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLAnchorElement).style.background = "#e2e8f0";
                      (e.currentTarget as HTMLAnchorElement).style.color = "#334155";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLAnchorElement).style.background = "#f1f5f9";
                      (e.currentTarget as HTMLAnchorElement).style.color = "#475569";
                    }}
                  >
                    View All Lessons
                  </Link>
                </div>

              </div>

            </div>

          </div>
        </section>

      </main>

      <Footer />
    </>
  );
}