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
  course_id: string;
  grade_group_id: string;
  title: string;
  description: string;
  created_at: string;
};

type Lesson = {
  lesson_id: string;
  course_id: string;
  title: string;
  content_type: "video" | "reading";
  content: string;
  points_reward: number;
  created_at: string;
};

type GradeGroup = {
  grade_group_id: string;
  name: string;
  description: string;
};

const ICONS = [
  faBookOpen,
  faCalculator,
  faFlask,
  faEarth,
  faMap,
  faMicroscope,
  faLanguage,
  faLandmark,
];

const COLORS = [
  "#3749a9",
  "#059669",
  "#0e7490",
  "#7c3aed",
  "#b45309",
  "#1b9e5a",
];

function getVisualForCourse(courseId: string) {
  const hash = courseId
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);

  const icon = ICONS[hash % ICONS.length];
  const color = COLORS[hash % COLORS.length];

  return { icon, color };
}

function buildPrerequisites(
  gradeName: string | undefined,
  totalLessons: number
): string[] {
  if (!gradeName) return [];

  if (gradeName.includes("P1") || gradeName.includes("P2")) {
    return [
      "Ability to follow simple instructions",
      "Basic reading readiness",
      "Curiosity and willingness to learn"
    ];
  }

  if (gradeName.includes("P3") || gradeName.includes("P4")) {
    return [
      "Completion of lower primary level",
      "Basic literacy and numeracy skills",
      `Ability to manage ${totalLessons}+ structured lessons`
    ];
  }

  return [
    "Strong foundation from previous grade level",
    "Independent reading and comprehension skills",
    "Commitment to structured weekly learning"
  ];
}

export default function CourseDetailPage() {
  const params = useParams();
  const courseId = params.id as string;
  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [gradeGroups, setGradeGroups] = useState<GradeGroup[]>([]);
  const estimatedDurationWeeks = Math.ceil(lessons.length / 4);


  const totalPoints = lessons.reduce(
    (sum, lesson) => sum + lesson.points_reward,
    0
  );

  const estimatedLessonsWeeks = Math.ceil(totalPoints / 100);

  const gradeMap = Object.fromEntries(
    gradeGroups.map((g) => [g.grade_group_id, g.name])
  );


useEffect(() => {
  const fetchCourseDetails = async () => {
    try {
      setLoading(true);

      const [courseRes, lessonsRes, gradeRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/courses/${courseId}`),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/lessons`),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/grade-groups`)
      ]);

      const courseData = await courseRes.json();
      const lessonsData = await lessonsRes.json();
      const gradeData = await gradeRes.json();
      setGradeGroups(gradeData);

      setCourse(courseData);

      // Filter lessons for this course
      const filteredLessons = lessonsData.filter(
        (lesson: Lesson) => lesson.course_id === courseId
      );

      setLessons(filteredLessons);

    } catch (error) {
      console.error("Failed to fetch course details:", error);
    } finally {
      setLoading(false);
    }
  };

  if (courseId) {
    fetchCourseDetails();
  }
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
    "Master fundamental concepts in " + course.title.toLowerCase(),
    "Develop critical thinking and problem-solving skills",
    "Build confidence through interactive learning activities",
    "Apply knowledge to real-world scenarios",
    "Prepare for advanced studies in the subject"
  ];

  const gradeName = gradeMap[course.grade_group_id];
  const prerequisites = buildPrerequisites(gradeName, lessons.length);
  const { icon, color } = getVisualForCourse(course.course_id);


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
                background: `$${color}25`,
                border: `2px solid ${color}50`,
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0,
              }}>
                <FontAwesomeIcon
                  icon={icon}
                  style={{ width: "36px", height: "36px", color: color }}
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
                    {course.title}
                  </span>
                  <span style={{
                    fontSize: "0.75rem", fontWeight: 800,
                    textTransform: "uppercase", letterSpacing: "0.08em",
                    padding: "6px 16px", borderRadius: "50px",
                    background: "rgba(255,255,255,0.1)",
                    color: "#ffffff",
                    border: "1px solid rgba(255,255,255,0.15)",
                  }}>
                    {gradeMap[course.grade_group_id] || "Unknown Grade"}
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
                      {lessons.length} Lessons
                    </span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <FontAwesomeIcon icon={faClock} style={{ width: "16px", height: "16px", color: "#a0b0ff" }} />
                    <span style={{ color: "#ffffff", fontWeight: 600 }}>
                      {estimatedDurationWeeks} weeks
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
                      <div key={lesson.lesson_id} style={{
                        display: "flex", alignItems: "center", gap: "16px",
                        padding: "16px 20px",
                        borderRadius: "12px",
                        background: "#f0fdf4",
                        border: "1px solid #bbf7d0",
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
                      onClick={() => window.location.href = `/courses/${courseId}/${lesson.lesson_id}`}
                      >
                        <div style={{
                          width: "40px", height: "40px", borderRadius: "50%",
                          background: "#10b981",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          color: "#ffffff",
                          fontWeight: 700, fontSize: "0.9rem",
                        }}>
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
                                icon={lesson.content_type === 'video' ? faVideo : faBookOpen}
                                style={{ width: "12px", height: "12px" }}
                              />
                              {lesson.content_type}
                            </span>
                            <span style={{
                              fontSize: "0.85rem", color: "#64748b",
                              display: "flex", alignItems: "center", gap: "4px"
                            }}>
                              <FontAwesomeIcon icon={faClock} style={{ width: "12px", height: "12px" }} />
                              {estimatedLessonsWeeks} weeks
                            </span>
                            <span style={{
                              fontSize: "0.85rem", color: "#64748b",
                              display: "flex", alignItems: "center", gap: "4px"
                            }}>
                              <FontAwesomeIcon icon={faStar} style={{ width: "12px", height: "12px", color: "#ffd700" }} />
                              {lesson.points_reward} points
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
                        {lessons.length}
                      </div>
                      <div style={{ fontSize: "0.85rem", color: "#64748b", fontWeight: 600 }}>
                        Total Lessons
                      </div>
                    </div>

                    <div style={{ textAlign: "center" }}>
                      <div style={{
                        fontSize: "2rem", fontWeight: 800, color: "#10b981", marginBottom: "4px"
                      }}>
                        {estimatedDurationWeeks} weeks
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