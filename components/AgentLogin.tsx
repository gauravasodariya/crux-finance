// File: components/AgentLogin.tsx
'use client';

import React from 'react';
import { Lock, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAppContext } from '@/context/AppContext';
import { MOCK_AGENTS } from '@/lib/mockData';
import { saveToStorage, STORAGE_KEYS } from '@/lib/storage';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import SharedHeader from '@/components/SharedHeader';
import Footer from '@/components/Footer';

type FormValues = {
  username: string;
  password: string;
};

const schema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export default function AgentLogin() {
  const router = useRouter();
  const { dispatch } = useAppContext();
  const [loginError, setLoginError] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { username: '', password: '' },
    mode: 'onChange',
  });

  const onSubmit = async (values: FormValues) => {
    await new Promise(resolve => setTimeout(resolve, 800));
    const agent = MOCK_AGENTS.find(a => a.username === values.username);
    if (agent && values.password === 'password') {
      dispatch({ type: 'LOGIN', payload: { user: agent, userType: 'agent' } });
      saveToStorage(STORAGE_KEYS.CURRENT_USER, agent);
      saveToStorage(STORAGE_KEYS.USER_TYPE, 'agent');
      router.push('/support-dashboard');
    } else {
      setLoginError('Invalid username or password.');
    }
  };

  const handleBackClick = () => {
    router.push('/');
  };

  return (
    <div className={`min-h-screen bg-gray-50 flex flex-col`}>
      <SharedHeader />
      <main className="w-full max-w-lg flex-grow flex flex-col items-start justify-center self-center p-6">
        <button
          onClick={handleBackClick}
          className="mb-4 inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-700 text-slate-100 hover:bg-slate-600 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Home
        </button>
        <div className="bg-white border border-gray-200 rounded-2xl shadow-xl p-10">
          <h2 className="text-2xl font-bold text-gray-900">Agent Sign In</h2>
          <p className="text-gray-600 mt-2">Use demo credentials or your phone number to continue.</p>
          {loginError && (
            <div className="mt-4 bg-red-100 border border-red-200 text-red-700 px-4 py-3 rounded-lg relative" role="alert">
              <strong className="font-bold">Error:</strong>
              <span className="block sm:inline"> {loginError}</span>
            </div>
          )}
          <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
            <div>
              <div className="relative">
                <input
                  {...register('username')}
                  type="text"
                  placeholder="Enter your username"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  {...register('password')}
                  type="password"
                  placeholder="Password"
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
            >
              {isSubmitting ? 'Signing In...' : 'Sign In'}
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}