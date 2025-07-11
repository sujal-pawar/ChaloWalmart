# Walmart Server Monitoring Dashboard - Client

This React application provides a modern UI for visualizing server metrics and crash predictions.

## Current Implementation

The frontend currently uses simulated data that changes randomly to demonstrate the UI's capabilities. When your Flask backend with real data and AI/ML predictions is ready, follow the steps below to integrate it.

## Backend Integration Steps

### Step 1: Set Up Your Flask Backend

1. Navigate to the server directory and set up your Flask environment:
```bash
cd ../server
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

2. Create the following API endpoints in your Flask application:
   - `/api/server-status` - Overall server status
   - `/api/parameters` - Current values for all monitored parameters
   - `/api/parameters/history` - Historical data for charts
   - `/api/crash-prediction` - ML-based crash predictions

### Step 2: Configure CORS in Your Flask App

Ensure your Flask app allows cross-origin requests from your frontend:

```python
from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Your API endpoints here
```

### Step 3: Connect the Frontend to Your Backend

1. Open `src/utils/apiService.js`
2. Change the `USE_MOCK_DATA` flag from `true` to `false`:

```javascript
// Set this to false when your Flask backend is ready
const USE_MOCK_DATA = false;
```

3. If needed, update the `BASE_URL` to match your Flask server's address:

```javascript
const BASE_URL = 'http://localhost:5000/api';  // Change if your server runs on a different port
```

### Step 4: Implement the Required API Endpoints

Your Flask backend should return data in the same format that the mock data uses. Here are the expected data structures:

#### 1. Server Status (/api/server-status)

```json
{
  "status": "Online",  // or "Warning" or "Critical"
  "probability": 0.82, // Stability probability (0-1)
  "lastIncident": "12d 5h ago"
}
```

#### 2. Parameters (/api/parameters)

```json
{
  "cpu": { "value": 78, "trend": "up", "status": "warning" },
  "memory": { "value": 67, "trend": "stable", "status": "normal" },
  "disk": { "value": 82, "trend": "up", "status": "warning" },
  "temperature": { "value": 58, "trend": "up", "status": "warning" },
  "errors": { "value": 12, "trend": "up", "status": "critical" },
  "responseTime": { "value": 230, "trend": "up", "status": "critical" },
  "network": { "value": 45, "trend": "down", "status": "normal" },
  "uptime": { "value": 8.5, "trend": "stable", "status": "normal" },
  "processor": { "value": 82, "trend": "up", "status": "warning" },
  "threads": { "value": 128, "trend": "up", "status": "normal" }
}
```

#### 3. Parameter History (/api/parameters/history)

```json
{
  "timestamps": ["2025-07-12T08:00:00Z", "2025-07-12T09:00:00Z", "..."],
  "cpu": [65, 68, 72, 75, 76, "..."],
  "memory": [60, 62, 64, 66, 67, "..."],
  "disk": [81, 81, 82, 82, 82, "..."],
  "temperature": [52, 54, 56, 57, 58, "..."],
  "errors": [2, 4, 7, 9, 12, "..."],
  "responseTime": [150, 175, 195, 210, 230, "..."],
  "network": [60, 55, 50, 47, 45, "..."],
  "uptime": [8.0, 8.1, 8.2, 8.3, 8.4, "..."],
  "processor": [70, 74, 78, 80, 82, "..."],
  "threads": [100, 110, 118, 125, 128, "..."]
}
```

#### 4. Crash Prediction (/api/crash-prediction)

```json
{
  "probability": 0.64,
  "timeFrame": "6 hours",
  "recommendations": [
    "Reduce CPU-intensive tasks",
    "Investigate error rate increase",
    "Optimize response time"
  ]
}
```

### Step 5: Testing the Integration

1. Start your Flask backend:
```bash
cd ../server
flask run
```

2. In a new terminal, start your React frontend:
```bash
cd ../client
npm run dev
```

3. Open your browser and navigate to the application. You should now see real data from your backend.

4. To verify that you're getting real data and not mock data:
   - Check the browser console for "Fetching from API" messages
   - Temporarily disable your backend to see if the app falls back to mock data

### Step 6: Implement Real Data Collection in Your Backend

Implement functions in your Flask app to:

1. Collect real server metrics:
   - Use libraries like `psutil` for system metrics
   - Set up database logging for historical data
   - Connect to your server monitoring infrastructure

2. Create the ML model for crash prediction:
   - Train a model using historical crash data
   - Implement the prediction algorithm
   - Update the model periodically with new data

### Troubleshooting

If you encounter issues with the integration:

1. **CORS errors**: Ensure your Flask app has CORS configured correctly
2. **Data format errors**: Compare your API response with the expected format
3. **Network issues**: Check that the `BASE_URL` in `apiService.js` matches your Flask server address

To force the app to use mock data (for testing):
- Add `?USE_FORCE_MOCK=true` to the URL, e.g., `http://localhost:3000/?USE_FORCE_MOCK=true`

## Additional Resources

- Flask documentation: https://flask.palletsprojects.com/
- React documentation: https://reactjs.org/docs/getting-started.html
- Chart.js documentation: https://www.chartjs.org/docs/latest/

---

## Original Vite Documentation

This project was built with Vite. The following plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh
