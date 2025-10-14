'use client';

import { useState } from 'react';
import Link from 'next/link';
import { resetPassword } from '@/lib/supabase';
import Navbar from '@/components/Navbar';
import Logo from '@/components/Logo';
import { Mail } from 'lucide-react';

export default function RecuperarPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { error: resetError } = await resetPassword(email);

      if (resetError) {
        setError('Error al enviar el correo de recuperación. Verifica que el correo sea correcto.');
        return;
      }

      setSuccess(true);
    } catch (err) {
      setError('Ocurrió un error al enviar el correo de recuperación');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />

        <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-md w-full">
            <div className="bg-white p-8 rounded-lg shadow-md text-center space-y-4">
              <div className="flex justify-center">
                <div className="bg-green-100 p-3 rounded-full">
                  <Mail className="h-12 w-12 text-green-600" />
                </div>
              </div>

              <h2 className="text-2xl font-bold text-gray-900">
                Correo enviado
              </h2>

              <p className="text-gray-600">
                Te hemos enviado un correo a <strong>{email}</strong> con instrucciones para recuperar tu contraseña.
              </p>

              <p className="text-sm text-gray-500">
                Revisa tu bandeja de entrada y tu carpeta de spam. El enlace expirará en 1 hora.
              </p>

              <div className="pt-4">
                <Link
                  href="/login"
                  className="text-primary-600 hover:text-primary-500 font-medium"
                >
                  Volver a iniciar sesión
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <div className="flex justify-center">
              <Logo width={80} height={80} showText={false} />
            </div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Recuperar contraseña
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Ingresa tu correo electrónico y te enviaremos instrucciones para recuperar tu contraseña.
            </p>
          </div>

          <form className="mt-8 space-y-6 bg-white p-8 rounded-lg shadow-md" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Correo electrónico
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-gray-900"
                placeholder="tu@email.com"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
            >
              {loading ? 'Enviando...' : 'Enviar instrucciones'}
            </button>

            <div className="text-center">
              <Link
                href="/login"
                className="text-sm text-primary-600 hover:text-primary-500 font-medium"
              >
                Volver a iniciar sesión
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
