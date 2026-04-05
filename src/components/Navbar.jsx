import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/useLanguage';
import { Menu, X } from 'lucide-react';
import lightLogo from '../assets/itqan_logo_light_mode.svg';
import darkLogo from '../assets/itqn_logo_dark_mode.svg';

const Navbar = () => {
  const { t, toggleLang, isRTL } = useLanguage();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const hamburgerRef = useRef(null);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 50);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close on Escape and return focus to hamburger
  useEffect(() => {
    if (!mobileOpen) return undefined;

    const closeOnEscape = (event) => {
      if (event.key === 'Escape') {
        setMobileOpen(false);
        hamburgerRef.current?.focus();
      }
    };

    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [mobileOpen]);

  // Focus trap: move focus into menu on open, contain Tab/Shift+Tab
  useEffect(() => {
    if (!mobileOpen) return undefined;

    const menu = document.getElementById('mobile-navigation');
    if (!menu) return undefined;

    const focusable = Array.from(
      menu.querySelectorAll('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])')
    );
    if (!focusable.length) return undefined;

    focusable[0].focus();

    const trapFocus = (e) => {
      if (e.key !== 'Tab') return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    menu.addEventListener('keydown', trapFocus);
    return () => menu.removeEventListener('keydown', trapFocus);
  }, [mobileOpen]);

  const closeMenu = () => {
    setMobileOpen(false);
    hamburgerRef.current?.focus();
  };

  const navLinks = [
    { name: t('nav.services'), href: '/#services' },
    { name: t('nav.portfolio'), href: '/#portfolio' },
    { name: t('nav.process'), href: '/#process' },
    { name: t('nav.contact'), href: '/#contact' },
  ];

  return (
    <header
      className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-5xl rounded-[2rem] transition-all duration-500
        ${isScrolled ? 'bg-Snow/80 backdrop-blur-xl border border-Accent/10 text-Ink shadow-[0_16px_45px_theme(\'colors.Ink/8%\')] py-3' : 'bg-transparent text-White py-5'}`}
    >
      <div className="px-6 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex-shrink-0 interactive-lift">
          <img
            src={isScrolled ? lightLogo : darkLogo}
            alt="Itqan Tech — Mastery in Technology"
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
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8" aria-label={isRTL ? 'التنقل الرئيسي' : 'Main navigation'}>
          {navLinks.map((link, idx) => (
            <a
              key={idx}
              href={link.href}
              className={`text-sm font-medium interactive-lift transition-colors hover:text-Accent ${isScrolled ? 'text-Ink/80' : 'text-White/75 hover:text-Sand-Soft'}`}
            >
              {link.name}
            </a>
          ))}
        </nav>

        {/* Actions */}
        <div className="hidden md:flex items-center gap-4">
          <button
            onClick={toggleLang}
            aria-label={t('nav.langToggle')}
            className={`w-11 h-11 rounded-full flex items-center justify-center text-sm font-mono transition-colors hover:bg-Accent/10 interactive-lift
              ${isScrolled ? 'text-Ink' : 'text-White'}`}
          >
            {t('nav.lang')}
          </button>

          <a
            href="https://cal.com/abdelrahman-abbas/discovery-call"
            target="_blank"
            rel="noreferrer"
            className="btn-magnetic btn-wipe btn-accent px-5 py-2.5 rounded-full bg-Accent text-White text-sm font-medium whitespace-nowrap max-w-full truncate"
          >
            <span>{t('nav.bookCall')}</span>
            <span className="sr-only"> (opens in new tab)</span>
          </a>
        </div>

        {/* Mobile Toggle */}
        <button
          ref={hamburgerRef}
          className="md:hidden p-3"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-expanded={mobileOpen}
          aria-controls="mobile-navigation"
          aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div
          id="mobile-navigation"
          role="dialog"
          aria-modal="true"
          aria-label={isRTL ? 'قائمة التنقل' : 'Navigation menu'}
          className="absolute top-full left-0 w-full mt-2 surface-tint bg-Snow text-Ink rounded-[2rem] border border-Accent/10 shadow-[0_24px_50px_theme('colors.Ink/10%')] p-6 flex flex-col gap-4 md:hidden"
        >
          {navLinks.map((link, idx) => (
            <a
              key={idx}
              href={link.href}
              className="text-lg font-medium"
              onClick={closeMenu}
            >
              {link.name}
            </a>
          ))}
          <div className="h-px bg-gradient-to-r from-transparent via-Accent/20 to-transparent my-2"></div>
          <button
            onClick={() => { toggleLang(); closeMenu(); }}
            className="flex items-center gap-2 text-lg font-mono text-start"
          >
            {t('nav.langToggle')}
          </button>
          <a
            href="https://cal.com/abdelrahman-abbas/discovery-call"
            target="_blank"
            rel="noreferrer"
            className="btn-accent mt-4 text-center py-3 rounded-full bg-Accent text-White font-medium"
            onClick={closeMenu}
          >
            {t('nav.bookCall')}
            <span className="sr-only"> (opens in new tab)</span>
          </a>
        </div>
      )}
    </header>
  );
};

export default Navbar;
