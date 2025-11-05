// File: components/CustomerLogin.tsx
'use client';

import React from 'react';
import { ArrowLeft, AlertCircle, Phone } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAppContext } from '@/context/AppContext';
import { MOCK_CUSTOMERS } from '@/lib/mockData';
import { saveToStorage, STORAGE_KEYS } from '@/lib/storage';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import SharedHeader from '@/components/SharedHeader';
import Footer from '@/components/Footer';

type FormValues = {
  phone: string;
};

const schema = z.object({
  phone: z
    .string()
    .min(10, 'Phone number must be at least 10 digits')
    .max(15, 'Phone number cannot exceed 15 digits')
    .regex(/^\+?\d{10,15}$/i, 'Use format like +919876543210'),
});

export default function CustomerLogin() {
  const router = useRouter(); // Added useRouter
  const { dispatch } = useAppContext();
  const [loginError, setLoginError] = React.useState<string | null>(null);

  const { register, handleSubmit, formState: { errors, isSubmitting }, setValue } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { phone: '' },
    mode: 'onChange',
  });

  const onSubmit = async (values: FormValues) => {
    await new Promise(resolve => setTimeout(resolve, 800));
    const customer = MOCK_CUSTOMERS.find(c => c.phone === values.phone);
    if (customer) {
      dispatch({ type: 'LOGIN', payload: { user: customer, userType: 'customer' } });
      saveToStorage(STORAGE_KEYS.CURRENT_USER, customer);
      saveToStorage(STORAGE_KEYS.USER_TYPE, 'customer');
      router.push('/customer-chat');
    } else {
      setLoginError('No customer found with this phone number.');
    }
  };

  const handleBackClick = () => { // Added handleBackClick
    router.push("/");
  };

  return (
    <div className={`min-h-screen bg-gray-50 flex flex-col`}>
      <SharedHeader />
      <main className="w-full max-w-lg flex-grow flex flex-col items-start justify-center self-center p-6">
        <button // Added back button
          onClick={handleBackClick}
          className="mb-4 inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-700 text-slate-100 hover:bg-slate-600 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Home
        </button>
        <div className="bg-white border border-gray-200 rounded-2xl shadow-xl p-10">
          <h2 className="text-2xl font-bold text-gray-900">Customer Sign In</h2>
          <p className="text-gray-600 mt-2">Enter your phone number to access your tickets.</p>
          {loginError && (
            <div className="mt-4 bg-red-100 border border-red-200 text-red-700 px-4 py-3 rounded-lg relative" role="alert">
              <strong className="font-bold">Error:</strong>
              <span className="block sm:inline"> {loginError}</span>
            </div>
          )}
          <form onSubmit={handleSubmit(onSubmit)} className="mt-6">
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
              {...register('phone')}
              type="tel"
              placeholder="Enter Mobile number"
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {errors.phone && <p className="text-red-500 text-sm mt-2 flex items-center gap-1"><AlertCircle className='w-4 h-4'/>{errors.phone.message}</p>}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-4 bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
          >
            {isSubmitting ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
      </div>
      
      </main>
      <Footer />
    </div>
    );
};