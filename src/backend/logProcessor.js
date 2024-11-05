const fs = require('fs');
const path = require('path');

function processLogs() {
  const logPath = path.join(__dirname, '../logs/sasl1.log');
  try {
    const data = fs.readFileSync(logPath, 'utf8');
    const lines = data.split('\n');

    const logs = lines.map(line => {
      if (line.trim() === '') return null;

      const regex = /^(\w+\s+\d+\s+\d+:\d+:\d+)\s+\w+\s+\w+\/\w+\/\w+\[(\d+)\]:\s+warning:\s+([^\[]+)\[(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})\]:\s+(.*)$/;
      const match = line.match(regex);

      if (match) {
        const [_, timestamp, processId, host, ip, message] = match;

        return {
          timestamp, 
          processId, 
          host: host.trim(), 
          ip,
          message: message.trim() 
        };
      } else {
        console.error('Log parsing failed for line:', line);
        return null;
      }
    }).filter(entry => entry !== null); 

    return logs;
  } catch (error) {
    console.error('Error reading log file:', error);
    return [];
  }
}

module.exports = { processLogs };
