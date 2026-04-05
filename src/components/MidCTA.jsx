import React from 'react';
import { useLanguage } from '../context/useLanguage';

const MidCTA = () => {
  const { t } = useLanguage();

  return (
    <section aria-label="Call to action" className="bg-Void py-24 md:py-32 px-6 text-center relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,theme('colors.Accent/8%'),transparent_55%)]" />
      <div className="max-w-2xl mx-auto flex flex-col items-center gap-6">
        <h2 className="text-2xl md:text-3xl font-sans font-bold text-Snow">
          {t('portfolio.midCta.title')}
        </h2>
        <a
          href="https://cal.com/abdelrahman-abbas/discovery-call"
          target="_blank"
          rel="noreferrer"
          className="btn-magnetic btn-wipe btn-accent inline-flex items-center px-8 py-4 rounded-full bg-Accent text-White text-base font-medium transition-shadow"
        >
          <span>{t('portfolio.midCta.cta')}</span>
          <span className="sr-only"> (opens in new tab)</span>
        </a>
      </div>
    </section>
  );
};

export default MidCTA;
