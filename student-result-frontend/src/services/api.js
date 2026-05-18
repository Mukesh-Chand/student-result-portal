import axios from 'axios'

const apiClient = axios.create({
  baseURL: 'https://student-result-portal-7dqc.onrender.com',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Response interceptor for global error normalisation
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Server responded with a non-2xx status
      const message =
        error.response.data?.message ||
        error.response.data?.error ||
        `Server error: ${error.response.status}`
      return Promise.reject(new Error(message))
    } else if (error.request) {
      // Request made but no response received
      return Promise.reject(
        new Error('Unable to reach the server. Please check your connection.')
      )
    } else {
      return Promise.reject(new Error(error.message || 'An unexpected error occurred.'))
    }
  }
)

/**
 * Fetch student result from the backend.
 * @param {string} rollNumber
 * @param {number|string} semester
 * @returns {Promise<Object>} result data
 */
export async function fetchResult(rollNumber, semester) {
  const endpoint =
    semester === 'REPORT'
      ? `/api/results/report/${rollNumber}`
      : `/api/results?rollNumber=${rollNumber}&semester=${semester}`

  const response = await apiClient.get(endpoint)

  return response.data
}

export default apiClient
