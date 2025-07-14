# ServerPulse - Server Monitoring & Failure Prediction

<div align="center">
  <img src="./images/serverpulse.png" alt="ServerPulse Logo" width="550px" />
</div>


## Overview

ServerPulse is a comprehensive real-time server monitoring solution that combines real-time system metrics tracking with advanced failure prediction using LSTM neural networks. This application helps system administrators proactively manage server infrastructure by identifying potential failures before they occur.

## Features

- **Real-time Monitoring**: Track CPU, memory, disk usage, network activity, and other system metrics in real-time
- **Predictive Analytics**: ML-powered failure prediction using LSTM neural networks
- **Interactive Dashboard**: Modern React-based UI with responsive charts and metrics visualization
- **Trend Analysis**: Historical data tracking to identify patterns and anomalies
- **Alert System**: Visual warnings when metrics exceed normal thresholds
- **Responsive Design**: Works on desktop and mobile devices

<!-- Add a screenshot of your main dashboard here -->

<img width="1780" height="653" alt="Screenshot 2025-07-14 235813" src="https://github.com/user-attachments/assets/03a560f5-89d4-42ca-bbf6-5e4681e3fc46" />
<img width="1799" height="746" alt="Screenshot 2025-07-14 235822" src="https://github.com/user-attachments/assets/3e32bad4-e5b7-47ca-8c18-00bf4da5195a" />






## System Architecture

The application consists of three main components:

1. **React Frontend**: Modern UI built with React, Vite, and TailwindCSS
2. **Flask Backend Server**: API endpoints for fetching and processing system data
3. **LSTM AI Model**: Neural network for predicting potential system failures

![System Architecture]
<!-- Add a system architecture diagram here -->

## Technology Stack

- **Frontend**: React, Vite, TailwindCSS, Chart.js
- **Backend**: Flask, Python
- **AI/ML**: TensorFlow, LSTM neural networks
- **Data Collection**: psutil, custom system metrics collection

## Installation and Setup

### Prerequisites
- Python 3.7+
- Node.js 14+
- npm or yarn

### Setting Up the Project

1. **Clone the repository**
   ```bash
   git clone https://github.com/sujal-pawar/ChaloWallmart.git
   cd ChaloWallmart
   ```

2. **Set up the backend**
   ```bash
   # Navigate to the server directory
   cd server
   
   # Create and activate virtual environment
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   
   # Install dependencies
   pip install -r requirements.txt
   
   # Start the server
   python app.py
   ```

3. **Set up the frontend**
   ```bash
   # Navigate to the client directory
   cd ../client
   
   # Install dependencies
   npm install
   
   # Start the development server
   npm run dev
   ```

4. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5001

## Using the Application

### Dashboard Navigation

- **Status**: View overall system health and stability probability
- **Parameters**: Monitor individual system metrics and their trends
- **Graphs**: Visualize historical data with interactive charts
- **Analytics**: Access predictive insights and recommendations

<img width="1900" height="775" alt="Screenshot 2025-07-14 235800" src="https://github.com/user-attachments/assets/95c0ba6b-e452-4887-b3be-6661276fc3fd" />

<!-- Add a screenshot of your parameter grid here -->

### Understanding the Prediction System

The LSTM neural network analyzes patterns in system metrics to predict potential failures before they occur. The prediction is presented as:

- **Probability**: Likelihood of a system failure
- **Reason**: Key metrics contributing to the prediction
- **Recommendations**: Suggested actions to prevent failure

<img width="1879" height="775" alt="Screenshot 2025-07-14 235833" src="https://github.com/user-attachments/assets/81bd1319-efdb-4d53-a9d9-22d1aa4d3900" />
<!-- Add a screenshot of your prediction screen here -->

## Development and Integration

### Training Custom Models

1. Navigate to the `ai-model/training` directory
2. Modify `train_model.py` as needed for your specific use case
3. Run training:
   ```bash
   python train_model.py
   ```
4. The new model will be saved to the `ai-model/models` directory

### API Endpoints

- `GET /live-sequence`: Get current system metrics
- `POST /predict`: Send system data and receive failure prediction
- `GET /`: API health check

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contributors


- [Harshil Bohra](https://github.com/prof7turtle) 
- [Atharva Kuratkar](https://github.com/AtharvA89)
- [Vishal Tamhane](https://github.com/vishal-tamhane)
- [Sujal Pawar](https://github.com/sujal-pawar)

## Acknowledgments

- Walmart Sparkathon Hackathon Team
- TensorFlow for machine learning framework
- React and Flask communities for excellent documentation

---

*This project was developed as part of the Walmart Sparkathon Hackathon 2025.*
