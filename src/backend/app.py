import os
from flask import Flask, jsonify
from flask_cors import CORS 
from log_processor import process_logs

app = Flask(__name__)
CORS(app)
app.debug = True

def get_logs_path(filename="sasl1.log"):
    current_dir = os.path.dirname(os.path.abspath(__file__))
    logs_dir = os.path.join(current_dir, "..", "..", "logs")
    return os.path.join(logs_dir, filename)

@app.route('/api/logs', methods=['GET'])
def get_logs():
    log_file_path = get_logs_path()
    print("Log file path:", log_file_path)
    logs = process_logs(log_file_path)
    return jsonify(logs)

if __name__ == '__main__':
    app.run(port=5000)
