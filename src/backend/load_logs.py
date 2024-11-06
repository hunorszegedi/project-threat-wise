from elasticsearch import Elasticsearch, exceptions
import re
import time

es = Elasticsearch("http://localhost:9200")

geo_cache = {}

def load_logs_to_elasticsearch(log_file_path, index_name="logs", rate_limit=1):
    with open(log_file_path, 'r') as file:
        lines = file.readlines()
        for line in lines:

            match = re.match(
                r"^(\w+\s+\d+\s+\d+:\d+:\d+)\s+\w+\s+\w+\/\w+\/\w+\[(\d+)\]:\s+warning:\s+([^\[]+)\[(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})\]:\s+(.*)$",
                line
            )
            if match:
                timestamp, process_id, host, ip, message = match.groups()
                
                geolocation = geo_cache.get(ip, "Unknown")
                
                doc = {
                    "timestamp": timestamp,
                    "process_id": process_id,
                    "host": host.strip(),
                    "ip": ip,
                    "geolocation": geolocation,
                    "message": message.strip()
                }
                
                for attempt in range(3):
                    try:
                        es.index(index=index_name, body=doc)
                        break 
                    except exceptions.ConnectionError as e:
                        print(f"Connection error: {e}. Retrying...")
                        time.sleep(2) 
                    except exceptions.TransportError as e:
                        print(f"Transport error: {e}. Retrying...")
                        time.sleep(2) 
                    except Exception as e:
                        print(f"Failed to index document: {e}")
                        break 
            
            else:
                print("Log parsing failed for line:", line)

            time.sleep(rate_limit)

# betenni egy forba sasli
load_logs_to_elasticsearch('../../logs/sasl1.log', rate_limit=1) 
