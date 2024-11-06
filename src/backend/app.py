from flask import Flask, jsonify, request
from flask_cors import CORS
from elasticsearch import Elasticsearch
import threading
import time
import requests

app = Flask(__name__)
CORS(app)
es = Elasticsearch("http://localhost:9200")

suspicious_ips = set()
all_logs = []
batch_size = 10
offset = 0
lock = threading.Lock()

def download_firehol_ip_list():
    url = "https://raw.githubusercontent.com/firehol/blocklist-ipsets/master/firehol_level1.netset"
    response = requests.get(url)
    if response.status_code == 200:
        ip_list = response.text.splitlines()
        global suspicious_ips
        suspicious_ips = set(ip_list)

download_firehol_ip_list()

def log_suspicious_ip(ip):
    with open("suspicious_ips_log.txt", "a") as file:
        file.write(f"{ip}\n")

class LogUpdaterThread(threading.Thread):
    def __init__(self):
        threading.Thread.__init__(self)

    def run(self):
        global all_logs, offset
        while True:
            try:
                response = es.search(
                    index="logs",
                    body={
                        "query": {
                            "match_all": {}
                        }
                    },
                    size=batch_size,
                    from_=offset
                )

                logs = [hit["_source"] for hit in response['hits']['hits']]

                for log in logs:
                    ip = log.get('ip')
                    if ip in suspicious_ips:
                        log['suspicious'] = True
                        log_suspicious_ip(ip)
                    else:
                        log['suspicious'] = False

                with lock:
                    all_logs = logs
                    offset += batch_size

                time.sleep(1)

            except Exception as e:
                print(f"Error fetching logs: {e}")

LogUpdaterThread().start()

@app.route('/api/logs', methods=['GET'])
def get_logs():
    with lock:
        return jsonify(all_logs)

@app.route('/api/suspicious_ips', methods=['GET'])
def get_suspicious_ips():
    return jsonify(list(suspicious_ips))

if __name__ == '__main__':
    app.run(port=5000)
