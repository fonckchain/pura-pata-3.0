import axios from 'axios';
import { Dog, DogFormData, DogFilters, User } from '@/types';
import { supabase } from './supabase';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: `${API_URL}/api/v1`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use(async (config) => {
  const { data: { session } } = await supabase.auth.getSession();
  if (session?.access_token) {
    config.headers.Authorization = `Bearer ${session.access_token}`;
  }
  return config;
});

// Dogs API
export const dogsApi = {
  // Get all dogs with filters
  getDogs: async (filters?: DogFilters): Promise<Dog[]> => {
    const { data } = await api.get('/dogs', { params: filters });
    return data;
  },

  // Get dog by ID
  getDog: async (id: string): Promise<Dog> => {
    const { data } = await api.get(`/dogs/${id}`);
    return data;
  },

  // Create new dog
  createDog: async (dogData: Partial<Dog>): Promise<Dog> => {
    const { data } = await api.post('/dogs', dogData);
    return data;
  },

  // Update dog
  updateDog: async (id: string, dogData: Partial<Dog>): Promise<Dog> => {
    const { data } = await api.put(`/dogs/${id}`, dogData);
    return data;
  },

  // Delete dog
  deleteDog: async (id: string): Promise<void> => {
    await api.delete(`/dogs/${id}`);
  },

  // Update dog status
  updateStatus: async (id: string, status: 'disponible' | 'reservado' | 'adoptado'): Promise<Dog> => {
    const { data } = await api.patch(`/dogs/${id}/status`, { status });
    return data;
  },

  // Get my dogs
  getMyDogs: async (): Promise<Dog[]> => {
    const { data } = await api.get('/dogs/me');
    return data;
  },

  // Get dogs nearby
  getNearbyDogs: async (latitude: number, longitude: number, radius: number): Promise<Dog[]> => {
    const { data } = await api.get('/dogs/nearby', {
      params: { latitude, longitude, radius },
    });
    return data;
  },
};

// Users API
export const usersApi = {
  // Get current user profile
  getProfile: async (): Promise<User> => {
    const { data } = await api.get('/users/me');
    return data;
  },

  // Update user profile
  updateProfile: async (userData: Partial<User>): Promise<User> => {
    const { data } = await api.put('/users/me', userData);
    return data;
  },

  // Create user profile (called after Supabase auth)
  createProfile: async (userData: Omit<User, 'id' | 'created_at'>): Promise<User> => {
    const { data } = await api.post('/users', userData);
    return data;
  },
};

export default api;
