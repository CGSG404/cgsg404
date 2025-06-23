import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hyuomkqzebyiagrmj1ks.supabase.co'; // Ganti dengan URL Anda
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'; // Ganti dengan anon key Anda

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const signUp = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({ email, password });
    return { user: data?.user, error };
};

export const getUser = async () => {
    const { data } = await supabase.auth.getUser();
    return data.user;
};

export const signInWithGoogle = async () => {
  const { error } = await supabase.auth.signInWithOAuth({ provider: 'google' });
  return { error };
};