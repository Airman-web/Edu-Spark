"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

const navLinks = [
  { label: "Home",         href: "/" },
  { label: "About",        href: "/about" },
  { label: "Features",     href: "/#features" },
  { label: "How It Works", href: "/#how-it-works" },
];

export default function Navbar() {
  const [scrolled,  setScrolled]  = useState(false);
  const [menuOpen,  setMenuOpen]  = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      style={{
        position:   "fixed",
        top: 0, left: 0, right: 0,
        zIndex:     50,
        transition: "all 0.3s ease",
        background: scrolled ? "rgba(255,255,255,0.95)" : "rgba(0,0,0,0.15)",
        backdropFilter: "blur(12px)",
        borderBottom: scrolled ? "1px solid #eef0fa" : "1px solid rgba(255,255,255,0.12)",
        boxShadow: scrolled ? "0 2px 20px rgba(55,73,169,0.08)" : "none",
      }}
    >
      <div
        className="container"
        style={{
          display:        "flex",
          alignItems:     "center",
          justifyContent: "space-between",
          padding:        "14px 24px",
          maxWidth:       "1160px",
          margin:         "0 auto",
        }}
      >
        {/* ── Logo ── */}
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none" }}>
          <Image
            src="/images/logo-nobg.png"
            alt="EduSpark Logo"
            width={40}
            height={40}
            style={{ objectFit: "contain" }}
            priority
          />
          <span style={{
            fontFamily: "'Playfair Display', serif",
            fontWeight: 900,
            fontSize:   "1.25rem",
            color:      scrolled ? "#3749a9" : "#ffffff",
            letterSpacing: "-0.01em",
            transition: "color 0.3s ease",
          }}>
            EduSpark
          </span>
        </Link>

        {/* ── Desktop Links ── */}
        <div style={{ display: "flex", alignItems: "center", gap: "36px" }}
             className="hidden-mobile">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              style={{
                fontFamily:  "'Nunito', sans-serif",
                fontWeight:  700,
                fontSize:    "0.9rem",
                color:       scrolled ? "#3d4566" : "rgba(255,255,255,0.9)",
                textDecoration: "none",
                transition:  "color 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = scrolled ? "#3749a9" : "#ffffff")}
              onMouseLeave={(e) => (e.currentTarget.style.color = scrolled ? "#3d4566" : "rgba(255,255,255,0.9)")}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* ── CTA Buttons ── */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}
             className="hidden-mobile">
          <Link href="/login"
            style={{
              padding: "10px 24px",
              fontSize: "0.875rem",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "50px",
              fontFamily: "'Poppins', sans-serif",
              fontWeight: 700,
              textDecoration: "none",
              transition: "all 0.2s ease",
              color: scrolled ? "#3749a9" : "#ffffff",
              border: scrolled ? "2px solid #3749a9" : "2px solid rgba(255,255,255,0.7)",
              background: "transparent",
            }}>
            Log In
          </Link>
          <Link href="/register" className="btn-primary"
            style={{ padding: "10px 24px", fontSize: "0.875rem" }}>
            Get Started
          </Link>
        </div>

        {/* ── Mobile Hamburger ── */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
          style={{
            display:    "none",
            flexDirection: "column",
            gap:        "5px",
            background: "none",
            border:     "none",
            cursor:     "pointer",
            padding:    "6px",
          }}
          className="show-mobile"
        >
          {[0, 1, 2].map((i) => (
            <span key={i} style={{
              display:    "block",
              width:      "24px",
              height:     "2px",
              background: scrolled ? "#131b46" : "#ffffff",
              borderRadius: "2px",
              transition: "all 0.3s ease",
              transform:
                i === 0 && menuOpen ? "rotate(45deg) translate(5px, 5px)" :
                i === 1 && menuOpen ? "scaleX(0)" :
                i === 2 && menuOpen ? "rotate(-45deg) translate(5px, -5px)" :
                "none",
              opacity: i === 1 && menuOpen ? 0 : 1,
            }} />
          ))}
        </button>
      </div>

      {/* ── Mobile Menu ── */}
      <div style={{
        overflow:   "hidden",
        maxHeight:  menuOpen ? "400px" : "0",
        transition: "max-height 0.35s ease",
        background: "#ffffff",
        borderTop:  menuOpen ? "1px solid #eef0fa" : "none",
      }}>
        <div style={{ padding: "16px 24px 24px", display: "flex", flexDirection: "column", gap: "16px" }}>
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              style={{
                fontFamily: "'Nunito', sans-serif",
                fontWeight: 700,
                fontSize:   "0.95rem",
                color:      scrolled ? "#3d4566" : "#ffffff",
                textDecoration: "none",
              }}
            >
              {link.label}
            </Link>
          ))}
          <div style={{ display: "flex", flexDirection: "column", gap: "10px", paddingTop: "8px" }}>
            <Link href="/login"    className="btn-outline"   style={{ textAlign: "center" }}>Log In</Link>
            <Link href="/register" className="btn-primary"   style={{ textAlign: "center" }}>Get Started</Link>
          </div>
        </div>
      </div>

      {/* Responsive helpers */}
      <style>{`
        @media (max-width: 768px) {
          .hidden-mobile { display: none !important; }
          .show-mobile   { display: flex !important; }
        }
        @media (min-width: 769px) {
          .show-mobile   { display: none !important; }
          .hidden-mobile { display: flex !important; }
        }
      `}</style>
    </nav>
  );
}