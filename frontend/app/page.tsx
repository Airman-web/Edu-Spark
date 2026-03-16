import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight,
  faCheck,
  faBolt,
  faVideo,
  faTrophy,
  faChartBar,
  faLayerGroup,
  faPenToSquare,
  faUniversalAccess,
  faUserPlus,
  faCirclePlay,
  faMedal,
  faMagnifyingGlassChart,
} from "@fortawesome/free-solid-svg-icons";
import Navbar from "@/components/Navbar";
import Footer from "@/components/footer";

/*  Data  */
const features = [
  {
    icon: faVideo,
    title: "Video Lessons",
    desc: "Curriculum-aligned video lessons mapped to Rwanda's primary school program P1 through P6.",
    card: "card-blue",
  },
  {
    icon: faTrophy,
    title: "Points & Badges",
    desc: "Students earn points for every lesson and quiz completed. Collect badges and climb the leaderboard.",
    card: "card-purple",
  },
  {
    icon: faChartBar,
    title: "Guardian Dashboard",
    desc: "Real-time insights for parents. Track lessons, quiz scores, and engagement all in one place.",
    card: "card-blue",
  },
  {
    icon: faLayerGroup,
    title: "Grade-Based Courses",
    desc: "Content organised by grade groups (P1–P2, P3–P4, P5–P6) so students only see what's relevant.",
    card: "card-purple",
  },
  {
    icon: faPenToSquare,
    title: "Interactive Quizzes",
    desc: "After every lesson, a short quiz reinforces learning and rewards students with bonus points.",
    card: "card-blue",
  },
  {
    icon: faUniversalAccess,
    title: "Inclusive by Design",
    desc: "Built with accessibility and disability support in mind. Every child deserves a spark.",
    card: "card-purple",
  },
];

const steps = [
  {
    number: "01",
    icon: faUserPlus,
    title: "Guardian Signs Up",
    desc: "A parent or guardian creates an account and adds their child's profile name, grade group, and display name.",
  },
  {
    number: "02",
    icon: faCirclePlay,
    title: "Student Starts Learning",
    desc: "The student accesses grade-specific courses, watches video lessons, and completes quizzes.",
  },
  {
    number: "03",
    icon: faMedal,
    title: "Earn Points & Badges",
    desc: "Every completed lesson and quiz earns points. Students compete on the weekly leaderboard.",
  },
  {
    number: "04",
    icon: faMagnifyingGlassChart,
    title: "Guardian Tracks Progress",
    desc: "Parents monitor real-time progress lesson completion, quiz scores, and weekly activity charts.",
  },
];

const stats = [
  { value: "98%",   label: "Primary Enrolment in Rwanda" },
  { value: "P1–P6", label: "Full Curriculum Coverage"    },
  { value: "3",     label: "Grade Groups Supported"      },
  { value: "Free",  label: "Always Free to Start"        },
];

const perks = [
  "Real-time lesson & quiz progress",
  "Weekly engagement charts",
  "Points and badges earned",
  "Manage multiple children from one account",
];

/* Page */
export default function LandingPage() {
  return (
    <>
      <Navbar />

      <main style={{ background: "#ffffff" }}>

        {/* HERO — family image with dark overlay */}
        <section
          style={{
            position:          "relative",
            paddingTop:        "140px",
            paddingBottom:     "100px",
            textAlign:         "center",
            backgroundImage:   "url('/images/family1.webp')",
            backgroundSize:    "cover",
            backgroundPosition:"center center",
            backgroundRepeat:  "no-repeat",
          }}
        >
          {/* Dark gradient overlay so white text stays readable */}
          <div style={{
            position:   "absolute",
            inset:      0,
            background: "linear-gradient(160deg, rgba(13,20,60,0.78) 0%, rgba(19,27,70,0.70) 55%, rgba(41,14,66,0.80) 100%)",
            zIndex:     0,
          }} />

          <div className="container section-center" style={{ position: "relative", zIndex: 1 }}>

            {/* Live pill */}
            <div
              className="anim-fade-in"
              style={{
                display:      "inline-flex",
                alignItems:   "center",
                gap:          "8px",
                background:   "rgba(255,255,255,0.15)",
                border:       "1px solid rgba(255,255,255,0.35)",
                borderRadius: "50px",
                padding:      "6px 16px",
                fontSize:     "0.75rem",
                fontWeight:   600,
                color:        "#ffffff",
                marginBottom: "32px",
                letterSpacing:"0.04em",
                backdropFilter: "blur(8px)",
              }}
            >
              <span style={{
                width: "8px", height: "8px",
                borderRadius: "50%",
                background: "#22c55e",
                display: "inline-block",
                animation: "pulse 2s infinite",
              }} />
              Now available for primary school students in Rwanda
            </div>

            {/* Headline */}
            <h1
              className="display-heading anim-fade-up anim-hidden"
              style={{
                fontSize:            "clamp(2.8rem, 6vw, 5rem)",
                color:               "#ffffff",
                maxWidth:            "820px",
                marginBottom:        "24px",
                animationFillMode:   "forwards",
                textShadow:          "0 2px 20px rgba(0,0,0,0.3)",
              }}
            >
              Every Child Deserves A Spark
            </h1>

            {/* Subheadline */}
            <p
              className="anim-fade-up anim-hidden delay-2"
              style={{
                fontSize:          "1.1rem",
                fontWeight:        400,
                color:             "rgba(255,255,255,0.88)",
                maxWidth:          "580px",
                lineHeight:        1.8,
                marginBottom:      "40px",
                animationFillMode: "forwards",
              }}
            >
              EduSpark is an interactive e-learning platform for primary school
              students in Rwanda video lessons, gamified rewards, and real-time
              progress tracking all in one place.
            </p>

            {/* CTA Buttons */}
            <div
              className="anim-fade-up anim-hidden delay-3"
              style={{
                display:           "flex",
                gap:               "16px",
                justifyContent:    "center",
                flexWrap:          "wrap",
                marginBottom:      "64px",
                animationFillMode: "forwards",
              }}
            >
              <Link href="/register" className="btn-primary">
                Get Started Free
                <FontAwesomeIcon icon={faArrowRight} style={{ width: "14px", height: "14px" }} />
              </Link>
              <Link
                href="/login"
                style={{
                  display:        "inline-flex",
                  alignItems:     "center",
                  justifyContent: "center",
                  gap:            "10px",
                  padding:        "13px 32px",
                  borderRadius:   "50px",
                  fontFamily:     "'Poppins', sans-serif",
                  fontSize:       "0.95rem",
                  fontWeight:     600,
                  color:          "#ffffff",
                  background:     "rgba(255,255,255,0.12)",
                  border:         "2px solid rgba(255,255,255,0.5)",
                  textDecoration: "none",
                  backdropFilter: "blur(6px)",
                  transition:     "all 0.2s ease",
                }}
              >
                Log In
              </Link>
            </div>

            {/* Stat strip */}
            <div
              className="anim-fade-up anim-hidden delay-5"
              style={{
                display:             "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
                gap:                 "16px",
                maxWidth:            "760px",
                width:               "100%",
                animationFillMode:   "forwards",
              }}
            >
              {stats.map((s) => (
                <div
                  key={s.label}
                  style={{
                    background:     "rgba(255,255,255,0.12)",
                    borderRadius:   "16px",
                    padding:        "20px 16px",
                    border:         "1px solid rgba(255,255,255,0.25)",
                    textAlign:      "center",
                    backdropFilter: "blur(10px)",
                  }}
                >
                  <div style={{
                    fontFamily: "'Poppins', sans-serif",
                    fontSize:   "1.8rem",
                    fontWeight: 800,
                    color:      "#ffffff",
                  }}>
                    {s.value}
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.72)", marginTop: "4px", fontWeight: 500 }}>
                    {s.label}
                  </div>
                </div>
              ))}
            </div>

          </div>
        </section>

        <section id="features" style={{ background: "#f7f8fc", padding: "96px 0" }}>
          <div className="container">

            {/* Heading */}
            <div className="section-center" style={{ marginBottom: "56px" }}>
              <span className="section-eyebrow">Why EduSpark</span>
              <h2 className="section-title">Learning that actually works</h2>
              <p className="section-subtitle">
                Designed for how children actually learn not just how
                they&apos;re traditionally taught.
              </p>
            </div>

            {/* Cards grid */}
            <div style={{
              display:             "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap:                 "24px",
            }}>
              {features.map((f) => {
                const isGradeBasedCourses = f.title === "Grade-Based Courses";
                const CardContent = (
                  <div
                    className={f.card}
                    style={isGradeBasedCourses ? {
                      cursor: "pointer",
                      transition: "transform 0.2s, box-shadow 0.2s",
                    } : {}}
                  >
                    <div className="card-icon card-icon-white-bg">
                      <FontAwesomeIcon
                        icon={f.icon}
                        style={{ width: "22px", height: "22px", color: "#ffffff" }}
                      />
                    </div>
                    <h3 style={{
                      fontSize:     "1.05rem",
                      fontWeight:   700,
                      color:        "#ffffff",
                      marginBottom: "10px",
                    }}>
                      {f.title}
                    </h3>
                    <p style={{
                      fontSize:   "0.875rem",
                      color:      "rgba(255,255,255,0.75)",
                      lineHeight: 1.75,
                    }}>
                      {f.desc}
                    </p>
                  </div>
                );

                return isGradeBasedCourses ? (
                  <Link key={f.title} href="/courses" style={{ textDecoration: "none" }} className="grade-based-courses-link">
                    {CardContent}
                  </Link>
                ) : (
                  <div key={f.title}>
                    {CardContent}
                  </div>
                );
              })}
            </div>

            <style>{`
              .grade-based-courses-link:hover .card-purple {
                transform: scale(1.02) !important;
                box-shadow: 0 8px 25px rgba(0,0,0,0.15) !important;
              }
            `}</style>

          </div>
        </section>

        {/* HOW IT WORKS  —  white background, centered steps */}
        <section id="how-it-works" style={{ background: "#ffffff", padding: "96px 0" }}>
          <div className="container">

            {/* Heading */}
            <div className="section-center" style={{ marginBottom: "56px" }}>
              <span className="section-eyebrow">Simple & Fast</span>
              <h2 className="section-title">How it works</h2>
              <p className="section-subtitle">
                From sign-up to learning in four easy steps.
              </p>
            </div>

            {/* Steps grid */}
            <div style={{
              display:             "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap:                 "32px",
            }}>
              {steps.map((step, i) => (
                <div
                  key={step.number}
                  className="card-white"
                  style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" }}
                >
                  {/* Step number */}
                  <div className="step-number">{step.number}</div>

                  {/* Icon bubble */}
                  <div
                    className="card-icon card-icon-blue-bg"
                    style={{ margin: "0 auto 16px" }}
                  >
                    <FontAwesomeIcon
                      icon={step.icon}
                      style={{ width: "20px", height: "20px", color: "#3749a9" }}
                    />
                  </div>

                  <h3 style={{
                    fontSize:     "1rem",
                    fontWeight:   800,
                    color:        "#0f1535",
                    marginBottom: "10px",
                  }}>
                    {step.title}
                  </h3>
                  <p style={{
                    fontSize:   "0.875rem",
                    color:      "#7b82a8",
                    lineHeight: 1.75,
                  }}>
                    {step.desc}
                  </p>

                  {/* Connector dot for non-last steps */}
                  {i < steps.length - 1 && (
                    <div style={{
                      width:        "8px",
                      height:       "8px",
                      borderRadius: "50%",
                      background:   "var(--grad-blue)",
                      marginTop:    "20px",
                    }} />
                  )}
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* GUARDIAN SECTION  —  off-white, two-column centered */}
        <section id="guardians" style={{ background: "#f7f8fc", padding: "96px 0" }}>
          <div className="container">
            <div style={{
              display:       "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap:           "56px",
              alignItems:    "center",
            }}>

              {/* Left — text */}
              <div>
                <span className="section-eyebrow">For Parents & Guardians</span>
                <h2 className="section-title" style={{ maxWidth: "420px" }}>
                  Stay close to your child&apos;s learning journey
                </h2>
                <p style={{
                  fontSize:     "0.95rem",
                  color:        "#7b82a8",
                  lineHeight:   1.8,
                  marginBottom: "28px",
                }}>
                  The EduSpark Guardian Dashboard gives you real-time visibility
                  into your child&apos;s education — which lessons they completed,
                  quiz scores, and points earned, all in one clear dashboard.
                </p>

                <ul style={{ display: "flex", flexDirection: "column", gap: "14px", marginBottom: "32px" }}>
                  {perks.map((item) => (
                    <li key={item} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <span style={{
                        width:          "24px",
                        height:         "24px",
                        borderRadius:   "50%",
                        background:     "var(--grad-blue)",
                        display:        "flex",
                        alignItems:     "center",
                        justifyContent: "center",
                        flexShrink:     0,
                      }}>
                        <FontAwesomeIcon icon={faCheck} style={{ width: "10px", height: "10px", color: "#fff" }} />
                      </span>
                      <span style={{ fontSize: "0.9rem", fontWeight: 600, color: "#3d4566" }}>{item}</span>
                    </li>
                  ))}
                </ul>

                <Link href="/register" className="btn-primary">
                  Create Guardian Account
                  <FontAwesomeIcon icon={faArrowRight} style={{ width: "13px", height: "13px" }} />
                </Link>
              </div>

              {/* Right — mock dashboard card */}
              <div
                className="anim-float card-white"
                style={{ padding: "28px" }}
              >
                {/* Header */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
                  <div>
                    <p style={{ fontSize: "0.75rem", color: "#7b82a8", fontWeight: 600 }}>Welcome back</p>
                    <p style={{ fontSize: "1rem", fontWeight: 800, color: "#0f1535" }}>Divine Uwase</p>
                  </div>
                  <span style={{
                    fontSize:     "0.75rem",
                    fontWeight:   700,
                    padding:      "6px 14px",
                    borderRadius: "20px",
                    background:   "#eef0fa",
                    color:        "#3749a9",
                  }}>
                    2 students
                  </span>
                </div>

                {/* Student rows */}
                {[
                  { name: "Kevin", grade: "P1–P2", progress: 72, points: 340, color: "#3749a9" },
                  { name: "Amina", grade: "P3–P4", progress: 88, points: 520, color: "#5b2d8a" },
                ].map((s) => (
                  <div
                    key={s.name}
                    style={{
                      background:   "#f7f8fc",
                      borderRadius: "14px",
                      padding:      "16px",
                      marginBottom: "12px",
                      border:       "1px solid #eef0fa",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <div style={{
                          width:          "36px",
                          height:         "36px",
                          borderRadius:   "50%",
                          background:     s.color,
                          display:        "flex",
                          alignItems:     "center",
                          justifyContent: "center",
                          color:          "#fff",
                          fontWeight:     800,
                          fontSize:       "0.9rem",
                        }}>
                          {s.name[0]}
                        </div>
                        <div>
                          <p style={{ fontSize: "0.875rem", fontWeight: 800, color: "#0f1535" }}>{s.name}</p>
                          <p style={{ fontSize: "0.75rem", color: "#7b82a8", fontWeight: 600 }}>{s.grade}</p>
                        </div>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <FontAwesomeIcon icon={faTrophy} style={{ width: "13px", height: "13px", color: "#f59e0b" }} />
                        <span style={{ fontSize: "0.875rem", fontWeight: 800, color: "#3749a9" }}>
                          {s.points} pts
                        </span>
                      </div>
                    </div>
                    {/* Progress bar */}
                    <div style={{ height: "6px", borderRadius: "6px", background: "#e5e9f5", overflow: "hidden" }}>
                      <div style={{
                        height:     "100%",
                        width:      `${s.progress}%`,
                        background: s.color,
                        borderRadius: "6px",
                        transition: "width 0.4s ease",
                      }} />
                    </div>
                    <p style={{ fontSize: "0.72rem", color: "#7b82a8", marginTop: "6px", fontWeight: 600 }}>
                      {s.progress}% course complete
                    </p>
                  </div>
                ))}
              </div>

            </div>
          </div>
        </section>

        {/*CTA BANNER  —  dark gradient, centered */}
        <section style={{ padding: "96px 0" }}>
          <div className="container section-center">
            <div style={{
              background:    "var(--grad-cta)",
              borderRadius:  "28px",
              padding:       "72px 40px",
              textAlign:     "center",
              width:         "100%",
              maxWidth:      "820px",
              position:      "relative",
              overflow:      "hidden",
            }}>
              {/* Subtle glow circle */}
              <div style={{
                position:     "absolute",
                top:          "-60px",
                left:         "50%",
                transform:    "translateX(-50%)",
                width:        "320px",
                height:       "320px",
                borderRadius: "50%",
                background:   "rgba(55,73,169,0.25)",
                filter:       "blur(60px)",
                pointerEvents:"none",
              }} />

              <div style={{ position: "relative", zIndex: 1 }}>
                {/* Icon */}
                <div style={{
                  width:          "64px",
                  height:         "64px",
                  borderRadius:   "18px",
                  background:     "rgba(255,255,255,0.12)",
                  display:        "flex",
                  alignItems:     "center",
                  justifyContent: "center",
                  margin:         "0 auto 24px",
                }}>
                  <FontAwesomeIcon icon={faBolt} style={{ width: "28px", height: "28px", color: "#f59e0b" }} />
                </div>

                <h2
                  className="display-heading"
                  style={{ fontSize: "clamp(2rem, 4vw, 3rem)", color: "#ffffff", marginBottom: "16px" }}
                >
                  Ready to ignite the spark?
                </h2>
                <p style={{
                  fontSize:     "1rem",
                  color:        "rgba(255,255,255,0.7)",
                  maxWidth:     "480px",
                  margin:       "0 auto 36px",
                  lineHeight:   1.8,
                }}>
                  Join EduSpark today and give your child a fun, engaging, and
                  curriculum-aligned way to learn.
                </p>

                <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
                  <Link href="/register" className="btn-white">
                    Get Started Free
                    <FontAwesomeIcon icon={faArrowRight} style={{ width: "13px", height: "13px" }} />
                  </Link>
                  <Link
                    href="/about"
                    style={{
                      display:        "inline-flex",
                      alignItems:     "center",
                      justifyContent: "center",
                      gap:            "10px",
                      padding:        "14px 32px",
                      borderRadius:   "50px",
                      fontFamily:     "'Poppins', sans-serif",
                      fontSize:       "0.95rem",
                      fontWeight:     800,
                      color:          "rgba(255,255,255,0.85)",
                      background:     "rgba(255,255,255,0.1)",
                      border:         "2px solid rgba(255,255,255,0.25)",
                      textDecoration: "none",
                      transition:     "all 0.2s",
                    }}
                  >
                    Learn More
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

      </main>

      <Footer />

      {/* Pulse animation for live dot */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.6; transform: scale(1.3); }
        }
      `}</style>
    </>
  );
}