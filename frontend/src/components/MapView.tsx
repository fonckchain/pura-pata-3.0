'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Dog } from '@/types';

interface MapViewProps {
  dogs: Dog[];
  center?: [number, number];
  zoom?: number;
  height?: string;
  onDogClick?: (dog: Dog) => void;
}

export default function MapView({
  dogs,
  center = [9.7489, -83.7534], // Costa Rica center
  zoom = 8,
  height = '500px',
  onDogClick
}: MapViewProps) {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    // Initialize map
    const map = L.map(mapContainerRef.current).setView(center, zoom);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map);

    mapRef.current = map;

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [center, zoom]);

  useEffect(() => {
    if (!mapRef.current) return;

    // Clear existing markers
    mapRef.current.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        mapRef.current?.removeLayer(layer);
      }
    });

    // Add markers for each dog
    dogs.forEach((dog) => {
      if (!mapRef.current) return;

      const icon = L.divIcon({
        className: 'dog-marker',
        html: '🐕',
        iconSize: [30, 30],
        iconAnchor: [15, 15],
      });

      const marker = L.marker([dog.latitude, dog.longitude], { icon })
        .addTo(mapRef.current);

      marker.bindPopup(`
        <div class="p-2">
          <h3 class="font-bold text-lg">${dog.name}</h3>
          <p class="text-sm">${dog.breed}</p>
          <p class="text-sm">${dog.size} • ${dog.gender}</p>
          <a href="/perros/${dog.id}" class="text-primary-600 hover:underline text-sm">Ver detalles</a>
        </div>
      `);

      if (onDogClick) {
        marker.on('click', () => onDogClick(dog));
      }
    });

    // Fit bounds if there are dogs
    if (dogs.length > 0) {
      const bounds = L.latLngBounds(dogs.map(dog => [dog.latitude, dog.longitude]));
      mapRef.current.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [dogs, onDogClick]);

  return (
    <div
      ref={mapContainerRef}
      style={{ height, width: '100%' }}
      className="rounded-lg overflow-hidden shadow-md"
    />
  );
}
