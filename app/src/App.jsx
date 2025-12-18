import { useState } from "react";
import "./App.css";
import ClubGrid from "./components/ClubGrid";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [page, setPage] = useState("morning"); // default admin page
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [portal, setPortal] = useState("admin"); // "admin" or "student"

  const morningClubs = [
  {
    name: "Robotics Club",
    mission: "Build, program, and compete with robots.",
    members: 18,
    image: "/images/robotics.jpg",
  },
  {
    name: "Creative Writing",
    mission: "Explore storytelling, poetry, and prose.",
    members: 12,
    image: "/images/creative-writing.jpg",
  },
  {
    name: "Chess Club",
    mission: "Compete with others in a supportive environment",
    members: 4,
    image: "/images/chess.jpg",
  },
];

const wednesdayClubs = [
  {
    name: "Drama Club",
    mission: "Acting, directing, and stage performance.",
    members: 15,
    image: "/images/drama.jpg",
  },
  {
    name: "Art Club",
    mission: "Drawing, painting, and creative expression.",
    members: 10,
    image: "/images/art.jpeg",
  },
];


  // =====================
  // LOGIN PAGE
  // =====================
  if (!loggedIn) {
    return (
      <div className="page">
        <div className="card-ui">
          <h1>BCA Club Dashboard</h1>
          <p className="subtitle">Please sign in to continue.</p>

          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button onClick={() => setLoggedIn(true)}>Sign in</button>
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
            onClick={() => setPortal("student")}
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

        {/* Portal Title */}
        <div className="portal-title">
          {portal === "admin" ? "Admin Portal" : "Student Portal"}
        </div>

        {/* =====================
            ADMIN PORTAL CONTENT
        ===================== */}
        {portal === "admin" && (
          <>
            {/* Morning Club Management */}
            {page === "morning" && (
              <>
                <div className="page-title">Morning Club Management</div>

                <div className="controls">
                  <div className="filter-box">
                    <strong>Filter by:</strong>
                    <label>Category:</label>
                    <select>
                      <option>-- Select --</option>
                      <option>STEM</option>
                      <option>Humanities</option>
                      <option>Art</option>
                      <option>Other</option>
                    </select>

                    <label>Status:</label>
                    <select>
                      <option>-- Select --</option>
                      <option>Approved</option>
                      <option>Pending</option>
                      <option>Rejected</option>
                    </select>

                    <br /><br />
                    <button>Clear</button>
                    <button>Submit</button>
                  </div>

                  <div className="tools">
                    <strong>Other Tools:</strong><br />
                    <select>
                      <option>-- Select --</option>
                      <option>STEM</option>
                      <option>Humanities</option>
                      <option>Art</option>
                      <option>Other</option>
                    </select><br />
                    <select
                      onChange={(e) => {
                        if (e.target.value === "ai-merge") {
                          setPage("morning-ai-merge");
                        }
                      }}
                    >
                      <option value="">-- Select --</option>
                      <option value="add">Add Club</option>
                      <option value="ai-merge">AI Merge</option>
                      <option value="teacher">Add Teacher</option>
                      <option value="archive">Archive Clubs</option>
                    </select>
                  </div>
                </div>

                <div className="status-update">
                  Update selected <strong>STATUS</strong> TO:
                  <select>
                    <option>-- Select --</option>
                    <option>Approved</option>
                    <option>Pending</option>
                    <option>Rejected</option>
                  </select>
                  <button>Submit</button>
                </div>

                <table>
                  <thead>
                    <tr>
                      <th></th>
                      <th>Club</th>
                      <th>Leader Email</th>
                      <th>Category</th>
                      <th>Advisor</th>
                      <th>Meeting Place</th>
                      <th>Day</th>
                      <th>Time</th>
                      <th>5 members</th>
                      <th>Status</th>
                      <th>View/Edit</th>
                      <th>Merge?</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      {
                        club: "Baking Club",
                        email: "anygup26@bergen.org",
                        category: "Other",
                        advisor: "Dr. Carter",
                        place: "Room 138A",
                        day: "Thursday",
                        time: "7:30",
                        members: "Yes",
                        status: "Pending",
                      },
                      {
                        club: "Calculus Club",
                        email: "stegeo26@bergen.org",
                        category: "STEM",
                        advisor: "Mr. Isecke",
                        place: "Room 138B",
                        day: "Monday",
                        time: "7:30",
                        members: "No",
                        status: "Pending",
                      },
                      {
                        club: "Creative Writing Club",
                        email: "brofol@bergen.org",
                        category: "Humanities",
                        advisor: "Mr. Respass",
                        place: "Room 136",
                        day: "Tuesday",
                        time: "7:35",
                        members: "Yes",
                        status: "Approved",
                      },
                    ].map((club, i) => (
                      <tr key={i}>
                        <td><div className="checkbox"></div></td>
                        <td>{club.club}</td>
                        <td>{club.email}</td>
                        <td>{club.category}</td>
                        <td>{club.advisor}</td>
                        <td>{club.place}</td>
                        <td>{club.day}</td>
                        <td>{club.time}</td>
                        <td>{club.members}</td>
                        <td>{club.status}</td>
                        <td><button>Edit</button></td>
                        <td>No</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            )}
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
                  <button>Send Email Suggesting Selected Clubs Merge</button>

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

                {[
                  {
                    reason:
                      "These clubs focus on hands-on STEM problem solving and competitive math-based challenges.",
                    clubs: [
                      { name: "Calculus Club", members: 8 },
                      { name: "Math Competition Club", members: 6 },
                      { name: "Problem Solvers Club", members: 5 },
                    ],
                  },
                  {
                    reason:
                      "These clubs center around creative writing, storytelling, and literary discussion.",
                    clubs: [
                      { name: "Creative Writing Club", members: 7 },
                      { name: "Poetry Club", members: 4 },
                    ],
                  },
                  {
                    reason:
                      "These clubs emphasize culinary creativity and baking fundamentals.",
                    clubs: [
                      { name: "Baking Club", members: 5 },
                      { name: "Cooking Club", members: 9 },
                    ],
                  },
                ].map((group, i) => (
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
                        fontWeight: "600",
                        marginBottom: "15px",
                        color: "#1e3a5f",
                      }}
                    >
                      AI Reason for grouping:
                      <div style={{ fontWeight: "400", marginTop: "6px" }}>
                        {group.reason}
                      </div>
                    </div>

                    {group.clubs.map((club, idx) => (
                      <div
                      key={idx}
                      style={{
                        display: "flex",
                        alignItems: "center", // 
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

                      <span className="pill">Members: {club.members}</span>
                    </div>

                    ))}
                  </div>
                ))}
              </>
            )}

            {/* Wednesday Club Management */}
            {page === "wednesday" && (
              <>
                <div className="page-title">Wednesday Club Management</div>

                <div className="controls">
                  <div className="filter-box">
                    <strong>Filter by:</strong>
                    <label>Category:</label>
                    <select>
                      <option>-- Select --</option>
                      <option>STEM</option>
                      <option>Humanities</option>
                      <option>Art</option>
                      <option>Other</option>
                    </select>

                    <label>Status:</label>
                    <select>
                      <option>-- Select --</option>
                      <option>Approved</option>
                      <option>Pending</option>
                      <option>Rejected</option>
                    </select>

                    <label>Advisor:</label>
                    <select>
                      <option></option>
                    </select>

                    <br /><br />
                    <button>Clear</button>
                    <button>Submit</button>
                  </div>

                  <div className="tools">
                    <strong>Other Tools:</strong><br />
                    <select>
                      <option>-- Select --</option>
                      <option>Add Club</option>
                      <option>Archive Clubs</option>
                      <option>Add Teacher</option>
                      <option>Reset Availability</option>
                    </select>
                  </div>
                </div>

                <div className="status-update">
                  Update selected <strong>STATUS</strong> TO:
                  <select>
                    <option>-- Select --</option>
                    <option>Approved</option>
                    <option>Pending</option>
                    <option>Rejected</option>
                  </select>
                  <button>Submit</button>
                </div>

                <table>
                  <thead>
                    <tr>
                      <th></th>
                      <th>Club</th>
                      <th>Leader Email</th>
                      <th>Category</th>
                      <th>Advisor</th>
                      <th>Meeting Place</th>
                      <th>5 members</th>
                      <th>Requested Advisor</th>
                      <th>Status</th>
                      <th>View/Edit</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      {
                        club: "Drawing Club",
                        email: "anygup26@bergen.org",
                        category: "Art",
                        advisor: "Mr. Sen",
                        place: "Room 138B",
                        members: "Yes",
                        requested: "Mr. Sen",
                        status: "Approved",
                      },
                      {
                        club: "Chess Club",
                        email: "chessclubleader@bergen.org",
                        category: "STEM",
                        advisor: "Ms. Lee",
                        place: "Room 101",
                        members: "Yes",
                        requested: "Ms. Lee",
                        status: "Pending",
                      },
                      {
                        club: "Drama Club",
                        email: "dramaleader@bergen.org",
                        category: "Art",
                        advisor: "Mr. Brown",
                        place: "Room 202",
                        members: "No",
                        requested: "Mr. Brown",
                        status: "Approved",
                      },
                    ].map((club, i) => (
                      <tr key={i}>
                        <td><div className="checkbox"></div></td>
                        <td>{club.club}</td>
                        <td>{club.email}</td>
                        <td>{club.category}</td>
                        <td>{club.advisor}</td>
                        <td>{club.place}</td>
                        <td>{club.members}</td>
                        <td>{club.requested}</td>
                        <td>{club.status}</td>
                        <td><button>Edit</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            )}
            {/* Teacher Availability */}
            {page === "teacher" && (
              <>
                <div className="page-title">Wednesday Club Teacher Availability</div>

                <div className="controls">
                  <div className="filter-box">
                    <strong>Filter by:</strong>
                    <label>Available:</label>
                    <select>
                      <option>-- Select --</option>
                      <option>Yes</option>
                      <option>No</option>
                    </select>
                    <label>Assigned:</label>
                    <select>
                      <option>-- Select --</option>
                      <option>Yes</option>
                      <option>No</option>
                    </select>
                    <br />
                    <button>Clear</button>
                    <button>Submit</button>
                  </div>

                  <div className="tools">
                    <strong>Other Tools:</strong>
                    <br />
                    <select>
                      <option>-- Select --</option>
                      <option>Add Club</option>
                      <option>Archive Clubs</option>
                      <option>Add Teacher</option>
                      <option>Reset Availability</option>
                    </select>
                  </div>
                </div>

                <button style={{ marginBottom: "1rem" }}>
                  Send Email to Teachers Who Haven’t Responded
                </button>

                <table>
                  <thead>
                    <tr>
                      <th></th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Rm #</th>
                      <th>Available</th>
                      <th>Department</th>
                      <th>Assigned to Club</th>
                      <th>View/Edit</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      {
                        name: "Mr. John Smith",
                        email: "johsmi@bergen.org",
                        room: "101",
                        available: "Yes",
                        department: "Math",
                        assigned: "Robotics Club",
                      },
                      {
                        name: "Ms. Anna Lee",
                        email: "annlee@bergen.org",
                        room: "202",
                        available: "No",
                        department: "Science",
                        assigned: "",
                      },
                      {
                        name: "Mr. Michael Brown",
                        email: "micbro@bergen.org",
                        room: "264",
                        available: "Yes",
                        department: "English",
                        assigned: "Cooking Club",
                      },
                      {
                        name: "Ms. Sophia Garcia",
                        email: "sopgar@bergen.org",
                        room: "28",
                        available: "Yes",
                        department: "History",
                        assigned: "",
                      },
                      {
                        name: "Mr. David Johnson",
                        email: "davjoh@bergen.org",
                        room: "204",
                        available: "No",
                        department: "Art",
                        assigned: "Knitting Club",
                      },
                    ].map((teacher, i) => (
                      <tr key={i}>
                        <td>🗑️</td>
                        <td>{teacher.name}</td>
                        <td>{teacher.email}</td>
                        <td>{teacher.room}</td>
                        <td>{teacher.available}</td>
                        <td>{teacher.department}</td>
                        <td>
                          <select>
                            <option>{teacher.assigned}</option>
                            <option>Chess Club</option>
                            <option>Drama Club</option>
                            <option>Photography Club</option>
                            <option>Math Club</option>
                          </select>
                        </td>
                        <td>
                          <button>View/Edit</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            )}
          </>
        )}
        {portal === "student" && (
          <>
            {page === "morning" && (
              <ClubGrid title="Morning Clubs" clubs={morningClubs} />
            )}

            {page === "wednesday" && (
              <ClubGrid title="Wednesday Clubs" clubs={wednesdayClubs} />
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default App;
