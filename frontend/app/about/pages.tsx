import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/footer";

export default function About() {
  return (
    <>
      <Navbar />

      <main style={{ background: "#ffffff", paddingTop: "80px" }}>

        {/* ══════════════════════════════════════════════════════════
            HERO SECTION
        ══════════════════════════════════════════════════════════ */}
        <section
          style={{
            background: "linear-gradient(135deg, #f7f8fc 0%, #eef0fa 100%)",
            padding: "80px 0 100px",
            textAlign: "center",
          }}
        >
          <div className="container section-center">
            <div
              style={{
                display: "inline-block",
                background: "#eef0fa",
                border: "1px solid #d1d8f0",
                borderRadius: "50px",
                padding: "6px 16px",
                fontSize: "0.75rem",
                fontWeight: 800,
                color: "#3749a9",
                marginBottom: "32px",
                letterSpacing: "0.04em",
              }}
            >
              About EduSpark
            </div>

            <h1
              className="display-heading"
              style={{
                fontSize: "clamp(2.5rem, 5vw, 4rem)",
                color: "#3749a9",
                maxWidth: "700px",
                marginBottom: "24px",
              }}
            >
              Empowering Rwanda's Future
              <span style={{
                background: "linear-gradient(135deg, #1b2561, #3749a9)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}>
                Through Education
              </span>
            </h1>

            <p
              style={{
                fontSize: "1.1rem",
                color: "#7b82a8",
                maxWidth: "580px",
                lineHeight: 1.8,
                marginBottom: "40px",
              }}
            >
              EduSpark is revolutionizing primary education in Rwanda by combining
              curriculum-aligned content with gamification and real-time progress tracking.
            </p>

            <Image
              src="/images/study1.webp"
              alt="Students learning with EduSpark"
              width={600}
              height={400}
              style={{
                borderRadius: "16px",
                boxShadow: "0 12px 48px rgba(19, 27, 70, 0.12)",
                marginTop: "40px",
              }}
              priority
            />
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════
            MISSION, VISION, PURPOSE
        ══════════════════════════════════════════════════════════ */}
        <section style={{ padding: "100px 0" }}>
          <div className="container">
            <div style={{ textAlign: "center", marginBottom: "80px" }}>
              <h2
                className="display-heading"
                style={{
                  fontSize: "clamp(2rem, 4vw, 2.75rem)",
                  color: "#3749a9",
                  marginBottom: "16px",
                }}
              >
                Our Foundation
              </h2>
              <p
                style={{
                  fontSize: "1rem",
                  color: "#7b82a8",
                  maxWidth: "560px",
                  margin: "0 auto",
                  lineHeight: 1.75,
                }}
              >
                Built on the principles of accessibility, engagement, and educational excellence
              </p>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                gap: "40px",
                maxWidth: "1000px",
                margin: "0 auto",
              }}
            >
              {/* Mission */}
              <div
                className="mission-card"
                style={{
                  background: "#ffffff",
                  border: "1px solid #eef0fa",
                  borderRadius: "16px",
                  padding: "40px 32px",
                  boxShadow: "0 4px 24px rgba(19, 27, 70, 0.08)",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                }}
              >
                <div
                  style={{
                    width: "60px",
                    height: "60px",
                    borderRadius: "12px",
                    background: "linear-gradient(135deg, #1b2561, #3749a9)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "24px",
                  }}
                >
                  <span style={{ fontSize: "1.5rem", color: "#ffffff" }}>🎯</span>
                </div>
                <h3
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: "1.5rem",
                    fontWeight: 900,
                    color: "#3749a9",
                    marginBottom: "16px",
                  }}
                >
                  Our Mission
                </h3>
                <p
                  style={{
                    fontSize: "1rem",
                    color: "#3d4566",
                    lineHeight: 1.7,
                  }}
                >
                  To provide an engaging and inclusive digital learning platform for primary
                  school students in Rwanda by using curriculum-aligned video lessons,
                  interactive activities, and gamification to improve understanding,
                  motivation, and school retention.
                </p>
              </div>

              {/* Vision */}
              <div
                className="vision-card"
                style={{
                  background: "#ffffff",
                  border: "1px solid #eef0fa",
                  borderRadius: "16px",
                  padding: "40px 32px",
                  boxShadow: "0 4px 24px rgba(19, 27, 70, 0.08)",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                }}
              >
                <div
                  style={{
                    width: "60px",
                    height: "60px",
                    borderRadius: "12px",
                    background: "linear-gradient(135deg, #290e42, #5b2d8a)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "24px",
                  }}
                >
                  <span style={{ fontSize: "1.5rem", color: "#ffffff" }}>🔮</span>
                </div>
                <h3
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: "1.5rem",
                    fontWeight: 900,
                    color: "#3749a9",
                    marginBottom: "16px",
                  }}
                >
                  Our Vision
                </h3>
                <p
                  style={{
                    fontSize: "1rem",
                    color: "#3d4566",
                    lineHeight: 1.7,
                  }}
                >
                  To create a future where every child in Rwanda enjoys learning, stays in school,
                  and reaches their full potential through accessible and innovative education.
                </p>
              </div>

              {/* Purpose */}
              <div
                className="purpose-card"
                style={{
                  background: "#ffffff",
                  border: "1px solid #eef0fa",
                  borderRadius: "16px",
                  padding: "40px 32px",
                  boxShadow: "0 4px 24px rgba(19, 27, 70, 0.08)",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                }}
              >
                <div
                  style={{
                    width: "60px",
                    height: "60px",
                    borderRadius: "12px",
                    background: "linear-gradient(135deg, #1b2561, #290e42)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "24px",
                  }}
                >
                  <span style={{ fontSize: "1.5rem", color: "#ffffff" }}>🌟</span>
                </div>
                <h3
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: "1.5rem",
                    fontWeight: 900,
                    color: "#3749a9",
                    marginBottom: "16px",
                  }}
                >
                  Our Purpose
                </h3>
                <p
                  style={{
                    fontSize: "1rem",
                    color: "#3d4566",
                    lineHeight: 1.7,
                  }}
                >
                  EduSpark exists to bridge the gap between traditional classroom teaching
                  and the diverse ways students learn by providing a platform that supports learners,
                  assists teachers, and allows guardians to track progress and encourage success.
                </p>
              </div>
            </div>

            <style>{`
              .mission-card:hover, .vision-card:hover, .purpose-card:hover {
                transform: translateY(-4px);
                box-shadow: 0 8px 32px rgba(19, 27, 70, 0.12) !important;
              }
            `}</style>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════
            IMPACT STATS
        ══════════════════════════════════════════════════════════ */}
        <section
          style={{
            background: "linear-gradient(135deg, #131b46 0%, #1b2561 100%)",
            padding: "80px 0",
            color: "#ffffff",
          }}
        >
          <div className="container">
            <div style={{ textAlign: "center", marginBottom: "60px" }}>
              <h2
                className="display-heading"
                style={{
                  fontSize: "clamp(2rem, 4vw, 2.75rem)",
                  color: "#ffffff",
                  marginBottom: "16px",
                }}
              >
                Our Impact in Rwanda
              </h2>
              <p
                style={{
                  fontSize: "1rem",
                  color: "rgba(255,255,255,0.8)",
                  maxWidth: "560px",
                  margin: "0 auto",
                  lineHeight: 1.75,
                }}
              >
                Making a difference in primary education across the country
              </p>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "40px",
                maxWidth: "800px",
                margin: "0 auto",
              }}
            >
              <div style={{ textAlign: "center" }}>
                <div
                  style={{
                    fontSize: "3rem",
                    fontWeight: 900,
                    color: "#ffffff",
                    marginBottom: "8px",
                  }}
                >
                  98%
                </div>
                <div
                  style={{
                    fontSize: "0.9rem",
                    color: "rgba(255,255,255,0.8)",
                    fontWeight: 600,
                  }}
                >
                  Primary School Enrollment
                </div>
              </div>

              <div style={{ textAlign: "center" }}>
                <div
                  style={{
                    fontSize: "3rem",
                    fontWeight: 900,
                    color: "#ffffff",
                    marginBottom: "8px",
                  }}
                >
                  P1–P6
                </div>
                <div
                  style={{
                    fontSize: "0.9rem",
                    color: "rgba(255,255,255,0.8)",
                    fontWeight: 600,
                  }}
                >
                  Full Curriculum Coverage
                </div>
              </div>

              <div style={{ textAlign: "center" }}>
                <div
                  style={{
                    fontSize: "3rem",
                    fontWeight: 900,
                    color: "#ffffff",
                    marginBottom: "8px",
                  }}
                >
                  Free
                </div>
                <div
                  style={{
                    fontSize: "0.9rem",
                    color: "rgba(255,255,255,0.8)",
                    fontWeight: 600,
                  }}
                >
                  Always Free to Start
                </div>
              </div>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </>
  );
}