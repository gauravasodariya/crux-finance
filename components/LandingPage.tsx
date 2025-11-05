"use client";

import React from 'react';
import Hero from './landing/Hero';
import FeatureGrid from './landing/FeatureGrid';
import { CustomerRoleCard, AgentRoleCard } from './landing/RoleCard';

export default function LandingPage() {
  return (
    <div className="min-h-[60vh] bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <Hero />

        <FeatureGrid />

        <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <CustomerRoleCard />
          <AgentRoleCard />
        </div>
      </section>
    </div>
  );
}