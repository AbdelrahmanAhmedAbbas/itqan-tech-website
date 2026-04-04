import React, { useState, useLayoutEffect, useRef } from 'react';
import { useLanguage } from '../context/useLanguage';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';
import gsap from 'gsap';
import { ChevronDown } from 'lucide-react';

const FAQ = () => {
  const { t } = useLanguage();
  const sectionRef = useRef(null);
  const [openIndex, setOpenIndex] = useState(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  const items = t('faq.items') || [];

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set('.faq-item', { clearProps: 'all', opacity: 1, y: 0 });
        return;
      }

      gsap.fromTo('.faq-item',
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.08,
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
    <section ref={sectionRef} aria-labelledby="faq-heading" className="py-24 md:py-32 bg-Surface">
      <div className="max-w-3xl mx-auto px-6">
        <div className="mb-5">
          <span className="section-kicker">{t('faq.kicker')}</span>
        </div>
        <h2 id="faq-heading" className="text-display-md font-bold font-sans text-Ink mb-12">
          {t('faq.title')}
        </h2>
        <div className="flex flex-col gap-3">
          {items.map((item, i) => (
            <div
              key={i}
              className="faq-item surface-tint bg-Snow rounded-2xl border border-Border/60 shadow-[0_10px_26px_rgba(24,24,27,0.04)] overflow-hidden"
            >
              <button
                id={`faq-button-${i}`}
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-start justify-between p-6 text-start gap-4"
                aria-expanded={openIndex === i}
                aria-controls={`faq-panel-${i}`}
              >
                <span className="text-safe min-w-safe text-lg font-medium font-sans text-Ink">{item.q}</span>
                <ChevronDown
                  size={20}
                  className={`flex-shrink-0 text-Accent transition-transform duration-300 ${openIndex === i ? 'rotate-180' : ''}`}
                  aria-hidden="true"
                />
              </button>
              <div
                id={`faq-panel-${i}`}
                role="region"
                aria-labelledby={`faq-button-${i}`}
                aria-hidden={openIndex !== i}
                className={`grid overflow-hidden transition-[grid-template-rows,padding] duration-300 ${openIndex === i ? 'grid-rows-[1fr] pb-6' : 'grid-rows-[0fr]'}`}
              >
                <div className="min-h-0 overflow-hidden">
                  <p className="text-safe px-6 text-Muted leading-relaxed">{item.a}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
