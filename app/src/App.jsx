import { useState } from 'react'
import './App.css'

function App() {
  const [loggedIn, setLoggedIn] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  // LOGIN PAGE
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

          <button onClick={() => setLoggedIn(true)}>
            Sign in
          </button>
        </div>
      </div>
    )
  }

  // ADMIN PORTAL PAGE
  return (
    <div className="container">
      {/* Sidebar */}
      <div className="sidebar">
        <a href="#">Morning Club Management</a>
        <a href="#">Wednesday Club Management</a>
        <a href="#">Teacher Availability</a>
      </div>

      {/* Main content */}
      <div className="main">
        <div className="portal-title">Admin Portal</div>
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
      </div>
    </div>
  )
}

export default App
