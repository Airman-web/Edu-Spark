"use client";

import { useState } from "react";
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
    description: "Explore the human body, ecosystems, and basic physics through experiments.",
  },
  {
    id: "social-p3-p4",
    title: "Social Studies",
    subject: "Social Studies",
    ageGroup: "P3–P4",
    lessons: 10,
    duration: "3 weeks",
    icon: faMap,
    iconColor: "#7c3aed",
    description: "Learn about Rwanda's history, geography, and community through story-led lessons.",
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
    description: "Master algebra, percentages, ratios, and problem solving at a higher level.",
  },
  {
    id: "english-p5-p6",
    title: "English Composition",
    subject: "English",
    ageGroup: "P5–P6",
    lessons: 18,
    duration: "5 weeks",
    icon: faFileLines,
    iconColor: "#0e7490",
    description: "Write essays, reports, and creative pieces with confidence and accuracy.",
  },
  {
    id: "science-p5-p6",
    title: "Science & Technology",
    subject: "Science",
    ageGroup: "P5–P6",
    lessons: 16,
    duration: "5 weeks",
    icon: faMicroscope,
    iconColor: "#059669",
    description: "Study chemistry, physics, and biology concepts aligned to the P5–P6 curriculum.",
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

const AGE_GROUPS = ["All", "P1–P2", "P3–P4", "P5–P6"];

export default function CoursesPage() {
  const [selectedGroup, setSelectedGroup] = useState("All");

  const filtered = selectedGroup === "All"
    ? COURSES
    : COURSES.filter((c) => c.ageGroup === selectedGroup);

  return (
    <>
      <Navbar />

      <main style={{ background: "#ffffff", minHeight: "100vh", fontFamily: "Poppins, Nunito, sans-serif" }}>

        <section style={{
          backgroundImage: "linear-gradient(90deg, #131b46, #1b2561)",
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
                  {AGE_GROUPS.map((group) => (
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
              {filtered.map((course) => (
                <div
                  key={course.id}
                  style={{
                    backgroundImage: "linear-gradient(135deg, #1b2561, #290e42)",
                    borderRadius: "20px",
                    padding: "28px",
                    boxShadow: "0 8px 32px rgba(19,27,70,0.15)",
                    display: "flex",
                    flexDirection: "column",
                    gap: "16px",
                    transition: "transform 0.2s, box-shadow 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLDivElement).style.transform = "translateY(-4px)";
                    (e.currentTarget as HTMLDivElement).style.boxShadow = "0 16px 48px rgba(19,27,70,0.25)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
                    (e.currentTarget as HTMLDivElement).style.boxShadow = "0 8px 32px rgba(19,27,70,0.15)";
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div style={{
                      width: "52px", height: "52px", borderRadius: "14px",
                      background: `${course.iconColor}25`,
                      border: `1px solid ${course.iconColor}50`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      <FontAwesomeIcon
                        icon={course.icon}
                        style={{ width: "22px", height: "22px", color: course.iconColor }}
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
                      {course.ageGroup}
                    </span>
                  </div>

                  <div>
                    <p style={{
                      fontSize: "0.68rem", fontWeight: 700,
                      textTransform: "uppercase", letterSpacing: "0.08em",
                      color: "#a0b0ff", marginBottom: "8px",
                    }}>
                      {course.subject}
                    </p>
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
                      <FontAwesomeIcon icon={faClock} style={{ width: "12px", height: "12px", color: "#a0b0ff" }} />
                      <span style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.55)", fontWeight: 600 }}>
                        {course.duration}
                      </span>
                    </div>
                  </div>

                  <Link
                    href={`/courses/${course.id}`}
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
              ))}
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