import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';
import './IPInfoMap.css'; 

const IpInfoMap = () => {
  const [ipData, setIpData] = useState([]);
  const [stats, setStats] = useState({ totalIps: 0, countryStats: {} });

  useEffect(() => {
    axios.get('http://localhost:5000/api/ip-data')
      .then(response => {
        setIpData(response.data);
        const countryCount = {};
        response.data.forEach(ipInfo => {
          const country = ipInfo.country || 'Unknown';
          countryCount[country] = (countryCount[country] || 0) + 1;
        });
        setStats({
          totalIps: response.data.length,
          countryStats: countryCount,
        });
      })
      .catch(error => console.error('Error fetching IP data:', error));
  }, []);

  return (
    <div className="ip-info-container">
      <MapContainer center={[20, 0]} zoom={2} style={{ height: '600px', width: '70%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {ipData.map((ip, index) => (
          <CircleMarker
            key={index}
            center={[ip.latitude, ip.longitude]}
            radius={5}
            color="blue"
          >
            <Popup>
              <div>
                <p><strong>IP:</strong> {ip.ip}</p>
                <p><strong>Country:</strong> {ip.country}</p>
                <p><strong>City:</strong> {ip.city}</p>
              </div>
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>

      <div className="stats-panel">
        <h2>{stats.totalIps} IPs</h2>
        <p>{Object.keys(stats.countryStats).length} Countries</p>
        <p>{stats.totalIps} Cities</p>
        <button className="copy-url-button">Copy URL</button>
        <button className="new-map-button">New Map</button>
        <div className="country-stats">
          {Object.entries(stats.countryStats).map(([country, count], index) => (
            <div key={index} className="country-row">
              <span className="country-name">{country}</span>
              <span className="country-ip-count">{count} IPs</span>
              <div className="country-bar" style={{ width: `${(count / stats.totalIps) * 100}%` }}></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default IpInfoMap;
