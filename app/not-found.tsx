import React from "react";

export default function NotFound() {
  return (
    
      <div className="flex min-h-screen items-center justify-center bg-casino-dark text-white">
        <div className="text-center p-6">
          <h1 className="mb-4 text-4xl font-bold">404 – Page Not Found</h1>
          <p className="mb-6 text-gray-400">The page you are looking for doesn’t exist or has been moved.</p>
          <a
            href="/"
            className="inline-block rounded-full bg-casino-neon-green px-6 py-3 text-casino-dark font-semibold hover:opacity-90 transition"
          >
            Back to Home
          </a>
        </div>
      </div>
  );
}