import axios from 'axios'

// timeout
const requestTimeOut = 30 * 1000
const success = 200

// Global request object
const service = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: requestTimeOut,
  responseType: 'json',
  validateStatus(status) {
    return status === success
  },
})

// Request interceptor
service.interceptors.request.use(
  (config) => {
    let _config = config
    // Set request headers
    //use AWS Cognito to get the token and set it in the header for authentication
    // if (token) {
    // _config.headers['Authorization'] = `Bearer ${token}`
    // }
    return _config
  },
  (error) => {
    console.error('Request error:', error)
    return Promise.reject(error)
  },
)

// Response interceptor
service.interceptors.response.use(
  (response) => {
    debugger
    const result = response.data
    return result
  },
  (error) => {
    console.error('Response error:', error)

    if (error.toString().indexOf('Error: timeout') !== -1) {
      console.error('Network timeout, please try again later')
    }

    if (error.toString().indexOf('Error: Network Error') !== -1) {
      console.error('Network error, please try again later')
    }

    if (error.response) {
      switch (error.response.status) {
        case 400:
          console.error('Bad request')
          break
        case 403:
          console.error('Access denied')
          break
        case 404:
          console.error('Resource not found')
          break
        case 500:
          console.error('Server error')
          break
        default:
          console.error('Network error, please try again later')
          break
      }
    }

    return Promise.reject(error)
  },
)

// Convert object to URL parameters format
function tansParams(params) {
  let result = ''
  Object.keys(params).forEach((key) => {
    if (params[key] !== undefined && params[key] !== null) {
      result += encodeURIComponent(key) + '=' + encodeURIComponent(params[key]) + '&'
    }
  })
  return result.slice(0, -1) // Remove trailing '&'
}

// RESTful API request wrapper
const request = {
  get(url, params) {
    return service({
      method: 'get',
      url,
      params,
    })
  },

  post(url, data) {
    return service.post(url, data, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
  },

  postForm(url, data) {
    return service.post(url, data, {
      transformRequest: [
        (data) => {
          return tansParams(data)
        },
      ],
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
  },

  put(url, data) {
    return service.put(url, data, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
  },

  delete(url, params) {
    return service.delete(url, { params })
  },

  // File upload
  upload(url, formData) {
    return service.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 120 * 1000,
    })
  },
}

export default request
