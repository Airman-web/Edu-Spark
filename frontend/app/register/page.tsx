"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faEnvelope,
  faPhone,
  faLock,
  faEye,
  faEyeSlash,
  faArrowRight,
  faCheckCircle,
} from "@fortawesome/free-solid-svg-icons";

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  /* Form state */
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone_number: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

// creating the handleSubmit function to send form data to the backend API for registration. It will handle loading state, success state, and error handling. On successful registration, it will redirect the user to the login page after a short delay.
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  setError("");

  try {
    const response = await fetch(
      "https://edu-spark-production.up.railway.app/api/auth/signup", // confirm endpoint
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Registration failed");
    }

    setSuccess(true);

    setTimeout(() => {
      router.push("/login");
    }, 2000);

  } catch (err: any) {
    setError(err.message || "Error registering! Something went wrong");
  } finally {
    setLoading(false);
  }
};

  if (success) {
    return (
      <div style={containerStyle}>
        <div style={cardStyle}>
          <div style={{ textAlign: "center" }}>
            <FontAwesomeIcon
              icon={faCheckCircle}
              style={{ fontSize: "3rem", color: "#22c55e", marginBottom: "20px" }}
            />
            <h1 style={{ ...headingStyle, color: "#131b46" }}>Success!</h1>
            <p style={{ ...subheadingStyle, color: "#6b7280" }}>
              Your account has been created. Redirecting to login...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      {/* ── Top bar ─────────────────────────────────────────────── */}
      <div style={topBarStyle}>
        <Link href="/" style={logoStyle}>
          <Image
            src="/images/logo-nobg.png"
            alt="EduSpark"
            width={36}
            height={36}
            style={{ objectFit: "contain" }}
            priority
          />
          <span style={logoTextStyle}>
            Edu<span style={{ color: "#3749a9" }}>Spark</span>
          </span>
        </Link>
        <span style={hintStyle}>
          Already have an account?{" "}
          <Link href="/login" style={linkStyle}>
            Log in
          </Link>
        </span>
      </div>

      <div style={contentStyle}>
        <div style={{ width: "100%", maxWidth: "500px" }}>
          <div style={{ textAlign: "center", marginBottom: "32px" }}>
            <h1 style={headingStyle}>Create your account</h1>
            <p style={subheadingStyle}>Join EduSpark to start your child's learning journey</p>
          </div>

          <div style={cardStyle}>
            {error && (
              <div style={errorBannerStyle}>
                <p>{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              {/* Full Name */}
              <div>
                <label style={labelStyle}>Full Name</label>
                <div style={inputWrapperStyle}>
                  <FontAwesomeIcon icon={faUser} style={inputIconStyle} />
                  <input
                    type="text"
                    name="full_name"
                    placeholder="Cynthia Irakoze"
                    value={formData.full_name}
                    onChange={handleChange}
                    required
                    style={inputStyle}
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label style={labelStyle}>Email Address</label>
                <div style={inputWrapperStyle}>
                  <FontAwesomeIcon icon={faEnvelope} style={inputIconStyle} />
                  <input
                    type="email"
                    name="email"
                    placeholder="cynthia@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    style={inputStyle}
                  />
                </div>
              </div>

              {/* Phone Number */}
              <div>
                <label style={labelStyle}>Phone Number (Optional)</label>
                <div style={inputWrapperStyle}>
                  <FontAwesomeIcon icon={faPhone} style={inputIconStyle} />
                  <input
                    type="tel"
                    name="phone_number"
                    placeholder="0780000000"
                    value={formData.phone_number}
                    onChange={handleChange}
                    style={inputStyle}
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label style={labelStyle}>Password</label>
                <div style={inputWrapperStyle}>
                  <FontAwesomeIcon icon={faLock} style={inputIconStyle} />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="At least 6 characters"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    minLength={6}
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
                  ...btnStyle,
                  opacity: loading ? 0.7 : 1,
                  cursor: loading ? "not-allowed" : "pointer",
                }}
              >
                {loading ? "Creating account..." : "Sign Up"}
                {!loading && <FontAwesomeIcon icon={faArrowRight} style={{ width: "13px" }} />}
              </button>
            </form>
          </div>

          <p style={footerLinkStyle}>
            By signing up, you agree to our{" "}
            <Link href="/terms" style={linkStyle}>Terms of Service</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

/* ─── Styles ───────────────────────────────────────────── */
const containerStyle = {
  minHeight: "100vh",
  background: "#f4f6ff",
  display: "flex",
  flexDirection: "column",
} as any;

const topBarStyle = {
  background: "#ffffff",
  borderBottom: "1px solid #e8ecf8",
  padding: "0 24px",
  height: "64px",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
} as any;

const logoStyle = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
  textDecoration: "none",
} as any;

const logoTextStyle = {
  fontFamily: "'Nunito', sans-serif",
  fontWeight: 800,
  fontSize: "1.1rem",
  color: "#131b46",
} as any;

const hintStyle = {
  fontSize: "0.85rem",
  color: "#6b7280",
  fontFamily: "'Nunito', sans-serif",
} as any;

const linkStyle = {
  color: "#3749a9",
  fontWeight: 700,
  textDecoration: "none",
} as any;

const contentStyle = {
  flex: 1,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "40px 24px",
} as any;

const cardStyle = {
  background: "#ffffff",
  borderRadius: "20px",
  padding: "36px 32px",
  boxShadow: "0 4px 32px rgba(19,27,70,0.1)",
  border: "1px solid #e8ecf8",
} as any;

const headingStyle = {
  fontFamily: "'Nunito', sans-serif",
  fontWeight: 900,
  fontSize: "2rem",
  color: "#0d1333",
  marginBottom: "8px",
} as any;

const subheadingStyle = {
  fontSize: "0.9rem",
  color: "#6b7280",
  fontFamily: "'Nunito', sans-serif",
} as any;

const labelStyle = {
  display: "block",
  fontSize: "0.8rem",
  fontWeight: 700,
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
  transition: "all 0.2s",
} as any;

const eyeBtnStyle = {
  position: "absolute",
  right: "14px",
  background: "none",
  border: "none",
  cursor: "pointer",
  padding: "4px",
} as any;

const btnStyle = {
  width: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "10px",
  padding: "14px 32px",
  borderRadius: "12px",
  fontWeight: 800,
  fontSize: "1rem",
  fontFamily: "'Nunito', sans-serif",
  color: "#ffffff",
  background: "linear-gradient(135deg, #1b2561 0%, #3749a9 100%)",
  border: "none",
  boxShadow: "0 8px 32px rgba(55,73,169,0.35)",
  marginTop: "8px",
  transition: "all 0.2s",
} as any;

const errorBannerStyle = {
  background: "#fee2e2",
  color: "#b91c1c",
  padding: "12px 16px",
  borderRadius: "12px",
  fontSize: "0.85rem",
  fontWeight: 600,
  marginBottom: "24px",
  border: "1px solid #fecaca",
  fontFamily: "'Nunito', sans-serif",
} as any;

const footerLinkStyle = {
  textAlign: "center",
  marginTop: "24px",
  fontSize: "0.75rem",
  color: "#9ca3af",
  fontFamily: "'Nunito', sans-serif",
} as any;
