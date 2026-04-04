import React, { useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import SocialProof from './components/SocialProof';
import Services from './components/Services';
import Philosophy from './components/Philosophy';
import BuiltFor from './components/BuiltFor';
import Portfolio from './components/Portfolio';
import MidCTA from './components/MidCTA';
import Process from './components/Process';
import Testimonials from './components/Testimonials';
import FAQ from './components/FAQ';
import CTA from './components/CTA';
import Footer from './components/Footer';

function App() {
  // Prevent hydration flash if needed
  useEffect(() => {
    document.body.style.visibility = 'visible';
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-Snow font-sans text-Ink">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[38rem] bg-[radial-gradient(circle_at_top,rgba(24,90,219,0.08),transparent_58%)]" />
      <div className="pointer-events-none absolute right-0 top-[28rem] h-[24rem] w-[24rem] rounded-full bg-[radial-gradient(circle,rgba(184,138,90,0.07),transparent_65%)] blur-3xl" />
      <div className="pointer-events-none absolute left-0 top-[76rem] h-[24rem] w-[24rem] rounded-full bg-[radial-gradient(circle,rgba(47,125,104,0.055),transparent_68%)] blur-3xl" />
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-Accent focus:text-White focus:rounded-lg focus:shadow-lg focus:text-sm focus:font-medium"
      >
        Skip to content
      </a>
      <Navbar />
      <main id="main-content" className="relative z-10">
        <Hero />
        <SocialProof />
        <Services />
        <Philosophy />
        <BuiltFor />
        <Portfolio />
        <MidCTA />
        <Process />
        <Testimonials />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}

export default App;
