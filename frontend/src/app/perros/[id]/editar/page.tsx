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
  loading: () => <div className="h-64 bg-gray-200 rounded-lg flex items-center justify-center">Cargando mapa...</div>
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

  const [formData, setFormData] = useState<{
    name: string;
    breed: string;
    age_years: number;
    age_months: number;
    gender: 'macho' | 'hembra' | '';
    size: 'pequeño' | 'mediano' | 'grande' | '';
    color: string;
    description: string;
    vaccinated: boolean;
    sterilized: boolean;
    dewormed: boolean;
    special_needs: string;
    address: string;
    province: string;
    canton: string;
    latitude: number;
    longitude: number;
    status: 'disponible' | 'reservado' | 'adoptado';
    contact_phone: string;
    contact_email: string;
    has_whatsapp: boolean;
  }>({
    name: '',
    breed: '',
    age_years: 0,
    age_months: 0,
    gender: '',
    size: '',
    color: '',
    description: '',
    vaccinated: false,
    sterilized: false,
    dewormed: false,
    special_needs: '',
    address: '',
    province: '',
    canton: '',
    latitude: 9.7489,
    longitude: -83.7534,
    status: 'disponible',
    contact_phone: '',
    contact_email: '',
    has_whatsapp: false,
  });

  const [contactPreferences, setContactPreferences] = useState({
    showPhone: true,
    hasWhatsApp: true,
    showEmail: false,
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
        name: dogData.name || '',
        breed: dogData.breed || '',
        age_years: dogData.age_years || 0,
        age_months: dogData.age_months || 0,
        gender: dogData.gender || '',
        size: dogData.size || '',
        color: dogData.color || '',
        description: dogData.description || '',
        vaccinated: dogData.vaccinated || false,
        sterilized: dogData.sterilized || false,
        dewormed: dogData.dewormed || false,
        special_needs: dogData.special_needs || '',
        address: dogData.address || '',
        province: dogData.province || '',
        canton: dogData.canton || '',
        latitude: dogData.latitude || 9.7489,
        longitude: dogData.longitude || -83.7534,
        status: dogData.status,
        contact_phone: dogData.contact_phone || '',
        contact_email: dogData.contact_email || '',
        has_whatsapp: dogData.has_whatsapp || false,
      });

      // Set contact preferences based on existing data
      setContactPreferences({
        showPhone: !!dogData.contact_phone,
        hasWhatsApp: dogData.has_whatsapp || false,
        showEmail: !!dogData.contact_email,
      });
    } catch (err: any) {
      console.error('Error loading dog:', err);
      setError('Error al cargar el perro');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData({ ...formData, [name]: checked });
    } else if (type === 'number') {
      setFormData({ ...formData, [name]: parseFloat(value) || 0 });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleContactPreferenceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setContactPreferences({ ...contactPreferences, [name]: checked });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validate at least one contact method is selected
    if (!contactPreferences.showPhone && !contactPreferences.showEmail) {
      setError('Debes seleccionar al menos un método de contacto (teléfono o email)');
      return;
    }

    setSaving(true);

    try {
      const updateData: any = {
        ...formData,
        contact_phone: contactPreferences.showPhone ? formData.contact_phone : null,
        contact_email: contactPreferences.showEmail ? formData.contact_email : null,
        has_whatsapp: contactPreferences.showPhone && contactPreferences.hasWhatsApp,
      };

      await dogsApi.updateDog(params.id as string, updateData);
      setSuccess('Perro actualizado correctamente');

      // Reload dog data
      const updatedDog = await dogsApi.getDog(params.id as string);
      setDog(updatedDog);
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
      await dogsApi.updateDog(params.id as string, { ...formData, status: 'adoptado' } as any);
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
    <div className="min-h-screen bg-gray-50 py-12">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => router.push(`/perros/${params.id}`)}
          className="flex items-center space-x-2 text-gray-600 hover:text-primary-600 mb-6"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Volver a detalles</span>
        </button>

        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="bg-primary-600 px-6 py-8">
            <h1 className="text-3xl font-bold text-white">Editar {dog.name}</h1>
            <p className="mt-2 text-primary-100">
              Actualiza la información del perro
            </p>
          </div>

          <form onSubmit={handleSubmit} className="px-6 py-8 space-y-8">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
                {success}
              </div>
            )}

            {/* Información Básica */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Información Básica</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500 text-gray-900"
                  />
                </div>

                <div>
                  <label htmlFor="breed" className="block text-sm font-medium text-gray-700 mb-2">
                    Raza *
                  </label>
                  <input
                    type="text"
                    id="breed"
                    name="breed"
                    value={formData.breed}
                    onChange={handleChange}
                    required
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500 text-gray-900"
                  />
                </div>

                <div>
                  <label htmlFor="age_years" className="block text-sm font-medium text-gray-700 mb-2">
                    Edad (años) *
                  </label>
                  <input
                    type="number"
                    id="age_years"
                    name="age_years"
                    value={formData.age_years}
                    onChange={handleChange}
                    min="0"
                    max="25"
                    required
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500 text-gray-900"
                  />
                </div>

                <div>
                  <label htmlFor="age_months" className="block text-sm font-medium text-gray-700 mb-2">
                    Edad (meses)
                  </label>
                  <input
                    type="number"
                    id="age_months"
                    name="age_months"
                    value={formData.age_months}
                    onChange={handleChange}
                    min="0"
                    max="11"
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500 text-gray-900"
                  />
                </div>

                <div>
                  <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-2">
                    Sexo *
                  </label>
                  <select
                    id="gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    required
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500 text-gray-900"
                  >
                    <option value="">Seleccione</option>
                    <option value="macho">Macho</option>
                    <option value="hembra">Hembra</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="size" className="block text-sm font-medium text-gray-700 mb-2">
                    Tamaño *
                  </label>
                  <select
                    id="size"
                    name="size"
                    value={formData.size}
                    onChange={handleChange}
                    required
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500 text-gray-900"
                  >
                    <option value="">Seleccione</option>
                    <option value="pequeño">Pequeño (menos de 10kg)</option>
                    <option value="mediano">Mediano (10-25kg)</option>
                    <option value="grande">Grande (más de 25kg)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Ubicación */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                Ubicación
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="province" className="block text-sm font-medium text-gray-700 mb-2">
                    Provincia *
                  </label>
                  <select
                    id="province"
                    name="province"
                    value={formData.province}
                    onChange={handleChange}
                    required
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500 text-gray-900"
                  >
                    <option value="">Seleccione</option>
                    <option value="San José">San José</option>
                    <option value="Alajuela">Alajuela</option>
                    <option value="Cartago">Cartago</option>
                    <option value="Heredia">Heredia</option>
                    <option value="Guanacaste">Guanacaste</option>
                    <option value="Puntarenas">Puntarenas</option>
                    <option value="Limón">Limón</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="canton" className="block text-sm font-medium text-gray-700 mb-2">
                    Cantón *
                  </label>
                  <input
                    type="text"
                    id="canton"
                    name="canton"
                    value={formData.canton}
                    onChange={handleChange}
                    required
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500 text-gray-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ubicación en el Mapa
                </label>
                <LocationPicker
                  latitude={formData.latitude}
                  longitude={formData.longitude}
                  onLocationChange={(lat, lng) => {
                    setFormData(prev => ({ ...prev, latitude: lat, longitude: lng }));
                  }}
                />
              </div>
            </div>

            {/* Salud */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Salud</h2>
              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="vaccinated"
                    name="vaccinated"
                    checked={formData.vaccinated}
                    onChange={handleChange}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label htmlFor="vaccinated" className="ml-3 text-sm font-medium text-gray-700">
                    Vacunado
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="sterilized"
                    name="sterilized"
                    checked={formData.sterilized}
                    onChange={handleChange}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label htmlFor="sterilized" className="ml-3 text-sm font-medium text-gray-700">
                    Castrado
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="dewormed"
                    name="dewormed"
                    checked={formData.dewormed}
                    onChange={handleChange}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label htmlFor="dewormed" className="ml-3 text-sm font-medium text-gray-700">
                    Desparasitado
                  </label>
                </div>

                <div>
                  <label htmlFor="special_needs" className="block text-sm font-medium text-gray-700 mb-2">
                    Necesidades Especiales
                  </label>
                  <input
                    type="text"
                    id="special_needs"
                    name="special_needs"
                    value={formData.special_needs}
                    onChange={handleChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500 text-gray-900"
                    placeholder="Medicación diaria, dieta especial, etc."
                  />
                </div>
              </div>
            </div>

            {/* Información de Contacto */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Información de Contacto</h2>
              <p className="text-sm text-gray-600 mb-4">
                Esta información se mostrará a las personas interesadas en adoptar
              </p>

              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label htmlFor="contact_phone" className="block text-sm font-medium text-gray-700 mb-2">
                        Teléfono *
                      </label>
                      <input
                        type="tel"
                        id="contact_phone"
                        name="contact_phone"
                        value={formData.contact_phone}
                        onChange={handleChange}
                        required
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500 text-gray-900"
                        placeholder="8888-8888"
                      />
                    </div>

                    <div>
                      <label htmlFor="contact_email" className="block text-sm font-medium text-gray-700 mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        id="contact_email"
                        name="contact_email"
                        value={formData.contact_email}
                        onChange={handleChange}
                        required
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500 text-gray-900"
                        placeholder="correo@ejemplo.com"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-start">
                      <input
                        type="checkbox"
                        id="showPhone"
                        name="showPhone"
                        checked={contactPreferences.showPhone}
                        onChange={handleContactPreferenceChange}
                        className="h-4 w-4 mt-1 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                      <label htmlFor="showPhone" className="ml-3">
                        <span className="text-sm font-medium text-gray-700">Mostrar mi teléfono</span>
                        <p className="text-xs text-gray-500">Los interesados podrán llamarte directamente</p>
                      </label>
                    </div>

                    <div className="flex items-start">
                      <input
                        type="checkbox"
                        id="hasWhatsApp"
                        name="hasWhatsApp"
                        checked={contactPreferences.hasWhatsApp}
                        onChange={handleContactPreferenceChange}
                        disabled={!contactPreferences.showPhone}
                        className="h-4 w-4 mt-1 text-primary-600 focus:ring-primary-500 border-gray-300 rounded disabled:opacity-50"
                      />
                      <label htmlFor="hasWhatsApp" className="ml-3">
                        <span className="text-sm font-medium text-gray-700">Tengo WhatsApp en este número</span>
                        <p className="text-xs text-gray-500">Se mostrará un botón para contactarte por WhatsApp</p>
                      </label>
                    </div>

                    <div className="flex items-start">
                      <input
                        type="checkbox"
                        id="showEmail"
                        name="showEmail"
                        checked={contactPreferences.showEmail}
                        onChange={handleContactPreferenceChange}
                        className="h-4 w-4 mt-1 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                      <label htmlFor="showEmail" className="ml-3">
                        <span className="text-sm font-medium text-gray-700">Mostrar mi email</span>
                        <p className="text-xs text-gray-500">Los interesados podrán contactarte por correo</p>
                      </label>
                    </div>
                  </div>
                </div>

                {!contactPreferences.showPhone && !contactPreferences.showEmail && (
                  <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg">
                    <p className="text-sm font-medium">⚠️ Debes seleccionar al menos un método de contacto</p>
                  </div>
                )}
              </div>
            </div>

            {/* Descripción */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Descripción *
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={5}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500 text-gray-900"
                placeholder="Cuéntanos sobre la personalidad del perro, su comportamiento, y por qué está en adopción..."
              />
            </div>

            {/* Estado */}
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                Estado de Adopción
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

            {/* Submit */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 flex items-center justify-center space-x-2 bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="h-5 w-5" />
                <span>{saving ? 'Guardando...' : 'Guardar Cambios'}</span>
              </button>

              {formData.status !== 'adoptado' && (
                <button
                  type="button"
                  onClick={handleMarkAsAdopted}
                  disabled={saving}
                  className="flex-1 flex items-center justify-center space-x-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <CheckCircle className="h-5 w-5" />
                  <span>Marcar como Adoptado</span>
                </button>
              )}
            </div>
          </form>

          {dog.status === 'adoptado' && (
            <div className="px-6 pb-6">
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 mr-2" />
                  <span className="font-semibold">Este perro ya fue adoptado ✨</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
