import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const romaniaMures = [46.5456, 24.5615]; //maros

const locationIcon = new L.Icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const GeolocationMap = () => {
  const [geoLocations, setGeoLocations] = useState([]);
  const [renderedIps, setRenderedIps] = useState(new Set());

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/logs');
        const updatedLocations = response.data
          .filter(log => log.geolocation && log.geolocation.latitude && log.geolocation.longitude)
          .map(log => ({
            ip: log.ip,
            latitude: log.geolocation.latitude,
            longitude: log.geolocation.longitude,
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
      } catch (error) {
        console.error('Error fetching geolocation data:', error);
      }
    };

    fetchLogs();

    const interval = setInterval(() => {
      fetchLogs();
    }, 100);

    return () => clearInterval(interval);
  }, [renderedIps]);

  const getLineColor = (status) => {
    switch (status) {
      case 'critical':
        return 'red';
      case 'severe':
        return 'orange';
      case 'very-frequent':
        return 'purple';
      case 'frequent':
        return 'green';
      case 'repeated':
        return 'yellow';
      default:
        return 'blue';
    }
  };

  return (
    <MapContainer center={romaniaMures} zoom={2} style={{ height: '600px', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {geoLocations.map((location, index) => (
        <React.Fragment key={index}>
          <Marker position={[location.latitude, location.longitude]} icon={locationIcon} />
          <Polyline
            positions={[[location.latitude, location.longitude], romaniaMures]}
            color={getLineColor(location.status)}
            weight={1}
          />
        </React.Fragment>
      ))}
    </MapContainer>
  );
};

export default GeolocationMap;
