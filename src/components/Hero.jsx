import React, { useLayoutEffect, useRef } from 'react';
import { useLanguage } from '../context/useLanguage';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';
import gsap from 'gsap';
import { ChevronDown } from 'lucide-react';

const Hero = () => {
  const { t, isRTL } = useLanguage();
  const heroRef = useRef(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set('.hero-anim, .scroll-indicator', { clearProps: 'all', opacity: 1, y: 0, scale: 1 });
        return;
      }

      // Text stagger up
      gsap.fromTo('.hero-anim', 
        { y: 50, opacity: 0, scale: 0.95 },
        { 
          y: 0, 
          opacity: 1, 
          scale: 1,
          duration: 1.2, 
          stagger: 0.2, 
          ease: 'power4.out',
          delay: 0.2
        }
      );
      
      gsap.to('.scroll-indicator', {
        y: 12,
        opacity: 1,
        repeat: -1,
        yoyo: true,
        duration: 1.5,
        ease: 'power2.inOut'
      });
    }, heroRef);

    return () => ctx.revert();
  }, [isRTL, prefersReducedMotion]);

  return (
    <section 
      ref={heroRef}
      className="relative min-h-[100dvh] bg-Void text-White overflow-hidden flex items-center justify-center pt-20"
    >
      {/* Cinematic Image Background */}
      <div className="absolute inset-0 z-0 bg-Void">
        <img 
          src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=2800&q=80" 
          alt="" 
          className="absolute inset-0 w-full h-full object-cover opacity-40 pointer-events-none" 
        />
        <div className="absolute inset-0 opacity-40 dark-grid mix-blend-overlay"></div>
        <div className="ambient-orb absolute -left-16 top-20 h-64 w-64 rounded-full bg-Accent/30 blur-[100px] mix-blend-screen pointer-events-none"></div>
        <div className="ambient-orb absolute right-0 top-28 h-56 w-56 rounded-full bg-Sand/15 blur-[100px] mix-blend-screen pointer-events-none"></div>
        
        {/* Soft edge masking */}
        <div className="absolute inset-0 bg-gradient-to-b from-Void/20 via-transparent to-Void/40"></div>
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-b from-transparent to-Void"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-5xl mx-auto px-6 flex flex-col items-center text-center">
        
        <div className="hero-anim mb-6">
          <span className="section-kicker border-White/10 bg-White/5 text-Sand-Soft shadow-none">
            {isRTL ? 'شريك تقني موثوق' : 'Trusted technical partner'}
          </span>
        </div>

        <h1 className="flex flex-col gap-4 mb-8 w-full max-w-4xl text-safe">
          <span className="hero-anim text-safe font-sans font-bold text-display-lg text-Snow">
            {t('hero.line1')}
          </span>
          <span className="hero-anim text-safe font-serif italic text-display-xl text-Sand-Soft drop-shadow-[0_4px_20px_theme('colors.Sand/10%')]">
            {t('hero.line2')}
          </span>
        </h1>
        
        <p className="hero-anim text-safe max-w-2xl text-lg md:text-2xl text-Muted-Light font-sans mb-12 leading-relaxed text-balance">
          {t('hero.subtext')}
        </p>

        <div className="hero-anim">
          <a
            href="https://cal.com/abdelrahman-abbas/discovery-call"
            target="_blank"
            rel="noreferrer"
            className="btn-magnetic btn-wipe btn-accent inline-flex items-center px-6 py-4 md:px-10 md:py-5 rounded-full bg-Accent text-White text-base md:text-lg font-medium transition-shadow"
          >
            <span>{t('hero.cta')}</span>
            <span className="sr-only"> (opens in new tab)</span>
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 opacity-0 scroll-indicator">
        <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-Muted-Light">{t('hero.scroll')}</span>
        <ChevronDown size={20} className="text-Sand/80" />
      </div>
    </section>
  );
};

export default Hero;
