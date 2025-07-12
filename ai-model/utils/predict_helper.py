import numpy as np
import joblib
import tensorflow as tf
import psutil
import time
import os

FEATURES = ['cpu', 'memory', 'disk', 'temperature', 'errors', 
            'response_time', 'network', 'uptime', 'processes', 'threads']
SEQ_LENGTH = 10

def load_model_and_scaler():
    # Get the absolute path to the models directory
    current_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    model_path = os.path.join(current_dir, 'models', 'lstm_failure_predictor.h5')
    scaler_path = os.path.join(current_dir, 'models', 'feature_scaler.pkl')
    
    model = tf.keras.models.load_model(model_path)
    scaler = joblib.load(scaler_path)
    return model, scaler

def predict_failure(raw_sequence, model, scaler):
    seq = np.array(raw_sequence)
    if seq.shape != (SEQ_LENGTH, len(FEATURES)):
        raise ValueError(f"Expected input shape: (10, 10), got: {seq.shape}")
    # Flatten for scaler
    seq_flat = seq.flatten().reshape(1, -1)  # shape (1, 100)
    seq_scaled = scaler.transform(seq_flat)  # shape (1, 100)
    # Reshape for LSTM: (batch_size, timesteps, features)
    seq_lstm = seq_scaled.reshape(1, SEQ_LENGTH, len(FEATURES))  # shape (1, 10, 10)
    prob = float(model.predict(seq_lstm)[0][0])
    will_fail = prob > 0.5
    reason_info = analyze_reason(raw_sequence)
    return prob, will_fail, reason_info

def analyze_reason(sequence):
    arr = np.array(sequence)
    changes = arr[-1] - arr[0]
    perc_changes = np.where(np.abs(arr[0]) > 1e-5, ((arr[-1] - arr[0]) / arr[0]) * 100, 0)

    significant = []
    for i, pct in enumerate(perc_changes):
        if abs(pct) > 20:  # more strict threshold
            change_desc = f"{FEATURES[i]} {'increased' if pct > 0 else 'decreased'} by {pct:+.1f}%"
            significant.append((FEATURES[i], change_desc, pct))

    reason_sentences = [desc for _, desc, _ in significant]
    last_spike = {"metric": None, "change": "N/A"}

    if significant:
        top = max(significant, key=lambda x: abs(x[2]))
        last_spike = {"metric": top[0], "change": f"{top[2]:+.1f}%"}

    return {
        "reason": "; ".join(reason_sentences) if reason_sentences else "No significant metric changes detected.",
        "last_spike": last_spike
    }

def get_system_data_sequence():
    sequence = []
    for _ in range(SEQ_LENGTH):
        try:
            cpu = psutil.cpu_percent(interval=0.1)
            memory = psutil.virtual_memory().percent
            disk = psutil.disk_usage('/').percent
            # Try to get temperature, fallback to 50 if not available
            try:
                temp = psutil.sensors_temperatures()
                temperature = temp.get('coretemp', [{'current': 50}])[0]['current'] if temp else 50
            except Exception:
                temperature = 50
            errors = np.random.randint(0, 5)
            response_time = np.random.uniform(100, 500)
            network = psutil.net_io_counters().bytes_sent / 1024
            uptime = time.time() - psutil.boot_time()
            processes = len(psutil.pids())
            threads = sum(p.num_threads() for p in psutil.process_iter())

            row = [cpu, memory, disk, temperature, errors,
                   response_time, network, uptime, processes, threads]
            sequence.append(row)
        except Exception as e:
            print("psutil error:", e)
            # Only fallback to zeros if the whole row fails
            sequence.append([0]*10)
        time.sleep(0.5)  # keep it light
    return sequence
