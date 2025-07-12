import axios from 'axios';

// Base API configuration - replace with your actual backend URL in production
const BASE_URL = 'http://localhost:5000/api';

// Flag to control whether to use mock data or real backend
// Set this to false when your Flask backend is ready
const USE_MOCK_DATA = false;

// Create an axios instance with common configuration
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Helper for handling errors
const handleError = (error) => {
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    console.error('API Response Error:', error.response.data);
    return {
      error: true,
      message: error.response.data.message || 'Server error',
      status: error.response.status
    };
  } else if (error.request) {
    // The request was made but no response was received
    console.error('API Request Error:', error.request);
    return {
      error: true,
      message: 'No response from server. Please check your connection.',
      status: 0
    };
  } else {
    // Something happened in setting up the request that triggered an Error
    console.error('API Setup Error:', error.message);
    return {
      error: true,
      message: 'Request configuration error',
      status: 0
    };
  }
};

/**
 * Get data from either the backend API or fallback to mock data
 * This function provides a smooth transition from development to production
 * 
 * @param {string} endpoint - API endpoint to call (e.g., '/server-status')
 * @param {string} mockType - Type of mock data to use as fallback
 * @param {object} params - Optional URL parameters
 * @returns {Promise<object>} - The data from API or mock
 */
export const getData = async (endpoint, mockType, params = {}) => {
  // If we're configured to use mock data or the USE_FORCE_MOCK query param is present
  if (USE_MOCK_DATA || new URLSearchParams(window.location.search).has('USE_FORCE_MOCK')) {
    console.log(`Using mock data for: ${mockType}`);
    return serverService.getMockData(mockType);
  }
  
  try {
    console.log(`Fetching from API: ${endpoint}`);
    const response = await api.get(endpoint, { params });
    return response.data;
  } catch (error) {
    console.warn(`API error for ${endpoint}, falling back to mock data`, error);
    return serverService.getMockData(mockType);
  }
};

// API service functions
export const serverService = {
  // Get current server status
  getServerStatus: async () => {
    return getData('/server-status', 'server-status');
  },
  
  // Get all current parameters
  getParameters: async () => {
    return getData('/parameters', 'parameters');
  },
  
  // Get historical parameter data
  getParameterHistory: async (params = {}) => {
    return getData('/parameters/history', 'parameters-history', params);
  },
  
  // Get crash prediction data
  getCrashPrediction: async () => {
    return getData('/crash-prediction', 'crash-prediction');
  },
  
  // Mock data fallback - use this when backend is unavailable during development
  getMockData: (dataType) => {
    switch (dataType) {
      case 'server-status':
        return {
          status: Math.random() > 0.7 ? 'Online' : Math.random() > 0.5 ? 'Warning' : 'Critical',
          probability: Math.random(),
          lastIncident: '12d 5h ago'
        };
        
      case 'parameters':
        return {
          cpu: { value: Math.floor(Math.random() * 100), trend: 'up', status: 'warning' },
          memory: { value: Math.floor(Math.random() * 100), trend: 'stable', status: 'normal' },
          disk: { value: Math.floor(Math.random() * 100), trend: 'up', status: 'warning' },
          temperature: { value: Math.floor(30 + Math.random() * 40), trend: 'up', status: 'warning' },
          errors: { value: Math.floor(Math.random() * 20), trend: 'up', status: 'critical' },
          responseTime: { value: Math.floor(100 + Math.random() * 300), trend: 'up', status: 'warning' },
          network: { value: Math.floor(Math.random() * 100), trend: 'down', status: 'normal' },
          uptime: { value: Math.floor(1 + Math.random() * 30), trend: 'up', status: 'normal' },
          processor: { value: Math.floor(Math.random() * 100), trend: 'up', status: 'warning' },
          threads: { value: Math.floor(50 + Math.random() * 200), trend: 'up', status: 'normal' }
        };
        
      case 'crash-prediction':
        return {
          probability: Math.random(),
          timeFrame: `${Math.floor(1 + Math.random() * 24)} hours`,
          recommendations: [
            'Reduce CPU-intensive tasks',
            'Investigate error rate increase',
            'Optimize response time'
          ]
        };
        
      case 'parameters-history':
        // Generate history data for charts
        const timestamps = Array.from({length: 24}, (_, i) => {
          const date = new Date();
          date.setHours(date.getHours() - (24 - i));
          return date.toISOString();
        });
        
        return {
          timestamps,
          cpu: Array.from({length: 24}, () => Math.floor(Math.random() * 100)),
          memory: Array.from({length: 24}, () => Math.floor(Math.random() * 100)),
          disk: Array.from({length: 24}, () => Math.floor(60 + Math.random() * 40)),
          temperature: Array.from({length: 24}, () => Math.floor(30 + Math.random() * 40)),
          errors: Array.from({length: 24}, () => Math.floor(Math.random() * 20)),
          responseTime: Array.from({length: 24}, () => Math.floor(100 + Math.random() * 300)),
          network: Array.from({length: 24}, () => Math.floor(Math.random() * 100)),
          uptime: Array.from({length: 24}, (_, i) => i + 1),
          processor: Array.from({length: 24}, () => Math.floor(Math.random() * 100)),
          threads: Array.from({length: 24}, () => Math.floor(50 + Math.random() * 200))
        };
        
      default:
        return { error: true, message: 'Invalid mock data type requested' };
    }
  }
};

/**
 * IMPLEMENTATION GUIDE:
 * 
 * To use real data from your Flask backend:
 * 
 * 1. Set the USE_MOCK_DATA flag to false at the top of this file
 * 
 * 2. Update the components to use these functions:
 *    Example in a component:
 * 
 *    ```jsx
 *    import { serverService } from '../utils/apiService';
 *    
 *    function YourComponent() {
 *      const [parameters, setParameters] = useState({});
 *      
 *      useEffect(() => {
 *        async function fetchData() {
 *          const data = await serverService.getParameters();
 *          if (!data.error) {
 *            setParameters(data);
 *          }
 *        }
 *        
 *        fetchData();
 *        const interval = setInterval(fetchData, 3000);
 *        return () => clearInterval(interval);
 *      }, []);
 *      
 *      // Rest of component...
 *    }
 *    ```
 *    
 * 3. Backend API Structure:
 *    Your Flask backend should implement the endpoints that match the ones used in this service:
 *    - /api/server-status
 *    - /api/parameters
 *    - /api/parameters/history
 *    - /api/crash-prediction
 * 
 * 4. Testing:
 *    - Use URL parameter ?USE_FORCE_MOCK=true to force mock data even when USE_MOCK_DATA is false
 *    - Check the console logs to see whether real or mock data is being used
 */

export default api;
