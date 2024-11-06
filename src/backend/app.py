from flask import Flask, jsonify, request
from flask_cors import CORS
from elasticsearch import Elasticsearch
import threading
import time

app = Flask(__name__)
CORS(app)
es = Elasticsearch("http://localhost:9200")

all_logs = []
batch_size = 10
offset = 0
lock = threading.Lock() 

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

if __name__ == '__main__':
    app.run(port=5000)
