'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { Dog } from '@/types';
import { dogsApi } from '@/lib/api';
import { supabase } from '@/lib/supabase';
import Navbar from '@/components/Navbar';
import { MapPin, Save, ArrowLeft, CheckCircle } from 'lucide-react';

const LocationPicker = dynamic(() => import('@/components/LocationPicker'), {
  ssr: false,
  loading: () => <div className="h-[400px] bg-gray-200 rounded-lg flex items-center justify-center">Cargando mapa...</div>
});

export default function EditDogPage() {
  const params = useParams();
  const router = useRouter();
  const [dog, setDog] = useState<Dog | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isOwner, setIsOwner] = useState(false);

  const [formData, setFormData] = useState({
    address: '',
    province: '',
    latitude: 9.7489,
    longitude: -83.7534,
    status: 'disponible' as 'disponible' | 'reservado' | 'adoptado',
  });

  useEffect(() => {
    checkUserAndLoadDog();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  const checkUserAndLoadDog = async () => {
    try {
      setLoading(true);

      // Check authentication
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/login');
        return;
      }
      setCurrentUser(session.user);

      // Load dog
      const dogData = await dogsApi.getDog(params.id as string);
      setDog(dogData);

      // Check ownership
      if (dogData.publisher_id !== session.user.id) {
        setError('No tienes permiso para editar este perro');
        setIsOwner(false);
        return;
      }

      setIsOwner(true);
      setFormData({
        address: dogData.address || '',
        province: dogData.province || '',
        latitude: dogData.latitude || 9.7489,
        longitude: dogData.longitude || -83.7534,
        status: dogData.status,
      });
    } catch (err: any) {
      console.error('Error loading dog:', err);
      setError('Error al cargar el perro');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);

    try {
      await dogsApi.updateDog(params.id as string, formData);
      setSuccess('Perro actualizado correctamente');

      // Reload dog data
      const updatedDog = await dogsApi.getDog(params.id as string);
      setDog(updatedDog);
      setFormData({
        address: updatedDog.address || '',
        province: updatedDog.province || '',
        latitude: updatedDog.latitude || 9.7489,
        longitude: updatedDog.longitude || -83.7534,
        status: updatedDog.status,
      });
    } catch (err: any) {
      console.error('Error updating dog:', err);
      setError(err.response?.data?.detail || 'Error al actualizar el perro');
    } finally {
      setSaving(false);
    }
  };

  const handleMarkAsAdopted = async () => {
    if (!confirm('¿Estás seguro de marcar este perro como adoptado?')) {
      return;
    }

    setError('');
    setSuccess('');
    setSaving(true);

    try {
      await dogsApi.updateDog(params.id as string, { ...formData, status: 'adoptado' });
      setSuccess('¡Felicidades! El perro ha sido marcado como adoptado');
      setFormData({ ...formData, status: 'adoptado' });

      // Reload to get updated data
      const updatedDog = await dogsApi.getDog(params.id as string);
      setDog(updatedDog);
    } catch (err: any) {
      console.error('Error marking as adopted:', err);
      setError(err.response?.data?.detail || 'Error al marcar como adoptado');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-screen">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </div>
    );
  }

  if (!dog || !isOwner) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error || 'No tienes permiso para editar este perro'}
          </div>
          <button
            onClick={() => router.back()}
            className="mt-4 flex items-center space-x-2 text-gray-600 hover:text-primary-600"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Volver</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => router.push(`/perros/${params.id}`)}
          className="flex items-center space-x-2 text-gray-600 hover:text-primary-600 mb-6"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Volver a detalles</span>
        </button>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Editar {dog.name}</h1>
            <p className="text-gray-600 mt-2">Actualiza la ubicación y el estado de adopción</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-6">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="province" className="block text-sm font-medium text-gray-700 mb-2">
                Provincia
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MapPin className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  id="province"
                  name="province"
                  value={formData.province}
                  onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500 text-gray-900"
                >
                  <option value="">Seleccione una provincia</option>
                  <option value="San José">San José</option>
                  <option value="Alajuela">Alajuela</option>
                  <option value="Cartago">Cartago</option>
                  <option value="Heredia">Heredia</option>
                  <option value="Guanacaste">Guanacaste</option>
                  <option value="Puntarenas">Puntarenas</option>
                  <option value="Limón">Limón</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                Dirección
              </label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500 text-gray-900"
                placeholder="200m norte de la iglesia..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ubicación en el Mapa
              </label>
              <p className="text-xs text-gray-500 mb-2">
                Haz clic en el mapa para seleccionar la ubicación exacta del perro
              </p>
              <LocationPicker
                latitude={formData.latitude}
                longitude={formData.longitude}
                onLocationChange={(lat, lng) => {
                  setFormData({ ...formData, latitude: lat, longitude: lng });
                }}
              />
            </div>

            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                Estado
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500 text-gray-900"
              >
                <option value="disponible">Disponible</option>
                <option value="reservado">Reservado</option>
                <option value="adoptado">Adoptado</option>
              </select>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 flex items-center justify-center space-x-2 bg-primary-600 text-white px-6 py-3 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="h-5 w-5" />
                <span>{saving ? 'Guardando...' : 'Guardar Cambios'}</span>
              </button>

              {formData.status !== 'adoptado' && (
                <button
                  type="button"
                  onClick={handleMarkAsAdopted}
                  disabled={saving}
                  className="flex-1 flex items-center justify-center space-x-2 bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <CheckCircle className="h-5 w-5" />
                  <span>Marcar como Adoptado</span>
                </button>
              )}
            </div>
          </form>

          {dog.status === 'adoptado' && (
            <div className="mt-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 mr-2" />
                <span className="font-semibold">Este perro ya fue adoptado ✨</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
