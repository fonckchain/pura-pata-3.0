'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Dog } from '@/types';
import { dogsApi } from '@/lib/api';
import { supabase } from '@/lib/supabase';
import { formatAge, formatDate, formatPhoneForWhatsApp, generateWhatsAppMessage } from '@/lib/utils';
import Navbar from '@/components/Navbar';
import MapView from '@/components/MapView';
import DogStructuredData from '@/components/DogStructuredData';
import { MapPin, Phone, Mail, Calendar, Share2, ArrowLeft, Edit } from 'lucide-react';

export default function DogDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [dog, setDog] = useState<Dog | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    if (params.id) {
      checkUserAndLoadDog();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  const checkUserAndLoadDog = async () => {
    try {
      setLoading(true);

      // Check authentication
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setCurrentUser(session.user);
      }

      // Load dog
      const data = await dogsApi.getDog(params.id as string);
      setDog(data);

      // Check if current user is the owner (use session.user directly, not state)
      if (session && data.publisher_id === session.user.id) {
        setIsOwner(true);
      }
    } catch (error) {
      console.error('Error loading dog:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleWhatsAppClick = () => {
    if (!dog) return;
    const phone = formatPhoneForWhatsApp(dog.contact_phone);
    const message = generateWhatsAppMessage(dog.name, dog.id);
    window.open(`https://wa.me/506${phone}?text=${message}`, '_blank');
  };

  const handleShare = async () => {
    if (!dog) return;
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Adopta a ${dog.name}`,
          text: `Mira a ${dog.name}, un ${dog.breed} en adopción`,
          url,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      navigator.clipboard.writeText(url);
      alert('Link copiado al portapapeles');
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

  if (!dog) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <p className="text-center text-gray-600">Perro no encontrado</p>
        </div>
      </div>
    );
  }

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
    <div className="min-h-screen bg-gray-50">
      <DogStructuredData dog={dog} />
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => router.push(isOwner ? '/mis-perros' : '/')}
          className="flex items-center space-x-2 text-gray-600 hover:text-primary-600 mb-6"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>{isOwner ? 'Volver a Mis Perros' : 'Volver a Búsqueda'}</span>
        </button>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Photos Gallery */}
            <div className="p-6">
              <div className="relative h-96 mb-4 rounded-lg overflow-hidden">
                <Image
                  src={dog.photos[currentPhotoIndex] || '/placeholder-dog.jpg'}
                  alt={dog.name}
                  fill
                  className="object-cover"
                />
                <div className="absolute top-4 right-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${statusColors[dog.status]}`}>
                    {statusLabels[dog.status]}
                  </span>
                </div>
              </div>

              {dog.photos.length > 1 && (
                <div className="grid grid-cols-5 gap-2">
                  {dog.photos.map((photo, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentPhotoIndex(index)}
                      className={`relative h-20 rounded-lg overflow-hidden ${
                        currentPhotoIndex === index ? 'ring-2 ring-primary-600' : ''
                      }`}
                    >
                      <Image
                        src={photo}
                        alt={`${dog.name} ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Dog Info */}
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h1 className="text-3xl font-bold text-gray-900">{dog.name}</h1>
                <div className="flex space-x-2">
                  {isOwner && (
                    <Link
                      href={`/perros/${dog.id}/editar`}
                      className="p-2 text-gray-600 hover:text-primary-600 border border-gray-300 rounded-md hover:border-primary-600"
                      title="Editar perro"
                    >
                      <Edit className="h-6 w-6" />
                    </Link>
                  )}
                  <button
                    onClick={handleShare}
                    className="p-2 text-gray-600 hover:text-primary-600"
                  >
                    <Share2 className="h-6 w-6" />
                  </button>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Edad</p>
                    <p className="font-semibold text-gray-900">{formatAge(dog.age_years, dog.age_months)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Raza</p>
                    <p className="font-semibold text-gray-900">{dog.breed}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Tamaño</p>
                    <p className="font-semibold capitalize text-gray-900">{dog.size}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Género</p>
                    <p className="font-semibold capitalize text-gray-900">{dog.gender}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {dog.vaccinated && (
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                      ✓ Vacunado
                    </span>
                  )}
                  {dog.sterilized && (
                    <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                      ✓ Castrado
                    </span>
                  )}
                  {dog.dewormed && (
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                      ✓ Desparasitado
                    </span>
                  )}
                </div>

                {dog.description && (
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Descripción</p>
                    <p className="text-gray-700">{dog.description}</p>
                  </div>
                )}

                {dog.special_needs && (
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Necesidades especiales</p>
                    <p className="text-gray-700">{dog.special_needs}</p>
                  </div>
                )}

                <div className="flex items-center text-gray-600">
                  <Calendar className="h-5 w-5 mr-2" />
                  <span className="text-sm">Publicado: {formatDate(dog.created_at)}</span>
                </div>
              </div>

              {/* Contact Buttons - Only show if not owner */}
              {!isOwner && dog.status === 'disponible' && (
                <div className="space-y-3">
                  {dog.contact_phone && dog.has_whatsapp && (
                    <button
                      onClick={handleWhatsAppClick}
                      className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-700 flex items-center justify-center space-x-2"
                    >
                      <Phone className="h-5 w-5" />
                      <span>Contactar por WhatsApp</span>
                    </button>
                  )}

                  {dog.contact_phone && (
                    <a
                      href={`tel:${dog.contact_phone}`}
                      className="w-full bg-primary-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-primary-700 flex items-center justify-center space-x-2"
                    >
                      <Phone className="h-5 w-5" />
                      <span>Llamar: {dog.contact_phone}</span>
                    </a>
                  )}

                  {dog.contact_email && (
                    <a
                      href={`mailto:${dog.contact_email}`}
                      className="w-full border border-primary-600 text-primary-600 py-3 px-4 rounded-lg font-semibold hover:bg-primary-50 flex items-center justify-center space-x-2"
                    >
                      <Mail className="h-5 w-5" />
                      <span>{dog.contact_email}</span>
                    </a>
                  )}
                </div>
              )}

              {/* Owner message */}
              {isOwner && (
                <div className="bg-primary-50 border border-primary-200 text-primary-700 px-4 py-3 rounded-lg">
                  <p className="font-semibold">Este es tu perro</p>
                  <p className="text-sm mt-1">Usa el botón de editar para actualizar la información</p>
                </div>
              )}
            </div>
          </div>

          {/* Location Map */}
          <div className="p-6 border-t">
            <div className="flex items-center mb-4">
              <MapPin className="h-5 w-5 text-gray-600 mr-2" />
              <div>
                <p className="font-semibold text-gray-900">Ubicación</p>
                <p className="text-sm text-gray-600">{dog.canton ? `${dog.canton}, ${dog.province}` : dog.province}</p>
              </div>
            </div>
            <MapView dogs={[dog]} center={[dog.latitude, dog.longitude]} zoom={13} height="300px" />
          </div>
        </div>
      </div>
    </div>
  );
}
