"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  LuBookOpen,
  LuFileCheck,
  LuTrophy,
  LuStar,
  LuChevronRight,
  LuFlame,
  LuCircleCheckBig,
  LuTarget,
} from "react-icons/lu";

// Static data (replace with API calls when backend is ready)

const quizResults = [
  { course: "Mathematics – Grade 9", quiz: "Quadratic Equations", score: 90, date: "Mar 14" },
  { course: "English Literature", quiz: "Romeo & Juliet", score: 78, date: "Mar 13" },
  { course: "Physics – Grade 9", quiz: "Newton's Laws", score: 85, date: "Mar 12" },
  { course: "Biology", quiz: "Cell Structure", score: 92, date: "Mar 11" },
  { course: "Chemistry", quiz: "Atomic Theory", score: 74, date: "Mar 10" },
];

const courses = [
  {
    title: "Mathematics – Grade 9",
    progress: 72, lessons: 18, totalLessons: 25, color: "#3749a9",
    description: "Algebra, quadratic equations, geometry proofs, and number theory fundamentals.",
    nextLesson: "Lesson 19: Trigonometry Basics",
    instructor: "Mr. Kamanzi",
    quizzes: 5, assignments: 3,
  },
  {
    title: "English Literature",
    progress: 55, lessons: 11, totalLessons: 20, color: "#5b2d8a",
    description: "Classic and contemporary texts, essay writing, and literary analysis techniques.",
    nextLesson: "Lesson 12: Macbeth – Act III",
    instructor: "Ms. Uwimana",
    quizzes: 4, assignments: 4,
  },
  {
    title: "Physics – Grade 9",
    progress: 40, lessons: 8, totalLessons: 20, color: "#131b46",
    description: "Mechanics, waves, electricity, and introductory quantum concepts.",
    nextLesson: "Lesson 9: Thermodynamics",
    instructor: "Mr. Nsengimana",
    quizzes: 3, assignments: 2,
  },
  {
    title: "Biology",
    progress: 88, lessons: 22, totalLessons: 25, color: "#1b9e5a",
    description: "Cell biology, genetics, ecosystems, and human body systems.",
    nextLesson: "Lesson 23: DNA Replication",
    instructor: "Ms. Mutesi",
    quizzes: 6, assignments: 3,
  },
  {
    title: "Chemistry",
    progress: 20, lessons: 4, totalLessons: 20, color: "#c05621",
    description: "Atomic structure, periodic table, chemical bonding, and reactions.",
    nextLesson: "Lesson 5: Chemical Equations",
    instructor: "Mr. Habimana",
    quizzes: 2, assignments: 1,
  },
  {
    title: "Geography",
    progress: 60, lessons: 12, totalLessons: 20, color: "#1b6e9e",
    description: "Physical geography, climate, maps, and human settlement patterns.",
    nextLesson: "Lesson 13: Plate Tectonics",
    instructor: "Ms. Ingabire",
    quizzes: 4, assignments: 2,
  },
];

const leaderboardTop5 = [
  { rank: 1, name: "Amina K.", points: 3840 },
  { rank: 2, name: "Jean H.", points: 3710 },
  { rank: 3, name: "Grace U.", points: 3680 },
  { rank: 11, name: "Patrick N.", points: 2940 },
  { rank: 12, name: "You", points: 2890, isMe: true },
];

// Score colour helper 
function scoreMeta(score: number) {
  if (score >= 85) return { bg: "#e6f9f0", text: "#1b9e5a", bar: "#1b9e5a" };
  if (score >= 70) return { bg: "#fef9e7", text: "#b7791f", bar: "#f6ad55" };
  return { bg: "#fdecea", text: "#c0392b", bar: "#fc8181" };
}

// Component 
export default function StudentDashboardPage() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [userName, setUserName] = useState("Student");
  const [userInfo, setUserInfo] = useState({
      firstName: "",
      role: "",
    });

  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      setAuthorized(true);
      return;
    }
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    
        setUserInfo({
          firstName: user?.profile?.firstName || "",
          role: user?.role || "",
        });

    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token || role !== "student") {
      router.replace("/login");
    } else {
      setAuthorized(true);
      try {
        const u = JSON.parse(localStorage.getItem("user") || "{}");
        const first = u.profile?.firstName || "";
        if (first) setUserName(first);
      } catch {
        // fall through — default name used
      }
    }
  }, []);

  if (!authorized) return null;

  const totalLessons = 34;
  const totalPoints = 2890;
  const quizAvg = Math.round(quizResults.reduce((s, q) => s + q.score, 0) / quizResults.length);
  const leaderboardRank = 12;
  const totalStudents = 250;

  return (
    <div className="py-6 space-y-6">

      {/* ── 1. Student name + greeting ───────────────────────────────────── */}
      <div>
        <h1 className="text-[22px] font-bold text-[#0f1535]">
          Welcome back, {userName}!
        </h1>
        <p className="text-[13px] text-[#7b82a8] mt-0.5">
          Here&apos;s your learning progress at a glance.
        </p>
      </div>

      {/* ── 2. Top summary row: Total Points hero + 3 stat cards ─────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

        {/* Total Points – gradient hero card */}
        <div
          className="relative rounded-2xl p-5 text-white sm:col-span-1 cursor-pointer group overflow-hidden"
          style={{
            background: "linear-gradient(135deg, #1b2561 0%, #3749a9 100%)",
            boxShadow: "0 4px 20px rgba(55,73,169,0.35)",
          }}
          onClick={() => router.push("/student-dashboard/profile")}
        >
          {/* Default */}
          <div className="flex items-center gap-4 transition-opacity duration-200 group-hover:opacity-0">
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
              <LuStar size={22} color="#fff" />
            </div>
            <div>
              <p className="text-[12px] font-semibold text-white/70 uppercase tracking-wider">Total Points</p>
              <p className="text-[26px] font-bold leading-tight">{totalPoints.toLocaleString()}</p>
              <p className="text-[11px] text-white/60 mt-0.5">XP earned so far</p>
            </div>
          </div>
          {/* Hover */}
          <div className="absolute inset-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-between">
            <p className="text-[11px] font-bold text-white/70 uppercase tracking-wider mb-2">Points Breakdown</p>
            <div className="space-y-1">
              {[
                { label: "Mathematics", pts: 680 },
                { label: "Biology", pts: 620 },
                { label: "English", pts: 540 },
                { label: "Physics", pts: 510 },
                { label: "Others", pts: 540 },
              ].map((s) => (
                <div key={s.label} className="flex justify-between text-[11px]">
                  <span className="text-white/70">{s.label}</span>
                  <span className="text-white font-semibold">{s.pts} pts</span>
                </div>
              ))}
            </div>
            <p className="text-[10px] text-white/50 mt-2">+120 pts this week · View profile →</p>
          </div>
        </div>

        {/* Lessons Completed */}
        <div
          className="relative bg-white rounded-2xl p-5 border border-[#e4e6f0] cursor-pointer group overflow-hidden hover:border-[#131b46] transition-colors"
          style={{ boxShadow: "0 2px 12px rgba(19,27,70,0.06)" }}
          onClick={() => router.push("/student-dashboard/courses")}
        >
          {/* Default */}
          <div className="flex items-center gap-4 transition-opacity duration-200 group-hover:opacity-0">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: "#131b4614" }}>
              <LuFileCheck size={22} color="#131b46" />
            </div>
            <div>
              <p className="text-[13px] font-medium text-[#7b82a8]">Lessons Completed</p>
              <p className="text-[22px] font-bold text-[#0f1535]">{totalLessons}</p>
              <p className="text-[11px] text-[#9ba3c7]">across 6 courses</p>
            </div>
          </div>
          {/* Hover */}
          <div className="absolute inset-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white flex flex-col justify-between">
            <p className="text-[11px] font-bold text-[#131b46] uppercase tracking-wider mb-2">By Course</p>
            <div className="space-y-1">
              {[
                { label: "Biology", done: 22, total: 25 },
                { label: "Mathematics", done: 18, total: 25 },
                { label: "Geography", done: 12, total: 20 },
                { label: "English", done: 11, total: 20 },
                { label: "Physics", done: 8, total: 20 },
              ].map((c) => (
                <div key={c.label} className="flex justify-between text-[11px]">
                  <span className="text-[#7b82a8]">{c.label}</span>
                  <span className="font-semibold text-[#0f1535]">{c.done}/{c.total}</span>
                </div>
              ))}
            </div>
            <p className="text-[10px] text-[#9ba3c7] mt-2">5 completed this week · View courses →</p>
          </div>
        </div>

        {/* Quiz Average */}
        <div
          className="relative bg-white rounded-2xl p-5 border border-[#e4e6f0] cursor-pointer group overflow-hidden hover:border-[#1b9e5a] transition-colors"
          style={{ boxShadow: "0 2px 12px rgba(19,27,70,0.06)" }}
          onClick={() => router.push("/student-dashboard/courses")}
        >
          {/* Default */}
          <div className="flex items-center gap-4 transition-opacity duration-200 group-hover:opacity-0">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: "#1b9e5a14" }}>
              <LuTarget size={22} color="#1b9e5a" />
            </div>
            <div>
              <p className="text-[13px] font-medium text-[#7b82a8]">Quiz Average</p>
              <p className="text-[22px] font-bold text-[#0f1535]">{quizAvg}%</p>
              <p className="text-[11px] text-[#9ba3c7]">{quizResults.length} quizzes taken</p>
            </div>
          </div>
          {/* Hover */}
          <div className="absolute inset-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white flex flex-col justify-between">
            <p className="text-[11px] font-bold text-[#1b9e5a] uppercase tracking-wider mb-2">Recent Scores</p>
            <div className="space-y-1">
              {quizResults.map((q) => (
                <div key={q.quiz} className="flex justify-between text-[11px]">
                  <span className="text-[#7b82a8] truncate pr-2">{q.quiz}</span>
                  <span className={`font-semibold shrink-0 ${q.score >= 85 ? "text-[#1b9e5a]" : q.score >= 70 ? "text-[#b7791f]" : "text-[#c0392b]"}`}>
                    {q.score}%
                  </span>
                </div>
              ))}
            </div>
            <p className="text-[10px] text-[#9ba3c7] mt-2">Best: Biology 92% · View all →</p>
          </div>
        </div>

        {/* Leaderboard Rank */}
        <div
          className="relative bg-white rounded-2xl p-5 border border-[#e4e6f0] cursor-pointer group overflow-hidden hover:border-[#5b2d8a] transition-colors"
          style={{ boxShadow: "0 2px 12px rgba(19,27,70,0.06)" }}
          onClick={() => router.push("/student-dashboard/leaderboard")}
        >
          {/* Default */}
          <div className="flex items-center gap-4 transition-opacity duration-200 group-hover:opacity-0">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: "#5b2d8a14" }}>
              <LuTrophy size={22} color="#5b2d8a" />
            </div>
            <div>
              <p className="text-[13px] font-medium text-[#7b82a8]">Leaderboard Rank</p>
              <p className="text-[22px] font-bold text-[#0f1535]">#{leaderboardRank}</p>
              <p className="text-[11px] text-[#9ba3c7]">of {totalStudents} students</p>
            </div>
          </div>
          {/* Hover */}
          <div className="absolute inset-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white flex flex-col justify-between">
            <p className="text-[11px] font-bold text-[#5b2d8a] uppercase tracking-wider mb-2">Standing</p>
            <div className="space-y-1.5">
              <div className="flex justify-between text-[11px]">
                <span className="text-[#7b82a8]">Your rank</span>
                <span className="font-bold text-[#0f1535]">#12 / {totalStudents}</span>
              </div>
              <div className="flex justify-between text-[11px]">
                <span className="text-[#7b82a8]">Your points</span>
                <span className="font-semibold text-[#0f1535]">2,890 pts</span>
              </div>
              <div className="flex justify-between text-[11px]">
                <span className="text-[#7b82a8]">Next rank (#11)</span>
                <span className="font-semibold text-[#5b2d8a]">+50 pts needed</span>
              </div>
              <div className="flex justify-between text-[11px]">
                <span className="text-[#7b82a8]">Top student</span>
                <span className="font-semibold text-[#0f1535]">Amina K. · 3,840</span>
              </div>
              <div className="flex justify-between text-[11px]">
                <span className="text-[#7b82a8]">Weekly change</span>
                <span className="font-semibold text-[#1b9e5a]">↑ 3 places</span>
              </div>
            </div>
            <p className="text-[10px] text-[#9ba3c7] mt-2">View full leaderboard →</p>
          </div>
        </div>
      </div>

      {/* ── 3. Middle row: Quiz Performance + Leaderboard Position ───────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Quiz Performance – detailed */}
        <div
          className="lg:col-span-2 bg-white rounded-2xl border border-[#e4e6f0] overflow-hidden"
          style={{ boxShadow: "0 2px 12px rgba(19,27,70,0.06)" }}
        >
          <div className="px-6 py-4 border-b border-[#e4e6f0] flex items-center justify-between">
            <div>
              <h2 className="text-[15px] font-bold text-[#0f1535]">Quiz Performance</h2>
              <p className="text-[12px] text-[#7b82a8] mt-0.5">Your recent quiz scores</p>
            </div>
            <span
              className="px-3 py-1 rounded-full text-[11px] font-semibold"
              style={{ background: "#1b9e5a14", color: "#1b9e5a" }}
            >
              Avg {quizAvg}%
            </span>
          </div>

          <ul className="divide-y divide-[#f0f1f7]">
            {quizResults.map((q, i) => {
              const { bg, text, bar } = scoreMeta(q.score);
              return (
                <li key={i} className="px-6 py-4 hover:bg-[#f7f8fc] transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <div className="min-w-0 pr-4">
                      <p className="text-[13px] font-semibold text-[#0f1535] truncate">{q.quiz}</p>
                      <p className="text-[11.5px] text-[#7b82a8] mt-0.5 truncate">{q.course}</p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-[11px] text-[#9ba3c7]">{q.date}</span>
                      <span
                        className="px-2.5 py-0.5 rounded-full text-[12px] font-bold"
                        style={{ background: bg, color: text }}
                      >
                        {q.score}%
                      </span>
                    </div>
                  </div>
                  {/* Score bar */}
                  <div className="h-1.5 rounded-full bg-[#f0f1f7] overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${q.score}%`, background: bar }}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Leaderboard Position – detailed */}
        <div
          className="bg-white rounded-2xl border border-[#e4e6f0] overflow-hidden"
          style={{ boxShadow: "0 2px 12px rgba(19,27,70,0.06)" }}
        >
          <div className="px-6 py-4 border-b border-[#e4e6f0]">
            <h2 className="text-[15px] font-bold text-[#0f1535]">Leaderboard</h2>
            <p className="text-[12px] text-[#7b82a8] mt-0.5">Top students this month</p>
          </div>

          <ul className="divide-y divide-[#f0f1f7]">
            {leaderboardTop5.map((entry, i) => (
              <li
                key={i}
                className={`px-5 py-3.5 flex items-center gap-3 transition-colors ${
                  entry.isMe
                    ? "bg-[#3749a908]"
                    : "hover:bg-[#f7f8fc]"
                }`}
              >
                {/* Rank badge */}
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center text-[12px] font-bold shrink-0"
                  style={
                    entry.rank <= 3
                      ? {
                          background:
                            entry.rank === 1
                              ? "#f6c90014"
                              : entry.rank === 2
                                ? "#b0b0b014"
                                : "#cd7f3214",
                          color:
                            entry.rank === 1
                              ? "#b7791f"
                              : entry.rank === 2
                                ? "#6b7280"
                                : "#92400e",
                        }
                      : { background: "#f0f2fa", color: "#7b82a8" }
                  }
                >
                  {entry.rank <= 3 ? ["🥇", "🥈", "🥉"][entry.rank - 1] : `#${entry.rank}`}
                </div>

                {/* Name */}
                <span
                  className={`flex-1 text-[13px] truncate ${
                    entry.isMe
                      ? "font-bold text-[#3749a9]"
                      : "font-medium text-[#0f1535]"
                  }`}
                >
                  {entry.name}
                  {entry.isMe && (
                    <span className="ml-1.5 text-[10px] font-semibold text-[#3749a9] bg-[#3749a914] px-1.5 py-0.5 rounded-full">
                      You
                    </span>
                  )}
                </span>

                {/* Points */}
                <span className="text-[12px] font-semibold text-[#7b82a8] shrink-0">
                  {entry.points.toLocaleString()} pts
                </span>
              </li>
            ))}
          </ul>

          {/* Separator for missing ranks */}
          <div className="px-5 py-2 text-center text-[11px] text-[#9ba3c7]">
            · · ·
          </div>

          <div className="px-6 pb-4 pt-1">
            <button
              onClick={() => router.push("/student-dashboard/leaderboard")}
              className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-[13px] font-semibold text-[#3749a9] border border-[#3749a9] hover:bg-[#3749a908] transition-colors"
            >
              Full Leaderboard <LuChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* ── 4. My Courses – navigation section ───────────────────────────── */}
      <div
        className="bg-white rounded-2xl border border-[#e4e6f0] overflow-hidden"
        style={{ boxShadow: "0 2px 12px rgba(19,27,70,0.06)" }}
      >
        <div className="px-6 py-4 border-b border-[#e4e6f0] flex items-center justify-between">
          <div>
            <h2 className="text-[15px] font-bold text-[#0f1535]">My Courses</h2>
            <p className="text-[12px] text-[#7b82a8] mt-0.5">Continue where you left off</p>
          </div>
          <button
            onClick={() => router.push("/student-dashboard/courses")}
            className="flex items-center gap-1.5 text-[12px] font-semibold text-[#3749a9] hover:underline"
          >
            View all <LuChevronRight size={13} />
          </button>
        </div>

        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {courses.map((c, i) => (
            <div
              key={i}
              className="relative border border-[#e4e6f0] rounded-xl p-4 hover:border-[#3749a9] hover:shadow-md transition-all cursor-pointer group overflow-hidden"
              onClick={() => router.push("/student-dashboard/courses")}
            >
              {/* Default view */}
              <div className="transition-opacity duration-200 group-hover:opacity-0">
                {/* Icon + title */}
                <div className="flex items-start gap-3 mb-3">
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                    style={{ background: `${c.color}14` }}
                  >
                    <LuBookOpen size={17} color={c.color} />
                  </div>
                  <p className="text-[13px] font-semibold text-[#0f1535] leading-snug pt-0.5">
                    {c.title}
                  </p>
                </div>

                {/* Progress bar */}
                <div className="mb-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] text-[#7b82a8]">
                      {c.lessons} / {c.totalLessons} lessons
                    </span>
                    <span className="text-[11px] font-semibold" style={{ color: c.color }}>
                      {c.progress}%
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full bg-[#f0f1f7] overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${c.progress}%`, background: c.color }}
                    />
                  </div>
                </div>

                {/* Status */}
                <div className="flex items-center gap-1.5 mt-3">
                  {c.progress === 100 ? (
                    <span className="flex items-center gap-1 text-[11px] font-semibold text-[#1b9e5a]">
                      <LuCircleCheckBig size={13} /> Completed
                    </span>
                  ) : (
                    <span
                      className="flex items-center gap-1 text-[11px] font-semibold"
                      style={{ color: c.color }}
                    >
                      <LuFlame size={13} /> Continue learning
                    </span>
                  )}
                </div>
              </div>

              {/* Hover overlay */}
              <div
                className="absolute inset-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-between rounded-xl"
                style={{ background: `${c.color}f5` }}
              >
                <div>
                  <p className="text-[12px] font-bold text-white mb-1">{c.title}</p>
                  <p className="text-[11px] text-white/80 leading-snug mb-3">{c.description}</p>
                  <div className="space-y-1.5">
                    <p className="text-[11px] text-white/90">
                      <span className="font-semibold">Next:</span> {c.nextLesson}
                    </p>
                    <p className="text-[11px] text-white/90">
                      <span className="font-semibold">Instructor:</span> {c.instructor}
                    </p>
                    <div className="flex gap-3 mt-1">
                      <span className="text-[11px] text-white/80">{c.quizzes} quizzes</span>
                      <span className="text-[11px] text-white/80">{c.assignments} assignments</span>
                    </div>
                  </div>
                </div>
                <div
                  className="mt-3 flex items-center justify-center gap-1 py-1.5 rounded-lg text-[11px] font-semibold"
                  style={{ background: "rgba(255,255,255,0.2)", color: "#fff" }}
                >
                  Open Course <LuChevronRight size={12} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
