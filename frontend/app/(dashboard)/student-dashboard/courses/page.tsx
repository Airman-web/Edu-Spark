"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  LuBookOpen,
  LuSearch,
  LuFlame,
  LuCircleCheckBig,
  LuClock,
  LuFileCheck,
  LuChevronRight,
  LuX,
} from "react-icons/lu";

//  Mock data
const courses = [
  {
    id: 1,
    title: "Mathematics – Grade 9",
    subject: "Mathematics",
    progress: 72,
    lessons: 18,
    totalLessons: 25,
    color: "#3749a9",
    instructor: "Mr. Kamanzi",
    description: "Algebra, quadratic equations, geometry proofs, and number theory fundamentals.",
    nextLesson: "Lesson 19: Trigonometry Basics",
    quizzes: 5,
    assignments: 3,
    lastActivity: "2 hours ago",
    duration: "12h 30m",
  },
  {
    id: 2,
    title: "English Literature",
    subject: "English",
    progress: 55,
    lessons: 11,
    totalLessons: 20,
    color: "#5b2d8a",
    instructor: "Ms. Uwimana",
    description: "Classic and contemporary texts, essay writing, and literary analysis techniques.",
    nextLesson: "Lesson 12: Macbeth – Act III",
    quizzes: 4,
    assignments: 4,
    lastActivity: "Yesterday",
    duration: "8h 45m",
  },
  {
    id: 3,
    title: "Physics – Grade 9",
    subject: "Physics",
    progress: 40,
    lessons: 8,
    totalLessons: 20,
    color: "#131b46",
    instructor: "Mr. Nsengimana",
    description: "Mechanics, waves, electricity, and introductory quantum concepts.",
    nextLesson: "Lesson 9: Thermodynamics",
    quizzes: 3,
    assignments: 2,
    lastActivity: "3 days ago",
    duration: "9h 20m",
  },
  {
    id: 4,
    title: "Biology",
    subject: "Biology",
    progress: 88,
    lessons: 22,
    totalLessons: 25,
    color: "#1b9e5a",
    instructor: "Ms. Mutesi",
    description: "Cell biology, genetics, ecosystems, and human body systems.",
    nextLesson: "Lesson 23: DNA Replication",
    quizzes: 6,
    assignments: 3,
    lastActivity: "1 hour ago",
    duration: "14h 10m",
  },
  {
    id: 5,
    title: "Chemistry",
    subject: "Chemistry",
    progress: 20,
    lessons: 4,
    totalLessons: 20,
    color: "#c05621",
    instructor: "Mr. Habimana",
    description: "Atomic structure, periodic table, chemical bonding, and reactions.",
    nextLesson: "Lesson 5: Chemical Equations",
    quizzes: 2,
    assignments: 1,
    lastActivity: "5 days ago",
    duration: "10h 00m",
  },
  {
    id: 6,
    title: "Geography",
    subject: "Geography",
    progress: 60,
    lessons: 12,
    totalLessons: 20,
    color: "#1b6e9e",
    instructor: "Ms. Ingabire",
    description: "Physical geography, climate, maps, and human settlement patterns.",
    nextLesson: "Lesson 13: Plate Tectonics",
    quizzes: 4,
    assignments: 2,
    lastActivity: "Yesterday",
    duration: "11h 15m",
  },
  {
    id: 7,
    title: "History – Grade 9",
    subject: "History",
    progress: 35,
    lessons: 7,
    totalLessons: 20,
    color: "#7b3a1e",
    instructor: "Mr. Bizimana",
    description: "Rwandan history, African civilisations, colonial era, and post-independence.",
    nextLesson: "Lesson 8: Independence Movements",
    quizzes: 3,
    assignments: 2,
    lastActivity: "4 days ago",
    duration: "9h 50m",
  },
  {
    id: 8,
    title: "Computer Science",
    subject: "Computer Science",
    progress: 10,
    lessons: 2,
    totalLessons: 20,
    color: "#0e7490",
    instructor: "Ms. Niyonzima",
    description: "Introduction to programming, algorithms, data structures, and web basics.",
    nextLesson: "Lesson 3: Variables & Data Types",
    quizzes: 1,
    assignments: 1,
    lastActivity: "1 week ago",
    duration: "10h 30m",
  },
];

const subjects = ["All", ...Array.from(new Set(courses.map((c) => c.subject)))];

const FILTER_OPTIONS = [
  { label: "All courses", value: "all" },
  { label: "In progress", value: "inprogress" },
  { label: "Almost done (>70%)", value: "nearlydone" },
  { label: "Just started (<30%)", value: "new" },
  { label: "Completed", value: "completed" },
];

// Component
export default function StudentCoursesPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [subject, setSubject] = useState("All");
  const [filter, setFilter] = useState("all");

  const filtered = courses.filter((c) => {
    const matchSearch =
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.instructor.toLowerCase().includes(search.toLowerCase()) ||
      c.description.toLowerCase().includes(search.toLowerCase());
    const matchSubject = subject === "All" || c.subject === subject;
    const matchFilter =
      filter === "all" ||
      (filter === "inprogress" && c.progress > 0 && c.progress < 100) ||
      (filter === "nearlydone" && c.progress >= 70 && c.progress < 100) ||
      (filter === "new" && c.progress < 30) ||
      (filter === "completed" && c.progress === 100);
    return matchSearch && matchSubject && matchFilter;
  });

  return (
    <div className="py-6 space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-[22px] font-bold text-[#0f1535]">My Courses</h1>
        <p className="text-[13px] text-[#7b82a8] mt-0.5">
          {courses.length} courses enrolled · {courses.filter((c) => c.progress === 100).length} completed
        </p>
      </div>

      {/* Search + Filters */}
      <div className="flex flex-col sm:flex-row gap-3">

        {/* Search */}
        <div className="relative flex-1">
          <LuSearch size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9ba3c7]" />
          <input
            type="text"
            placeholder="Search courses, instructors…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-9 py-2.5 rounded-xl border border-[#e4e6f0] text-[13px] text-[#0f1535] placeholder:text-[#9ba3c7] outline-none focus:border-[#3749a9] transition-colors bg-white"
            style={{ boxShadow: "0 1px 4px rgba(19,27,70,0.05)" }}
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9ba3c7] hover:text-[#0f1535]"
            >
              <LuX size={14} />
            </button>
          )}
        </div>

        {/* Subject filter */}
        <select
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="px-3 py-2.5 rounded-xl border border-[#e4e6f0] text-[13px] text-[#0f1535] outline-none focus:border-[#3749a9] transition-colors bg-white cursor-pointer"
          style={{ boxShadow: "0 1px 4px rgba(19,27,70,0.05)" }}
        >
          {subjects.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      {/* Progress filter pills */}
      <div className="flex flex-wrap gap-2">
        {FILTER_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => setFilter(opt.value)}
            className={`px-3.5 py-1.5 rounded-full text-[12px] font-semibold transition-colors ${
              filter === opt.value
                ? "bg-[#3749a9] text-white"
                : "bg-white border border-[#e4e6f0] text-[#7b82a8] hover:border-[#3749a9] hover:text-[#3749a9]"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Results count */}
      {search || subject !== "All" || filter !== "all" ? (
        <p className="text-[12px] text-[#7b82a8]">
          Showing {filtered.length} of {courses.length} courses
        </p>
      ) : null}

      {/* Course grid */}
      {filtered.length === 0 ? (
        <div
          className="bg-white rounded-2xl border border-[#e4e6f0] flex flex-col items-center justify-center py-20"
          style={{ boxShadow: "0 2px 12px rgba(19,27,70,0.06)" }}
        >
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-3" style={{ background: "#3749a914" }}>
            <LuSearch size={22} color="#3749a9" />
          </div>
          <p className="text-[15px] font-semibold text-[#0f1535]">No courses found</p>
          <p className="text-[13px] text-[#7b82a8] mt-1">Try adjusting your search or filters</p>
          <button
            onClick={() => { setSearch(""); setSubject("All"); setFilter("all"); }}
            className="mt-4 px-4 py-2 rounded-xl text-[13px] font-semibold text-[#3749a9] border border-[#3749a9] hover:bg-[#3749a908] transition-colors"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((c) => (
            <div
              key={c.id}
              className="bg-white border border-[#e4e6f0] rounded-2xl overflow-hidden hover:border-[#3749a9] hover:shadow-md transition-all cursor-pointer group"
              style={{ boxShadow: "0 2px 12px rgba(19,27,70,0.05)" }}
              onClick={() => router.push(`/student-dashboard/courses/${c.id}`)}
            >
              {/* Colour bar */}
              <div className="h-1.5 w-full" style={{ background: c.color }} />

              <div className="p-5">
                {/* Icon + title */}
                <div className="flex items-start gap-3 mb-4">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
                    style={{ background: `${c.color}14` }}
                  >
                    <LuBookOpen size={18} color={c.color} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[14px] font-bold text-[#0f1535] leading-snug group-hover:text-[#3749a9] transition-colors">
                      {c.title}
                    </p>
                    <p className="text-[11.5px] text-[#7b82a8] mt-0.5">{c.instructor}</p>
                  </div>
                </div>

                {/* Description */}
                <p className="text-[12px] text-[#7b82a8] leading-relaxed mb-4 line-clamp-2">
                  {c.description}
                </p>

                {/* Progress */}
                <div className="mb-4">
                  <div className="flex justify-between mb-1.5">
                    <span className="text-[11.5px] text-[#7b82a8]">{c.lessons}/{c.totalLessons} lessons</span>
                    <span className="text-[11.5px] font-bold" style={{ color: c.color }}>{c.progress}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-[#f0f1f7] overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${c.progress}%`, background: c.color }}
                    />
                  </div>
                </div>

                {/* Meta row */}
                <div className="flex items-center gap-3 mb-4 flex-wrap">
                  <span className="flex items-center gap-1 text-[11px] text-[#9ba3c7]">
                    <LuFileCheck size={12} /> {c.quizzes} quizzes
                  </span>
                  <span className="flex items-center gap-1 text-[11px] text-[#9ba3c7]">
                    <LuBookOpen size={12} /> {c.assignments} assignments
                  </span>
                  <span className="flex items-center gap-1 text-[11px] text-[#9ba3c7]">
                    <LuClock size={12} /> {c.duration}
                  </span>
                </div>

                {/* Next lesson + CTA */}
                <div className="border-t border-[#f0f1f7] pt-3 flex items-center justify-between">
                  <div className="min-w-0 pr-2">
                    {c.progress === 100 ? (
                      <span className="flex items-center gap-1 text-[11.5px] font-semibold text-[#1b9e5a]">
                        <LuCircleCheckBig size={13} /> Completed
                      </span>
                    ) : (
                      <>
                        <p className="text-[10.5px] text-[#9ba3c7]">Up next</p>
                        <p className="text-[11.5px] font-semibold text-[#0f1535] truncate">{c.nextLesson}</p>
                      </>
                    )}
                  </div>
                  <button
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-[11.5px] font-semibold text-white shrink-0 transition-opacity hover:opacity-90"
                    style={{ background: c.color }}
                  >
                    {c.progress === 100 ? "Review" : <><LuFlame size={12} /> Continue</>}
                    <LuChevronRight size={12} />
                  </button>
                </div>

                {/* Last activity */}
                <p className="text-[10.5px] text-[#b0b8d4] mt-2">Last activity: {c.lastActivity}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
