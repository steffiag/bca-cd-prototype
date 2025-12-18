import { useState } from "react";
import "./App.css";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [page, setPage] = useState("morning"); // default admin page
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [portal, setPortal] = useState("admin"); // "admin" or "student"

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
      {/* Sidebar */}
      <div className="sidebar">
        {portal === "admin" ? (
          <>
            <a
              href="#"
              onClick={() => setPage("morning")}
              className={page === "morning" ? "active" : ""}
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
        ) : (
          <></>
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
              background: portal === "admin" ? "#6366f1" : "#9e9e9e",
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
              background: portal === "student" ? "#6366f1" : "#9e9e9e",
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
                    <select>
                      <option>Add Club</option>
                      <option>AI Merge</option>
                      <option>Add Teacher</option>
                      <option>Archive Clubs</option>
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
                    <tr>
                      <td><div className="checkbox"></div></td>
                      <td>Baking Club</td>
                      <td>anygup26@bergen.org</td>
                      <td>Other</td>
                      <td>Dr. Carter</td>
                      <td>Room 138A</td>
                      <td>Thursday</td>
                      <td>7:30</td>
                      <td>Yes</td>
                      <td>Pending</td>
                      <td><button>Edit</button></td>
                      <td>No</td>
                    </tr>
                  </tbody>
                </table>
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

        {/* =====================
            STUDENT PORTAL CONTENT
        ===================== */}
        {portal === "student" && (
          <div style={{ textAlign: "center", marginTop: "50px", fontSize: "24px" }}>
            Welcome to the Student Portal :D
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
