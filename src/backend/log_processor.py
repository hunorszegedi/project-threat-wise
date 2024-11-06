import ipapi
import re

def get_geolocation(ip):
    try:
        data = ipapi.location(ip=ip)
        return data.get("country_name", "Unknown")
    except Exception as e:
        print(f"Error fetching geolocation for IP {ip}: {e}")
        return "Unknown"
    
def process_logs(log_file_path):
    logs = []
    with open(log_file_path, 'r') as file:
        lines = file.readlines()
        for line in lines:
            if line.strip() == '':
                continue

            match = re.match(
                r"^(\w+\s+\d+\s+\d+:\d+:\d+)\s+\w+\s+\w+\/\w+\/\w+\[(\d+)\]:\s+warning:\s+([^\[]+)\[(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})\]:\s+(.*)$", 
                line
            )

            if match:
                timestamp, process_id, host, ip, message = match.groups()
                
                # geolocation = get_geolocation(ip)  

                logs.append({
                    "timestamp": timestamp,
                    "processId": process_id,
                    "host": host.strip(),
                    "ip": ip,
                    # "geolocation": geolocation,
                    "message": message.strip()
                })
            else:
                print("Log parsing failed for line:", line)

    return logs
