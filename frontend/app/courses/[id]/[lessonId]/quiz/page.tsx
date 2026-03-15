"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/footer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faCircleCheck,
  faCircleXmark,
  faTrophy,
  faRotateLeft,
  faArrowRight,
  faClipboardQuestion,
} from "@fortawesome/free-solid-svg-icons";

type Option = { id: string; text: string };
type Question = {
  id: number;
  question: string;
  options: Option[];
  correctId: string;
  explanation: string;
};

const QUESTIONS: Question[] = [
  {
    id: 1,
    question: "What is 2 + 3?",
    options: [
      { id: "a", text: "4" },
      { id: "b", text: "5" },
      { id: "c", text: "6" },
      { id: "d", text: "7" },
    ],
    correctId: "b",
    explanation: "2 + 3 = 5. If you have 2 apples and get 3 more, you have 5 apples in total.",
  },
  {
    id: 2,
    question: "Which symbol is used for addition?",
    options: [
      { id: "a", text: "−" },
      { id: "b", text: "×" },
      { id: "c", text: "+" },
      { id: "d", text: "÷" },
    ],
    correctId: "c",
    explanation: "The + symbol means addition. It is used when we want to put numbers together.",
  },
  {
    id: 3,
    question: "What is 1 + 1?",
    options: [
      { id: "a", text: "1" },
      { id: "b", text: "3" },
      { id: "c", text: "11" },
      { id: "d", text: "2" },
    ],
    correctId: "d",
    explanation: "1 + 1 = 2. One plus one always equals two.",
  },
  {
    id: 4,
    question: "If you have 4 books and get 2 more, how many do you have?",
    options: [
      { id: "a", text: "5" },
      { id: "b", text: "6" },
      { id: "c", text: "7" },
      { id: "d", text: "8" },
    ],
    correctId: "b",
    explanation: "4 + 2 = 6. This is a real-life example of addition.",
  },
  {
    id: 5,
    question: "What is 0 + 9?",
    options: [
      { id: "a", text: "0" },
      { id: "b", text: "10" },
      { id: "c", text: "9" },
      { id: "d", text: "90" },
    ],
    correctId: "c",
    explanation: "0 + 9 = 9. Adding zero to any number does not change it.",
  },
];

type QuizState = "answering" | "submitted";

export default function QuizPage() {
  const params = useParams();
  const courseId  = params.id       as string;
  const lessonId  = params.lessonId as string;

  const [currentIndex, setCurrentIndex]   = useState(0);
  const [selected, setSelected]           = useState<Record<number, string>>({});
  const [quizState, setQuizState]         = useState<QuizState>("answering");

  const currentQuestion = QUESTIONS[currentIndex];
  const totalQuestions  = QUESTIONS.length;
  const isLast          = currentIndex === totalQuestions - 1;
  const selectedAnswer  = selected[currentQuestion.id];

  function handleSelect(optionId: string) {
    if (quizState === "submitted") return;
    setSelected((s) => ({ ...s, [currentQuestion.id]: optionId }));
  }

  function handleNext() {
    if (!isLast) setCurrentIndex((i) => i + 1);
  }

  function handlePrev() {
    if (currentIndex > 0) setCurrentIndex((i) => i - 1);
  }

  function handleSubmit() {
    setQuizState("submitted");
    setCurrentIndex(0);
  }

  function handleRetry() {
    setSelected({});
    setQuizState("answering");
    setCurrentIndex(0);
  }

  const score = QUESTIONS.filter((q) => selected[q.id] === q.correctId).length;
  const percentage = Math.round((score / totalQuestions) * 100);
  const allAnswered = QUESTIONS.every((q) => selected[q.id]);

  function getOptionStyle(optionId: string): React.CSSProperties {
    const isSelected = selectedAnswer === optionId;
    const isCorrect  = optionId === currentQuestion.correctId;

    if (quizState === "submitted") {
      if (isCorrect) return { ...optionBase, border: "2px solid #10b981", background: "rgba(16,185,129,0.1)" };
      if (isSelected && !isCorrect) return { ...optionBase, border: "2px solid #ef4444", background: "rgba(239,68,68,0.08)" };
      return { ...optionBase, opacity: 0.5 };
    }

    if (isSelected) return { ...optionBase, border: "2px solid #3749a9", background: "rgba(55,73,169,0.08)", boxShadow: "0 0 0 3px rgba(55,73,169,0.15)" };
    return optionBase;
  }

  return (
    <>
      <Navbar />

      <main style={{ background: "#ffffff", minHeight: "100vh", fontFamily: "Poppins, Nunito, sans-serif" }}>

        {/* Header */}
        <section style={{
          backgroundImage: "linear-gradient(135deg, #131b46, #1b2561)",
          paddingTop: "100px",
          paddingBottom: "48px",
        }}>
          <div style={{ maxWidth: "760px", margin: "0 auto", padding: "0 24px" }}>
            <Link
              href={`/courses/${courseId}/${lessonId}`}
              style={{
                display: "inline-flex", alignItems: "center", gap: "8px",
                color: "rgba(255,255,255,0.7)", textDecoration: "none",
                fontSize: "0.875rem", fontWeight: 600, marginBottom: "20px",
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#ffffff")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.7)")}
            >
              <FontAwesomeIcon icon={faChevronLeft} style={{ width: "12px", height: "12px" }} />
              Back to Lesson
            </Link>

            <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "20px" }}>
              <div style={{
                width: "48px", height: "48px", borderRadius: "14px",
                background: "rgba(55,73,169,0.25)", border: "1px solid rgba(55,73,169,0.4)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <FontAwesomeIcon icon={faClipboardQuestion} style={{ width: "22px", height: "22px", color: "#a0b0ff" }} />
              </div>
              <div>
                <h1 style={{ fontSize: "1.6rem", fontWeight: 900, color: "#ffffff", lineHeight: 1.2 }}>
                  Lesson Quiz
                </h1>
                <p style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.6)" }}>
                  {totalQuestions} questions · Addition Basics
                </p>
              </div>
            </div>

            {/* Progress bar */}
            <div>
              <div style={{
                width: "100%", height: "6px", borderRadius: "6px",
                background: "rgba(255,255,255,0.15)", overflow: "hidden",
              }}>
                <div style={{
                  height: "100%", borderRadius: "6px",
                  width: `${((currentIndex + 1) / totalQuestions) * 100}%`,
                  backgroundImage: "linear-gradient(90deg, #3749a9, #7b93ff)",
                  transition: "width 0.3s ease",
                }} />
              </div>
              <div style={{
                display: "flex", justifyContent: "space-between",
                marginTop: "8px", fontSize: "0.75rem", color: "rgba(255,255,255,0.55)",
              }}>
                <span>Question {currentIndex + 1} of {totalQuestions}</span>
                <span>{Object.keys(selected).length} answered</span>
              </div>
            </div>
          </div>
        </section>

        {/* Quiz body */}
        <section style={{ background: "#f7f8fc", padding: "40px 24px 96px" }}>
          <div style={{ maxWidth: "760px", margin: "0 auto" }}>

            {quizState === "answering" ? (
              <>
                {/* Question card */}
                <div style={{
                  background: "#ffffff", borderRadius: "20px", padding: "36px",
                  border: "1px solid #eef0fa",
                  boxShadow: "0 4px 24px rgba(55,73,169,0.07)",
                  marginBottom: "16px",
                }}>
                  <p style={{
                    fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase",
                    letterSpacing: "0.1em", color: "#3749a9", marginBottom: "12px",
                  }}>
                    Question {currentIndex + 1}
                  </p>
                  <h2 style={{
                    fontSize: "1.25rem", fontWeight: 800, color: "#1b2561",
                    lineHeight: 1.4, marginBottom: "28px",
                  }}>
                    {currentQuestion.question}
                  </h2>

                  <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    {currentQuestion.options.map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => handleSelect(opt.id)}
                        style={getOptionStyle(opt.id)}
                      >
                        <span style={{
                          width: "32px", height: "32px", borderRadius: "50%", flexShrink: 0,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          background: selectedAnswer === opt.id ? "#3749a9" : "#eef0fa",
                          color: selectedAnswer === opt.id ? "#ffffff" : "#3749a9",
                          fontSize: "0.8rem", fontWeight: 800,
                          transition: "all 0.2s",
                        }}>
                          {opt.id.toUpperCase()}
                        </span>
                        <span style={{ fontSize: "0.95rem", fontWeight: 600, color: "#1b2561" }}>
                          {opt.text}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Navigation */}
                <div style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  gap: "12px", flexWrap: "wrap",
                }}>
                  <button
                    onClick={handlePrev}
                    disabled={currentIndex === 0}
                    style={{
                      ...navBtn,
                      opacity: currentIndex === 0 ? 0.4 : 1,
                      cursor: currentIndex === 0 ? "not-allowed" : "pointer",
                    }}
                  >
                    ← Previous
                  </button>

                  <div style={{ display: "flex", gap: "8px" }}>
                    {QUESTIONS.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentIndex(i)}
                        style={{
                          width: "32px", height: "32px", borderRadius: "50%", border: "none",
                          cursor: "pointer", fontWeight: 700, fontSize: "0.8rem",
                          background: i === currentIndex
                            ? "linear-gradient(135deg, #1b2561, #3749a9)"
                            : selected[QUESTIONS[i].id]
                            ? "#eef0fa"
                            : "#ffffff",
                          color: i === currentIndex ? "#ffffff" : "#3749a9",
                          border: selected[QUESTIONS[i].id] && i !== currentIndex
                            ? "2px solid #3749a9" : "2px solid #eef0fa",
                          transition: "all 0.2s",
                        }}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>

                  {!isLast ? (
                    <button onClick={handleNext} style={{ ...navBtn, background: "linear-gradient(135deg, #1b2561, #3749a9)", color: "#ffffff", border: "none" }}>
                      Next →
                    </button>
                  ) : (
                    <button
                      onClick={handleSubmit}
                      disabled={!allAnswered}
                      style={{
                        ...navBtn,
                        backgroundImage: allAnswered ? "linear-gradient(135deg, #1b2561, #3749a9)" : "none",
                        background: allAnswered ? undefined : "#e2e8f0",
                        color: allAnswered ? "#ffffff" : "#94a3b8",
                        border: "none",
                        cursor: allAnswered ? "pointer" : "not-allowed",
                      }}
                    >
                      Submit Quiz
                    </button>
                  )}
                </div>

                {!allAnswered && isLast && (
                  <p style={{ textAlign: "center", fontSize: "0.8rem", color: "#94a3b8", marginTop: "12px" }}>
                    Answer all questions to submit
                  </p>
                )}
              </>
            ) : (
              <>
                {/* Score card */}
                <div style={{
                  backgroundImage: "linear-gradient(135deg, #1b2561, #290e42)",
                  borderRadius: "20px", padding: "40px",
                  textAlign: "center", marginBottom: "24px",
                  boxShadow: "0 8px 32px rgba(19,27,70,0.2)",
                }}>
                  <div style={{
                    width: "80px", height: "80px", borderRadius: "50%", margin: "0 auto 20px",
                    background: percentage >= 60 ? "rgba(16,185,129,0.2)" : "rgba(239,68,68,0.15)",
                    border: `3px solid ${percentage >= 60 ? "#10b981" : "#ef4444"}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <FontAwesomeIcon
                      icon={percentage >= 60 ? faTrophy : faRotateLeft}
                      style={{ width: "32px", height: "32px", color: percentage >= 60 ? "#10b981" : "#ef4444" }}
                    />
                  </div>
                  <h2 style={{ fontSize: "1.8rem", fontWeight: 900, color: "#ffffff", marginBottom: "8px" }}>
                    {percentage >= 80 ? "Excellent! 🎉" : percentage >= 60 ? "Good Job! 👍" : "Keep Trying! 💪"}
                  </h2>
                  <p style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.6)", marginBottom: "24px" }}>
                    You scored
                  </p>
                  <div style={{
                    display: "inline-flex", alignItems: "baseline", gap: "4px",
                    background: "rgba(255,255,255,0.08)", borderRadius: "16px", padding: "16px 32px",
                    marginBottom: "24px",
                  }}>
                    <span style={{ fontSize: "3rem", fontWeight: 900, color: "#ffffff" }}>{score}</span>
                    <span style={{ fontSize: "1.4rem", color: "rgba(255,255,255,0.5)", fontWeight: 600 }}>/ {totalQuestions}</span>
                  </div>
                  <div style={{
                    width: "100%", height: "8px", borderRadius: "8px",
                    background: "rgba(255,255,255,0.15)", overflow: "hidden", marginBottom: "8px",
                  }}>
                    <div style={{
                      height: "100%", borderRadius: "8px",
                      width: `${percentage}%`,
                      background: percentage >= 60 ? "#10b981" : "#ef4444",
                      transition: "width 0.8s ease",
                    }} />
                  </div>
                  <p style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.5)" }}>{percentage}% correct</p>
                </div>

                {/* Answer review */}
                <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "24px" }}>
                  {QUESTIONS.map((q, i) => {
                    const userAnswer = selected[q.id];
                    const isCorrect  = userAnswer === q.correctId;
                    return (
                      <div key={q.id} style={{
                        background: "#ffffff", borderRadius: "16px", padding: "24px",
                        border: `1.5px solid ${isCorrect ? "#10b981" : "#ef4444"}`,
                        boxShadow: "0 2px 12px rgba(55,73,169,0.06)",
                      }}>
                        <div style={{ display: "flex", alignItems: "flex-start", gap: "12px", marginBottom: "12px" }}>
                          <FontAwesomeIcon
                            icon={isCorrect ? faCircleCheck : faCircleXmark}
                            style={{ width: "20px", height: "20px", color: isCorrect ? "#10b981" : "#ef4444", flexShrink: 0, marginTop: "2px" }}
                          />
                          <p style={{ fontSize: "0.95rem", fontWeight: 700, color: "#1b2561", lineHeight: 1.4 }}>
                            {i + 1}. {q.question}
                          </p>
                        </div>

                        <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginBottom: "12px", paddingLeft: "32px" }}>
                          {q.options.map((opt) => (
                            <div key={opt.id} style={{
                              display: "flex", alignItems: "center", gap: "8px",
                              padding: "8px 12px", borderRadius: "10px",
                              background: opt.id === q.correctId
                                ? "rgba(16,185,129,0.1)"
                                : opt.id === userAnswer && !isCorrect
                                ? "rgba(239,68,68,0.08)"
                                : "transparent",
                              border: opt.id === q.correctId
                                ? "1px solid rgba(16,185,129,0.3)"
                                : opt.id === userAnswer && !isCorrect
                                ? "1px solid rgba(239,68,68,0.2)"
                                : "1px solid transparent",
                            }}>
                              <span style={{
                                width: "22px", height: "22px", borderRadius: "50%", flexShrink: 0,
                                display: "flex", alignItems: "center", justifyContent: "center",
                                fontSize: "0.7rem", fontWeight: 800,
                                background: opt.id === q.correctId ? "#10b981" : opt.id === userAnswer && !isCorrect ? "#ef4444" : "#eef0fa",
                                color: opt.id === q.correctId || (opt.id === userAnswer && !isCorrect) ? "#ffffff" : "#3749a9",
                              }}>
                                {opt.id.toUpperCase()}
                              </span>
                              <span style={{
                                fontSize: "0.875rem", fontWeight: 600,
                                color: opt.id === q.correctId ? "#065f46" : opt.id === userAnswer && !isCorrect ? "#7f1d1d" : "#64748b",
                              }}>
                                {opt.text}
                              </span>
                              {opt.id === q.correctId && (
                                <span style={{ marginLeft: "auto", fontSize: "0.7rem", fontWeight: 700, color: "#10b981" }}>Correct</span>
                              )}
                              {opt.id === userAnswer && !isCorrect && (
                                <span style={{ marginLeft: "auto", fontSize: "0.7rem", fontWeight: 700, color: "#ef4444" }}>Your answer</span>
                              )}
                            </div>
                          ))}
                        </div>

                        <div style={{
                          paddingLeft: "32px", padding: "10px 12px 10px 32px",
                          background: "#f7f8fc", borderRadius: "10px",
                          fontSize: "0.82rem", color: "#3d4566", lineHeight: 1.6,
                        }}>
                          💡 {q.explanation}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Action buttons */}
                <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                  <button
                    onClick={handleRetry}
                    style={{
                      flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                      padding: "14px", borderRadius: "50px",
                      border: "2px solid #3749a9", background: "transparent",
                      color: "#3749a9", fontSize: "0.95rem", fontWeight: 700,
                      cursor: "pointer", fontFamily: "inherit",
                    }}
                  >
                    <FontAwesomeIcon icon={faRotateLeft} style={{ width: "14px", height: "14px" }} />
                    Retry Quiz
                  </button>
                  <Link
                    href={`/courses/${courseId}`}
                    style={{
                      flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                      padding: "14px", borderRadius: "50px",
                      backgroundImage: "linear-gradient(135deg, #1b2561, #3749a9)",
                      color: "#ffffff", fontSize: "0.95rem", fontWeight: 700,
                      textDecoration: "none",
                    }}
                  >
                    Back to Course
                    <FontAwesomeIcon icon={faArrowRight} style={{ width: "14px", height: "14px" }} />
                  </Link>
                </div>
              </>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

const optionBase: React.CSSProperties = {
  width: "100%", display: "flex", alignItems: "center", gap: "14px",
  padding: "14px 18px", borderRadius: "14px", border: "2px solid #eef0fa",
  background: "#ffffff", cursor: "pointer", textAlign: "left",
  transition: "all 0.2s", fontFamily: "inherit",
};

const navBtn: React.CSSProperties = {
  padding: "10px 24px", borderRadius: "50px",
  border: "2px solid #eef0fa", background: "#ffffff",
  color: "#3d4566", fontSize: "0.875rem", fontWeight: 700,
  cursor: "pointer", fontFamily: "inherit", transition: "all 0.2s",
};