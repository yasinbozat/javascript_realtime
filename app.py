from flask import Flask, render_template, send_from_directory
import time

app = Flask(__name__)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/json/<path:filename>')
def serve_scripts(filename):
    time.sleep(12)
    return send_from_directory('static/json', filename)

if __name__ == '__main__':
    app.run(debug=True, port="8000")