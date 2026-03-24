"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  LuFileCheck,
  LuStar,
  LuTarget,
  LuBookOpen,
  LuTrophy,
  LuHistory,
} from "react-icons/lu";

export default function StudentDashboardPage() {
  const router = useRouter();

  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);

  const [userName, setUserName] = useState("Student");
  const [profileImage, setProfileImage] = useState<string | null>(null);

  const [progress, setProgress] = useState<any>(null);
  const pointsTotal = Number(progress?.total_points || 0);
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [leaderboardRank, setLeaderboardRank] = useState<number | null>(null);

  

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token = localStorage.getItem("token");
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        const role = user?.role;
        const studentId = user?.sub || user?.id;

        setAuthorized(true);

        const name =
          user?.full_name?.split(" ")[0] ||
          user?.profile?.firstName ||
          user?.email ||
          "Student";

        setUserName(name);

        const avatar =
          user?.profile_picture ||
          user?.avatar ||
          user?.image ||
          user?.profile?.avatar ||
          user?.profile?.profile_picture ||
          null;

        setProfileImage(avatar);

        // order implemented to fetch all data in parallel
        const [progressRes, enrollmentsRes, leaderboardRes] =
          await Promise.all([
            fetch(`${process.env.NEXT_PUBLIC_API_URL}/progress`, {
              headers: { Authorization: `Bearer ${token}` },
            }),
            fetch(
              `${process.env.NEXT_PUBLIC_API_URL}/courses/student/${studentId}/enrollments`,
              { headers: { Authorization: `Bearer ${token}` } }
            ),
            fetch(`${process.env.NEXT_PUBLIC_API_URL}/points/leaderboard`, {
              headers: { Authorization: `Bearer ${token}` },
            }),
          ]);


        // progress
        if (progressRes.ok) {
          const data = await progressRes.json();
          console.log(" RAW PROGRESS DATA:", data);
          console.log("RAW total_points:", data?.total_points);
          setProgress(data);
        }

        // all enrollments
        if (enrollmentsRes.ok) {
          const data = await enrollmentsRes.json();
          setEnrollments(data || []);
        }

        // leaderboard
        if (leaderboardRes.ok) {
          const data = await leaderboardRes.json();

          const sorted = [...data].sort(
            (a, b) =>
              Number(b.total_points) - Number(a.total_points)
          );

          setLeaderboard(sorted);

          const rank =
            sorted.findIndex(
              (s) => s.student_id === studentId
            ) + 1;

          setLeaderboardRank(rank > 0 ? rank : null);

          const me = sorted.find(
            (s) => s.student_id === studentId
          );

          if (me?.profile_image_url) {
            setProfileImage(me.profile_image_url);
          }
        }
      } catch (err) {
        console.error("Dashboard error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#3749a9] border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-[#7b82a8] text-sm">
          Loading your dashboard...
        </p>
      </div>
    );
  }

  if (!authorized) return null;

  const completedLessons =
    progress?.completed_lessons?.filter(
      (l: any) => l.completed === true
    ).length || 0;

  const quizAttempts = progress?.quiz_attempts || [];

  const quizAverage =
    quizAttempts.length > 0
      ? Math.round(
          quizAttempts.reduce(
            (sum: number, q: any) => sum + q.score,
            0
          ) / quizAttempts.length
        )
      : 0;

  //  leaderboard progress logic
  let progressToNextRank = 100;
  let pointsToNextRank = 0;

  if (leaderboardRank && leaderboardRank > 1) {
    const nextPlayer = leaderboard[leaderboardRank - 2];

    if (nextPlayer) {
      const nextPoints = Number(nextPlayer.total_points);
      pointsToNextRank = Math.max(
        nextPoints - pointsTotal,
        0
      );
      progressToNextRank =
        (pointsTotal / nextPoints) * 100;
    }
  }

  return (
    <div className="py-6 space-y-6">

      {/* HERO */}
      <div className="bg-gradient-to-r from-[#3749a9] to-[#5b2d8a] rounded-3xl p-8 text-white shadow-xl">
        <div className="flex items-center gap-6">
          {profileImage ? (
            <img
              src={profileImage}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-2xl animate-float animate-glow"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-yellow-400 flex items-center justify-center text-3xl font-bold shadow-2xl animate-float animate-glow">
              {userName.charAt(0)}
            </div>
          )}

          <div>
            <h1 className="text-3xl font-bold">
              Hi {userName}! 👋
            </h1>
            <p className="text-white/80 mt-2">
              Keep learning and climb the leaderboard!
            </p>
          </div>
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard icon={<LuStar />} label="Total Points" value={pointsTotal} color="text-[#3749a9]" />
        <StatCard icon={<LuFileCheck />} label="Lessons Completed" value={completedLessons} color="text-[#1b2561]" />
        <StatCard icon={<LuTarget />} label="Quiz Average" value={`${quizAverage}%`} color="text-[#1b9e5a]" />
        <StatCard icon={<LuBookOpen />} label="Enrolled Courses" value={enrollments.length} color="text-[#5b2d8a]" />
      </div>
      

      {/* LEADERBOARD */}
      <div className="bg-white rounded-2xl border border-[#e4e6f0] shadow-sm p-6">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-[15px] font-bold">Leaderboard Position</h2>
            <p className="text-sm text-[#7b82a8] mt-1">
              Keep earning to climb higher!
            </p>
          </div>

          <div className="flex items-center gap-3 text-[#5b2d8a]">
            <LuTrophy size={22} />
            <span className="text-2xl font-bold">
              #{leaderboardRank ?? "--"}
            </span>
          </div>
        </div>

        <div className="mt-4">
          <div className="w-full h-3 bg-[#f0f1f7] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#3749a9] to-[#8b5cf6] transition-all duration-700"
              style={{ width: `${progressToNextRank}%` }}
            />
          </div>

          {leaderboardRank === 1 ? (
            <p className="text-xs text-green-600 mt-2 font-semibold">
              👑 You are leading the leaderboard!
            </p>
          ) : (
            <p className="text-xs text-[#7b82a8] mt-2">
              {pointsToNextRank} points to next rank
            </p>
          )}
        </div>
      </div>

      {/* POINTS HISTORY */}
      <div className="bg-white rounded-2xl border border-[#e4e6f0] shadow-sm p-6">
        <div className="flex items-center gap-2 mb-4 text-[#3749a9]">
          <LuHistory />
          <h2 className="font-bold text-sm">Points History</h2>
        </div>

        {progress?.completed_lessons?.length > 0 ? (
          <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
            {progress.completed_lessons.map((lesson: any) => (
              <div
                key={lesson.progress_id}
                className="flex justify-between items-center bg-[#f9f9ff] p-3 rounded-xl"
              >
                <div>
                  <p className="text-sm font-medium">
                    {lesson.lesson?.title}
                  </p>
                  <p className="text-xs text-gray-400">
                    {lesson.progress_percentage}% completed
                  </p>
                </div>
                <span className="text-sm font-bold text-[#3749a9]">
                  +{Number(lesson.points || 0)}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-gray-400">
            No points earned yet.
          </p>
        )}
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: any;
  color: string;
}) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-[#e4e6f0] shadow-sm">
      <div className={`flex items-center gap-2 mb-2 ${color}`}>
        {icon}
        <p className="text-[12px] text-[#7b82a8]">{label}</p>
      </div>
      <p className={`text-[28px] font-bold ${color}`}>
        {value}
      </p>
    </div>
  );
}