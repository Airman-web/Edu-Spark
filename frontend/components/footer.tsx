"use client";

import Link from "next/link";
import Image from "next/image";

const footerLinks = {
  Platform:  [
    { label: "Features",     href: "/#features" },
    { label: "How It Works", href: "/#how-it-works" },
    { label: "Leaderboard",  href: "/#leaderboard" },
    { label: "For Guardians",href: "/#guardians" },
  ],
  Company: [
    { label: "About Us",       href: "/about" },
    { label: "Contact",        href: "/contact" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Use",   href: "/terms" },
  ],
  Account: [
    { label: "Log In",   href: "/login" },
    { label: "Register", href: "/register" },
  ],
};

export default function Footer() {
  return (
    <footer style={{
      background:   "var(--grad-cta)",
      color:        "#ffffff",
      paddingTop:   "64px",
      paddingBottom:"32px",
    }}>
      <div className="container">

        {/* ── Top grid ── */}
        <div style={{
          display:             "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap:                 "40px",
          marginBottom:        "48px",
          textAlign:           "center",
        }}>

          {/* Brand column */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "14px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <Image
                src="/images/logo-nobg.png"
                alt="EduSpark"
                width={36}
                height={36}
                style={{ objectFit: "contain" }}
              />
              <span style={{
                fontFamily:    "'Playfair Display', serif",
                fontWeight:    900,
                fontSize:      "1.2rem",
                color:         "#ffffff",
              }}>
                Edu<span style={{ color: "#a0b0ff" }}>Spark</span>
              </span>
            </div>
            <p style={{
              fontSize:   "0.85rem",
              color:      "rgba(255,255,255,0.65)",
              lineHeight: 1.7,
              maxWidth:   "220px",
            }}>
              Igniting young minds through interactive, curriculum aligned learning for primary school students in Rwanda.
            </p>
            {/* Grade badges */}
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", justifyContent: "center" }}>
              {["P1–P2", "P3–P4", "P5–P6"].map((g) => (
                <span key={g} style={{
                  fontSize:     "0.7rem",
                  fontWeight:   700,
                  padding:      "4px 10px",
                  borderRadius: "20px",
                  background:   "rgba(255,255,255,0.12)",
                  border:       "1px solid rgba(255,255,255,0.2)",
                  color:        "rgba(255,255,255,0.85)",
                }}>
                  {g}
                </span>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([group, links]) => (
            <div key={group} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }}>
              <h4 style={{
                fontSize:      "0.7rem",
                fontWeight:    800,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color:         "rgba(255,255,255,0.5)",
                marginBottom:  "4px",
              }}>
                {group}
              </h4>
              {links.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  style={{
                    fontSize:       "0.875rem",
                    fontWeight:     600,
                    color:          "rgba(255,255,255,0.72)",
                    textDecoration: "none",
                    transition:     "color 0.2s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#ffffff")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.72)")}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          ))}
        </div>

        {/* ── Divider ── */}
        <div style={{
          height:     "1px",
          background: "rgba(255,255,255,0.12)",
          marginBottom: "24px",
        }} />

        {/* ── Bottom bar ── */}
        <div style={{
          display:        "flex",
          flexDirection:  "column",
          alignItems:     "center",
          gap:            "8px",
          textAlign:      "center",
        }}>
          <p style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.5)" }}>
            © {new Date().getFullYear()} EduSpark · Built by Team EduSpark
          </p>
          <p style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.4)" }}>
            Designed for primary school students in Rwanda
          </p>
        </div>

      </div>
    </footer>
  );
}