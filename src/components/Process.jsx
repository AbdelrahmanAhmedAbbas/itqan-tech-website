import React, { useLayoutEffect, useRef } from 'react';
import { useLanguage } from '../context/useLanguage';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';
import gsap from 'gsap';

const Process = () => {
  const { t, isRTL } = useLanguage();
  const sectionRef = useRef(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  const steps = ['step1', 'step2', 'step3', 'step4'];

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set('.process-step, .connect-line', { clearProps: 'all', opacity: 1, y: 0, scaleX: 1 });
        return;
      }

      gsap.fromTo('.process-step',
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
          }
        }
      );
      
      // Animated connecting line path drawing
      gsap.fromTo('.connect-line', 
        { scaleX: 0 },
        {
          scaleX: 1,
          transformOrigin: isRTL ? 'right center' : 'left center',
          duration: 1.5,
          ease: 'power2.inOut',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 60%',
          }
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, [isRTL, prefersReducedMotion]);

  return (
    <section id="process" ref={sectionRef} aria-labelledby="process-heading" className="py-24 md:py-32 bg-Snow relative">
      <div className="absolute inset-0 opacity-50 dark-grid"></div>
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        <div className="mb-20">
          <div className="mb-5">
            <span className="section-kicker">{isRTL ? 'تنفيذ واضح' : 'Clear delivery'}</span>
          </div>
          <h2 id="process-heading" className="text-display-md font-bold font-sans text-Ink">{isRTL ? 'عمليتنا' : 'Our Process'}</h2>
        </div>

        <div className="relative">
          {/* Desktop Connecting Line — only visible at 4-col layout */}
          <div className="hidden lg:block absolute top-[28px] left-8 right-8 h-px bg-Border/20">
            <div className="connect-line w-full h-full bg-gradient-to-r from-Accent via-Sand to-Mint"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-10 lg:gap-8">
            {steps.map((s) => (
              <div key={s} className="process-step relative">
                <div className="w-14 h-14 rounded-2xl surface-tint bg-Surface border border-Accent/15 flex items-center justify-center text-Accent font-mono font-bold text-lg mb-6 shadow-sm relative z-10 mx-auto md:mx-0">
                  {t(`process.${s}.num`)}
                </div>
                <div className="text-center md:text-start">
                  <h3 className="text-safe text-xl font-bold font-sans text-Ink mb-3">{t(`process.${s}.title`)}</h3>
                  <p className="text-safe text-Muted max-w-xs mx-auto md:mx-0 text-sm leading-relaxed text-balance">
                    {t(`process.${s}.desc`)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default Process;
