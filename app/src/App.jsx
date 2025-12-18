import { useState } from 'react'
import './App.css'

function App() {
  const [loggedIn, setLoggedIn] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  // Login Page UI (HTML/CSS + JS Functionality - uses no backend)
  // Works with all username/password combinations
    if (!loggedIn) {
    return (
      <div className="page">
        <div className="card-ui">
          <h1>BCA Club Dashboard</h1>
          <p className="subtitle">Please sign in to continue.</p>

          <input
            type="text"
            placeholder="Email"
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

  return (
    <div className="page">
      <div className="card-ui">
        <h1>Hello World</h1>
        <p className="subtitle">You’re logged in :D</p>
      </div>
    </div>
  )
}

  // when login button is clicked, setLoggedIn is set to true, 
  // advances to next page

  // Goes to the next page (currently same for both student & admin)

export default App
