import React, { useLayoutEffect, useRef } from 'react';
import { useLanguage } from '../context/useLanguage';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';
import gsap from 'gsap';
import { Check } from 'lucide-react';

const BuiltFor = () => {
  const { t } = useLanguage();
  const sectionRef = useRef(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  const items = t('builtFor.items') || [];

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set('.builtfor-item', { clearProps: 'all', opacity: 1, x: 0 });
        return;
      }

      gsap.fromTo('.builtfor-item',
        { x: -20, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.12,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
          }
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <section ref={sectionRef} aria-labelledby="built-for-heading" className="relative py-24 md:py-32 bg-Void overflow-hidden">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <img 
          src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=2800&q=80" 
          alt="" 
          className="absolute inset-0 w-full h-full object-cover opacity-[0.35] mix-blend-screen grayscale" 
        />
        <div className="absolute inset-0 bg-gradient-to-b from-Void/90 via-Void/20 to-Void/90"></div>
      </div>
      <div className="relative z-10 max-w-3xl mx-auto px-6">
        <div className="mb-6">
          <span className="section-kicker border-White/10 bg-White/5 text-Mint-Soft shadow-none">{t('builtFor.kicker')}</span>
        </div>
        <h2 id="built-for-heading" className="text-display-sm font-bold font-sans text-Snow mb-10">
          {t('builtFor.title')}
        </h2>
        <div className="flex flex-col gap-5">
          {items.map((item, i) => (
            <div key={i} className="builtfor-item flex items-start gap-4">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-Mint/20 flex items-center justify-center mt-0.5">
                <Check size={14} className="text-Mint" />
              </div>
              <p className="text-safe min-w-safe text-lg text-Muted-Light font-sans leading-relaxed">{item}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BuiltFor;
