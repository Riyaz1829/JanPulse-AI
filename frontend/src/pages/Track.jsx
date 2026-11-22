
import { useState } from 'react'
import { Link } from 'react-router-dom'

function Track() {
  const [complaintId, setComplaintId] = useState('')
  const [complaint, setComplaint] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const trackComplaint = async (event) => {
    event.preventDefault()

    if (!complaintId.trim()) {
      setError('Please enter your complaint ID.')
      return
    }

    setLoading(true)
    setError('')
    setComplaint(null)

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/complaints/${encodeURIComponent(complaintId.trim())}`
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.detail || 'Unable to find complaint.')
      }

      setComplaint(data.complaint)
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const severityClass = (severity) => {
    if (severity === 'Critical') return 'severity-critical'
    if (severity === 'High') return 'severity-high'
    if (severity === 'Medium') return 'severity-medium'
    return 'severity-low'
  }

  return (
    <div className="track-page">
      <header className="report-header">
        <Link to="/" className="track-logo">
          JanPulse <span>AI</span>
        </Link>

        <Link to="/" className="track-home-link">
          ← Back to Home
        </Link>
      </header>

      <main className="track-container">
        <section className="track-heading">
          <p>COMPLAINT MANAGEMENT</p>
          <h1>Track Your Complaint</h1>
          <span>
            Stay informed about your civic complaint.
            Enter your unique complaint ID to view its latest status.
          </span>
        </section>

        <form className="track-form" onSubmit={trackComplaint}>
          <label htmlFor="complaintId">Complaint ID</label>

          <input
            id="complaintId"
            type="text"
            placeholder="Example: JP-20261122-7A649D60"
            value={complaintId}
            onChange={(event) => setComplaintId(event.target.value)}
          />

          <button type="submit" disabled={loading}>
            {loading ? 'Searching...' : 'Track Complaint →'}
          </button>

          <small>
            Enter the complaint ID received after submitting your report.
          </small>
        </form>

        {error && (
          <div className="track-error" role="alert">
            {error}
          </div>
        )}

        {complaint && (
          <section className="track-result">
            <div className="track-result-header">
              <div>
                <p>COMPLAINT DETAILS</p>
                <h2>{complaint.complaint_id}</h2>
              </div>

              <span className="track-status">
                {complaint.status}
              </span>
            </div>

            <div className="track-details">
              <div>
                <small>Category</small>
                <strong>{complaint.category}</strong>
              </div>

              <div>
                <small>Location</small>
                <strong>{complaint.location}</strong>
              </div>

              <div>
                <small>Severity</small>
                <strong className={severityClass(complaint.severity)}>
                  {complaint.severity || 'Not assessed'}
                </strong>
              </div>

              <div>
                <small>Recommended Department</small>
                <strong>
                  {complaint.recommended_department || 'Not assigned'}
                </strong>
              </div>
            </div>

            <div className="track-description">
              <h3>Complaint Description</h3>
              <p>{complaint.description}</p>
            </div>

            {complaint.created_at && (
              <div className="track-date">
                <small>Submitted on</small>
                <p>
                  {new Date(complaint.created_at).toLocaleString()}
                </p>
              </div>
            )}

            {complaint.ai_analysis && (
              <div className="track-ai">
                <h3>JanPulse AI Assessment</h3>
                <p>
                  <strong>Detected issue:</strong>{' '}
                  {complaint.ai_analysis.issue_detected || 'Not available'}
                </p>
                <p>
                  <strong>Public safety risk:</strong>{' '}
                  {complaint.ai_analysis.public_risk || 'Not assessed'}
                </p>
                <p>
                  <strong>AI confidence:</strong>{' '}
                  {complaint.ai_analysis.confidence || 'Not available'}
                </p>
                <p className="track-disclaimer">
                  AI assessments are recommendations.
                  Final decisions require human verification.
                </p>
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  )
}

export default Track
