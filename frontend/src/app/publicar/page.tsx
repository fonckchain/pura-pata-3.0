'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { supabase } from '@/lib/supabase';
import api, { usersApi } from '@/lib/api';
import { uploadDogPhoto, deletePhotos } from '@/lib/supabase';
import { Camera, MapPin, Save, X } from 'lucide-react';

const LocationPicker = dynamic(() => import('@/components/LocationPicker'), {
  ssr: false,
  loading: () => <div className="h-64 bg-gray-200 rounded-lg flex items-center justify-center">Cargando mapa...</div>
});

export default function PublicarPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [uploadingPhotos, setUploadingPhotos] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    breed: '',
    age_years: 0,
    age_months: 0,
    gender: '',
    size: '',
    province: '',
    canton: '',
    latitude: 9.7489,
    longitude: -83.7534,
    description: '',
    vaccinated: false,
    sterilized: false,
    dewormed: false,
    special_needs: '',
    contact_phone: '',
    contact_email: '',
  });

  const [photoFiles, setPhotoFiles] = useState<File[]>([]);
  const [photoUrls, setPhotoUrls] = useState<string[]>([]);

  const [contactPreferences, setContactPreferences] = useState({
    showPhone: true,
    hasWhatsApp: true,
    showEmail: false,
  });

  useEffect(() => {
    const checkUserAndLoadProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/login');
        return;
      }

      // Load user profile and pre-fill location data
      try {
        const userProfile = await usersApi.getProfile();

        // Pre-fill location and contact fields if available
        if (userProfile) {
          setFormData(prev => ({
            ...prev,
            province: userProfile.province ?? prev.province,
            canton: userProfile.canton ?? prev.canton,
            latitude: userProfile.latitude ?? prev.latitude,
            longitude: userProfile.longitude ?? prev.longitude,
            contact_phone: userProfile.phone ?? prev.contact_phone,
            contact_email: userProfile.email ?? prev.contact_email,
          }));
        }
      } catch (error) {
        console.error('Error loading user profile:', error);
        // Continue anyway, user can fill manually
      }

      setLoading(false);
    };

    checkUserAndLoadProfile();
  }, [router]);

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

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setPhotoFiles([...photoFiles, ...files]);

      // Create preview URLs
      const newUrls = files.map(file => URL.createObjectURL(file));
      setPhotoUrls([...photoUrls, ...newUrls]);
    }
  };

  const removePhoto = (index: number) => {
    const newFiles = photoFiles.filter((_, i) => i !== index);
    const newUrls = photoUrls.filter((_, i) => i !== index);
    setPhotoFiles(newFiles);
    setPhotoUrls(newUrls);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate at least one contact method is selected
    if (!contactPreferences.showPhone && !contactPreferences.showEmail) {
      setError('Debes seleccionar al menos un método de contacto (teléfono o email)');
      return;
    }

    setSubmitting(true);

    let dogData = null;

    try {
      // Upload photos first
      let uploadedPhotoUrls: string[] = [];
      if (photoFiles.length > 0) {
        setUploadingPhotos(true);
        const uploadPromises = photoFiles.map(file => uploadDogPhoto(file));
        uploadedPhotoUrls = await Promise.all(uploadPromises);
        setUploadingPhotos(false);
      }

      // Create dog with photo URLs and apply contact preferences
      dogData = {
        ...formData,
        photos: uploadedPhotoUrls,
        status: 'disponible',
        contact_phone: contactPreferences.showPhone ? formData.contact_phone : null,
        contact_email: contactPreferences.showEmail ? formData.contact_email : null,
        has_whatsapp: contactPreferences.showPhone && contactPreferences.hasWhatsApp,
      };

      const response = await api.post('/dogs', dogData);
      const newDog = response.data;

      // Redirect to the new dog's page
      router.push(`/perros/${newDog.id}`);
    } catch (err: any) {
      console.error('Error creating dog:', err);
      console.error('Error details:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
        dogData: dogData
      });

      // Clean up uploaded photos if dog creation failed
      if (dogData?.photos && dogData.photos.length > 0) {
        console.log('Cleaning up uploaded photos...');
        try {
          await deletePhotos(dogData.photos);
          console.log('Successfully deleted orphaned photos');
        } catch (deleteError) {
          console.error('Error deleting photos:', deleteError);
          // Continue with error handling even if cleanup fails
        }
      }

      let errorMessage = 'Error al publicar el perro';

      if (err.response?.data?.detail) {
        if (typeof err.response.data.detail === 'string') {
          errorMessage = err.response.data.detail;
        } else if (Array.isArray(err.response.data.detail)) {
          errorMessage = err.response.data.detail.map((d: any) => d.msg).join(', ');
        }
      } else if (err.message) {
        errorMessage = err.message;
      }

      setError(errorMessage);
      setSubmitting(false);
      setUploadingPhotos(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="bg-primary-600 px-6 py-8">
            <h1 className="text-3xl font-bold text-white">Publicar Perro en Adopción</h1>
            <p className="mt-2 text-primary-100">
              Completa la información para ayudar a este perrito a encontrar un hogar
            </p>
          </div>

          <form onSubmit={handleSubmit} className="px-6 py-8 space-y-8">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            {/* Fotos */}
            <div>
              <label className="block text-lg font-semibold text-gray-900 mb-4">
                Fotos del Perro
              </label>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                <p className="text-sm text-blue-800">
                  <strong>💡 Consejo:</strong> Las fotos se mostrarán en formato cuadrado. Si subes fotos verticales, se recortarán automáticamente. Para mejores resultados, usa fotos horizontales o cuadradas donde el perro esté centrado.
                </p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                {photoUrls.map((url, index) => (
                  <div key={url} className="space-y-2">
                    <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 border-2 border-gray-300">
                      <Image
                        src={url}
                        alt={`Foto ${index + 1}`}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                      <button
                        type="button"
                        onClick={() => removePhoto(index)}
                        className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full hover:bg-red-700 z-10"
                      >
                        <X className="h-4 w-4" />
                      </button>
                      {index === 0 && (
                        <div className="absolute bottom-2 left-2 bg-primary-600 text-white text-xs px-2 py-1 rounded">
                          Foto Principal
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-center text-gray-600">Vista en tarjeta</p>
                  </div>
                ))}
                {photoUrls.length < 5 && (
                  <label className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary-500 hover:bg-primary-50 transition">
                    <Camera className="h-8 w-8 text-gray-400 mb-2" />
                    <span className="text-sm text-gray-600">Agregar foto</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handlePhotoChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
              <p className="text-sm text-gray-500">
                <strong>Máximo 5 fotos.</strong> La primera será la foto principal. Las imágenes se recortan automáticamente en formato cuadrado.
              </p>
            </div>

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
                    placeholder="Max"
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
                    placeholder="Labrador"
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
                    placeholder="San José"
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

            {/* Submit */}
            <div className="flex justify-end space-x-4 pt-6 border-t">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={submitting || uploadingPhotos}
                className="flex items-center space-x-2 bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {uploadingPhotos ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Subiendo fotos...</span>
                  </>
                ) : submitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Publicando...</span>
                  </>
                ) : (
                  <>
                    <Save className="h-5 w-5" />
                    <span>Publicar</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
