'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { Dog, DogFilters } from '@/types';
import { dogsApi } from '@/lib/api';
import DogCard from '@/components/DogCard';
import Navbar from '@/components/Navbar';
import { Search, SlidersHorizontal } from 'lucide-react';
import { costaRicaProvinces, dogSizes } from '@/lib/utils';

// Load MapView only on client side
const MapView = dynamic(() => import('@/components/MapView'), {
  ssr: false,
  loading: () => <div className="h-[600px] bg-gray-200 rounded-lg flex items-center justify-center">Cargando mapa...</div>
});

export default function Home() {
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [filteredDogs, setFilteredDogs] = useState<Dog[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'map' | 'list'>('list');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<DogFilters>({});

  useEffect(() => {
    loadDogs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    applyFilters();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dogs, filters]);

  const loadDogs = async () => {
    try {
      setLoading(true);
      const data = await dogsApi.getDogs({ status: 'disponible' } as any);
      setDogs(data);
    } catch (error) {
      console.error('Error loading dogs:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let result = dogs.filter(dog => dog.status === 'disponible');

    if (filters.size && filters.size.length > 0) {
      result = result.filter(dog => filters.size!.includes(dog.size));
    }

    if (filters.gender) {
      result = result.filter(dog => dog.gender === filters.gender);
    }

    if (filters.province) {
      result = result.filter(dog => dog.province === filters.province);
    }

    if (filters.vaccinated) {
      result = result.filter(dog => dog.vaccinated);
    }

    if (filters.sterilized) {
      result = result.filter(dog => dog.sterilized);
    }

    setFilteredDogs(result);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero Section */}
      <div className="bg-primary-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-4">Encuentra tu mejor amigo</h1>
          <p className="text-xl">Miles de perros esperando un hogar en Costa Rica</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filter Bar */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="flex-1 relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Buscar por ubicación..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900"
              />
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 text-gray-900"
            >
              <SlidersHorizontal className="h-5 w-5" />
              <span>Filtros</span>
            </button>

            <div className="flex space-x-2">
              <button
                onClick={() => setViewMode('list')}
                className={`px-4 py-2 rounded-md ${
                  viewMode === 'list' ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-900'
                }`}
              >
                Lista
              </button>
              <button
                onClick={() => setViewMode('map')}
                className={`px-4 py-2 rounded-md ${
                  viewMode === 'map' ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-900'
                }`}
              >
                Mapa
              </button>
            </div>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tamaño</label>
                <div className="space-y-2">
                  {dogSizes.map(size => (
                    <label key={size.value} className="flex items-center text-gray-900">
                      <input
                        type="checkbox"
                        checked={filters.size?.includes(size.value) || false}
                        onChange={(e) => {
                          const newSizes = e.target.checked
                            ? [...(filters.size || []), size.value]
                            : (filters.size || []).filter(s => s !== size.value);
                          setFilters({ ...filters, size: newSizes });
                        }}
                        className="mr-2"
                      />
                      {size.label}
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Género</label>
                <select
                  value={filters.gender || ''}
                  onChange={(e) => setFilters({ ...filters, gender: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900"
                >
                  <option value="">Todos</option>
                  <option value="macho">Macho</option>
                  <option value="hembra">Hembra</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Provincia</label>
                <select
                  value={filters.province || ''}
                  onChange={(e) => setFilters({ ...filters, province: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900"
                >
                  <option value="">Todas</option>
                  {costaRicaProvinces.map(province => (
                    <option key={province} value={province}>{province}</option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-3">
                <div className="flex flex-wrap gap-4">
                  <label className="flex items-center text-gray-900">
                    <input
                      type="checkbox"
                      checked={filters.vaccinated || false}
                      onChange={(e) => setFilters({ ...filters, vaccinated: e.target.checked })}
                      className="mr-2"
                    />
                    Vacunado
                  </label>
                  <label className="flex items-center text-gray-900">
                    <input
                      type="checkbox"
                      checked={filters.sterilized || false}
                      onChange={(e) => setFilters({ ...filters, sterilized: e.target.checked })}
                      className="mr-2"
                    />
                    Castrado
                  </label>
                  <label className="flex items-center text-gray-900">
                    <input
                      type="checkbox"
                      checked={filters.dewormed || false}
                      onChange={(e) => setFilters({ ...filters, dewormed: e.target.checked })}
                      className="mr-2"
                    />
                    Desparasitado
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Results */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            <p className="mt-4 text-gray-600">Cargando perros...</p>
          </div>
        ) : (
          <>
            <div className="mb-4 text-gray-600">
              {filteredDogs.length} {filteredDogs.length === 1 ? 'perro encontrado' : 'perros encontrados'}
            </div>

            {viewMode === 'map' ? (
              <MapView dogs={filteredDogs} height="600px" />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredDogs.map(dog => (
                  <DogCard key={dog.id} dog={dog} />
                ))}
              </div>
            )}

            {filteredDogs.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg">No se encontraron perros con los filtros seleccionados</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
