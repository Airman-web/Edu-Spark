"use client";

import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  LuFileText,
  LuClock,
  LuBookOpen,
  LuEye,
  LuPencil,
  LuTrash2,
  LuUsers,
} from "react-icons/lu";

type Lesson = {
  lesson_id: string;
  title: string;
};

type Quiz = {
  quiz_id: string;
  lesson_id: string;
  total_points: number;
  is_timed: boolean;
  time_limit_seconds: number;
  questions: {
    question_id: string;
  }[];
  created_at: string;
  students_attempted?: number; 
};

export default function AllQuizzesPage() {
  const router = useRouter();

  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [selectedLesson, setSelectedLesson] = useState<string>("");
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loadingLessons, setLoadingLessons] = useState(true);
  const [loadingQuiz, setLoadingQuiz] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Fetching all lessons
  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/admin/lesson`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!res.ok) throw new Error();

        const data = await res.json();
        setLessons(data);
      } catch {
        toast.error("Failed to load lessons");
      } finally {
        setLoadingLessons(false);
      }
    };

    fetchLessons();
  }, []);

  // Fetching the quiz for the selected lesson
  const fetchQuiz = async (lessonId: string) => {
    if (!lessonId) return;

    try {
      setLoadingQuiz(true);
      setQuiz(null);

      const token = localStorage.getItem("token");

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/quizzes/lesson/${lessonId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!res.ok) {
        setQuiz(null);
        return;
      }

      const data = await res.json();
      setQuiz(data);
    } catch {
      toast.error("Failed to load quiz");
    } finally {
      setLoadingQuiz(false);
    }
  };

  // DELETE QUIZ
  const handleDelete = async () => {
    if (!quiz) return;

    try {
      setDeleting(true);

      const token = localStorage.getItem("token");

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/quizzes/${quiz.quiz_id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!res.ok) throw new Error();

      toast.success("Quiz deleted successfully");
      setQuiz(null);
    } catch {
      toast.error("Delete failed");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-8 space-y-8">

      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-[#0f1535]">
          Manage Quizzes
        </h1>
      </div>

      {/* Lesson Selector */}
      <div className="bg-white border border-[#e4e6f0] rounded-2xl p-6 space-y-4 shadow-sm">
        <div className="flex items-center gap-3">
          <LuBookOpen className="text-[#3749a9]" size={20} />
          <h2 className="font-semibold text-[#0f1535]">
            Select a Lesson
          </h2>
        </div>

        {loadingLessons ? (
          <p className="text-sm text-[#7b82a8]">
            Loading lessons...
          </p>
        ) : lessons.length === 0 ? (
          <p className="text-sm text-red-500">
            No lessons available.
          </p>
        ) : (
          <select
            className="w-full border border-[#e4e6f0] rounded-lg px-4 py-3"
            value={selectedLesson}
            onChange={(e) => {
              setSelectedLesson(e.target.value);
              fetchQuiz(e.target.value);
            }}
          >
            <option value="">Choose a lesson</option>
            {lessons.map((lesson) => (
              <option key={lesson.lesson_id} value={lesson.lesson_id}>
                {lesson.title}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Quiz Display */}
      {loadingQuiz && (
        <p className="text-sm text-[#7b82a8]">
          Loading quiz...
        </p>
      )}

      {!loadingQuiz && selectedLesson && !quiz && (
        <div className="bg-white border border-[#e4e6f0] rounded-2xl p-8 text-center space-y-4">
          <LuFileText size={28} className="mx-auto text-[#9ba3c7]" />
          <p className="text-[#7b82a8]">
            No quiz found for this lesson.
          </p>
          <Button
            onClick={() =>
              router.push(
                `/admin-dashboard/lessons/${selectedLesson}/quiz`
              )
            }
            className="bg-[#3749a9] text-white"
          >
            Create Quiz
          </Button>
        </div>
      )}

      {quiz && (
        <div className="bg-white border border-[#e4e6f0] rounded-2xl p-6 shadow-sm space-y-6">
          <div className="flex justify-between items-start flex-wrap gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <h2 className="text-lg font-semibold text-[#0f1535]">
                  Quiz Summary
                </h2>

                {quiz.is_timed ? (
                  <Badge className="bg-orange-100 text-orange-600">
                    Game Mode
                  </Badge>
                ) : (
                  <Badge className="bg-blue-100 text-blue-600">
                    Standard Quiz
                  </Badge>
                )}
              </div>

              <div className="flex flex-wrap gap-6 text-sm text-[#4b5281]">
                <span>
                  <strong>Total Points:</strong> {quiz.total_points}
                </span>
                <span>
                  <strong>Questions:</strong>{" "}
                  {quiz.questions.length}
                </span>
                {quiz.is_timed && (
                  <span>
                    <LuClock className="inline mr-1" />
                    {quiz.time_limit_seconds} sec
                  </span>
                )}
                <span>
                  <LuUsers className="inline mr-1" />
                  Students Attempted:{" "}
                  {quiz.students_attempted ?? 0}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 flex-wrap">
              <Button
                variant="outline"
                onClick={() =>
                  router.push(
                    `/admin-dashboard/quizzes/${quiz.quiz_id}`
                  )
                }
              >
                <LuEye size={16} className="mr-2" />
                View
              </Button>

              <Button
                className="bg-[#3749a9] text-white"
                onClick={() =>
                  router.push(
                    `/admin-dashboard/quizzes/${quiz.quiz_id}/edit`
                  )
                }
              >
                <LuPencil size={16} className="mr-2" />
                Edit
              </Button>

              <Button
                variant="destructive"
                disabled={deleting}
                onClick={handleDelete}
              >
                <LuTrash2 size={16} className="mr-2" />
                Delete
              </Button>
            </div>
          </div>

          <div className="text-xs text-[#9ba3c7]">
            Created on{" "}
            {new Date(quiz.created_at).toLocaleDateString("en-GB")}
          </div>
        </div>
      )}
    </div>
  );
}