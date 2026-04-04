import React, { useEffect, useRef } from 'react';
import { useLanguage } from '../context/useLanguage';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';
import gsap from 'gsap';

const Services = () => {
  const { t, isRTL } = useLanguage();

  const cardThemes = [
    { tone: 'bg-Accent-Muted border-Accent/12 text-Accent', panel: 'border-Accent/12' },
    { tone: 'bg-Sand-Soft border-Sand/16 text-Sand', panel: 'border-Sand/16' },
    { tone: 'bg-Mint-Soft border-Mint/16 text-Mint', panel: 'border-Mint/16' },
  ];

  return (
    <section id="services" aria-labelledby="services-heading" className="py-24 md:py-32 bg-Snow">
      <div className="max-w-7xl mx-auto px-6">
        <h2 id="services-heading" className="sr-only">{isRTL ? 'خدماتنا' : 'Our Services'}</h2>
        <div className="mb-12 flex justify-center lg:justify-start">
          <span className="section-kicker">{isRTL ? 'ما نبنيه' : 'What we build'}</span>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <SaasCard title={t('services.saas.title')} desc={t('services.saas.desc')} tag={t('services.saas.tag')} theme={cardThemes[0]} />
          <MobileCard title={t('services.mobile.title')} desc={t('services.mobile.desc')} tag={t('services.mobile.tag')} theme={cardThemes[1]} />
          <WebCard title={t('services.web.title')} desc={t('services.web.desc')} tag={t('services.web.tag')} theme={cardThemes[2]} />
        </div>
      </div>
    </section>
  );
};

const CardLayout = ({ title, desc, tag, children, theme }) => {
  return (
    <div className="surface-tint relative flex min-h-[500px] flex-col overflow-hidden rounded-[2rem] border border-Border/60 bg-Surface p-8 shadow-[0_14px_38px_rgba(24,24,27,0.045)] group">
      <div className={`absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-current to-transparent opacity-70 ${theme.textLine || theme.tone}`}></div>
      <div className="relative flex flex-1 min-w-safe items-center justify-center">
        {children}
      </div>
      <div className="z-10 mt-8 min-w-safe">
        <span className={`mb-4 inline-flex max-w-full rounded-full border px-3 py-1 text-xs font-mono shadow-sm ${theme.tone}`}>
          {tag}
        </span>
        <h3 className="text-safe text-2xl font-bold font-sans text-Ink mb-2">{title}</h3>
        <p className="text-safe text-Muted">{desc}</p>
      </div>
    </div>
  );
};

// 1. SaaS Card - Minimal Data Graph
const SaasCard = ({ title, desc, tag, theme }) => {
  const pathRef = useRef(null);
  const containerRef = useRef(null);
  const dataRef = useRef(null);
  const countRef = useRef(124);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    let ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set(pathRef.current, { strokeDashoffset: 0, opacity: 1 });
        return;
      }

      const tl = gsap.timeline({ repeat: -1 });
      tl.to(pathRef.current, {
        strokeDashoffset: 0,
        duration: 2.5,
        ease: 'power2.inOut',
        onUpdate: () => {
          countRef.current += Math.floor(Math.random() * 3);
          if (dataRef.current) {
            dataRef.current.textContent = `$${countRef.current},400`;
          }
        }
      });
      tl.to(pathRef.current, { opacity: 0, duration: 0.5, delay: 1 });
      tl.set(pathRef.current, { strokeDashoffset: 350, opacity: 1 });
    }, containerRef);
    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <CardLayout title={title} desc={desc} tag={tag} theme={theme}>
      <div ref={containerRef} className="relative w-full max-w-[240px] flex flex-col items-center">
        <div className="flex flex-col items-center mb-6 z-10 relative">
          <div ref={dataRef} className="text-4xl font-bold font-sans text-Ink tracking-tight drop-shadow-sm">$124,400</div>
          <div className="text-[10px] text-Muted font-mono uppercase tracking-[0.2em] mt-1">Live MRR</div>
        </div>
        
        <div className="w-full h-[100px] relative overflow-hidden flex items-end pb-2 mix-blend-multiply opacity-80">
          <div className="absolute inset-0" style={{ backgroundSize: '16px 16px', backgroundImage: 'linear-gradient(to right, theme("colors.Accent / 5%") 1px, transparent 1px), linear-gradient(to bottom, theme("colors.Accent / 5%") 1px, transparent 1px)' }}></div>
          <svg aria-hidden="true" className="w-full h-full relative z-10 overflow-visible" viewBox="0 0 200 100" preserveAspectRatio="none">
            <path 
              ref={pathRef}
              d="M0,90 C40,50 70,80 110,40 C140,10 170,60 200,10" 
              fill="none" 
              stroke="currentColor"
              className="text-Accent"
              strokeWidth="3" 
              strokeLinecap="round"
              strokeDasharray="350"
              strokeDashoffset="350"
            />
          </svg>
        </div>
      </div>
    </CardLayout>
  );
};

// 2. Mobile Card - Distilled Floating Interaction
const MobileCard = ({ title, desc, tag, theme }) => {
  const containerRef = useRef(null);
  const sheetRef = useRef(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    let ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set(sheetRef.current, { y: '15%' });
        return;
      }

      const tl = gsap.timeline({ repeat: -1, repeatDelay: 1.5 });
      tl.set(sheetRef.current, { y: '65%', opacity: 0.5 });
      tl.to(sheetRef.current, { y: '10%', opacity: 1, duration: 0.8, ease: 'power3.out' });
      tl.to({}, { duration: 1.2 });
      tl.to(sheetRef.current, { y: '65%', opacity: 0.5, duration: 0.6, ease: 'power2.inOut' });
      
    }, containerRef);
    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <CardLayout title={title} desc={desc} tag={tag} theme={theme}>
      <div ref={containerRef} className="relative w-[160px] h-[220px] overflow-hidden flex items-end justify-center perspective-1000">
        
        {/* Soft Skeleton Wireframe */}
        <div className="absolute inset-0 border-x border-t border-Border/40 rounded-t-[2rem] bg-gradient-to-b from-White/60 to-transparent flex flex-col items-center p-5 opacity-70">
          <div className="w-10 h-1 bg-Surface rounded-full mb-6"></div>
          <div className="w-full h-2 bg-Border/20 rounded-full mb-3"></div>
          <div className="w-3/4 h-2 bg-Border/20 rounded-full mb-3"></div>
        </div>
        
        {/* Floating Panel Panel */}
        <div 
          ref={sheetRef}
          className="relative w-[140px] h-[160px] bg-White rounded-t-2xl shadow-[0_0_30px_rgba(0,0,0,0.04)] border border-Border/30 flex flex-col items-center pt-3 px-4"
        >
          <div className="w-8 h-1 bg-Border/50 rounded-full mb-6"></div>
          <div className="w-full h-1.5 bg-Sand/30 rounded-full mb-3"></div>
          <div className="w-2/3 h-1.5 bg-Border/20 rounded-full mb-3"></div>
          <div className="w-1/2 h-1.5 bg-Border/20 rounded-full mb-3"></div>
        </div>
      </div>
    </CardLayout>
  );
};

// 3. Web Card - Abstract API Constellation
const WebCard = ({ title, desc, tag, theme }) => {
  const containerRef = useRef(null);
  const nodesRef = useRef([]);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    let ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set(nodesRef.current, { clearProps: 'all' });
        gsap.set('.data-packet', { opacity: 0.7, scale: 1 });
        return;
      }

      gsap.to(nodesRef.current, {
        y: 'random(-10, 10)',
        x: 'random(-5, 5)',
        duration: "random(2, 4)",
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        stagger: 0.3
      });

      const tl = gsap.timeline({ repeat: -1 });
      tl.fromTo('.data-packet', 
        { scale: 0, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.4 }
      );
      tl.to('.data-packet', {
        x: (index) => index === 0 ? -45 : index === 1 ? 45 : 0,
        y: (index) => index === 0 ? -35 : index === 1 ? -35 : 45,
        opacity: 0,
        duration: 1.2,
        ease: 'power2.out',
        stagger: 0.15
      });

    }, containerRef);
    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <CardLayout title={title} desc={desc} tag={tag} theme={theme}>
      <div ref={containerRef} className="relative w-[180px] h-[180px] flex items-center justify-center mix-blend-multiply opacity-80">
        
        {/* Abstract Core */}
        <div className="absolute z-20 w-8 h-8 rounded-full border border-Mint/30 bg-Mint/10 flex items-center justify-center">
          <div className="w-2.5 h-2.5 bg-Mint rounded-full animate-[pulse_3s_infinite]"></div>
        </div>

        {/* Data Packets */}
        <div className="data-packet absolute z-10 w-1.5 h-1.5 bg-Mint rounded-full blur-[0.5px]"></div>
        <div className="data-packet absolute z-10 w-1.5 h-1.5 bg-Mint rounded-full blur-[0.5px]"></div>
        <div className="data-packet absolute z-10 w-1.5 h-1.5 bg-Mint rounded-full blur-[0.5px]"></div>

        {/* Distributed Elements */}
        <div 
          ref={el => nodesRef.current[0] = el}
          className="absolute z-10 text-[9px] text-Muted-Light/60 font-mono tracking-widest -translate-x-[55px] -translate-y-[45px]"
        >UI</div>
        <div 
          ref={el => nodesRef.current[1] = el}
          className="absolute z-10 text-[9px] text-Muted-Light/60 font-mono tracking-widest translate-x-[55px] -translate-y-[45px]"
        >DB</div>
        <div 
          ref={el => nodesRef.current[2] = el}
          className="absolute z-10 text-[9px] text-Muted-Light/60 font-mono tracking-widest translate-y-[55px]"
        >API</div>

        {/* Connecting Lines */}
        <svg aria-hidden="true" className="absolute inset-0 w-full h-full pointer-events-none z-0 opacity-40" viewBox="0 0 200 200">
          <path d="M100 100 L45 55" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" className="text-Border"/>
          <path d="M100 100 L155 55" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" className="text-Border"/>
          <path d="M100 100 L100 155" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" className="text-Border"/>
        </svg>

      </div>
    </CardLayout>
  );
};

export default Services;
