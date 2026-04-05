import React, { useLayoutEffect, useRef } from 'react';
import { useLanguage } from '../context/useLanguage';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';
import gsap from 'gsap';
import { Check } from 'lucide-react';

const CTA = () => {
  const { t, isRTL } = useLanguage();
  const ctaRef = useRef(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  const benefits = t('cta.benefits') || [];

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set('.cta-content > *', { clearProps: 'all', opacity: 1, y: 0 });
        return;
      }

      gsap.fromTo('.cta-content > *',
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: ctaRef.current,
            start: 'top 80%',
          }
        }
      );
    }, ctaRef);
    return () => ctx.revert();
  }, [isRTL, prefersReducedMotion]);

  return (
    <section ref={ctaRef} id="contact" className="py-24 md:py-32 bg-Void text-center px-6 relative overflow-hidden">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <img 
          src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=2800&q=80" 
          alt="" 
          className="absolute inset-0 w-full h-full object-cover opacity-[0.30] grayscale" 
        />
        <div className="absolute inset-0 bg-gradient-to-b from-Void/90 via-Void/40 to-Void/90"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,theme('colors.Accent/15%'),transparent_50%)]" />
      </div>
      <div className="relative z-10 max-w-3xl mx-auto cta-content">
        <div className="mb-6">
          <span className="section-kicker border-White/10 bg-White/5 text-Sand-Soft shadow-none">{isRTL ? 'ابدأ بوضوح' : 'Start with clarity'}</span>
        </div>
        <h2 className="text-safe text-display-md font-bold font-sans text-Snow mb-6">
          {t('cta.title')}
        </h2>
        <p className="text-safe text-lg md:text-xl text-Muted-Light mb-10 text-balance leading-relaxed">
          {t('cta.subtext')}
        </p>

        {/* What you'll get */}
        <div className="flex flex-col gap-3 max-w-md mx-auto mb-12 text-start">
          {benefits.map((benefit, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="flex-shrink-0 w-5 h-5 rounded-full bg-Mint/20 flex items-center justify-center">
                <Check size={12} className="text-Mint" />
              </div>
              <span className="text-safe min-w-safe text-Muted-Light text-sm font-sans">{benefit}</span>
            </div>
          ))}
        </div>

        <div className="flex flex-col items-center gap-6">
          <a
            href="https://cal.com/abdelrahman-abbas/discovery-call"
            target="_blank"
            rel="noreferrer"
            className="btn-magnetic btn-wipe btn-accent px-10 py-5 rounded-full bg-Accent text-White text-lg font-medium transition-shadow duration-300"
          >
            <span>{t('cta.primary')}</span>
            <span className="sr-only"> (opens in new tab)</span>
          </a>
          <a
            href="mailto:abdelrahman.abbas@itqan.tech"
            className="text-Muted-Light hover:text-Snow transition-colors text-sm font-mono"
          >
            {t('cta.secondary')}
          </a>
        </div>
      </div>
    </section>
  );
};

export default CTA;
