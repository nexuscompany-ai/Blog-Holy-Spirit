
import React, { useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import WhyUs from './components/WhyUs';
import BlogSection from './components/BlogSection';
import CTABanner from './components/CTABanner';
import Footer from './components/Footer';
import AdminLayout from './components/admin/AdminLayout';

const App: React.FC = () => {
  const [isAdmin, setIsAdmin] = useState(false);

  if (isAdmin) {
    return <AdminLayout exitAdmin={() => setIsAdmin(false)} />;
  }

  return (
    <div className="min-h-screen flex flex-col selection:bg-[#cfec0f] selection:text-black">
      <Header onAdminClick={() => setIsAdmin(true)} />
      <main className="flex-grow">
        <Hero />
        <WhyUs />
        <BlogSection />
        <CTABanner />
      </main>
      <Footer />
    </div>
  );
};

export default App;
