"use client";

import { useEffect, useState } from "react";
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
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";

type Course = {
  course_id: string;
  grade_group_id: string;
  title: string;
  description: string;
  lessons: number;
  totalPoints: number;
  created_at: string;
};

type GradeGroup = {
  grade_group_id: string;
  name: string;
  description: string;
};

// creating a map of courses to icon and color randomly for consistent styling
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

// creating a function to assign icons and colors randomly
function getVisualForCourse(courseId: string) {
  const hash = courseId
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);

  const icon = ICONS[hash % ICONS.length];
  const color = COLORS[hash % COLORS.length];

  return { icon, color };
}


export default function CoursesPage() {
  const [selectedGroup, setSelectedGroup] = useState("All");
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [gradeGroups, setGradeGroups] = useState<GradeGroup[]>([]);
  
  const gradeMap = Object.fromEntries(
    gradeGroups.map((g) => [g.grade_group_id, g.name])
  );

  const filtered =
    selectedGroup === "All"
      ? courses
      : courses.filter((c) => gradeMap[c.grade_group_id] === selectedGroup);
      
  const ageGroups = ["All", ...gradeGroups.map((g) => g.name)];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [coursesRes, lessonsRes, gradeGroupsRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/courses`),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/lessons`),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/grade-groups`)
        ]);

        const coursesData = await coursesRes.json();
        const lessonsData = await lessonsRes.json();
        const gradeGroupsData = await gradeGroupsRes.json();

        setGradeGroups(gradeGroupsData);

        const lessonStatsMap: Record<
          string,
          { count: number; totalPoints: number }
        > = {};

        lessonsData.forEach((lesson: any) => {
          if (!lessonStatsMap[lesson.course_id]) {
            lessonStatsMap[lesson.course_id] = { count: 0, totalPoints: 0 };
          }

          lessonStatsMap[lesson.course_id].count += 1;
          lessonStatsMap[lesson.course_id].totalPoints +=
            lesson.points_reward || 0;
        });

        const formattedCourses: Course[] = coursesData.map((c: any) => ({
          course_id: c.course_id,
          grade_group_id: c.grade_group_id,
          title: c.title,
          description: c.description,
          lessons: lessonStatsMap[c.course_id]?.count || 0,
          totalPoints: lessonStatsMap[c.course_id]?.totalPoints || 0,
          created_at: c.created_at,
        }));

        setCourses(formattedCourses);
      } catch (err) {
        console.error("Failed to fetch data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <Navbar />

      <main style={{ background: "#ffffff", minHeight: "100vh", fontFamily: "Poppins, Nunito, sans-serif" }}>

        <section style={{
          backgroundImage: "linear-gradient(90deg, rgba(27,37,97,0.10)), url('/images/study2.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          paddingTop: "120px",
          paddingBottom: "80px",
          textAlign: "center",
        }}>
          <div style={{ maxWidth: "600px", margin: "0 auto", padding: "0 24px" }}>
            <span style={{
              display: "inline-block",
              fontSize: "0.72rem",
              fontWeight: 800,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "#a0b0ff",
              background: "rgba(55,73,169,0.2)",
              border: "1px solid rgba(55,73,169,0.4)",
              borderRadius: "50px",
              padding: "6px 16px",
              marginBottom: "20px",
            }}>
              Curriculum-Aligned
            </span>
            <h1 style={{
              fontSize: "clamp(2.2rem, 5vw, 3.2rem)",
              fontWeight: 900,
              color: "#ffffff",
              marginBottom: "16px",
              lineHeight: 1.15,
            }}>
              Browse Courses
            </h1>
            <p style={{ fontSize: "1rem", color: "rgba(255,255,255,0.65)", lineHeight: 1.8 }}>
              Explore grade-specific courses built for Rwanda&apos;s primary school
              curriculum from P1 all the way to P6.
            </p>
          </div>
        </section>

        <section style={{ background: "#f7f8fc", padding: "48px 24px 96px" }}>
          <div style={{ maxWidth: "1100px", margin: "0 auto" }}>

            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "16px",
              marginBottom: "40px",
            }}>
              <p style={{ fontSize: "0.95rem", color: "#7b82a8", fontWeight: 600 }}>
                Showing{" "}
                <span style={{ color: "#1b2561", fontWeight: 800 }}>{filtered.length}</span>{" "}
                courses{selectedGroup !== "All" && ` for ${selectedGroup}`}
              </p>

              <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "#7b82a8" }}>
                  Filter by grade:
                </span>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  {ageGroups.map((group) => (
                    <button
                      key={group}
                      onClick={() => setSelectedGroup(group)}
                      style={{
                        padding: "8px 20px",
                        borderRadius: "50px",
                        border: selectedGroup === group ? "none" : "1.5px solid #d1d8f0",
                        backgroundImage: selectedGroup === group
                          ? "radial-gradient(circle at 60% 40%, #3749a9, #1b2561)"
                          : "none",
                        background: selectedGroup === group ? undefined : "#ffffff",
                        color: selectedGroup === group ? "#ffffff" : "#3d4566",
                        fontSize: "0.85rem",
                        fontWeight: 700,
                        cursor: "pointer",
                        fontFamily: "inherit",
                        transition: "all 0.2s",
                        boxShadow: selectedGroup === group ? "0 4px 14px rgba(55,73,169,0.3)" : "none",
                      }}
                    >
                      {group}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: "24px",
            }}>
              {filtered.map((course) => {
                const { icon, color } = getVisualForCourse(course.course_id);

                return (
                <div
                  key={course.course_id}
                  className="rounded-[20px] p-7 flex flex-col gap-4 
                            transition-all duration-200 
                            shadow-[0_8px_32px_rgba(19,27,70,0.15)]
                            hover:-translate-y-1 
                            hover:shadow-[0_16px_48px_rgba(19,27,70,0.25)]"
                  style={{
                    backgroundImage: "linear-gradient(135deg, #1b2561, #290e42)",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div
                      style={{
                        width: "52px",
                        height: "52px",
                        borderRadius: "14px",
                        background: `${color}25`,
                        border: `1px solid ${color}50`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <FontAwesomeIcon
                        icon={icon}
                        style={{ width: "22px", height: "22px", color }}
                      />
                    </div>
                    <span style={{
                      fontSize: "0.7rem", fontWeight: 800,
                      textTransform: "uppercase", letterSpacing: "0.08em",
                      padding: "4px 12px", borderRadius: "50px",
                      background: "rgba(255,255,255,0.1)",
                      color: "rgba(255,255,255,0.8)",
                      border: "1px solid rgba(255,255,255,0.15)",
                    }}>
                      {gradeMap[course.grade_group_id] || "Unknown"}
                    </span>
                  </div>

                  <div>
                    <h3 style={{
                      fontSize: "1.05rem", fontWeight: 800,
                      color: "#ffffff", marginBottom: "8px", lineHeight: 1.3,
                    }}>
                      {course.title}
                    </h3>
                    <p style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.6)", lineHeight: 1.7 }}>
                      {course.description}
                    </p>
                  </div>

                  <div style={{
                    display: "flex", gap: "16px",
                    paddingTop: "12px",
                    borderTop: "1px solid rgba(255,255,255,0.08)",
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <FontAwesomeIcon icon={faVideo} style={{ width: "12px", height: "12px", color: "#a0b0ff" }} />
                      <span style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.55)", fontWeight: 600 }}>
                        {course.lessons} lessons
                      </span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <FontAwesomeIcon icon={faCalculator} style={{ width: "12px", height: "12px", color: "#a0b0ff" }} />
                      <span style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.55)", fontWeight: 600 }}>
                        {course.totalPoints} points
                      </span>
                    </div>
                  </div>

                  <Link
                    href={`/courses/${course.course_id}`}
                    style={{
                      display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                      padding: "11px", borderRadius: "50px",
                      backgroundImage: "radial-gradient(circle at 60% 40%, #3749a9, #1b2561)",
                      color: "#ffffff", fontSize: "0.875rem", fontWeight: 700,
                      textDecoration: "none",
                      transition: "filter 0.2s",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.filter = "brightness(1.2)")}
                    onMouseLeave={(e) => (e.currentTarget.style.filter = "brightness(1)")}
                  >
                    View Course
                    <FontAwesomeIcon icon={faChevronRight} style={{ width: "11px", height: "11px" }} />
                  </Link>
                </div>
                );
            })}
            </div>

            {filtered.length === 0 && (
              <div style={{ textAlign: "center", padding: "80px 0", color: "#7b82a8" }}>
                <FontAwesomeIcon icon={faBookOpen} style={{ width: "48px", height: "48px", marginBottom: "16px", opacity: 0.3 }} />
                <p style={{ fontSize: "1rem", fontWeight: 600 }}>No courses found for this grade group.</p>
              </div>
            )}

          </div>
        </section>

      </main>

      <Footer />
    </>
  );
}