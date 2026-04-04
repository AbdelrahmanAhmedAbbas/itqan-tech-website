import React, { useLayoutEffect, useRef } from 'react';
import { useLanguage } from '../context/useLanguage';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';
import gsap from 'gsap';

const Philosophy = () => {
  const { t, isRTL } = useLanguage();
  const sectionRef = useRef(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set('.phil-text, .phil-bg', { clearProps: 'all', opacity: 1, y: 0, yPercent: 0 });
        return;
      }

      gsap.fromTo('.phil-text', 
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
          }
        }
      );
      
      gsap.to('.phil-bg', {
        yPercent: 20,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [isRTL, prefersReducedMotion]);

  return (
    <section ref={sectionRef} aria-labelledby="philosophy-heading" className="relative py-32 md:py-48 bg-Void overflow-hidden flex items-center">
      {/* Background Grid & Agency Image */}
      <div className="absolute inset-0 z-0 pointer-events-none bg-Void">
        <img 
          src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=2800&q=80" 
          alt="" 
          className="absolute inset-0 w-full h-full object-cover opacity-[0.25] grayscale" 
        />
        <div className="absolute inset-0 bg-gradient-to-b from-Void/80 via-transparent to-Void/80"></div>
        <div className="absolute inset-0 opacity-[0.14] dark-grid"></div>
        <div className="phil-bg absolute -right-12 top-16 h-64 w-64 rounded-full bg-[radial-gradient(circle,theme('colors.Accent/14%'),transparent_68%)] blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 w-full">
        <div className="flex flex-col gap-10">
          <span className="phil-text section-kicker w-max border-White/10 bg-White/5 text-Sand-Soft shadow-none">
            {isRTL ? 'كيف نعمل' : 'How we work'}
          </span>
          <p className="phil-text text-safe text-xl md:text-2xl text-Muted-Light font-sans max-w-2xl text-balance">
            {t('philosophy.line1')}
          </p>
          <h2 id="philosophy-heading" className="phil-text text-safe text-display-lg font-sans text-Snow">
            {t('philosophy.line2')}
            <span className="font-serif italic text-Sand-Soft"> {t('philosophy.keyword')}</span>
          </h2>
        </div>
      </div>
    </section>
  );
};

export default Philosophy;
