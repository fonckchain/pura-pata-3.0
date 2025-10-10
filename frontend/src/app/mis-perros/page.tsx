'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';
import api from '@/lib/api';
import { Plus, Edit, Trash2, MapPin, Calendar } from 'lucide-react';

interface Dog {
  id: string;
  name: string;
  breed: string;
  age_years: number;
  age_months: number;
  gender: string;
  size: string;
  status: string;
  province: string;
  canton: string;
  description: string;
  photos: string[];
  created_at: string;
  vaccinated: boolean;
  sterilized: boolean;
}

export default function MisPerrosPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/login');
        return;
      }
      setUser(session.user);
      await fetchMyDogs();
    };

    checkUser();
  }, [router]);

  const fetchMyDogs = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/v1/dogs/me');
      setDogs(response.data);
    } catch (err: any) {
      console.error('Error fetching dogs:', err);
      setError('Error al cargar tus perros');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (dogId: string, dogName: string) => {
    if (!confirm(`¿Estás seguro de eliminar a ${dogName}?`)) {
      return;
    }

    try {
      await api.delete(`/api/v1/dogs/${dogId}`);
      setDogs(dogs.filter(dog => dog.id !== dogId));
    } catch (err: any) {
      console.error('Error deleting dog:', err);
      alert('Error al eliminar el perro');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'disponible':
        return 'bg-green-100 text-green-800';
      case 'reservado':
        return 'bg-yellow-100 text-yellow-800';
      case 'adoptado':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'disponible':
        return 'Disponible';
      case 'reservado':
        return 'Reservado';
      case 'adoptado':
        return 'Adoptado';
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando tus perros...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Mis Perros</h1>
            <p className="mt-2 text-gray-600">
              {dogs.length === 0 ? 'No has publicado ningún perro aún' : `${dogs.length} ${dogs.length === 1 ? 'perro publicado' : 'perros publicados'}`}
            </p>
          </div>
          <Link
            href="/publicar"
            className="flex items-center space-x-2 bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition"
          >
            <Plus className="h-5 w-5" />
            <span>Publicar Nuevo</span>
          </Link>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {dogs.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <div className="text-gray-400 mb-4">
              <Plus className="h-24 w-24 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No tienes perros publicados
            </h3>
            <p className="text-gray-600 mb-6">
              Publica tu primer perro para ayudarle a encontrar un hogar
            </p>
            <Link
              href="/publicar"
              className="inline-flex items-center space-x-2 bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition"
            >
              <Plus className="h-5 w-5" />
              <span>Publicar Primer Perro</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dogs.map((dog) => (
              <div key={dog.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition">
                <div className="relative h-64">
                  {dog.photos && dog.photos.length > 0 ? (
                    <Image
                      src={dog.photos[0]}
                      alt={dog.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-400">Sin foto</span>
                    </div>
                  )}
                  <div className="absolute top-3 right-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(dog.status)}`}>
                      {getStatusText(dog.status)}
                    </span>
                  </div>
                </div>

                <div className="p-5">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{dog.name}</h3>
                  <p className="text-gray-600 mb-4">{dog.breed}</p>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                      {dog.canton}, {dog.province}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                      Publicado {new Date(dog.created_at).toLocaleDateString('es-CR')}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 text-xs text-gray-600 mb-4">
                    {dog.vaccinated && (
                      <span className="bg-green-100 text-green-700 px-2 py-1 rounded">
                        Vacunado
                      </span>
                    )}
                    {dog.sterilized && (
                      <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded">
                        Esterilizado
                      </span>
                    )}
                  </div>

                  <div className="flex space-x-2">
                    <Link
                      href={`/perros/${dog.id}`}
                      className="flex-1 flex items-center justify-center space-x-1 bg-primary-600 text-white px-4 py-2 rounded hover:bg-primary-700 transition text-sm"
                    >
                      <Edit className="h-4 w-4" />
                      <span>Ver/Editar</span>
                    </Link>
                    <button
                      onClick={() => handleDelete(dog.id, dog.name)}
                      className="flex items-center justify-center bg-red-50 text-red-600 px-4 py-2 rounded hover:bg-red-100 transition"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
