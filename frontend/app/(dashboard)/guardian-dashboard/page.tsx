"use client";

import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faPlus,
  faChartLine,
  faClock,
  faTrophy,
  faBars,
  faTimes,
  faChild,
  faStar,
} from "@fortawesome/free-solid-svg-icons";

const childrenData = [
  { id: 1, name: "Alice", age: 8, grade: "P3", totalPoints: 1250, learningTime: 45 },
  { id: 2, name: "Bob", age: 10, grade: "P5", totalPoints: 2100, learningTime: 60 },
  { id: 3, name: "Charlie", age: 7, grade: "P2", totalPoints: 800, learningTime: 30 },
];

export default function GuardianDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showAddChild, setShowAddChild] = useState(false);

  const guardianName = "Mrs. Johnson";

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f7f8fc", fontFamily: "Poppins, Nunito, sans-serif" }}>
      {/* Sidebar */}
      <aside style={{
        width: sidebarOpen ? "250px" : "0",
        background: "#ffffff",
        borderRight: "1px solid #eef0fa",
        transition: "width 0.3s",
        overflow: "hidden",
        position: "fixed",
        top: 0,
        left: 0,
        height: "100vh",
        zIndex: 10,
      }}>
        <div style={{ padding: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "30px" }}>
            <FontAwesomeIcon icon={faUser} style={{ color: "#3749a9", fontSize: "1.5rem" }} />
            <h2 style={{ fontSize: "1.2rem", fontWeight: 700, color: "#3749a9" }}>Guardian Dashboard</h2>
          </div>
          <nav>
            <ul style={{ listStyle: "none", padding: 0 }}>
              <li style={{ marginBottom: "10px" }}>
                <a href="#" style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none", color: "#3d4566", fontWeight: 600 }}>
                  <FontAwesomeIcon icon={faChild} />
                  Children Overview
                </a>
              </li>
              <li style={{ marginBottom: "10px" }}>
                <a href="#" style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none", color: "#3d4566", fontWeight: 600 }}>
                  <FontAwesomeIcon icon={faChartLine} />
                  Progress Reports
                </a>
              </li>
              <li style={{ marginBottom: "10px" }}>
                <a href="#" style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none", color: "#3d4566", fontWeight: 600 }}>
                  <FontAwesomeIcon icon={faClock} />
                  Learning Time
                </a>
              </li>
              <li>
                <a href="#" style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none", color: "#3d4566", fontWeight: 600 }}>
                  <FontAwesomeIcon icon={faTrophy} />
                  Achievements
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{
        flex: 1,
        marginLeft: sidebarOpen ? "250px" : "0",
        transition: "margin-left 0.3s",
        padding: "20px",
      }}>
        {/* Header */}
        <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
          <div>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              style={{
                background: "none",
                border: "none",
                fontSize: "1.5rem",
                cursor: "pointer",
                color: "#3749a9",
                marginRight: "20px",
              }}
            >
              <FontAwesomeIcon icon={sidebarOpen ? faTimes : faBars} />
            </button>
            <h1 style={{ fontSize: "2rem", fontWeight: 900, color: "#3749a9", display: "inline" }}>
              Welcome, {guardianName}
            </h1>
          </div>
          <button
            onClick={() => setShowAddChild(true)}
            style={{
              background: "linear-gradient(135deg, #3749a9, #1b2561)",
              color: "#ffffff",
              border: "none",
              padding: "10px 20px",
              borderRadius: "50px",
              fontWeight: 700,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <FontAwesomeIcon icon={faPlus} />
            Add Child
          </button>
        </header>

        {/* Children List */}
        <section style={{ marginBottom: "30px" }}>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 800, color: "#3d4566", marginBottom: "20px" }}>
            Your Children
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "20px" }}>
            {childrenData.map((child) => (
              <div
                key={child.id}
                style={{
                  background: "#ffffff",
                  borderRadius: "20px",
                  padding: "20px",
                  boxShadow: "0 4px 20px rgba(55,73,169,0.1)",
                  border: "1px solid #eef0fa",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "15px", marginBottom: "15px" }}>
                  <div style={{
                    width: "50px",
                    height: "50px",
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #3749a9, #1b2561)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#ffffff",
                    fontSize: "1.2rem",
                    fontWeight: 700,
                  }}>
                    {child.name[0]}
                  </div>
                  <div>
                    <h3 style={{ fontSize: "1.2rem", fontWeight: 800, color: "#3749a9", margin: 0 }}>
                      {child.name}
                    </h3>
                    <p style={{ fontSize: "0.9rem", color: "#7b82a8", margin: 0 }}>
                      Age {child.age} • Grade {child.grade}
                    </p>
                  </div>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <p style={{ fontSize: "0.8rem", color: "#7b82a8", margin: 0 }}>Total Points</p>
                    <p style={{ fontSize: "1.2rem", fontWeight: 800, color: "#3749a9", margin: 0 }}>
                      <FontAwesomeIcon icon={faStar} style={{ color: "#f59e0b", marginRight: "5px" }} />
                      {child.totalPoints}
                    </p>
                  </div>
                  <div>
                    <p style={{ fontSize: "0.8rem", color: "#7b82a8", margin: 0 }}>Learning Time</p>
                    <p style={{ fontSize: "1.2rem", fontWeight: 800, color: "#3749a9", margin: 0 }}>
                      <FontAwesomeIcon icon={faClock} style={{ color: "#10b981", marginRight: "5px" }} />
                      {child.learningTime} min
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Learning Time Graph Placeholder */}
        <section>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 800, color: "#3d4566", marginBottom: "20px" }}>
            Learning Time Overview
          </h2>
          <div style={{
            background: "#ffffff",
            borderRadius: "20px",
            padding: "20px",
            boxShadow: "0 4px 20px rgba(55,73,169,0.1)",
            border: "1px solid #eef0fa",
            height: "300px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}>
            <div style={{ textAlign: "center", color: "#7b82a8" }}>
              <FontAwesomeIcon icon={faChartLine} style={{ fontSize: "3rem", marginBottom: "10px" }} />
              <p>Learning Time Graph</p>
              <p style={{ fontSize: "0.9rem" }}>Chart visualization would go here</p>
            </div>
          </div>
        </section>
      </main>

      {/* Add Child Panel */}
      {showAddChild && (
        <div className="add-child-panel" style={{
          position: "fixed",
          top: 0,
          right: 0,
          width: "400px",
          height: "100vh",
          background: "#ffffff",
          borderLeft: "1px solid #eef0fa",
          boxShadow: "-4px 0 20px rgba(55,73,169,0.1)",
          zIndex: 20,
          padding: "20px",
          overflowY: "auto",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
            <h2 style={{ fontSize: "1.5rem", fontWeight: 800, color: "#3749a9" }}>Add New Child</h2>
            <button
              onClick={() => setShowAddChild(false)}
              style={{
                background: "none",
                border: "none",
                fontSize: "1.2rem",
                cursor: "pointer",
                color: "#7b82a8",
              }}
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </div>
          <form style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
            <div>
              <label style={{ display: "block", fontWeight: 600, color: "#3d4566", marginBottom: "5px" }}>
                Student Display Name
              </label>
              <input
                type="text"
                placeholder="Enter student's display name"
                style={{
                  width: "100%",
                  padding: "10px",
                  border: "1px solid #d1d8f0",
                  borderRadius: "10px",
                  fontSize: "1rem",
                }}
              />
            </div>
            <div>
              <label style={{ display: "block", fontWeight: 600, color: "#3d4566", marginBottom: "5px" }}>
                Student ID
              </label>
              <input
                type="text"
                placeholder="Enter student ID"
                style={{
                  width: "100%",
                  padding: "10px",
                  border: "1px solid #d1d8f0",
                  borderRadius: "10px",
                  fontSize: "1rem",
                }}
              />
            </div>
            <div>
              <label style={{ display: "block", fontWeight: 600, color: "#3d4566", marginBottom: "5px" }}>
                Date of Birth
              </label>
              <input
                type="date"
                style={{
                  width: "100%",
                  padding: "10px",
                  border: "1px solid #d1d8f0",
                  borderRadius: "10px",
                  fontSize: "1rem",
                }}
              />
            </div>
            <div>
              <label style={{ display: "block", fontWeight: 600, color: "#3d4566", marginBottom: "5px" }}>
                Age Group
              </label>
              <select
                style={{
                  width: "100%",
                  padding: "10px",
                  border: "1px solid #d1d8f0",
                  borderRadius: "10px",
                  fontSize: "1rem",
                }}
              >
                <option>P1–P2</option>
                <option>P3–P4</option>
                <option>P5–P6</option>
              </select>
            </div>
            <div>
              <label style={{ display: "block", fontWeight: 600, color: "#3d4566", marginBottom: "5px" }}>
                Upload Profile Picture
              </label>
              <input
                type="file"
                accept="image/*"
                style={{
                  width: "100%",
                  padding: "10px",
                  border: "1px solid #d1d8f0",
                  borderRadius: "10px",
                  fontSize: "1rem",
                }}
              />
            </div>
            <div>
              <label style={{ display: "block", fontWeight: 600, color: "#3d4566", marginBottom: "5px" }}>
                Disability (Optional)
              </label>
              <input
                type="text"
                placeholder="Enter any disability information"
                style={{
                  width: "100%",
                  padding: "10px",
                  border: "1px solid #d1d8f0",
                  borderRadius: "10px",
                  fontSize: "1rem",
                }}
              />
            </div>
            <button
              type="submit"
              style={{
                background: "linear-gradient(135deg, #3749a9, #1b2561)",
                color: "#ffffff",
                border: "none",
                padding: "12px",
                borderRadius: "50px",
                fontWeight: 700,
                cursor: "pointer",
                marginTop: "10px",
              }}
            >
              Submit
            </button>
          </form>
        </div>
      )}

      {/* Overlay for mobile */}
      {showAddChild && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.5)",
            zIndex: 15,
          }}
          onClick={() => setShowAddChild(false)}
        />
      )}

      <style>{`
        @media (max-width: 768px) {
          aside {
            width: ${sidebarOpen ? "200px" : "0"} !important;
          }
          main {
            margin-left: ${sidebarOpen ? "200px" : "0"} !important;
          }
          .add-child-panel {
            width: 100% !important;
            right: 0 !important;
          }
        }
      `}</style>
    </div>
  );
}