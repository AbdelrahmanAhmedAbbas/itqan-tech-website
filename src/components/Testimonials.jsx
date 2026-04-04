import React, { useLayoutEffect, useRef } from 'react';
import { useLanguage } from '../context/useLanguage';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';
import gsap from 'gsap';

const Testimonials = () => {
  const { t, isRTL } = useLanguage();
  const sectionRef = useRef(null);
  const prefersReducedMotion = usePrefersReducedMotion();
  
  const reviews = ['t1', 't2', 't3'];

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set('.testim-card', { clearProps: 'all', opacity: 1, y: 0 });
        return;
      }

      gsap.fromTo('.testim-card',
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
          }
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, [isRTL, prefersReducedMotion]);

  return (
    <section ref={sectionRef} aria-labelledby="testimonials-heading" className="py-24 md:py-32 bg-Surface">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-10 text-center md:text-start">
          <span className="section-kicker">{isRTL ? 'ثقة مبنية على النتائج' : 'Confidence earned in delivery'}</span>
          <h2 id="testimonials-heading" className="sr-only">{isRTL ? 'شهادات العملاء' : 'Testimonials'}</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reviews.map((r, i) => (
            <div key={i} className="testim-card min-w-0 surface-tint bg-Snow rounded-[2rem] p-8 border border-Border/60 shadow-[0_8px_24px_theme('colors.Ink/4%')] relative overflow-hidden">
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-Accent/40 to-transparent"></div>
              <div className="text-5xl font-serif text-Sand opacity-60 leading-none mb-4">"</div>
              <p className="text-safe text-Ink font-sans text-lg mb-8 leading-relaxed">
                {t(`testimonials.${r}.quote`)}
              </p>
              <div>
                <p className="text-safe font-bold font-sans text-Ink">{t(`testimonials.${r}.name`)}</p>
                <p className="text-safe text-xs text-Muted font-mono mt-1">
                  {t(`testimonials.${r}.role`)} — {t(`testimonials.${r}.company`)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
