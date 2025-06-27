import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://plhpubcmugqosexcgdhj.supabase.co'; // Ganti dengan URL Anda
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsaHB1YmNtdWdxb3NleGNnZGhqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA2OTM1MjQsImV4cCI6MjA2NjI2OTUyNH0.RvL-jUkEiCBrCywqC5dC2c8VxSt6ifjBRekkm82sMH4'; // Ganti dengan anon key Anda

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