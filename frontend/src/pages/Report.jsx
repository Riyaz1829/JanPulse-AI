
import { useState } from 'react'

function Report() {
  const [selectedImage, setSelectedImage] = useState(null)
  const [previewUrl, setPreviewUrl] = useState('')
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [apiError, setApiError] = useState('')
  const [aiAnalysis, setAiAnalysis] = useState(null)

  const [formData, setFormData] = useState({
    category: '',
    location: '',
    description: '',
  })

  function clearPreview() {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
    }
    setPreviewUrl('')
    setSelectedImage(null)
  }

  function handleInputChange(event) {
    const { name, value } = event.target

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }))

    setErrors((previous) => ({
      ...previous,
      [name]: '',
    }))

    setApiError('')
    setSuccessMessage('')
    setAiAnalysis(null)
  }

  function handleImageChange(event) {
    const file = event.target.files[0]

    setAiAnalysis(null)
    setApiError('')
    setSuccessMessage('')

    if (!file) {
      clearPreview()
      return
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']

    if (!allowedTypes.includes(file.type)) {
      alert('Please select a JPG, PNG or WEBP image.')
      event.target.value = ''
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Image size must be less than 5 MB.')
      event.target.value = ''
      return
    }

    clearPreview()

    setSelectedImage(file)
    setPreviewUrl(URL.createObjectURL(file))

    setErrors((previous) => ({
      ...previous,
      photo: '',
    }))
  }

  async function handleSubmit(event) {
    event.preventDefault()

    const newErrors = {}

    if (!formData.category) {
      newErrors.category = 'Please select an issue category.'
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Please enter the issue location.'
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Please describe the issue.'
    }

    if (!selectedImage) {
      newErrors.photo = 'Please upload an issue photograph.'
    }

    setErrors(newErrors)
    setApiError('')
    setSuccessMessage('')
    setAiAnalysis(null)

    if (Object.keys(newErrors).length > 0) {
      return
    }

    const complaintData = new FormData()

    complaintData.append('category', formData.category)
    complaintData.append('location', formData.location.trim())
    complaintData.append('description', formData.description.trim())
    complaintData.append('photo', selectedImage)

    try {
      setLoading(true)

      const response = await fetch(
        'http://127.0.0.1:8000/api/complaints/submit',
        {
          method: 'POST',
          body: complaintData,
        }
      )

      const result = await response.json()

      if (!response.ok) {
        throw new Error(
          result.detail || 'Unable to submit your complaint.'
        )
      }

      const analysis = result.ai_analysis

      if (!analysis || typeof analysis.is_civic_issue !== 'boolean') {
        throw new Error('AI returned an invalid image validation response.')
      }

      setAiAnalysis(analysis)

      if (analysis.is_civic_issue) {
        setSuccessMessage(result.message)

        setFormData({
          category: '',
          location: '',
          description: '',
        })

        clearPreview()

        const photoInput = document.getElementById('photo')

        if (photoInput) {
          photoInput.value = ''
        }
      } else {
        setSuccessMessage('')
      }

    } catch (error) {
      console.error('Complaint submission error:', error)

      setApiError(
        error.message || 'Unable to connect to the server.'
      )
    } finally {
      setLoading(false)
    }
  }

  const severityColors = {
    Low: '#16A34A',
    Medium: '#F59E0B',
    High: '#EA580C',
    Critical: '#DC2626',
  }

  const requiresHumanReview = aiAnalysis && (
    aiAnalysis.requires_human_review === true ||
    ['High', 'Critical'].includes(aiAnalysis.severity)
  )

  return (
    <div className="report-page">
      <header className="report-header">
        <h2>JanPulse <span>AI</span></h2>
        <a href="/">Back to Home</a>
      </header>

      <main className="report-container">
        <div className="report-heading">
          <p>CITIZEN GRIEVANCE PORTAL</p>
          <h1>Report a Civic Issue</h1>
          <span>
            Help improve your community by reporting
            infrastructure and public service issues.
          </span>
        </div>

        <form
          className="complaint-form"
          onSubmit={handleSubmit}
          noValidate
        >
          <div className="form-group">
            <label htmlFor="category">Issue Category</label>

            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
            >
              <option value="">Select an issue category</option>
              <option value="roads">Roads and Potholes</option>
              <option value="garbage">Garbage and Sanitation</option>
              <option value="water">Water Supply and Leakage</option>
              <option value="electricity">Streetlights and Electricity</option>
              <option value="drainage">Drainage and Sewage</option>
              <option value="other">Other Civic Issue</option>
            </select>

            {errors.category && (
              <small className="error-text">{errors.category}</small>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="location">Issue Location</label>

            <input
              id="location"
              name="location"
              type="text"
              placeholder="Enter area, street or landmark"
              value={formData.location}
              onChange={handleInputChange}
            />

            {errors.location && (
              <small className="error-text">{errors.location}</small>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="description">Describe the Issue</label>

            <textarea
              id="description"
              name="description"
              rows="5"
              placeholder="Explain the problem and how it affects your community..."
              value={formData.description}
              onChange={handleInputChange}
            />

            {errors.description && (
              <small className="error-text">{errors.description}</small>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="photo">Upload Issue Photograph</label>

            <input
              id="photo"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleImageChange}
            />

            <small>JPG, PNG or WEBP. Maximum size: 5 MB.</small>

            {errors.photo && (
              <small className="error-text">{errors.photo}</small>
            )}

            {previewUrl && (
              <div className="image-preview">
                <img src={previewUrl} alt="Selected civic issue" />
                <p>{selectedImage.name}</p>
              </div>
            )}
          </div>

          <button
            type="submit"
            className="complaint-submit"
            disabled={loading}
          >
            {loading ? 'Validating and Analysing...' : 'Submit Complaint'}
          </button>

          {apiError && (
            <p className="error-message" role="alert">
              {apiError}
            </p>
          )}
        </form>

        {aiAnalysis && !aiAnalysis.is_civic_issue && (
          <section
            role="alert"
            style={{
              marginTop: '24px',
              padding: '22px',
              background: '#FEF3C7',
              borderLeft: '4px solid #F59E0B',
              borderRadius: '10px',
            }}
          >
            <h2 style={{ color: '#92400E', fontSize: '19px' }}>
              Photograph Not Accepted
            </h2>

            <p style={{ color: '#78350F', marginTop: '10px' }}>
              {aiAnalysis.image_validation_message ||
                'This photograph could not be verified as a civic issue.'}
            </p>

            <p style={{ color: '#78350F', marginTop: '10px' }}>
              Please upload a clear photograph of a pothole, garbage
              accumulation, drainage blockage or another civic issue.
            </p>
          </section>
        )}

        {aiAnalysis && aiAnalysis.is_civic_issue && (
          <>
            {successMessage && (
              <p className="success-message" role="status">
                {successMessage}
              </p>
            )}

            <section
              className="ai-analysis-panel"
              aria-labelledby="analysis-heading"
              style={{
                marginTop: '24px',
                padding: '24px',
                background: '#E6F4F2',
                borderLeft: '4px solid #2A9D8F',
                borderRadius: '10px',
              }}
            >
              <p style={{
                color: '#1F7A70',
                fontWeight: 700,
                fontSize: '13px',
                letterSpacing: '1px',
              }}>
                JANPULSE AI ANALYSIS
              </p>

              <h2
                id="analysis-heading"
                style={{
                  color: '#0F2A4A',
                  margin: '8px 0 20px',
                  fontSize: '22px',
                }}
              >
                Complaint Assessment
              </h2>

              <div style={{ marginBottom: '18px' }}>
                <strong>Detected Issue</strong>
                <p>{aiAnalysis.issue_detected || 'Not available'}</p>
              </div>

              <div style={{ marginBottom: '18px' }}>
                <strong>Issue Category</strong>
                <p>{aiAnalysis.category || 'Not available'}</p>
              </div>

              <div style={{ marginBottom: '18px' }}>
                <strong>AI-Generated Description</strong>
                <p>{aiAnalysis.complaint_description || 'Not available'}</p>
              </div>

              <div style={{ marginBottom: '18px' }}>
                <strong>Severity</strong>
                <p style={{
                  color: severityColors[aiAnalysis.severity] || '#1E293B',
                  fontWeight: 700,
                }}>
                  {aiAnalysis.severity || 'Not available'}
                </p>
              </div>

              <div style={{ marginBottom: '18px' }}>
                <strong>Public Safety Risk</strong>
                <p style={{ fontWeight: 600 }}>
                  {aiAnalysis.public_risk || 'Not available'}
                </p>
                <p>{aiAnalysis.risk_explanation || ''}</p>
              </div>

              <div style={{ marginBottom: '18px' }}>
                <strong>Recommended Department</strong>
                <p>
                  {aiAnalysis.recommended_department || 'Not available'}
                </p>
              </div>

              <div style={{ marginBottom: '18px' }}>
                <strong>AI Confidence</strong>
                <p>{aiAnalysis.confidence || 'Not available'}</p>
              </div>

              <div>
                <strong>Human Review</strong>
                <p style={{
                  color: requiresHumanReview ? '#92400E' : '#166534',
                  fontWeight: 600,
                }}>
                  {requiresHumanReview
                    ? 'Required — Administrator review needed'
                    : 'Not flagged by AI'}
                </p>
              </div>

              <p style={{
                marginTop: '20px',
                paddingTop: '14px',
                borderTop: '1px solid #C5E4DF',
                color: '#64748B',
                fontSize: '12px',
              }}>
                AI-generated assessment is a recommendation.
                Final decisions require human verification.
              </p>
            </section>
          </>
        )}

        <p className="ai-notice">
          AI assistance will help analyse and classify your complaint.
        </p>
      </main>
    </div>
  )
}

export default Report
