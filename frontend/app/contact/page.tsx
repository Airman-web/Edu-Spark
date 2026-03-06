"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/footer";

type FormValues = { name: string; email: string; message: string };
type FormErrors = Partial<Record<keyof FormValues, string>>;

function validate(v: FormValues): FormErrors {
  const e: FormErrors = {};
  if (v.name.trim().length < 2)    e.name    = "Please enter your name.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email.trim()))
                                    e.email   = "Please enter a valid email.";
  if (v.message.trim().length < 10) e.message = "Message must be at least 10 characters.";
  return e;
}

export default function ContactPage() {
  const [values, setValues]       = useState<FormValues>({ name: "", email: "", message: "" });
  const [errors, setErrors]       = useState<FormErrors>({});
  const [touched, setTouched]     = useState<Partial<Record<keyof FormValues, boolean>>>({});
  const [submitted, setSubmitted] = useState(false);

  function handleChange(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const key = e.target.id as keyof FormValues;
    const next = { ...values, [key]: e.target.value };
    setValues(next);
    if (touched[key]) setErrors(validate(next));
  }

  function handleBlur(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const key = e.target.id as keyof FormValues;
    setTouched((t) => ({ ...t, [key]: true }));
    setErrors(validate(values));
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setTouched({ name: true, email: true, message: true });
    const errs = validate(values);
    setErrors(errs);
    if (Object.keys(errs).length === 0) setSubmitted(true);
  }

  const inputStyle = (hasError: boolean) => ({
    width: "100%",
    padding: "12px 16px",
    borderRadius: "12px",
    fontSize: "0.9rem",
    border: hasError ? "1.5px solid #f87171" : "1.5px solid rgba(255,255,255,0.1)",
    background: "rgba(255,255,255,0.06)",
    color: "#ffffff",
    outline: "none",
    fontFamily: "inherit",
    boxSizing: "border-box" as const,
  });

  const labelStyle = {
    fontSize: "0.75rem",
    fontWeight: 700,
    textTransform: "uppercase" as const,
    letterSpacing: "0.1em",
    color: "#a0b0ff",
  };

  return (
    <>
      <Navbar />

      <main style={{ background: "#ffffff", minHeight: "100vh", paddingTop: "120px", paddingBottom: "96px" }}>
        <div style={{ maxWidth: "600px", margin: "0 auto", padding: "0 24px" }}>

          <div style={{ textAlign: "center", marginBottom: "40px" }}>
            <span style={{
              display: "inline-block",
              fontSize: "0.75rem",
              fontWeight: 800,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "#3749a9",
              background: "#eef0fa",
              border: "1px solid #d1d8f0",
              borderRadius: "50px",
              padding: "6px 16px",
              marginBottom: "16px",
            }}>
              Get in Touch
            </span>
            <h1 style={{
              fontSize: "clamp(2rem, 5vw, 3rem)",
              fontWeight: 900,
              color: "#1b2561",
              marginBottom: "12px",
              lineHeight: 1.2,
            }}>
              Contact Us
            </h1>
            <p style={{ fontSize: "0.95rem", color: "#7b82a8", lineHeight: 1.7 }}>
              Have a question? We&apos;d love to hear from you.
            </p>
          </div>

          <div style={{
            backgroundImage: "linear-gradient(135deg, #1b2561, #290e42)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "24px",
            padding: "40px",
            boxShadow: "0 8px 32px rgba(19,27,70,0.15)",
          }}>
            {!submitted ? (
              <form onSubmit={handleSubmit} noValidate style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <label htmlFor="name" style={labelStyle}>Name</label>
                  <input
                    id="name" type="text" placeholder="Your full name"
                    value={values.name} onChange={handleChange} onBlur={handleBlur}
                    style={inputStyle(!!errors.name)}
                  />
                  {errors.name && <p style={{ fontSize: "0.75rem", color: "#f87171" }}>{errors.name}</p>}
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <label htmlFor="email" style={labelStyle}>Email</label>
                  <input
                    id="email" type="email" placeholder="you@example.com"
                    value={values.email} onChange={handleChange} onBlur={handleBlur}
                    style={inputStyle(!!errors.email)}
                  />
                  {errors.email && <p style={{ fontSize: "0.75rem", color: "#f87171" }}>{errors.email}</p>}
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <label htmlFor="message" style={labelStyle}>Message</label>
                  <textarea
                    id="message" rows={5} placeholder="How can we help you?"
                    value={values.message} onChange={handleChange} onBlur={handleBlur}
                    style={{ ...inputStyle(!!errors.message), resize: "vertical" }}
                  />
                  {errors.message && <p style={{ fontSize: "0.75rem", color: "#f87171" }}>{errors.message}</p>}
                </div>

                <button
                  type="submit"
                  style={{
                    width: "100%",
                    padding: "14px",
                    borderRadius: "50px",
                    border: "none",
                    backgroundImage: "linear-gradient(90deg, #1b2561, #3749a9)",
                    color: "#ffffff",
                    fontSize: "0.95rem",
                    fontWeight: 800,
                    cursor: "pointer",
                    fontFamily: "inherit",
                    transition: "opacity 0.2s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
                  onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
                >
                  Send Message
                </button>

                <style>{`
                  input::placeholder, textarea::placeholder { color: rgba(255,255,255,0.3); }
                  input:focus, textarea:focus { border-color: #3749a9 !important; box-shadow: 0 0 0 3px rgba(55,73,169,0.25); }
                `}</style>
              </form>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "16px", padding: "40px 0", textAlign: "center" }}>
                <div style={{
                  width: "64px", height: "64px", borderRadius: "50%",
                  background: "rgba(78,205,196,0.15)",
                  border: "2px solid rgba(78,205,196,0.4)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "28px",
                }}>
                  ✅
                </div>
                <h2 style={{ fontSize: "1.4rem", fontWeight: 800, color: "#ffffff" }}>Message Sent!</h2>
                <p style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.6)" }}>We&apos;ll get back to you within 24 hours.</p>
                <button
                  onClick={() => { setValues({ name: "", email: "", message: "" }); setTouched({}); setSubmitted(false); }}
                  style={{
                    padding: "10px 28px", borderRadius: "50px",
                    border: "2px solid rgba(55,73,169,0.5)",
                    background: "rgba(55,73,169,0.15)",
                    color: "#a0b0ff", fontSize: "0.875rem", fontWeight: 700,
                    cursor: "pointer", fontFamily: "inherit",
                  }}
                >
                  Send Another
                </button>
              </div>
            )}
          </div>

        </div>
      </main>

      <Footer />
    </>
  );
}