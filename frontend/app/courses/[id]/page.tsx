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
  faUsers,
  faAward,
  faArrowRight,
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
    lessons.push({
      id: `${courseId}-lesson-${i}`,
      title: topicList[i - 1] || `Lesson ${i}`,
      contentType: Math.random() > 0.5 ? 'video' : 'reading',
      duration: `${Math.floor(Math.random() * 20) + 10} min`,
      points: Math.floor(Math.random() * 50) + 20,
      completed: Math.random() > 0.7, // Random completion for demo
    });
  }

  return lessons;
};

export default function CourseDetailPage() {
  const params = useParams();
  const courseId = params.id as string;
  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Find course from hardcoded data
    const foundCourse = COURSES.find(c => c.id === courseId);
    if (foundCourse) {
      setCourse(foundCourse);
      setLessons(generateLessons(courseId, foundCourse.lessons));
    }
    setLoading(false);
  }, [courseId]);

  if (loading) {
    return (
      <>
        <Navbar />
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div>Loading course details...</div>
        </div>
        <Footer />
      </>
    );
  }

  if (!course) {
    return (
      <>
        <Navbar />
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
          <h2>Course not found</h2>
          <Link href="/courses" style={{ color: "#3749a9", textDecoration: "none", marginTop: "16px" }}>
            ← Back to Courses
          </Link>
        </div>
        <Footer />
      </>
    );
  }

  const learningObjectives = [
    "Master fundamental concepts in " + course.subject.toLowerCase(),
    "Develop critical thinking and problem-solving skills",
    "Build confidence through interactive learning activities",
    "Apply knowledge to real-world scenarios",
    "Prepare for advanced studies in the subject"
  ];

  const prerequisites = course.ageGroup === "P1–P2"
    ? ["Basic motor skills", "Ability to recognize colors and shapes"]
    : ["Completion of previous grade level", "Basic literacy and numeracy skills"];

  return (
    <>
      <Navbar />

      <main style={{ background: "#ffffff", minHeight: "100vh", fontFamily: "Poppins, Nunito, sans-serif" }}>

        {/* Header Section */}
        <section style={{
          backgroundImage: "linear-gradient(135deg, #131b46, #1b2561)",
          paddingTop: "120px",
          paddingBottom: "60px",
        }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px" }}>
            <Link
              href="/courses"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                color: "rgba(255,255,255,0.8)",
                textDecoration: "none",
                fontSize: "0.9rem",
                fontWeight: 600,
                marginBottom: "24px",
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#ffffff")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.8)")}
            >
              <FontAwesomeIcon icon={faChevronLeft} style={{ width: "12px", height: "12px" }} />
              Back to Courses
            </Link>

            <div style={{ display: "flex", gap: "32px", alignItems: "flex-start" }}>
              {/* Course Icon */}
              <div style={{
                width: "80px", height: "80px", borderRadius: "20px",
                background: `${course.iconColor}25`,
                border: `2px solid ${course.iconColor}50`,
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0,
              }}>
                <FontAwesomeIcon
                  icon={course.icon}
                  style={{ width: "36px", height: "36px", color: course.iconColor }}
                />
              </div>

              {/* Course Info */}
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", gap: "12px", marginBottom: "12px" }}>
                  <span style={{
                    fontSize: "0.75rem", fontWeight: 800,
                    textTransform: "uppercase", letterSpacing: "0.08em",
                    padding: "6px 16px", borderRadius: "50px",
                    background: "rgba(255,255,255,0.1)",
                    color: "#ffffff",
                    border: "1px solid rgba(255,255,255,0.15)",
                  }}>
                    {course.subject}
                  </span>
                  <span style={{
                    fontSize: "0.75rem", fontWeight: 800,
                    textTransform: "uppercase", letterSpacing: "0.08em",
                    padding: "6px 16px", borderRadius: "50px",
                    background: "rgba(255,255,255,0.1)",
                    color: "#ffffff",
                    border: "1px solid rgba(255,255,255,0.15)",
                  }}>
                    {course.ageGroup}
                  </span>
                </div>

                <h1 style={{
                  fontSize: "2.5rem", fontWeight: 800,
                  color: "#ffffff", marginBottom: "16px", lineHeight: 1.2,
                }}>
                  {course.title}
                </h1>

                <p style={{
                  fontSize: "1.1rem", color: "rgba(255,255,255,0.8)",
                  lineHeight: 1.6, marginBottom: "24px", maxWidth: "600px"
                }}>
                  {course.description}
                </p>

                {/* Course Stats */}
                <div style={{ display: "flex", gap: "24px", flexWrap: "wrap" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <FontAwesomeIcon icon={faVideo} style={{ width: "16px", height: "16px", color: "#a0b0ff" }} />
                    <span style={{ color: "#ffffff", fontWeight: 600 }}>
                      {course.lessons} Lessons
                    </span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <FontAwesomeIcon icon={faClock} style={{ width: "16px", height: "16px", color: "#a0b0ff" }} />
                    <span style={{ color: "#ffffff", fontWeight: 600 }}>
                      {course.duration}
                    </span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <FontAwesomeIcon icon={faStar} style={{ width: "16px", height: "16px", color: "#ffd700" }} />
                    <span style={{ color: "#ffffff", fontWeight: 600 }}>
                      4.8 Rating
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section style={{ padding: "60px 0" }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px" }}>

            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "48px" }}>

              {/* Main Content */}
              <div>

                {/* Learning Objectives */}
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
                    <FontAwesomeIcon icon={faAward} style={{ width: "20px", height: "20px", color: "#3749a9" }} />
                    Learning Objectives
                  </h2>
                  <ul style={{ listStyle: "none", padding: 0 }}>
                    {learningObjectives.map((objective, index) => (
                      <li key={index} style={{
                        display: "flex", alignItems: "flex-start", gap: "12px",
                        marginBottom: "12px", color: "#475569", fontSize: "1rem", lineHeight: 1.6
                      }}>
                        <FontAwesomeIcon icon={faCheckCircle} style={{
                          width: "16px", height: "16px", color: "#10b981", marginTop: "2px", flexShrink: 0
                        }} />
                        {objective}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Lessons List */}
                <div style={{
                  background: "#ffffff",
                  borderRadius: "16px",
                  padding: "32px",
                  marginBottom: "32px",
                  border: "1px solid #e2e8f0",
                  boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
                }}>
                  <h2 style={{
                    fontSize: "1.5rem", fontWeight: 800,
                    color: "#1e293b", marginBottom: "24px",
                    display: "flex", alignItems: "center", gap: "12px"
                  }}>
                    <FontAwesomeIcon icon={faPlay} style={{ width: "20px", height: "20px", color: "#3749a9" }} />
                    Course Lessons ({lessons.length})
                  </h2>

                  <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    {lessons.map((lesson, index) => (
                      <div key={lesson.id} style={{
                        display: "flex", alignItems: "center", gap: "16px",
                        padding: "16px 20px",
                        borderRadius: "12px",
                        background: lesson.completed ? "#f0fdf4" : "#f8fafc",
                        border: `1px solid ${lesson.completed ? "#bbf7d0" : "#e2e8f0"}`,
                        transition: "all 0.2s",
                        cursor: "pointer",
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLDivElement).style.transform = "translateY(-2px)";
                        (e.currentTarget as HTMLDivElement).style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)";
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
                        (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
                      }}
                      onClick={() => window.location.href = `/courses/${courseId}/${lesson.id}`}
                      >
                        <div style={{
                          width: "40px", height: "40px", borderRadius: "50%",
                          background: lesson.completed ? "#10b981" : "#e2e8f0",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          color: lesson.completed ? "#ffffff" : "#64748b",
                          fontWeight: 700, fontSize: "0.9rem",
                        }}>
                          {lesson.completed ? (
                            <FontAwesomeIcon icon={faCheckCircle} style={{ width: "16px", height: "16px" }} />
                          ) : (
                            index + 1
                          )}
                        </div>

                        <div style={{ flex: 1 }}>
                          <h3 style={{
                            fontSize: "1rem", fontWeight: 700,
                            color: "#1e293b", marginBottom: "4px"
                          }}>
                            {lesson.title}
                          </h3>
                          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                            <span style={{
                              fontSize: "0.85rem", color: "#64748b",
                              display: "flex", alignItems: "center", gap: "4px"
                            }}>
                              <FontAwesomeIcon
                                icon={lesson.contentType === 'video' ? faVideo : faBookOpen}
                                style={{ width: "12px", height: "12px" }}
                              />
                              {lesson.contentType}
                            </span>
                            <span style={{
                              fontSize: "0.85rem", color: "#64748b",
                              display: "flex", alignItems: "center", gap: "4px"
                            }}>
                              <FontAwesomeIcon icon={faClock} style={{ width: "12px", height: "12px" }} />
                              {lesson.duration}
                            </span>
                            <span style={{
                              fontSize: "0.85rem", color: "#64748b",
                              display: "flex", alignItems: "center", gap: "4px"
                            }}>
                              <FontAwesomeIcon icon={faStar} style={{ width: "12px", height: "12px", color: "#ffd700" }} />
                              {lesson.points} points
                            </span>
                          </div>
                        </div>

                        <FontAwesomeIcon
                          icon={faArrowRight}
                          style={{ width: "16px", height: "16px", color: "#64748b" }}
                        />
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Sidebar */}
              <div>

                {/* Prerequisites */}
                <div style={{
                  background: "#f8fafc",
                  borderRadius: "16px",
                  padding: "24px",
                  marginBottom: "24px",
                  border: "1px solid #e2e8f0",
                }}>
                  <h3 style={{
                    fontSize: "1.2rem", fontWeight: 800,
                    color: "#1e293b", marginBottom: "16px",
                    display: "flex", alignItems: "center", gap: "8px"
                  }}>
                    <FontAwesomeIcon icon={faUsers} style={{ width: "16px", height: "16px", color: "#3749a9" }} />
                    Prerequisites
                  </h3>
                  <ul style={{ listStyle: "none", padding: 0 }}>
                    {prerequisites.map((prereq, index) => (
                      <li key={index} style={{
                        color: "#475569", fontSize: "0.9rem", lineHeight: 1.6,
                        marginBottom: "8px", paddingLeft: "20px", position: "relative"
                      }}>
                        <span style={{
                          position: "absolute", left: 0, top: 0,
                          width: "6px", height: "6px", borderRadius: "50%",
                          background: "#3749a9"
                        }}></span>
                        {prereq}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Course Stats */}
                <div style={{
                  background: "#ffffff",
                  borderRadius: "16px",
                  padding: "24px",
                  border: "1px solid #e2e8f0",
                  boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
                }}>
                  <h3 style={{
                    fontSize: "1.2rem", fontWeight: 800,
                    color: "#1e293b", marginBottom: "20px",
                    textAlign: "center"
                  }}>
                    Course Overview
                  </h3>

                  <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                    <div style={{ textAlign: "center" }}>
                      <div style={{
                        fontSize: "2rem", fontWeight: 800, color: "#3749a9", marginBottom: "4px"
                      }}>
                        {course.lessons}
                      </div>
                      <div style={{ fontSize: "0.85rem", color: "#64748b", fontWeight: 600 }}>
                        Total Lessons
                      </div>
                    </div>

                    <div style={{ textAlign: "center" }}>
                      <div style={{
                        fontSize: "2rem", fontWeight: 800, color: "#10b981", marginBottom: "4px"
                      }}>
                        {course.duration}
                      </div>
                      <div style={{ fontSize: "0.85rem", color: "#64748b", fontWeight: 600 }}>
                        Duration
                      </div>
                    </div>

                    <div style={{ textAlign: "center" }}>
                      <div style={{
                        fontSize: "2rem", fontWeight: 800, color: "#f59e0b", marginBottom: "4px"
                      }}>
                        4.8
                      </div>
                      <div style={{ fontSize: "0.85rem", color: "#64748b", fontWeight: 600 }}>
                        Rating
                      </div>
                    </div>
                  </div>

                  {/* Enroll Button */}
                  <button style={{
                    width: "100%", padding: "14px", borderRadius: "50px",
                    backgroundImage: "radial-gradient(circle at 60% 40%, #3749a9, #1b2561)",
                    color: "#ffffff", fontSize: "1rem", fontWeight: 700,
                    border: "none", cursor: "pointer",
                    marginTop: "24px",
                    transition: "filter 0.2s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.filter = "brightness(1.1)")}
                  onMouseLeave={(e) => (e.currentTarget.style.filter = "brightness(1)")}
                  >
                    Enroll in Course
                  </button>
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