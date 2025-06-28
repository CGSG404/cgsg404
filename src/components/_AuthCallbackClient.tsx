// src/components/_AuthCallbackClient.tsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';

const AuthCallback = () => {
  const Navigate = useNavigate ();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        Navigate('/');
      }
    });
  }, [Navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-casino-dark">
      <div className="text-center text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-casino-neon-green mx-auto"></div>
        <p className="mt-4 text-lg">Finalizing login, please wait...</p>
      </div>
    </div>
  );
};

export default AuthCallback;
