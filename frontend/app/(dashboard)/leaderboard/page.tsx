"use client";

import React, { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LuSearch, LuTrophy } from "react-icons/lu";
import Navbar from "@/components/Navbar";

interface LeaderboardUser {
  student_id: string;
  name: string;
  total_points: string | number;
  profile_image_url?: string;
}

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchLeaderboard = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/points/leaderboard`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.ok) {
        const data = await res.json();
        const sorted = [...data].sort(
          (a, b) => Number(b.total_points) - Number(a.total_points)
        );
        setLeaderboard(sorted);
      }
    } catch (err) {
      console.error("Leaderboard error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
    const interval = setInterval(fetchLeaderboard, 5000);
    return () => clearInterval(interval);
  }, []);

  const filtered = useMemo(() => {
    return leaderboard.filter((user) =>
      user.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [leaderboard, search]);

  const topThree = filtered.slice(0, 3);
  const others = filtered.slice(3);

  const medalBadge = (index: number) => {
    if (index === 0)
      return "🏆 CHAMPION";
    if (index === 1)
      return "🥇 GOLD";
    if (index === 2)
      return "🥈 SILVER";
    if (index === 3 || index === 4)
      return "🥉 BRONZE";
    return null;
  };

  return (
    <div className="min-h-screen bg-[#f7f9ff]">

      {/* HERO WITH NAVBAR OVERLAY */}
      <div className="relative h-[440px] bg-gradient-to-r from-[#3749a9] to-[#5b2d8a] overflow-hidden">

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.15),transparent_60%)]"></div>

        <div className="absolute top-0 left-0 w-full z-20 backdrop-blur-md bg-white/5 border-b border-white/10">
          <Navbar />
        </div>

        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center text-white px-6">
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ repeat: Infinity, duration: 3 }}
            className="mb-6"
          >
            <div className="w-20 h-20 rounded-full bg-white/15 flex items-center justify-center backdrop-blur-lg border border-white/30 shadow-xl">
              <LuTrophy size={40} />
            </div>
          </motion.div>

          <h1 className="text-6xl font-extrabold">
            EduSpark Championship
          </h1>

          <p className="mt-4 text-white/80 max-w-2xl">
            Rise to the top and become the next learning champion.
          </p>
        </div>
      </div>

      {/* SEARCH */}
      <div className="relative -mt-14 flex justify-center px-6 z-20">
        <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl p-5 border border-[#e4e6f0]">
          <div className="relative">
            <LuSearch className="absolute left-4 top-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search student..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#3749a9]"
            />
          </div>
        </div>
      </div>

      {/* PODIUM */}
      <div className="mt-20 flex justify-center items-end gap-12 px-6">

        {topThree.map((user, index) => {
          const height = index === 0 ? "h-44" : index === 1 ? "h-36" : "h-28";

          return (
            <motion.div
              key={user.student_id}
              layout
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center"
            >
              {/* Avatar */}
              <div className="relative w-28 h-28 rounded-full overflow-hidden border-4 border-yellow-400 shadow-2xl">
                {user.profile_image_url ? (
                  <img
                    src={user.profile_image_url}
                    alt={user.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-[#3749a9] flex items-center justify-center text-white text-3xl font-bold">
                    {user.name.charAt(0)}
                  </div>
                )}

                {index === 0 && (
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="absolute -top-4 -right-4 text-3xl"
                  >
                    👑
                  </motion.div>
                )}
              </div>

              {/* Medal */}
              <div className="mt-4 px-6 py-2 rounded-full bg-white text-[#3749a9] font-bold shadow-lg border border-[#e4e6f0]">
                {medalBadge(index)}
              </div>

              {/* Name + Points */}
              <p className="mt-4 font-semibold text-[#1b2561]">
                {user.name}
              </p>
              <p className="text-xl font-extrabold text-[#3749a9]">
                {Number(user.total_points)}
              </p>

              {/* Podium Block */}
              <div className={`mt-4 w-32 ${height} rounded-t-2xl bg-gradient-to-t from-[#3749a9] to-[#5b2d8a] shadow-xl`} />
            </motion.div>
          );
        })}
      </div>

      {/* FULL LEADERBOARD */}
      <div className="max-w-5xl mx-auto mt-20 bg-white rounded-3xl shadow-xl border border-[#e4e6f0] overflow-hidden">
        {loading ? (
          <p className="text-center p-10 text-gray-400">
            Loading leaderboard...
          </p>
        ) : (
          <AnimatePresence>
            {others.map((user, index) => (
              <motion.div
                key={user.student_id}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center justify-between px-10 py-6 border-b hover:bg-[#f7f9ff]"
              >
                <div className="flex items-center gap-6">
                  <div className="text-lg font-bold text-gray-400 w-10">
                    #{index + 4}
                  </div>

                  {user.profile_image_url ? (
                    <img
                      src={user.profile_image_url}
                      alt={user.name}
                      className="w-14 h-14 rounded-full object-cover border-2 border-[#3749a9]"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-full bg-[#3749a9] text-white flex items-center justify-center font-bold">
                      {user.name.charAt(0)}
                    </div>
                  )}

                  <p className="font-semibold text-gray-800 text-lg">
                    {user.name}
                  </p>
                </div>

                <div className="flex items-center gap-6">
                  {medalBadge(index + 3) && (
                    <span className="px-4 py-1 rounded-full bg-[#eef1ff] text-[#3749a9] text-sm font-semibold">
                      {medalBadge(index + 3)}
                    </span>
                  )}

                  <div className="text-xl font-bold text-[#3749a9]">
                    {Number(user.total_points)}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}