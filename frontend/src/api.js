import axios from 'axios'

const API_BASE = 'http://localhost:8000'

// Shorten a long URL
export const shortenURL = async (originalUrl) => {
  const response = await axios.post(`${API_BASE}/shorten`, {
    original_url: originalUrl
  })
  return response.data
}

// Get analytics for a short code
export const getAnalytics = async (shortCode) => {
  const response = await axios.get(`${API_BASE}/analytics/${shortCode}`)
  return response.data
}
