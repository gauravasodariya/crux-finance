import LandingPage from "@/components/LandingPage";
import SharedHeader from '@/components/SharedHeader';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <div className={`min-h-screen bg-gray-50`}>
      <SharedHeader />
      <main>
        <LandingPage />
      </main>
      <Footer />
    </div>
  );
}