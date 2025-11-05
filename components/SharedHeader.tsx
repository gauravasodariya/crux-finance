"use client";

import Link from "next/link";
import { ReactNode } from "react";
import { ArrowRight, LogOut, User, Shield } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAppContext } from "@/context/AppContext";
import { removeFromStorage, STORAGE_KEYS } from "@/lib/storage";

type Props = {
  logoText?: string;
  logoGradient?: string;
  logoSize?: 'sm' | 'md' | 'lg';
  showLogoText?: boolean;
};

export default function SharedHeader({ 
  logoText = "KRUX Finance",
  logoGradient = "from-blue-500 to-indigo-500",
  logoSize = 'md',
  showLogoText = true
}: Props) {
  const router = useRouter();
  const { state, dispatch } = useAppContext();
  const isLoggedIn = Boolean(state.currentUser);

  const handleLogout = () => {
    dispatch({ type: "LOGOUT" });
    removeFromStorage(STORAGE_KEYS.CURRENT_USER);
    removeFromStorage(STORAGE_KEYS.USER_TYPE);
    router.push("/");
  };

  const logoSizes = {
    sm: 'w-10 h-10',
    md: 'w-12 h-12', 
    lg: 'w-14 h-14'
  };

  const textSizes = {
    sm: 'text-xl',
    md: 'text-2xl',
    lg: 'text-3xl'
  };

  const renderRightAction = () => {
    if (isLoggedIn) {
      return (
        <button
          onClick={handleLogout}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-red-300 bg-white text-gray-800 hover:bg-red-50 shadow-sm"
        >
          <span className="font-medium">Logout</span>
          <LogOut className="w-4 h-4 text-red-500" />
        </button>
      );
    }

    return (
      <details className="relative">
        <summary className="list-none inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-300 bg-white text-gray-800 hover:bg-gray-50 cursor-pointer shadow-sm">
          <span className="font-medium">Login</span>
          <ArrowRight className="w-4 h-4 text-gray-600" />
        </summary>
        <div className="absolute right-0 mt-2 w-56 bg-white border rounded-xl shadow-lg p-2 z-50">
          <Link href="/customer-login" className="inline-flex items-center gap-2 w-full px-3 py-2 rounded-md hover:bg-blue-50 text-gray-900">
            <User className="w-4 h-4 text-indigo-600 font-medium" />
            <span>Customer Login</span>
          </Link>
          <Link href="/agent-login" className="inline-flex items-center gap-2 w-full px-3 py-2 rounded-md hover:bg-indigo-50 text-gray-900">
            <Shield className="w-4 h-4 text-purple-600 font-medium" />
            <span>Agent Login</span>
          </Link>
        </div>
      </details>
    );
  };

  return (
    <header className="border-b bg-slate-800/90 backdrop-blur-md border-slate-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className={`${logoSizes[logoSize]} bg-gradient-to-br ${logoGradient} rounded-2xl flex items-center justify-center shadow-lg`}>
            <span className="text-white font-bold text-xl">K</span>
          </div>
          {showLogoText && (
            <div>
              <span className={`${textSizes[logoSize]} font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent`}>
                {logoText}
              </span>
            </div>
          )}
        </Link>
        <div className="flex items-center gap-2 text-slate-200">{renderRightAction()}</div>
      </div>
    </header>
  );
}