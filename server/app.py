from flask import Flask

app = Flask(__name__)  # Initialize Flask app

@app.route('/')         # Define a route like app.get('/', ...)
def home():
    return 'Hello from Flask!'  # Response

if __name__ == '__main__':
    app.run(debug=True)  # Start the server
