import pandas as pd
import numpy as np
import tensorflow as tf
from sklearn.preprocessing import MinMaxScaler
from sklearn.model_selection import train_test_split
import joblib
import os

# Constants
SEQ_LENGTH = 10
N_FEATURES = 10
CSV_PATH = "synthetic_failure_data.csv"
MODEL_SAVE_PATH = "../models/lstm_failure_predictor.h5"
SCALER_SAVE_PATH = "../models/feature_scaler.pkl"

# Load and prepare data
df = pd.read_csv(CSV_PATH)
y = df["label"].values
X = df.drop("label", axis=1).values

# Scale features
scaler = MinMaxScaler()
X_scaled = scaler.fit_transform(X)

# Reshape to LSTM format
X_seq = X_scaled.reshape(-1, SEQ_LENGTH, N_FEATURES)
y_seq = y.reshape(-1)

# Train/test split
X_train, X_test, y_train, y_test = train_test_split(X_seq, y_seq, test_size=0.2, random_state=42)

# Build model
model = tf.keras.Sequential([
    tf.keras.layers.LSTM(64, input_shape=(SEQ_LENGTH, N_FEATURES)),
    tf.keras.layers.Dense(32, activation="relu"),
    tf.keras.layers.Dense(1, activation="sigmoid")
])
model.compile(optimizer="adam", loss="binary_crossentropy", metrics=["accuracy"])

# Train model
model.fit(X_train, y_train, epochs=10, batch_size=2, validation_data=(X_test, y_test))

# Save model and scaler
os.makedirs("../models", exist_ok=True)
model.save(MODEL_SAVE_PATH)
joblib.dump(scaler, SCALER_SAVE_PATH)

print(f"✅ Model saved to {MODEL_SAVE_PATH}")
print(f"✅ Scaler saved to {SCALER_SAVE_PATH}")
