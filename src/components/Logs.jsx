import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import '../styles/Logs.css';

const Logs = () => {
  const [displayLogs, setDisplayLogs] = useState([]);
  const [suspiciousIps, setSuspiciousIps] = useState(new Set());
  const [feedback, setFeedback] = useState('');
  const [offset, setOffset] = useState(0);
  const [logCache, setLogCache] = useState({});
  const BATCH_SIZE = 5;
  const navigate = useNavigate(); // Initialize navigate

  const [filter, setFilter] = useState({
    type: '',
    ip: '',
    date: '',
    hostname: '',
    geolocation: '',
    processId: '',
    topFrequency: false,
    message: '',
  });

  const messageOptions = [
    { key: "SASL PLAIN authentication failed:", label: "SASL PLAIN authentication failed:", color: "red" },
    { key: "SASL LOGIN authentication failed: Invalid authentication mechanism", label: "SASL LOGIN auth failed: Invalid mechanism", color: "red" },
    { key: "SASL PLAIN authentication failed: Invalid authentication mechanism", label: "SASL PLAIN auth failed: Invalid mechanism", color: "red" }
  ];

  const fetchSuspiciousIps = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/suspicious_ips');
      setSuspiciousIps(new Set(response.data));
    } catch (error) {
      console.error('Error fetching suspicious IPs:', error);
    }
  };

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

        log.suspicious = suspiciousIps.has(log.ip);

        return log;
      });

      setDisplayLogs(newLogs);
      setOffset(prevOffset => prevOffset + BATCH_SIZE);
      setFeedback(`${newLogs.length} new log information every 0.5s.`);
      setLogCache({ ...logCache });
    } catch (error) {
      console.error('Error fetching logs:', error);
      setFeedback('Error requesting logs.');
    }
  };

  useEffect(() => {
    fetchSuspiciousIps();
    fetchLogs();

    const interval = setInterval(() => {
      fetchLogs();
    }, 100);

    return () => clearInterval(interval);
  }, []);

  const applyFilters = () => {
    let filtered = displayLogs;

    if (filter.message) {
      filtered = filtered.filter(log => log.message.includes(filter.message));
    }
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

  const geoLocations = displayLogs
    .filter(log => log.geolocation && log.geolocation.latitude && log.geolocation.longitude)
    .map(log => ({
      latitude: log.geolocation.latitude,
      longitude: log.geolocation.longitude,
    }));

  const handleNavigateToMap = () => {
    navigate('/geolocation-map', { state: { geoLocations } });
  };

  return (
    <div>
      <button onClick={handleNavigateToMap}>View Geolocation Map</button>

      <div className="legend-container">
        <h3>Legend:</h3>
        <div className="legend-item">
          <div className="legend-color new-log"></div>
          <span>New Log - Initial occurrence of the IP</span>
        </div>
        <div className="legend-item">
          <div className="legend-color repeated-log"></div>
          <span>Repeated Log - IP occurred multiple times</span>
        </div>
        <div className="legend-item">
          <div className="legend-color frequent-log"></div>
          <span>Frequent Log - IP occurred at least 5 times</span>
        </div>
        <div className="legend-item">
          <div className="legend-color very-frequent-log"></div>
          <span>Very Frequent Log - IP occurred at least 10 times</span>
        </div>
        <div className="legend-item">
          <div className="legend-color severe-log"></div>
          <span>Severe Log - IP occurred at least 50 times</span>
        </div>
        <div className="legend-item">
          <div className="legend-color critical-log"></div>
          <span>Critical Log - IP occurred at least 100 times</span>
        </div>
      </div>

      <div className="filter-container">
        <label>
          Message Type:
          <select
            value={filter.message}
            onChange={(e) => setFilter({ ...filter, message: e.target.value })}
          >
            <option value="">Select a message type...</option>
            {messageOptions.map(option => (
              <option key={option.key} value={option.key} style={{ color: option.color }}>
                {option.label}
              </option>
            ))}
          </select>
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
            <th>Country</th>
            <th>Region</th>
            <th>City</th>
            <th>Latitude</th>
            <th>Longitude</th>
            <th>Message</th>
            <th>Suspicious</th>
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
              <td>{log.geolocation ? log.geolocation.country : 'Unknown'}</td>
              <td>{log.geolocation ? log.geolocation.region : 'Unknown'}</td>
              <td>{log.geolocation ? log.geolocation.city : 'Unknown'}</td>
              <td>{log.geolocation ? log.geolocation.latitude : 'N/A'}</td>
              <td>{log.geolocation ? log.geolocation.longitude : 'N/A'}</td>
              <td>{log.message}</td>
              <td className={log.suspicious ? 'suspicious-yes' : 'suspicious-no'}>
                {log.suspicious ? 'Yes' : 'No'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Logs;
