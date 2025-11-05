'use client';

import React from 'react';
import { Sparkles } from 'lucide-react';

export default function Hero() {
  return (
    <div className="text-center mb-16">
      <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 rounded-full mb-6">
        <Sparkles className="w-4 h-4 text-blue-600" />
        <span className="text-md font-medium text-blue-700">24/7 Customer Support</span>
      </div>
      <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
        Welcome to KRUX
        <br />
        <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          Support Center
        </span>
      </h1>
      <p className="text-xl text-gray-600 max-w-2xl mx-auto">
        Get instant help with your loan applications, document requirements, and application status
      </p>
    </div>
  );
}