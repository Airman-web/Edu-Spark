"use client";

import { useState, ChangeEvent, FormEvent } from "react";
// import Navbar from "@/components/Navbar";
// import Footer from "@/components/Footer";


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

  const inputBase =
    "w-full rounded-xl border border-white/10 bg-white/[0.06] px-4 py-3 text-sm text-white placeholder-white/30 outline-none transition-all focus:border-[#3749a9] focus:ring-2 focus:ring-[#3749a9]/25";
  const inputErr = "!border-red-400/60 focus:!ring-red-400/20";

  return (
    <div className="relative min-h-screen" style={{ fontFamily: "Poppins, sans-serif" }}>

      {/* Background */}
      <div
        className="pointer-events-none fixed inset-0 -z-10"
        style={{ background: "linear-gradient(135deg,#131b46 0%,#1b2561 60%,#290e42 100%)" }}
      />

      {/* < Navbar /> */}

      <main className="mx-auto max-w-2xl px-4 py-16 sm:px-6">

        {/* Header */}
        <div className="mb-10 text-center">
          <h1 className="mb-3 text-4xl font-extrabold text-white">Contact Us</h1>
          <p className="text-sm text-white/55">
            Have a question? We&apos;d love to hear from you.
          </p>
        </div>

        {/* Form card */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-8 backdrop-blur-sm">
          {!submitted ? (
            <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">

              {/* Name */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="name" className="text-[11px] font-semibold uppercase tracking-widest text-blue-300/80">
                  Name
                </label>
                <input
                  id="name" type="text" placeholder="Your full name"
                  value={values.name} onChange={handleChange} onBlur={handleBlur}
                  className={`${inputBase} ${errors.name ? inputErr : ""}`}
                />
                {errors.name && <p className="text-[11px] text-red-400">{errors.name}</p>}
              </div>

              {/* Email */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="email" className="text-[11px] font-semibold uppercase tracking-widest text-blue-300/80">
                  Email
                </label>
                <input
                  id="email" type="email" placeholder="you@example.com"
                  value={values.email} onChange={handleChange} onBlur={handleBlur}
                  className={`${inputBase} ${errors.email ? inputErr : ""}`}
                />
                {errors.email && <p className="text-[11px] text-red-400">{errors.email}</p>}
              </div>

              {/* Message */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="message" className="text-[11px] font-semibold uppercase tracking-widest text-blue-300/80">
                  Message
                </label>
                <textarea
                  id="message" rows={5} placeholder="How can we help you?"
                  value={values.message} onChange={handleChange} onBlur={handleBlur}
                  className={`${inputBase} resize-y ${errors.message ? inputErr : ""}`}
                />
                {errors.message && <p className="text-[11px] text-red-400">{errors.message}</p>}
              </div>

              {/* Submit button */}
              <button
                type="submit"
                className="mt-1 w-full rounded-xl py-3.5 text-[15px] font-semibold text-white transition-all hover:-translate-y-0.5 hover:brightness-110 active:translate-y-0"
                style={{ backgroundImage: "linear-gradient(90deg,#1b2561,#3749a9)" }}
              >
                Send Message
              </button>
            </form>
          ) : (
            /* Success state */
            <div className="flex flex-col items-center gap-4 py-12 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-emerald-400/40 bg-emerald-400/10 text-3xl">

              </div>
              <h2 className="text-xl font-bold text-white">Message Sent!</h2>
              <p className="text-sm text-white/55">We&apos;ll get back to you within 24 hours.</p>
              <button
                onClick={() => {
                  setValues({ name: "", email: "", message: "" });
                  setTouched({});
                  setSubmitted(false);
                }}
                className="mt-2 rounded-xl border border-[#3749a9]/40 bg-[#3749a9]/15 px-6 py-2 text-sm font-semibold text-blue-300 transition-all hover:bg-[#3749a9]/25"
              >
                Send Another
              </button>
            </div>
          )}
        </div>
      </main>

    {/* <Footer />  */}
    </div>
  );
}