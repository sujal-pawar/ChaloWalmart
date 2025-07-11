# This module now only contains AI model initialization and helper functions
from utils.predict_helper import load_model_and_scaler

def initialize_model():
    """Initialize and return the model and scaler"""
    return load_model_and_scaler()

# The model and scaler can be imported from this module
model, scaler = initialize_model()
