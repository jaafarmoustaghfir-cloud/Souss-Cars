import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { FeaturesBar } from './components/FeaturesBar';
import { CategoriesSection } from './components/CategoriesSection';
import { VehicleCatalog } from './components/VehicleCatalog';
import { WhyChooseUs } from './components/WhyChooseUs';
import { RentalConditions } from './components/RentalConditions';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { VehicleDetailModal } from './components/VehicleDetailModal';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { AdminLogin } from './components/admin/AdminLogin';
import { AdminDashboard } from './components/admin/AdminDashboard';

const MainContent: React.FC = () => {
  const { currentView, isAdminLoggedIn } = useApp();

  if (currentView === 'admin') {
    if (!isAdminLoggedIn) {
      return <AdminLogin />;
    }
    return <AdminDashboard />;
  }

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white flex flex-col selection:bg-[#F5C518] selection:text-[#0D0D0D]">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <FeaturesBar />
        <CategoriesSection />
        <VehicleCatalog />
        <WhyChooseUs />
        <RentalConditions />
        <ContactSection />
      </main>
      <Footer />
      
      {/* Vehicle details & booking interactive modal */}
      <VehicleDetailModal />

      {/* Floating quick WhatsApp trigger */}
      <FloatingWhatsApp />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
