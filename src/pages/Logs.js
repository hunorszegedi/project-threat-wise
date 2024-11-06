import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Logs.css';

const Logs = () => {
  const [displayLogs, setDisplayLogs] = useState([]);
  const [feedback, setFeedback] = useState('');
  const [offset, setOffset] = useState(0);
  const [logCache, setLogCache] = useState({});
  const BATCH_SIZE = 5;

  const [filter, setFilter] = useState({
    type: '',
    ip: '',
    date: '',
    hostname: '',
    geolocation: '',
    processId: '',
    topFrequency: false,
  });

  const fetchLogs = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/logs', {
        params: { batch_size: BATCH_SIZE, offset }
      });

      const newLogs = response.data.map(log => {
        if (logCache[log.ip]) {
          logCache[log.ip]++;
        } else {
          logCache[log.ip] = 1;
        }

        if (logCache[log.ip] >= 100) {
          log.status = 'critical'; 
        } else if (logCache[log.ip] >= 50) {
          log.status = 'severe'; 
        } else if (logCache[log.ip] >= 10) {
          log.status = 'very-frequent'; 
        } else if (logCache[log.ip] >= 5) {
          log.status = 'frequent'; 
        } else if (logCache[log.ip] > 1) {
          log.status = 'repeated'; 
        } else {
          log.status = 'new';
        }

        return log;
      });

      setDisplayLogs(newLogs);
      setOffset(prevOffset => prevOffset + BATCH_SIZE);
      setFeedback(`${newLogs.length} új log betöltve.`);
      setLogCache({ ...logCache });
    } catch (error) {
      console.error('Error fetching logs:', error);
      setFeedback('Error requesting logs.');
    }
  };

  useEffect(() => {
    fetchLogs();

    const interval = setInterval(() => {
      fetchLogs();
    }, 1000); 

    return () => clearInterval(interval);
  }, []);

  const applyFilters = () => {
    let filtered = displayLogs;

    if (filter.type) {
      filtered = filtered.filter(log => log.message.includes(filter.type));
    }
    if (filter.ip) {
      filtered = filtered.filter(log => log.ip === filter.ip);
    }
    if (filter.date) {
      filtered = filtered.filter(log => log.timestamp.includes(filter.date));
    }
    if (filter.hostname) {
      filtered = filtered.filter(log => log.host.includes(filter.hostname));
    }
    if (filter.geolocation) {
      filtered = filtered.filter(log => log.geolocation && log.geolocation.includes(filter.geolocation));
    }
    if (filter.processId) {
      filtered = filtered.filter(log => log.processId === filter.processId);
    }
    if (filter.topFrequency) {
      const frequency = {};
      filtered.forEach(log => {
        frequency[log.message] = (frequency[log.message] || 0) + 1;
      });
      const maxFrequency = Math.max(...Object.values(frequency));
      filtered = filtered.filter(log => frequency[log.message] === maxFrequency);
    }

    setDisplayLogs(filtered.slice(0, BATCH_SIZE));
    setFeedback(`${filtered.length} log found.`);
  };

  useEffect(() => {
    applyFilters();
  }, [filter]);

  return (
    <div>
      <h1>Logs</h1>

      <div className="filter-container">
        <label>
          Type:
          <input
            type="text"
            value={filter.type}
            onChange={(e) => setFilter({ ...filter, type: e.target.value })}
            placeholder="Enter log type..."
          />
        </label>
        <label>
          IP Address:
          <input
            type="text"
            value={filter.ip}
            onChange={(e) => setFilter({ ...filter, ip: e.target.value })}
            placeholder="Enter IP address..."
          />
        </label>
        <label>
          Date:
          <input
            type="text"
            value={filter.date}
            onChange={(e) => setFilter({ ...filter, date: e.target.value })}
            placeholder="Enter date..."
          />
        </label>
        <label>
          Hostname:
          <input
            type="text"
            value={filter.hostname}
            onChange={(e) => setFilter({ ...filter, hostname: e.target.value })}
            placeholder="Enter hostname..."
          />
        </label>
        <label>
          Geolocation (Country):
          <input
            type="text"
            value={filter.geolocation}
            onChange={(e) => setFilter({ ...filter, geolocation: e.target.value })}
            placeholder="Enter country..."
          />
        </label>
        <label>
          Process ID:
          <input
            type="text"
            value={filter.processId}
            onChange={(e) => setFilter({ ...filter, processId: e.target.value })}
            placeholder="Enter process ID..."
          />
        </label>
        <label>
          Top Frequency:
          <input
            type="checkbox"
            checked={filter.topFrequency}
            onChange={(e) => setFilter({ ...filter, topFrequency: e.target.checked })}
          />
        </label>
        <button onClick={applyFilters}>Apply Filters</button>
      </div>

      {feedback && <div className="feedback">{feedback}</div>}

      <table>
        <thead>
          <tr>
            <th>Timestamp</th>
            <th>Process ID</th>
            <th>Host</th>
            <th>IP Address</th>
            <th>Geolocation</th>
            <th>Message</th>
          </tr>
        </thead>
        <tbody>
          {displayLogs.map((log, index) => (
            <tr key={index} className={
              log.status === 'critical' ? 'critical-log' :
              log.status === 'severe' ? 'severe-log' :
              log.status === 'very-frequent' ? 'very-frequent-log' :
              log.status === 'frequent' ? 'frequent-log' :
              log.status === 'repeated' ? 'repeated-log' :
              'new-log'
            }>
              <td>{log.timestamp}</td>
              <td>{log.process_id}</td>
              <td>{log.host}</td>
              <td>{log.ip}</td>
              <td>{log.geolocation}</td>
              <td>{log.message}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Logs;
