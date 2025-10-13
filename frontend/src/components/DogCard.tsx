'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Dog } from '@/types';
import { formatAge } from '@/lib/utils';
import { MapPin } from 'lucide-react';

interface DogCardProps {
  dog: Dog;
}

export default function DogCard({ dog }: DogCardProps) {
  const statusColors = {
    disponible: 'bg-green-100 text-green-800',
    reservado: 'bg-yellow-100 text-yellow-800',
    adoptado: 'bg-gray-100 text-gray-800',
  };

  const statusLabels = {
    disponible: 'Disponible',
    reservado: 'Reservado',
    adoptado: 'Adoptado',
  };

  return (
    <Link href={`/perros/${dog.id}`}>
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer">
        <div className="relative h-48 w-full">
          <Image
            src={dog.photos[0] || '/placeholder-dog.jpg'}
            alt={dog.name}
            fill
            className="object-cover object-center"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute top-2 right-2">
            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColors[dog.status]}`}>
              {statusLabels[dog.status]}
            </span>
          </div>
        </div>

        <div className="p-4">
          <div className="mb-2">
            <h3 className="text-lg font-bold text-gray-900">{dog.name}</h3>
          </div>

          <div className="space-y-2 text-sm text-gray-600">
            <p>
              <span className="font-semibold">Edad:</span> {formatAge(dog.age_years, dog.age_months)}
            </p>
            <p>
              <span className="font-semibold">Raza:</span> {dog.breed}
            </p>
            <p>
              <span className="font-semibold">Tamaño:</span> {dog.size}
            </p>
            <p>
              <span className="font-semibold">Género:</span> {dog.gender}
            </p>
          </div>

          <div className="mt-3 flex items-center text-sm text-gray-500">
            <MapPin className="h-4 w-4 mr-1" />
            <span>{dog.canton ? `${dog.canton}, ${dog.province}` : dog.province}</span>
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            {dog.vaccinated && (
              <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                Vacunado
              </span>
            )}
            {dog.sterilized && (
              <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs">
                Castrado
              </span>
            )}
            {dog.dewormed && (
              <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                Desparasitado
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
