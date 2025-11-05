import Link from "next/link";
import { Shield, Mail, Phone, MapPin, Facebook, Instagram, MessageCircle } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-900 border-t border-slate-700 text-slate-300">
      <div className="max-w-7xl mx-auto px-4 py-2">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-18 mb-8">
          {/* Company Info */}
         

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-2xl font-semibold text-white mb-6">Quick Links</h4>
            <div className="space-y-3">
              <Link href="/" className="block text-base text-slate-300 hover:text-blue-400 transition-colors duration-200">
                Home
              </Link>
              <Link href="/customer-login" className="block text-base text-slate-300 hover:text-blue-400 transition-colors duration-200">
                Customer Portal
              </Link>
              <Link href="/agent-login" className="block text-base text-slate-300 hover:text-blue-400 transition-colors duration-200">
                Agent Dashboard
              </Link>
            
            </div>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h4 className="text-2xl font-semibold text-white mb-6">Support</h4>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-slate-300">
                <Mail className="w-5 h-5 text-blue-400" />
                <span className="text-base">support@kruxfinance.com</span>
              </div>
              <div className="flex items-center gap-3 text-slate-300">
                <Phone className="w-5 h-5 text-blue-400" />
                <span className="text-base">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-3 text-slate-300">
                <MapPin className="w-5 h-5 text-blue-400" />
                <span className="text-base"> Bengaluru, Karnataka 560103</span>
              </div>
            </div>
            <div className="pt-2">
             
            </div>
          </div>

          {/* Legal & Social */}
          <div className="space-y-4">
            <h4 className="text-2xl font-semibold text-white mb-6">Legal</h4>
            <div className="space-y-3">
              <Link href="#" className="block text-base text-slate-300 hover:text-blue-400 transition-colors duration-200">
                Privacy Policy
              </Link>
              <Link href="#" className="block text-base text-slate-300 hover:text-blue-400 transition-colors duration-200">
                Terms of Service
              </Link>
             
              <Link href="#" className="block text-base text-slate-300 hover:text-blue-400 transition-colors duration-200">
                GDPR Compliance
              </Link>
            </div>
            
            {/* Social Links */}
            <div className="pt-4">
              <div className="flex gap-4">
                <a 
                  href="#" 
                  className="w-9 h-9 bg-slate-800 hover:bg-blue-600 rounded-lg flex items-center justify-center transition-colors duration-200"
                  aria-label="Facebook"
                >
                  <Facebook className="w-5 h-5 text-slate-300" />
                </a>
                <a 
                  href="#" 
                  className="w-9 h-9 bg-slate-800 hover:bg-pink-600 rounded-lg flex items-center justify-center transition-colors duration-200"
                  aria-label="Instagram"
                >
                  <Instagram className="w-5 h-5 text-slate-300" />
                </a>
                <a 
                  href="#" 
                  className="w-9 h-9 bg-slate-800 hover:bg-green-600 rounded-lg flex items-center justify-center transition-colors duration-200"
                  aria-label="WhatsApp"
                >
                  <MessageCircle className="w-5 h-5 text-slate-300" />
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col md:flex-row items-center justify-center gap-4">
          <div className="flex items-center gap-2 text-slate-400">
            <span className="text-sm">© 2025 KRUX Finance. All rights reserved.</span>
          </div>
          
        </div>
      </div>
    </footer>
  );
}