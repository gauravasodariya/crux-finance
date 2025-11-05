import { MessageCircle, Users, Shield } from "lucide-react";

export default function EnhancedFeatures() {
  return (
    <section className="py-16 bg-gradient-to-r from-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Premium Support Experience</h2>
          <p className="text-lg text-gray-600">Advanced features for modern customer support</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="p-6 bg-white rounded-xl shadow-lg border border-gray-200">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <MessageCircle className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Smart Chat</h3>
            <p className="text-base text-gray-600">AI-powered conversations with intelligent routing and quick responses</p>
          </div>
          
          <div className="p-6 bg-white rounded-xl shadow-lg border border-gray-200">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Team Collaboration</h3>
            <p className="text-base text-gray-600">Seamless agent coordination with assignment and escalation features</p>
          </div>
          
          <div className="p-6 bg-white rounded-xl shadow-lg border border-gray-200">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Secure & Reliable</h3>
            <p className="text-base text-gray-600">Enterprise-grade security with 99.9% uptime guarantee</p>
          </div>
        </div>
      </div>
    </section>
  );
}