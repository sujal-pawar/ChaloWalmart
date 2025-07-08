````markdown
# Flask Backend – Developer Notes

This project uses Flask as the backend framework.

---

## ⚙️ Working on the Project

### ✅ Activate Virtual Environment (Every time before running)
```bash
venv\Scripts\activate   # Windows
````

### ▶️ Run the Server

```bash
python app.py
```

Server runs at: [http://127.0.0.1:5000](http://127.0.0.1:5000)

---

## 📦 Installing New Packages

```bash
pip install <package-name>
```

Example:

```bash
pip install flask-cors
```

Don't forget to export installed packages:

```bash
pip freeze > requirements.txt
```

---

## 🧪 Useful Imports

```python
from flask import Flask, request, jsonify
```

---

## 🛠 Tips

* Use `@app.route()` to define routes (GET, POST, etc.)
* Use `request.json` to get data from frontend
* Use `jsonify()` to send JSON response
* Restart server after changing `app.py` (or use `debug=True`)
* Use `deactivate` to exit virtual environment

---

## 🧹 Clean Exit

```bash
deactivate
```

---

## 📁 Structure Example

```
flask-backend/
│
├── venv/               # Virtual environment
├── app.py              # Flask app
├── requirements.txt    # Package list (optional)
└── README.md           # This file
```
