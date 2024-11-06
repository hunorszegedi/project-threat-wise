import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './IncidentManagement.css';

const IncidentManagement = () => {
    const [logs, setLogs] = useState([]);
    const [filter, setFilter] = useState({
        severity: '',
        ip: '',
        host: '',
        actionTaken: false,
    });
    const [actions, setActions] = useState({});

    const fetchLogs = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/logs', {
                params: { batch_size: 100 }
            });
            setLogs(response.data);
        } catch (error) {
            console.error('Error fetching logs:', error);
        }
    };

    useEffect(() => {
        fetchLogs();
    }, []);

    const applyFilters = () => {
        let filtered = logs;

        if (filter.severity) {
            filtered = filtered.filter(log => log.status === filter.severity);
        }
        if (filter.ip) {
            filtered = filtered.filter(log => log.ip.includes(filter.ip));
        }
        if (filter.host) {
            filtered = filtered.filter(log => log.host.includes(filter.host));
        }

        return filtered;
    };

    const handleAction = (logId, action) => {
        setActions({ ...actions, [logId]: action });
    };

    const filteredLogs = applyFilters();

    return (
        <div>
            <h1>Incident Management</h1>

            <div className="filter-container">
                <label>
                    Severity:
                    <select
                        value={filter.severity}
                        onChange={(e) => setFilter({ ...filter, severity: e.target.value })}
                    >
                        <option value="">Select Severity...</option>
                        <option value="new">New</option>
                        <option value="repeated">Repeated</option>
                        <option value="frequent">Frequent</option>
                        <option value="very-frequent">Very Frequent</option>
                        <option value="severe">Severe</option>
                        <option value="critical">Critical</option>
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
                    Host:
                    <input
                        type="text"
                        value={filter.host}
                        onChange={(e) => setFilter({ ...filter, host: e.target.value })}
                        placeholder="Enter Host..."
                    />
                </label>
            </div>

            <table>
                <thead>
                    <tr>
                        <th>Timestamp</th>
                        <th>Process ID</th>
                        <th>Host</th>
                        <th>IP Address</th>
                        <th>Message</th>
                        <th>Severity</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredLogs.map((log, index) => (
                        <tr key={index}>
                            <td>{log.timestamp}</td>
                            <td>{log.process_id}</td>
                            <td>{log.host}</td>
                            <td>{log.ip}</td>
                            <td>{log.message}</td>
                            <td className={log.status}>{log.status}</td>
                            <td>
                                <button onClick={() => handleAction(log.ip, 'block')}>Block IP</button>
                                <button onClick={() => handleAction(log.ip, 'alert')}>Alert</button>
                                <button onClick={() => handleAction(log.ip, 'investigate')}>Investigate</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default IncidentManagement;
