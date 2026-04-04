import React, { useLayoutEffect, useRef } from 'react';
import { useLanguage } from '../context/useLanguage';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';
import gsap from 'gsap';

const SocialProof = () => {
  const { t } = useLanguage();
  const barRef = useRef(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  const stats = ['stat1', 'stat2', 'stat3', 'stat4'];

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set('.proof-stat', { clearProps: 'all', opacity: 1, y: 0 });
        return;
      }

      gsap.fromTo('.proof-stat',
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: 'power2.out',
          delay: 1.4,
        }
      );
    }, barRef);
    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <section ref={barRef} aria-label={t('socialProof.stat1.label') ? undefined : 'Statistics'} className="bg-Void border-t border-Accent/10 py-10 px-6">
      <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-8">
        {stats.map((s) => (
          <div key={s} className="proof-stat min-w-safe flex flex-col items-center text-center gap-1">
            <span className="text-4xl md:text-5xl font-bold font-mono text-Snow pb-1">
              {t(`socialProof.${s}.number`)}
            </span>
            <span className="text-safe max-w-[12rem] text-xs font-mono text-Muted-Light uppercase tracking-wider">
              {t(`socialProof.${s}.label`)}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default SocialProof;
