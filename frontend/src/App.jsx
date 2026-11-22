
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import './App.css'
import Report from './pages/Report'
import Track from './pages/Track'

function Home() {
  return (
    <div className="app">
      <header className="navbar">
        <h2>JanPulse <span>AI</span></h2>

        <nav className="nav-links">
          <a href="#home">Home</a>
          <a href="#how-it-works">How It Works</a>
          <Link to="/track">Track Complaint</Link>
          <a href="#language">English / తెలుగు</a>
        </nav>

        <button>Login</button>
      </header>

      <main>
        <section className="hero" id="home">
          <p className="tagline">AI-POWERED CIVIC INTELLIGENCE</p>

          <h1>
            Your Voice.<br />
            Your City.<br />
            <span>Your Change.</span>
          </h1>

          <p className="description">
            Report civic issues, track complaints and
            make your community better with AI.
          </p>

          <Link to="/report" className="report-btn">
            Report an Issue →
          </Link>
        </section>

        <section className="services" id="how-it-works">
          <div className="section-heading">
            <p>JANPULSE SERVICES</p>
            <h2>How can we help you today?</h2>
            <span>
              Access civic services and stay informed
              about your community.
            </span>
          </div>

          <div className="service-grid">
            <div className="service-card">
              <h3>Report an Issue</h3>
              <p>
                Report potholes, garbage, water leakage
                and other civic problems.
              </p>
              <Link to="/report" className="service-link">
                Submit Complaint →
              </Link>
            </div>

            <div className="service-card" id="track">
              <h3>Track Complaint</h3>
              <p>
                Check the latest status of your
                previously submitted complaint.
              </p>
              <Link to="/track" className="service-link">
                Track Status →
              </Link>
            </div>

            <div className="service-card">
              <h3>Community Issues</h3>
              <p>
                Explore reported infrastructure
                problems in your community.
              </p>
              <button>Explore Issues →</button>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/report" element={<Report />} />
        <Route path="/track" element={<Track />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
