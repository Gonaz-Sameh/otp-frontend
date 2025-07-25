import axios from 'axios';

//const API_BASE_URL = 'http://ec2-13-217-109-77.compute-1.amazonaws.com/otp-api/api/v1';
const API_BASE_URL = 'https://otp-apis.ahmed-sameh.me/api/v1';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
    }
    return Promise.reject(error);
  }
);

// OTP API functions
export const otpApi = {
  // Request WhatsApp OTP
  requestWhatsappOtp: async (organizationId, number) => {
    const response = await api.post(`/otp/request_otp/whatsapp?organizationId=${organizationId}`, {
      number
    });
    return response.data;
  },

  // Request Email OTP
  requestEmailOtp: async (organizationId, email) => {
    const response = await api.post(`/otp/request_otp/email?organizationId=${organizationId}`, {
      email
    });
    return response.data;
  },

  // Verify OTP
  verifyOtp: async (otpId, value) => {
    const response = await api.post('/otp/verify', {
      otpId,
      value
    });
    return response.data;
  },

  // Verify OTP with organizationId in query
  verifyOtpWithOrg: async (otpId, value, organizationId) => {
    const response = await api.post(`/otp/verify?organizationId=${organizationId}`, {
      otpId,
      value
    });
    return response.data;
  },

  // Get OTP status
  getOtpStatus: async (otpId) => {
    const response = await api.get(`/otp/${otpId}/status`);
    return response.data;
  },

  // Get channel lock status
  getChannelLockStatus: async (organizationId, channel, identifier) => {
    const response = await api.get('/otp/channel/status', {
      params: { organizationId, channel, identifier }
    });
    return response.data;
  },

  // Reset channel lock
  resetChannelLock: async (organizationId, channel, identifier) => {
    const response = await api.post('/otp/channel/reset', {
      organizationId,
      channel,
      identifier
    });
    return response.data;
  }
};

export default api; 