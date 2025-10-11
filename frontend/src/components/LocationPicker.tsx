'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface LocationPickerProps {
  latitude: number;
  longitude: number;
  onLocationChange: (lat: number, lng: number) => void;
}

export default function LocationPicker({ latitude, longitude, onLocationChange }: LocationPickerProps) {
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    // Initialize map
    const map = L.map(mapContainerRef.current).setView([latitude, longitude], 10);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map);

    // Create custom icon
    const icon = L.icon({
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });

    // Add draggable marker
    const marker = L.marker([latitude, longitude], {
      draggable: true,
      icon: icon
    }).addTo(map);

    marker.bindPopup('Arrastra el marcador a la ubicación del perro').openPopup();

    // Update location when marker is dragged
    marker.on('dragend', () => {
      const pos = marker.getLatLng();
      onLocationChange(pos.lat, pos.lng);
    });

    // Update location when clicking on map
    map.on('click', (e) => {
      marker.setLatLng(e.latlng);
      onLocationChange(e.latlng.lat, e.latlng.lng);
    });

    mapRef.current = map;
    markerRef.current = marker;

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update marker position when props change
  useEffect(() => {
    if (markerRef.current && mapRef.current) {
      const newLatLng = L.latLng(latitude, longitude);
      markerRef.current.setLatLng(newLatLng);
      mapRef.current.setView(newLatLng);
    }
  }, [latitude, longitude]);

  return (
    <div>
      <div
        ref={mapContainerRef}
        style={{ height: '400px', width: '100%' }}
        className="rounded-lg border border-gray-300 z-0"
      />
      <p className="text-xs text-gray-500 mt-2">
        Click en el mapa o arrastra el marcador para seleccionar la ubicación exacta
      </p>
    </div>
  );
}
