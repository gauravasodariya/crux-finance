'use client';

import React from 'react';
import { Shield, Clock, Users } from 'lucide-react';

export default function FeatureGrid() {
  return (
    <div className="grid md:grid-cols-3 gap-6 mb-16">
      {/* Secure & Private */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
          <Shield className="w-6 h-6 text-blue-600" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Secure & Private</h3>
        <p className="text-base text-gray-600">Your data is encrypted and protected</p>
      </div>

      {/* Instant Response */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
          <Clock className="w-6 h-6 text-green-600" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Instant Response</h3>
        <p className="text-base text-gray-600">Get answers immediately from our AI</p>
      </div>

      {/* Expert Support */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
          <Users className="w-6 h-6 text-purple-600" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Expert Support</h3>
        <p className="text-base text-gray-600">Connect with professional agents</p>
      </div>
    </div>
  );
}