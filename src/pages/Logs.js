import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Logs.css';

const Logs = () => {
  const [logs, setLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [filter, setFilter] = useState({type: '',
    ip: '',
    date: '',
    hostname: '',
    geolocation: '',
    processId: '',
    topFrequency: false,
   });

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await axios.get('/api/logs');
        console.log('Fetched logs:', response.data); 
        setLogs(response.data);
      } catch (error) {
        console.error('Error fetching logs:', error);
      }
    };
    fetchLogs();
  }, []);

  const applyFilters = () => {
    let filtered = logs;

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
      // Ehhez szuksegem lenne egy geolocation API-ra, amit az IP cimekhez lehet rendelni.
      // Ezt helyben peldakent kezelhetjuk az orszag nevenek feltetelezese alapjan.
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

    setFilteredLogs(filtered);
  };

  useEffect(() => {
    applyFilters();
  }, [filter]);

  return (
    <div>
      <h1>Logs</h1>

      <div>
        <label>
          Type:
          <input
            type="text"
            value={filter.type}
            onChange={(e) => setFilter({ ...filter, type: e.target.value })}
          />
        </label>
        <label>
          IP Address:
          <input
            type="text"
            value={filter.ip}
            onChange={(e) => setFilter({ ...filter, ip: e.target.value })}
          />
        </label>
        <label>
          Date:
          <input
            type="text"
            value={filter.date}
            onChange={(e) => setFilter({ ...filter, date: e.target.value })}
          />
        </label>
        <label>
          Hostname:
          <input
            type="text"
            value={filter.hostname}
            onChange={(e) => setFilter({ ...filter, hostname: e.target.value })}
          />
        </label>
        <label>
          Geolocation (Country):
          <input
            type="text"
            value={filter.geolocation}
            onChange={(e) => setFilter({ ...filter, geolocation: e.target.value })}
          />
        </label>
        <label>
          Process ID:
          <input
            type="text"
            value={filter.processId}
            onChange={(e) => setFilter({ ...filter, processId: e.target.value })}
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

      <table>
        <thead>
          <tr>
            <th>Timestamp</th>
            <th>Process ID</th>
            <th>Host</th>
            <th>IP Address</th>
            <th>Message</th>
          </tr>
        </thead>
        <tbody>
          {filteredLogs.map((log, index) => (
            <tr key={index}>
              <td>{log.timestamp}</td>
              <td>{log.processId}</td>
              <td>{log.host}</td>
              <td>{log.ip}</td>
              <td>{log.message}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Logs;

// !!!! reszletesebb filter es jobb design 
// !! szurd ki 
// !! legyen visszajelzes