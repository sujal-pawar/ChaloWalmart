from flask import Flask, request, jsonify
from flask_cors import CORS
import sys
import os

# Add ai-model directory to Python path
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'ai-model'))
from utils.predict_helper import load_model_and_scaler, predict_failure, get_system_data_sequence

app = Flask(__name__)
CORS(app)

# Load model and scaler at startup
model, scaler = load_model_and_scaler()

@app.route('/')
def home():
    return jsonify({"message": "LSTM Failure Prediction API is running!"})

@app.route('/predict', methods=['POST'])
def predict():
    data = request.json.get('sequence')

    if not data or len(data) != 10 or len(data[0]) != 10:
        return jsonify({'error': 'Provide a valid sequence of 10x10 values.'}), 400

    try:
        # Pass the 2D array directly
        prob, will_fail, reason_info = predict_failure(data, model, scaler)
        return jsonify({
            'will_fail': bool(will_fail),
            'probability': round(prob, 3),
            'reason': reason_info['reason'],
            'last_spike': reason_info['last_spike']
        })
    except Exception as e:
        print(f"Prediction error: {e}")
        return jsonify({'error': 'Internal server error. Check logs.'}), 500

@app.route('/live-sequence')
def live_sequence():
    try:
        sequence = get_system_data_sequence()
        return jsonify({'sequence': sequence})
    except Exception as e:
        print("Live data error:", e)
        return jsonify({'error': 'Failed to fetch system data'}), 500

@app.route('/favicon.ico')
def favicon():
    return '', 204

if __name__ == '__main__':
    app.run(debug=True)
