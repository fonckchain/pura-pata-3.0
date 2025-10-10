import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Auth helpers
export const signUp = async (email: string, password: string, userData: { name: string; phone: string; location?: string }) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: userData,
    },
  });
  return { data, error };
};

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const resetPassword = async (email: string) => {
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/auth/reset-password`,
  });
  return { data, error };
};

export const updatePassword = async (newPassword: string) => {
  const { data, error } = await supabase.auth.updateUser({
    password: newPassword,
  });
  return { data, error };
};

export const getSession = async () => {
  const { data: { session }, error } = await supabase.auth.getSession();
  return { session, error };
};

export const getUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser();
  return { user, error };
};

// Storage helpers
export const uploadDogPhoto = async (file: File, dogId?: string, index?: number) => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${dogId || 'temp'}_${index || 0}_${Date.now()}.${fileExt}`;
  const filePath = `dogs/${fileName}`;

  const { error } = await supabase.storage
    .from('dog-photos')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (error) {
    throw new Error(`Error uploading photo: ${error.message}`);
  }

  const { data: { publicUrl } } = supabase.storage
    .from('dog-photos')
    .getPublicUrl(filePath);

  return publicUrl;
};

export const deletePhotos = async (photoUrls: string[]) => {
  const filePaths = photoUrls.map(url => {
    const urlObj = new URL(url);
    return urlObj.pathname.split('/dog-photos/')[1];
  });

  const { error } = await supabase.storage
    .from('dog-photos')
    .remove(filePaths);

  return { error };
};
