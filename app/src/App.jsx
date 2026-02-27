import { useState, useEffect } from "react";
import "./App.css";
import ClubGrid from "./components/ClubGrid";
import TeacherAvailability from "./components/TeacherAvailability";
import WednesdayClubManagement from "./components/WednesdayClubManagement";
import MorningClubManagement from "./components/MorningClubManagement";
import axios from "axios"; 
import { useClubs } from "./hooks/UseClubs";

function App() {
  const [user, setUser] = useState(null);
  const [portal, setPortal] = useState(null); 
  const [page, setPage] = useState("morning"); 
  const [teacherAvailability, setTeacherAvailability] = useState([]);
  const [aiMerges, setAiMerges] = useState([]);
  const [selectedMerges, setSelectedMerges] = useState(new Set());
  //misdemeanors tab
  const [watchlist, setWatchlist] = useState([]);
  const [selectedClub, setSelectedClub] = useState("");
  const [selectedMisdemeanor, setSelectedMisdemeanor] = useState("");
  const [notes, setNotes] = useState("");

  const { clubs: morningClubs, loading: loadingMorning, refresh: refreshMorning } = useClubs("morning");
  const { clubs: wednesdayClubs, loading: loadingWednesday, refresh: refreshWednesday } = useClubs("wednesday");

  useEffect(() => {
    fetch("http://localhost:4000/auth/user", { credentials: "include" })
      .then(res => res.json())
      .then(data => {
        setUser(data);
        setPortal("admin");
      });
  }, []);

  useEffect(() => {
    fetch("http://localhost:4000/teacher-availability", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => setTeacherAvailability(data))
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    if (page === "morning-ai-merge") {
      fetch("http://localhost:4000/ai-merges")
        .then(res => res.json())
        .then(async (clubs) => {
          const response = await fetch("http://localhost:4000/assess-similarity", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(clubs)
          });
          const suggestions = await response.json();
          setAiMerges(suggestions);
        })
        .catch(err => console.error(err));
    }
  }, [page]);


  // const morningClubs = [ 
  //   {
  //     name: "Robotics Club",
  //     mission: "Build, program, and compete with robots.",
  //     members: 18,
  //     image: "/images/robotics.jpg",
  //   },
  //   {
  //     name: "Creative Writing",
  //     mission: "Explore storytelling, poetry, and prose.",
  //     members: 12,
  //     image: "/images/creative-writing.jpg",
  //   },
  //   {
  //     name: "Chess Club",
  //     mission: "Compete with others in a supportive environment",
  //     members: 6,
  //     image: "/images/chess.jpg",
  //   },
  // ];

  // const wednesdayClubs = [
  //   {
  //     name: "Drama Club",
  //     mission: "Acting, directing, and stage performance.",
  //     members: 15,
  //     image: "/images/drama.jpg",
  //   },
  //   {
  //     name: "Art Club",
  //     mission: "Drawing, painting, and creative expression.",
  //     members: 10,
  //     image: "/images/art.jpeg",
  //   },
  // ];


  // =====================
  // LOGIN PAGE
  // =====================
  if (!user) {
    return (
      <div className="page">
        <div className="card-ui">
          <h1>BCA Club Dashboard</h1>
          <p className="subtitle">Sign in with your school account</p>

          <button
            onClick={() =>
              (window.location.href = "http://localhost:4000/auth/google")
            }
          >
            Login with Google
          </button>
        </div>
      </div>
    );
  }

  // =====================
  // PORTAL PAGE (AFTER LOGIN)
  // =====================
  return (
    <div className="container">
    <div className="sidebar">
      {portal === "admin" && (
        <>
          <a
            href="#"
            onClick={() => setPage("morning")}
            className={page.startsWith("morning") ? "active" : ""}
          >
            Morning Club Management
          </a>
          <a
            href="#"
            onClick={() => setPage("wednesday")}
            className={page === "wednesday" ? "active" : ""}
          >
            Wednesday Club Management
          </a>
          <a
            href="#"
            onClick={() => setPage("teacher")}
            className={page === "teacher" ? "active" : ""}
          >
            Teacher Availability
          </a>
          <a
            href="#"
            onClick={() => setPage("misdemeanors")}
            className={page === "misdemeanors" ? "active" : ""}
          >
            Misdemeanors
          </a>
        </>
      )}
        {portal === "admin" && (
          <>
            <a
              href="#"
              onClick={() => setPage("morning")}
              className={page.startsWith("morning") ? "active" : ""}
            >
              Morning Club Management
            </a>
            <a
              href="#"
              onClick={() => setPage("wednesday")}
              className={page === "wednesday" ? "active" : ""}
            >
              Wednesday Club Management
            </a>
            <a
              href="#"
              onClick={() => setPage("teacher")}
              className={page === "teacher" ? "active" : ""}
            >
              Teacher Availability
            </a>
          </>
        )}

        {portal === "student" && (
          <>
            <a
              href="#"
              onClick={() => setPage("morning")}
              className={page === "morning" ? "active" : ""}
            >
              Morning Clubs
            </a>
            <a
              href="#"
              onClick={() => setPage("wednesday")}
              className={page === "wednesday" ? "active" : ""}
            >
              Wednesday Clubs
            </a>
          </>
        )}
      </div>


      {/* Main content */}
      <div className="main">
        {user && (
          <div style={{ position: "fixed", top: 20, right: 20, zIndex: 1000 }}>
            <button
              onClick={() => {
                fetch("http://localhost:4000/auth/logout", { credentials: "include" })
                  .then(() => setUser(null))
                  .catch((err) => console.error(err));
              }}
              style={{
                background: "#4a90e2",
                color: "white",
                border: "none",
                padding: "6px 12px",
                borderRadius: "6px",
                cursor: "pointer",
              }}
            >
              Logout
            </button>
          </div>
        )} 

        <div className="portal-title">{portal === "admin" ? "Admin Portal" : "Student Portal"}</div>
        {/* Portal Toggle Buttons */}
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <button
            onClick={() => setPortal("admin")}
            style={{
              marginRight: "10px",
              background: portal === "admin" ? "#4a90e2" : "#9e9e9e",
              color: "white",
              padding: "6px 12px",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            Admin Portal
          </button>
          <button
  onClick={() => {
      setPortal("student");
      setPage("morning");

      refreshMorning();
      refreshWednesday();
    }}
    style={{
      background: portal === "student" ? "#4a90e2" : "#9e9e9e",
      color: "white",
      padding: "6px 12px",
      border: "none",
      borderRadius: "6px",
      cursor: "pointer",
    }}
  >
    Student Portal
  </button>
        </div>

        {/* =====================
            ADMIN PORTAL CONTENT
        ===================== */}
        {portal === "admin" && (
          <>
            {page === "morning" && ( <MorningClubManagement setPage={setPage} user={user} /> )}

            {page === "morning-ai-merge" && (
              <>
                <div className="page-title">
                  Morning Club Management: AI Merges
                </div>

                <p style={{ textAlign: "center", marginBottom: "25px", color: "#1e3a5f" }}>
                  AI has analyzed proposed and approved clubs and grouped clubs that may
                  benefit from merging based on mission statements, activities, and goals.
                </p>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: "20px",
                    marginBottom: "30px",
                  }}
                >

                  <button onClick={async () => {
                    const selectedGroups = aiMerges.filter((_, idx) =>
                      selectedMerges.has(idx)
                  );
                  
                  if (selectedGroups.length === 0) {
                    alert("Please select at least one merge suggestion.");
                    return;
                  }
                  
                  if (!user || !user.email) {
                    alert("Admin email not found. Make sure you are logged in.");
                    return;
                  }
                  
                  try {
                    const response = await fetch(
                      "http://localhost:4000/send-merge-emails",
                      {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        credentials: "include",
                        body: JSON.stringify({
                          merges: selectedGroups,
                          adminEmail: user.email, // <-- send admin email here
                        }),
                      }
                    );
                    
                    const result = await response.json();
                    alert(result.message || "Emails sent.");
                  } 
                  
                  catch (err) {
                    console.error("Failed to send emails:", err);
                    alert("Failed to send emails. Check console for details.");
                  }
                  }}
                  >
                    Send Email Suggesting Selected Clubs Merge
                    </button>


                  <div>
                    <strong>Deadline:</strong>{" "}
                    <input
                      type="date"
                      value="2026-03-15"
                      readOnly
                      style={{ padding: "6px" }}
                    />
                  </div>
                </div>

  {aiMerges.length > 0 ? (
    aiMerges.map((group, i) => (
      <div
        key={i}
        style={{
          background: "#e7f0fb",
          borderRadius: "12px",
          padding: "20px",
          marginBottom: "25px",
          boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            fontWeight: "600",
            marginBottom: "15px",
            color: "#1e3a5f",
          }}
      >
          <input
            type="checkbox"
            checked={selectedMerges.has(i)}
            onChange={(e) => {
              const updated = new Set(selectedMerges);
              if (e.target.checked) {
                updated.add(i);
              } else {
                updated.delete(i);
              }
              setSelectedMerges(updated);
            }}
          />
          AI Suggested Merge:
        </div>


        {[{name: group.clubA, email: group.emailA}, {name: group.clubB, email: group.emailB}].map((club, idx) => (
          <div
            key={idx}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              background: "#ffffff",
              padding: "12px 16px",
              borderRadius: "8px",
              marginBottom: "10px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <button
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "6px",
                  border: "none",
                  color: "white",
                  fontSize: "16px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                title="Remove from merge group"
              >
                🗑️
              </button>
              <strong>{club.name}</strong>
            </div>
            <span>{club.email}</span>
          </div>
        ))}
      </div>
    ))
  ) : (
    <p style={{ textAlign: "center", color: "#666" }}>No AI merge suggestions yet.</p>
  )}
                {aiMerges.length > 0 ? (
                  aiMerges.map((group, i) => (
                    <div
                      key={i}
                      style={{
                        background: "#e7f0fb",
                        borderRadius: "12px",
                        padding: "20px",
                        marginBottom: "25px",
                        boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
                      }}
                    >
                      <div style={{ fontWeight: "600", marginBottom: "15px", color: "#1e3a5f" }}>
                        AI Suggested Merge:
                      </div>

                      {[{name: group.clubA, email: group.emailA}, {name: group.clubB, email: group.emailB}].map((club, idx) => (
                        <div
                          key={idx}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            background: "#ffffff",
                            padding: "12px 16px",
                            borderRadius: "8px",
                            marginBottom: "10px",
                          }}
                        >
                          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                            <button
                              style={{
                                width: "32px",
                                height: "32px",
                                borderRadius: "6px",
                                border: "none",
                                color: "white",
                                fontSize: "16px",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                              title="Remove from merge group"
                            >
                              🗑️
                            </button>
                            <strong>{club.name}</strong>
                          </div>
                          <span>{club.email}</span>
                        </div>
                      ))}
                    </div>
                  ))
                ) : (
                  <p style={{ textAlign: "center", color: "#666" }}>No AI merge suggestions yet.</p>
                )}
              </>
            )}

            {/* Wednesday Club Management */}
            {page === "wednesday" && <WednesdayClubManagement user={user} />}
            {/* Teacher Availability */}
            {page === "teacher" && <TeacherAvailability teachers={teacherAvailability} />}
                {page === "misdemeanors" && (
      <>
        <div className="page-title">Club Watchlist</div>

        <p style={{ textAlign: "center", marginBottom: "25px", color: "#1e3a5f" }}>
          Track clubs that require administrative monitoring.
        </p>

        {/* Add Form */}
        <div
          style={{
            background: "#e7f0fb",
            padding: "20px",
            borderRadius: "12px",
            marginBottom: "30px",
            boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
            display: "flex",
            flexWrap: "wrap",
            gap: "10px",
            justifyContent: "center",
          }}
        >
          <select
            value={selectedClub}
            onChange={(e) => setSelectedClub(e.target.value)}
            style={{ padding: "8px", borderRadius: "6px" }}
          >
            <option value="">Select Club</option>
            {[...morningClubs, ...wednesdayClubs].map((club, i) => (
              <option key={i} value={club.name}>
                {club.name}
              </option>
            ))}
          </select>

          <select
            value={selectedMisdemeanor}
            onChange={(e) => setSelectedMisdemeanor(e.target.value)}
            style={{ padding: "8px", borderRadius: "6px" }}
          >
            <option value="">Select Misdemeanor</option>
            <option>Missed Meetings</option>
            <option>Incomplete Paperwork</option>
            <option>Budget Violations</option>
            <option>Low Attendance</option>
            <option>Code of Conduct Violation</option>
          </select>

          <input
            type="text"
            placeholder="Optional notes..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            style={{ padding: "8px", borderRadius: "6px" }}
          />

          <button
            onClick={() => {
              if (!selectedClub || !selectedMisdemeanor) {
                alert("Please select a club and a misdemeanor.");
                return;
              }

              const newEntry = {
                id: Date.now(),
                club: selectedClub,
                misdemeanor: selectedMisdemeanor,
                notes,
                dateAdded: new Date().toLocaleDateString(),
              };

              setWatchlist([...watchlist, newEntry]);

              // reset form
              setSelectedClub("");
              setSelectedMisdemeanor("");
              setNotes("");
            }}
            style={{
              background: "#4a90e2",
              color: "white",
              border: "none",
              padding: "8px 14px",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            Add to Watchlist
          </button>
        </div>

        {/* Watchlist Cards */}
        {watchlist.length > 0 ? (
          watchlist.map((entry) => (
            <div
              key={entry.id}
              style={{
                background: "#ffffff",
                padding: "16px",
                borderRadius: "10px",
                marginBottom: "15px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <strong>{entry.club}</strong>
                <div style={{ fontSize: "14px", color: "#555" }}>
                  {entry.misdemeanor}
                </div>
                {entry.notes && (
                  <div style={{ fontSize: "13px", color: "#777" }}>
                    Notes: {entry.notes}
                  </div>
                )}
              </div>

              <div>
                <span style={{ marginRight: "15px", fontSize: "13px" }}>
                  {entry.dateAdded}
                </span>
                <button
                  onClick={() =>
                    setWatchlist(watchlist.filter((w) => w.id !== entry.id))
                  }
                  style={{
                    background: "#d9534f",
                    color: "white",
                    border: "none",
                    padding: "6px 10px",
                    borderRadius: "6px",
                    cursor: "pointer",
                  }}
                >
                  Remove
                </button>
              </div>
            </div>
          ))
        ) : (
          <p style={{ textAlign: "center", color: "#666" }}>
            No clubs currently on watchlist.
          </p>
        )}
      </>
    )}
            {/* Teacher Availability - NOW WITH USER PROP */}
            {page === "teacher" && <TeacherAvailability user={user} />}
          </>
        )}
        {portal === "student" && (
          <>
            {page === "morning" &&
              (loadingMorning ? (
                <p></p>
              ) : (
                <ClubGrid title="Morning Clubs" clubs={morningClubs} />
              ))
            }

            {page === "wednesday" &&
              (loadingWednesday ? (
                <p></p>
              ) : (
                <ClubGrid title="Wednesday Clubs" clubs={wednesdayClubs} />
              ))
            }
          </>
        )}
      </div>
    </div>
  );
}

export default App;
