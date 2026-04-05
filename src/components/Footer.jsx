import React from 'react';
import { useLanguage } from '../context/useLanguage';
import darkLogo from '../assets/itqn_logo_dark_mode.svg';

const Footer = () => {
  const { t, isRTL } = useLanguage();

  return (
    <footer className="bg-Void text-Snow pt-24 pb-8 rounded-t-[2rem] md:rounded-t-[3rem] px-6 mt-[-2rem] relative z-20 shadow-[0_-10px_30px_theme('colors.Void/50%')] overflow-hidden">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-Accent/12 to-transparent" />
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">

          {/* Col 1: Brand */}
          <div className="flex flex-col gap-4">
            <a href="#" className="flex items-center gap-2">
              <img
                src={darkLogo}
                alt="Itqan Logo"
                width="240"
                height="64"
                className="h-14 md:h-16 w-auto object-contain"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'block';
                }}
              />
              <span className="hidden font-sans font-bold text-xl tracking-tight">
                {isRTL ? 'إتقان' : 'Itqan'}
              </span>
            </a>
            <p className="text-Muted-Light font-mono text-sm max-w-xs">
              {t('footer.tagline')}
            </p>
          </div>

          {/* Col 2: Navigation */}
          <nav aria-label={isRTL ? 'تذييل الموقع' : 'Footer navigation'} className="flex flex-col gap-4">
            <a href="/#services" className="text-Muted-Light hover:text-Snow transition-colors py-1 min-h-[44px] flex items-center">{t('nav.services')}</a>
            <a href="/#portfolio" className="text-Muted-Light hover:text-Snow transition-colors py-1 min-h-[44px] flex items-center">{t('nav.portfolio')}</a>
            <a href="/#process" className="text-Muted-Light hover:text-Snow transition-colors py-1 min-h-[44px] flex items-center">{t('nav.process')}</a>
            <a href="/#contact" className="text-Muted-Light hover:text-Snow transition-colors py-1 min-h-[44px] flex items-center">{t('nav.contact')}</a>
          </nav>

          {/* Col 3: Social + Status */}
          <div className="flex flex-col gap-2">
            <a href="https://www.linkedin.com/in/abdelrahman114/" target="_blank" rel="noreferrer" className="text-Muted-Light hover:text-Snow transition-colors py-1 min-h-[44px] flex items-center">LinkedIn</a>
            <a href="https://x.com/AbdoAhmedAbbas" target="_blank" rel="noreferrer" className="text-Muted-Light hover:text-Snow transition-colors py-1 min-h-[44px] flex items-center">Twitter / X</a>
            <a href="https://www.instagram.com/abdelrahman_ahmed_abbas/" target="_blank" rel="noreferrer" className="text-Muted-Light hover:text-Snow transition-colors py-1 min-h-[44px] flex items-center">Instagram</a>
            <div className="flex items-center gap-2 pt-3 mt-1 border-t border-White/5">
              <div className="w-2 h-2 rounded-full bg-Mint animate-pulse"></div>
              <span className="text-xs font-mono text-Muted-Light">{t('footer.systemStatus')}</span>
            </div>
          </div>
        </div>

        <div className="h-px w-full bg-gradient-to-r from-transparent via-Accent/25 to-transparent mb-8"></div>
        
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-mono text-Muted-Light">
          <p>{t('footer.rights')}</p>
          <div className="flex gap-6">
            <a href="#legal" aria-disabled="true" className="hover:text-Snow transition-colors">{t('footer.privacy')}</a>
            <a href="#legal" aria-disabled="true" className="hover:text-Snow transition-colors">{t('footer.terms')}</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
