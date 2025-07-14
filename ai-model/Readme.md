# LSTM System Failure Prediction API

This project provides a live system failure prediction API using an LSTM neural network. It includes a backend (Flask API), a trained model, and a simple frontend for real-time predictions.

---

## Project Structure

```
.
├── Server -- app.py                # Flask backend API
├── client --index.html              # Frontend UI for live predictions

ai-model--
      ├── requirements.txt        # Python dependencies
      ├── models/
      │   ├── feature_scaler.pkl  # Scaler for input features
      │   └── lstm_failure_predictor.h5  # Trained LSTM model
      ├── training/
      │   ├── synthetic_failure_data.csv # Training data
      │   └── train_model.py      # Script to train the model
      └── utils/
          └── predict_helper.py   # Helper functions for prediction and data collection
```

---

## How It Works

### 1. Model Training

- The LSTM model is trained on synthetic system data (`synthetic_failure_data.csv`) using `training/train_model.py`.
- Features include CPU, memory, disk, temperature, errors, response time, network, uptime, processes, and threads.
- The script scales the data, reshapes it for LSTM input, trains the model, and saves both the model and scaler to the `models/` directory.

### 2. Backend (Flask API)

- **Endpoints:**
  - `/` : Health check.
  - `/predict` : Accepts a 10x10 sequence of system metrics, returns failure probability, prediction, and reason.
  - `/live-sequence` : Gathers a live 10x10 sequence from the current system.
- Uses `utils/predict_helper.py` to load the model/scaler, preprocess input, and interpret results.

### 3. Frontend

- `index.html` provides a simple UI.
- Clicking "Predict from Live System" fetches a live sequence from the backend and displays the prediction, probability, and reason for the result.

---

## Setup & Running

### 1. Install Dependencies

```bash
pip install -r requirements.txt
```

### 2. (Optional) Retrain the Model

If you want to retrain the model:

```bash
cd training
python train_model.py
```

This will update `models/lstm_failure_predictor.h5` and `models/feature_scaler.pkl`.

### 3. Start the Backend

```bash
python app.py
```

The API will run at `http://127.0.0.1:5000/`.

### 4. Use the Frontend

- Open `index.html` in your browser.
- Click "Predict from Live System" to get a real-time prediction.

---

## Integrating a New Model

1. **Train your model** (see `training/train_model.py` for reference).
2. **Save the model** as `models/lstm_failure_predictor.h5` and the scaler as `models/feature_scaler.pkl`.
3. **Ensure the input shape** is `(10, 10)` and features match those in `FEATURES` in `predict_helper.py`.
4. **Restart the backend** to load the new model.

---

## Integrating with a Custom Frontend

- Make POST requests to `/predict` with a JSON body:
  ```json
  { "sequence": [[...], ..., [...]] }  // 10x10 array
  ```
- To get live data, GET `/live-sequence` and use the returned `sequence` as input for `/predict`.

---

## Requirements

- Python 3.7+
- Flask
- TensorFlow
- joblib
- numpy

---

## Notes

- The backend uses `psutil` to gather live system metrics.
- The model expects a 10x10 sequence; adjust `SEQ_LENGTH` and `FEATURES` in both training and prediction code if you change this.
