"use client";

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setMessage(error.message);
    } else {
      setMessage('Sign in successful!');
      setTimeout(() => router.push('/'), 1000);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <form onSubmit={handleSignIn} className="bg-casino-card-bg p-8 rounded shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-white">Sign In</h2>
        <input
          type="email"
          placeholder="Email"
          className="w-full mb-4 p-2 rounded bg-casino-dark border border-casino-border-subtle text-white"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <div className="relative w-full mb-6">
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            className="w-full p-2 rounded pr-10 bg-casino-dark border border-casino-border-subtle text-white"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          <button
            type="button"
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400"
            onClick={() => setShowPassword((v) => !v)}
            tabIndex={-1}
          >
            {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
          </button>
        </div>
        <button
          type="submit"
          className="w-full bg-casino-neon-green text-casino-dark font-semibold py-2 rounded hover:bg-casino-neon-green/90 transition-colors"
        >
          Sign In
        </button>
        {message && <div className="mt-4 text-center text-red-400">{message}</div>}
      </form>
    </div>
  );
}
