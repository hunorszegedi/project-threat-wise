import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { MapContainer, TileLayer, useMap, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.heat';
import '../styles/GeolocationMap.css';

const romaniaMures = [46.5456, 24.5615];

const statusIntensity = {
  critical: 5,
  severe: 4,
  'very-frequent': 3,
  frequent: 2,
  repeated: 1,
};

const HeatmapLayer = ({ points, options, setHoveredData }) => {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    const heatLayer = L.heatLayer(points.map(p => [p.lat, p.lng, p.intensity]), options).addTo(map);

    const handleMouseMove = (e) => {
      const { lat, lng } = e.latlng;
      let closest = null;
      let minDist = Infinity;
      points.forEach(point => {
        const distance = Math.sqrt(
          Math.pow(point.lat - lat, 2) + Math.pow(point.lng - lng, 2)
        );
        if (distance < minDist && distance < 0.1) {
          minDist = distance;
          closest = point;
        }
      });
      if (closest) {
        setHoveredData({
          ip: closest.ip,
          country: closest.country,
          latitude: closest.lat,
          longitude: closest.lng,
        });
      } else {
        setHoveredData(null);
      }
    };

    map.on('mousemove', handleMouseMove);

    return () => {
      map.removeLayer(heatLayer);
      map.off('mousemove', handleMouseMove);
    };
  }, [map, points, options, setHoveredData]);

  return null;
};

const GeolocationMap = () => {
  const [geoLocations, setGeoLocations] = useState([]);
  const [renderedIps, setRenderedIps] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hoveredData, setHoveredData] = useState(null);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/logs');
        const updatedLocations = response.data
          .filter(log => log.geolocation && log.geolocation.latitude && log.geolocation.longitude && log.geolocation.country)
          .map(log => ({
            ip: log.ip,
            latitude: log.geolocation.latitude,
            longitude: log.geolocation.longitude,
            country: log.geolocation.country,
            status: log.status,
          }));

        setGeoLocations(prevLocations => {
          const newLocations = updatedLocations.filter(loc => !renderedIps.has(loc.ip));
          if (newLocations.length > 0) {
            const newRenderedIps = new Set(renderedIps);
            newLocations.forEach(loc => newRenderedIps.add(loc.ip));
            setRenderedIps(newRenderedIps);
          }
          return [...prevLocations, ...newLocations];
        });

        setLoading(false);
      } catch (error) {
        console.error('Error fetching geolocation data:', error);
        setError('Error fetching geolocation data.');
        setLoading(false);
      }
    };

    fetchLogs();

    const interval = setInterval(() => {
      fetchLogs();
    }, 1000);

    return () => clearInterval(interval);
  }, [renderedIps]);

  const heatmapPoints = geoLocations.map(loc => ({
    lat: loc.latitude,
    lng: loc.longitude,
    intensity: statusIntensity[loc.status] || 1,
    ip: loc.ip,
    country: loc.country,
  }));

  const countryTraffic = geoLocations.reduce((acc, loc) => {
    acc[loc.country] = (acc[loc.country] || 0) + 1;
    return acc;
  }, {});

  const sortedCountries = Object.entries(countryTraffic)
    .sort((a, b) => b[1] - a[1]);

    const heatmapOptions = {
      radius: 8,
      maxZoom: 17,
      gradient: {
        0.0: 'rgba(0, 0, 0, 0)',
        0.2: 'rgba(0, 128, 0, 0.3)',
        0.4: 'rgba(0, 128, 0, 0.5)',
        0.6: 'rgba(0, 128, 0, 0.7)',
        0.8: 'rgba(0, 128, 0, 0.9)',
        1.0: 'rgba(0, 128, 0, 1)',
      },
      max: 5,
      blur: 1,
    };
    


  return (
    <div className="dashboard-container">
      <header className="header">
        <h1>Security Dashboard</h1>
      </header>

      <div className="info-cards">
        <div className="card">
          <h3>Total Traffic</h3>
          <p>{geoLocations.length}</p>
        </div>
        <div className="card">
          <h3>Critical Alerts</h3>
          <p>{geoLocations.filter(loc => loc.status === 'critical').length}</p>
        </div>
        <div className="card">
          <h3>Unique Countries</h3>
          <p>{Object.keys(countryTraffic).length}</p>
        </div>
      </div>

      <div className="content-container">
        <div className="map-container">
          {loading && <div className="loading">Loading...</div>}
          {error && <div className="error">{error}</div>}
          {!loading && !error && (
            <MapContainer center={romaniaMures} zoom={6} style={{ height: '100%', width: '100%' }}>
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <HeatmapLayer points={heatmapPoints} options={heatmapOptions} setHoveredData={setHoveredData} />
              {hoveredData && (
                <Popup position={[hoveredData.latitude, hoveredData.longitude]}>
                  <div>
                    <strong>IP:</strong> {hoveredData.ip}<br />
                    <strong>Country:</strong> {hoveredData.country}
                  </div>
                </Popup>
              )}
            </MapContainer>
          )}
        </div>

        <div className="panel-container">
          <h2>Traffic by Country</h2>
          <ul>
            {sortedCountries.map(([country, count], index) => (
              <li key={index}>
                <span className="country-name">{country}</span>
                <span className="traffic-count">{count}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default GeolocationMap;
