"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { useMemo } from "react";
import "leaflet/dist/leaflet.css";

export default function Map() {
  // Montpellier, France coordinates
  const position: [number, number] = [43.6108, 3.8767];

  // Create custom mauve marker icon
  const icon = useMemo(() => {
    if (typeof window === 'undefined') return undefined;
    
    // Create a custom SVG marker in mauve color
    const mauveMarkerSvg = `
      <svg width="25" height="41" viewBox="0 0 25 41" xmlns="http://www.w3.org/2000/svg">
        <path d="M12.5 0C5.596 0 0 5.596 0 12.5c0 9.375 12.5 28.5 12.5 28.5S25 21.875 25 12.5C25 5.596 19.404 0 12.5 0z" fill="#cba6f7"/>
        <circle cx="12.5" cy="12.5" r="4" fill="#1e1e2e"/>
      </svg>
    `;
    const iconUrl = 'data:image/svg+xml;base64,' + btoa(mauveMarkerSvg);
    
    return L.icon({
      iconUrl,
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
    });
  }, []);

  if (typeof window === 'undefined') return null;

  return (
    <MapContainer 
      center={position} 
      zoom={5} 
      scrollWheelZoom={false} 
      className="w-full h-full"
      zoomControl={false}
      dragging={false}
      doubleClickZoom={false}
      attributionControl={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      />
      <Marker position={position} icon={icon}>
        <Popup>
          Montpellier, France <br /> Remote Worldwide
        </Popup>
      </Marker>
    </MapContainer>
  );
}
