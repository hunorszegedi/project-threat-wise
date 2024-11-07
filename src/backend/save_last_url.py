import subprocess
import json

def extract_ip_data(log_file_path):
    try:
        command = f"cat {log_file_path} | grep -oE '\\b([0-9]{{1,3}}\\.){{3}}[0-9]{{1,3}}\\b' | sort -u"
        result = subprocess.run(command, shell=True, capture_output=True, text=True)
        ip_addresses = result.stdout.strip().split('\n')

        ip_data = []
        for ip in ip_addresses:
            if ip: 
                ip_data.append({"ip": ip, "info": {}}) 

        return ip_data
    except Exception as e:
        print(f"Hiba az IP-k kinyerése közben: {e}")
        return []

def save_ip_data_to_json(ip_data, filename='ip_data.json'):
    try:
        with open(filename, 'w') as file:
            json.dump(ip_data, file, indent=4)
            print(f"IP adatok mentése sikeres a(z) {filename} fájlba.")
    except Exception as e:
        print(f"Hiba az IP-adatok mentése közben: {e}")

if __name__ == "__main__":
    log_file_path = '../../logs/sasl1proba.log'
    ip_data = extract_ip_data(log_file_path)
    if ip_data:
        save_ip_data_to_json(ip_data)
