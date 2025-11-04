import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, Popup } from 'react-leaflet';

function LocationMarker({ onLocationSelect }) {
  const [position, setPosition] = useState(null);

  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setPosition(e.latlng);
      onLocationSelect({ lat, lng }); 
    },
  });

  return position === null ? null : (
    <Marker position={position}>
      <Popup>Ви обрали цю точку</Popup>
    </Marker>
  );
}


const MapPicker = ({ onLocationSelect, closeModal }) => {
  const defaultPosition = [49.4229, 26.9871]; 

  return (
    <div className="map-modal-overlay">
      <div className="map-modal-content">
        <div className="map-modal-header">
          <h3>Оберіть точку на карті</h3>
          <button onClick={closeModal} className="map-modal-close-btn">✕</button>
        </div>
        <div className="map-container">
          <MapContainer center={defaultPosition} zoom={13} scrollWheelZoom={true}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <LocationMarker onLocationSelect={onLocationSelect} />
          </MapContainer>
        </div>
      </div>
    </div>
  );
};

export default MapPicker;