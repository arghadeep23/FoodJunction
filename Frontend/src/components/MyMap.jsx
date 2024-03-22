import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import "../styles/MyMap.scss";
const MyMap = ({ latitude, longitude, name }) => {
    const position = [latitude, longitude]; // Replace with your actual latitude and longitude
    // const position = [34.167719, -118.1332]; // Replace with your actual latitude and longitude

    return (
        <MapContainer center={position} zoom={13} style={{ height: '200px', width: '400px' }}>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <Marker position={position}>
                <Popup>
                    {name}
                </Popup>
            </Marker>
        </MapContainer>
    );
};

export default MyMap;