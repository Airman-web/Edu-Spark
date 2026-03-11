"use client";

import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
config.autoAddCss = false;

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faLock,
  faEye,
  faEyeSlash,
  faArrowRight,
  faShieldHalved,
  faGraduationCap,
  faUser,
} from "@fortawesome/free-solid-svg-icons";

type Tab = "guardian" | "student";

export default function LoginPage() {
  const [activeTab, setActiveTab]         = useState<Tab>("guardian");
  const [showPassword, setShowPassword]   = useState(false);

  /* Guardian form state */
  const [guardianEmail, setGuardianEmail] = useState("");
  const [guardianPass,  setGuardianPass]  = useState("");

  /* Student form state */
  const [studentUser, setStudentUser] = useState("");
  const [studentPass, setStudentPass] = useState("");

  // adding the loading and error states for the forms
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGuardianSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  setError("");

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: guardianEmail,
          password: guardianPass,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Login failed");
    }

    // Saving the token and role
    localStorage.setItem("token", data.access_token);
    localStorage.setItem("role", data.user.role);
    localStorage.setItem("user", JSON.stringify(data.user));

    console.log("User logged in:", data);

    // Redirect based on role
    if (data.user.role === "admin") {
      window.location.href = "/admin-dashboard";
    } else {
      window.location.href = "/guardian-dashboard";
    }
  } catch (err: any) {
    setError(err.message || "Something went wrong");
  } finally {
    setLoading(false);
  }
};

  const handleStudentSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  setError("");

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/student-login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          display_name: studentUser,
          password: studentPass,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Login failed");
    }

    localStorage.setItem("token", data.access_token);
    localStorage.setItem("role", data.role);

    console.log("Student logged in:", data);

    // redirecting to the student dashboard after login successful
    window.location.href = "/student-dashboard";

  } catch (err: any) {
    setError(err.message || "Something went wrong");
  } finally {
    setLoading(false);
  }
};

  return (
    <div style={{
      minHeight: "100vh",
      background: "#f4f6ff",
      display: "flex",
      flexDirection: "column",
    }}>

      {/* The top bar section */}
      <div style={{
        background: "#ffffff",
        borderBottom: "1px solid #e8ecf8",
        padding: "0 24px",
        height: "64px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}>
        <Link href="/" style={{
          display: "flex", alignItems: "center", gap: "10px", textDecoration: "none",
        }}>
          <Image
            src="/images/logo-nobg.png"
            alt="EduSpark"
            width={36}
            height={36}
            style={{ objectFit: "contain" }}
            priority
          />
          <span style={{
            fontFamily: "'Nunito', sans-serif",
            fontWeight: 800,
            fontSize: "1.1rem",
            color: "#131b46",
          }}>
            Edu<span style={{ color: "#3749a9" }}>Spark</span>
          </span>
        </Link>
        <span style={{ fontSize: "0.85rem", color: "#6b7280", fontFamily: "'Nunito', sans-serif" }}>
          Don&apos;t have an account?{" "}
          <Link href="/register" style={{ color: "#3749a9", fontWeight: 600, textDecoration: "none" }}>
            Sign up
          </Link>
        </span>
      </div>

      {/* ── Main content  */}
      <div style={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 24px",
      }}>
        <div style={{ width: "100%", maxWidth: "480px" }}>

          {/* Page title */}
          <div style={{ textAlign: "center", marginBottom: "32px" }}>
            <h1 style={{
              fontFamily: "'Nunito', sans-serif",
              fontWeight: 900,
              fontSize: "2rem",
              color: "#0d1333",
              marginBottom: "8px",
            }}>
              Welcome back
            </h1>
            <p style={{ fontSize: "0.9rem", color: "#6b7280", fontFamily: "'Nunito', sans-serif" }}>
              Choose your account type to continue
            </p>
          </div>

          {/* The tab switcher between student and guardian*/}
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "0",
            background: "#e8ecf8",
            borderRadius: "14px",
            padding: "4px",
            marginBottom: "28px",
          }}>
            {(["guardian", "student"] as Tab[]).map((tab) => {
              const isActive = activeTab === tab;
              return (
                <button
                  key={tab}
                  onClick={() => {
                    setActiveTab(tab);
                    setShowPassword(false);
                  }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    padding: "12px 16px",
                    borderRadius: "10px",
                    border: "none",
                    cursor: "pointer",
                    fontFamily: "'Nunito', sans-serif",
                    fontWeight: 700,
                    fontSize: "0.875rem",
                    transition: "all 0.2s",
                    background: isActive
                      ? "linear-gradient(135deg, #1b2561 0%, #3749a9 100%)"
                      : "transparent",
                    color: isActive ? "#ffffff" : "#6b7280",
                    boxShadow: isActive ? "0 4px 16px rgba(55,73,169,0.3)" : "none",
                  }}
                >
                  <FontAwesomeIcon
                    icon={tab === "guardian" ? faShieldHalved : faGraduationCap}
                    style={{ width: "15px", height: "15px" }}
                  />
                  {tab === "guardian" ? "Guardian" : "Student"}
                </button>
              );
            })}
          </div>

          {/*  Form card */}
          <div style={{
            background: "#ffffff",
            borderRadius: "20px",
            padding: "36px 32px",
            boxShadow: "0 4px 32px rgba(19,27,70,0.1)",
            border: "1px solid #e8ecf8",
          }}>
            {error && (
              <div style={{
                background: "#fee2e2",
                border: "1px solid #fecaca",
                color: "#b91c1c",
                padding: "10px 14px",
                borderRadius: "10px",
                marginBottom: "16px",
                fontSize: "0.8rem",
              }}>
                {error}
              </div>
            )}

            {/*  Creating the gaurdian form */}
            {activeTab === "guardian" && (
              <>
                {/* Context hint */}
                <div style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "12px",
                  padding: "14px 16px",
                  borderRadius: "12px",
                  background: "#eef1ff",
                  border: "1px solid #c7ceef",
                  marginBottom: "28px",
                }}>
                  <FontAwesomeIcon
                    icon={faShieldHalved}
                    style={{ width: "16px", color: "#3749a9", marginTop: "2px", flexShrink: 0 }}
                  />
                  <div>
                    <p style={{
                      fontSize: "0.8rem",
                      fontWeight: 700,
                      color: "#1b2561",
                      fontFamily: "'Nunito', sans-serif",
                      marginBottom: "2px",
                    }}>
                      Are you a parent or guardian?
                    </p>
                    <p style={{ fontSize: "0.75rem", color: "#6b7280", fontFamily: "'Nunito', sans-serif" }}>
                      Log in here to manage your children's accounts and track their progress.
                    </p>
                  </div>
                </div>

                <form onSubmit={handleGuardianSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

                  {/* Email */}
                  <div>
                    <label style={labelStyle}>Email Address</label>
                    <div style={inputWrapperStyle}>
                      <FontAwesomeIcon icon={faEnvelope} style={inputIconStyle} />
                      <input
                        type="email"
                        placeholder="your@email.com"
                        value={guardianEmail}
                        onChange={(e) => setGuardianEmail(e.target.value)}
                        required
                        style={inputStyle}
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                      <label style={{ ...labelStyle, margin: 0 }}>Password</label>
                      <Link href="/forgot-password?role=guardian" style={forgotStyle}>
                        Forgot password?
                      </Link>
                    </div>
                    <div style={inputWrapperStyle}>
                      <FontAwesomeIcon icon={faLock} style={inputIconStyle} />
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        value={guardianPass}
                        onChange={(e) => setGuardianPass(e.target.value)}
                        required
                        style={{ ...inputStyle, paddingRight: "48px" }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        style={eyeBtnStyle}
                      >
                        <FontAwesomeIcon
                          icon={showPassword ? faEyeSlash : faEye}
                          style={{ width: "15px", color: "#9ca3af" }}
                        />
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    style={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "10px",
                      padding: "14px 32px",
                      borderRadius: "12px",
                      fontWeight: 700,
                      fontSize: "0.95rem",
                      fontFamily: "'Nunito', sans-serif",
                      color: "#ffffff",
                      background: "linear-gradient(135deg, #1b2561 0%, #3749a9 100%)",
                      border: "none",
                      cursor: loading ? "not-allowed" : "pointer",
                      boxShadow: "0 8px 32px rgba(55,73,169,0.35)",
                      marginTop: "4px",
                      transition: "filter 0.2s, transform 0.2s",
                      opacity: loading ? 0.7 : 1,
                    }}
                  >
                    {loading ? (
                      <>
                        <FontAwesomeIcon icon={faSpinner} spin />
                        Logging in...
                      </>
                    ) : (
                      <>
                        Log In as Guardian
                        <FontAwesomeIcon icon={faArrowRight} style={{ width: "13px" }} />
                      </>
                    )}
                  </button>
                </form>

                {/* Divider to student */}
                <div style={{ marginTop: "24px", textAlign: "center" }}>
                  <p style={{ fontSize: "0.8rem", color: "#9ca3af", fontFamily: "'Nunito', sans-serif" }}>
                    Are you a student?{" "}
                    <button
                      onClick={() => setActiveTab("student")}
                      style={{
                        background: "none", border: "none", cursor: "pointer",
                        color: "#3749a9", fontWeight: 700, fontSize: "0.8rem",
                        fontFamily: "'Nunito', sans-serif",
                      }}
                    >
                      Log in here instead
                    </button>
                  </p>
                </div>
              </>
            )}

            {/* ── STUDENT FORM ──────────────────────────────── */}
            {activeTab === "student" && (
              <>
                {/* Context hint */}
                <div style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "12px",
                  padding: "14px 16px",
                  borderRadius: "12px",
                  background: "#f0eeff",
                  border: "1px solid #d4c7ef",
                  marginBottom: "28px",
                }}>
                  <FontAwesomeIcon
                    icon={faGraduationCap}
                    style={{ width: "16px", color: "#290e42", marginTop: "2px", flexShrink: 0 }}
                  />
                  <div>
                    <p style={{
                      fontSize: "0.8rem",
                      fontWeight: 700,
                      color: "#290e42",
                      fontFamily: "'Nunito', sans-serif",
                      marginBottom: "2px",
                    }}>
                      Are you a student?
                    </p>
                    <p style={{ fontSize: "0.75rem", color: "#6b7280", fontFamily: "'Nunito', sans-serif" }}>
                      Log in with your Username and password to access your lessons.
                    </p>
                  </div>
                </div>

                <form onSubmit={handleStudentSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

                  {/* Username */}
                  <div>
                    <label style={labelStyle}>Username</label>
                    <div style={inputWrapperStyle}>
                      <FontAwesomeIcon icon={faUser} style={inputIconStyle} />
                      <input
                        type="text"
                        placeholder="e.g. jdoe123"
                        value={studentUser}
                        onChange={(e) => setStudentUser(e.target.value)}
                        required
                        style={{ ...inputStyle, letterSpacing: "0.02em" }}
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                      <label style={{ ...labelStyle, margin: 0 }}>Password</label>
                      <Link href="/forgot-password?role=student" style={forgotStyle}>
                        Forgot password?
                      </Link>
                    </div>
                    <div style={inputWrapperStyle}>
                      <FontAwesomeIcon icon={faLock} style={inputIconStyle} />
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        value={studentPass}
                        onChange={(e) => setStudentPass(e.target.value)}
                        required
                        style={{ ...inputStyle, paddingRight: "48px" }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        style={eyeBtnStyle}
                      >
                        <FontAwesomeIcon
                          icon={showPassword ? faEyeSlash : faEye}
                          style={{ width: "15px", color: "#9ca3af" }}
                        />
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    style={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "10px",
                      padding: "14px 32px",
                      borderRadius: "12px",
                      fontWeight: 700,
                      fontSize: "0.95rem",
                      fontFamily: "'Nunito', sans-serif",
                      color: "#ffffff",
                      background: "linear-gradient(135deg, #290e42 0%, #4a2070 100%)",
                      border: "none",
                      cursor: loading ? "not-allowed" : "pointer",
                      boxShadow: "0 8px 32px rgba(41,14,66,0.35)",
                      marginTop: "4px",
                      transition: "filter 0.2s, transform 0.2s",
                      opacity: loading ? 0.7 : 1,
                    }}
                  >
                    {loading ? (
                      <>
                        <FontAwesomeIcon icon={faSpinner} spin />
                        Logging in...
                      </>
                    ) : (
                      <>
                        Log In as Student
                        <FontAwesomeIcon icon={faArrowRight} style={{ width: "13px" }} />
                      </>
                    )}
                  </button>
                </form>

                {/* Notice: students can't access guardian login */}
                <div style={{
                  marginTop: "20px",
                  padding: "12px 16px",
                  borderRadius: "10px",
                  background: "#fff7ed",
                  border: "1px solid #fed7aa",
                  textAlign: "center",
                }}>
                  <p style={{ fontSize: "0.75rem", color: "#92400e", fontFamily: "'Nunito', sans-serif" }}>
                    🔒 Students cannot access the Guardian dashboard.
                    Only parents and guardians can manage accounts.
                  </p>
                </div>
              </>
            )}
          </div>

          {/* Back to home */}
          <p style={{
            textAlign: "center",
            marginTop: "24px",
            fontSize: "0.8rem",
            color: "#9ca3af",
            fontFamily: "'Nunito', sans-serif",
          }}>
            <Link href="/" style={{ color: "#3749a9", fontWeight: 600, textDecoration: "none" }}>
              ← Back to homepage
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

/* ─── Shared inline styles ───────────────────────────────────────────── */
const labelStyle = {
  display: "block",
  fontSize: "0.8rem",
  fontWeight: 600,
  color: "#374151",
  fontFamily: "'Nunito', sans-serif",
  marginBottom: "8px",
} as any;

const inputWrapperStyle = {
  position: "relative",
  display: "flex",
  alignItems: "center",
} as any;

const inputIconStyle = {
  position: "absolute",
  left: "14px",
  width: "15px",
  height: "15px",
  color: "#9ca3af",
  pointerEvents: "none",
} as any;

const inputStyle = {
  width: "100%",
  padding: "12px 16px 12px 42px",
  borderRadius: "12px",
  border: "1.5px solid #dde2f5",
  background: "#f8f9ff",
  fontFamily: "'Nunito', sans-serif",
  fontSize: "0.875rem",
  color: "#0d1333",
  outline: "none",
  transition: "border-color 0.2s, box-shadow 0.2s",
} as any;

const eyeBtnStyle = {
  position: "absolute",
  right: "14px",
  background: "none",
  border: "none",
  cursor: "pointer",
  padding: "4px",
  display: "flex",
  alignItems: "center",
} as any;

const forgotStyle = {
  fontSize: "0.78rem",
  color: "#3749a9",
  fontWeight: 600,
  fontFamily: "'Nunito', sans-serif",
  textDecoration: "none",
} as any;