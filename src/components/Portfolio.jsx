import React, { useLayoutEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/useLanguage';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import coreEnImg from '../assets/core-en-platform.png';
import wasfaImg from '../assets/wasfa-mobile-app.png';

const Portfolio = () => {
  const { t, isRTL } = useLanguage();
  const containerRef = useRef(null);
  const cardsRef = useRef([]);
  const prefersReducedMotion = usePrefersReducedMotion();
  const isCompactLayout = useMediaQuery('(max-width: 767px)');

  const projects = [
    {
      id: 'p1',
      name: t('portfolio.p1.name'),
      industry: t('portfolio.p1.industry'),
      desc: t('portfolio.p1.desc'),
      result: t('portfolio.p1.result'),
      tech: ['Next.js', 'TypeScript', 'Prisma', 'MySQL'],
      img: coreEnImg,
      link: '/case-study/core-en',
      bgLayer: <RadarBg />
    },
    {
      id: 'p2',
      name: t('portfolio.p2.name'),
      industry: t('portfolio.p2.industry'),
      desc: t('portfolio.p2.desc'),
      result: t('portfolio.p2.result'),
      tech: ['React Native', 'Expo', 'TypeScript'],
      img: wasfaImg,
      link: '/case-study/wasfa',
      bgLayer: <WaveBg />
    }
  ];

  useLayoutEffect(() => {
    if (prefersReducedMotion || isCompactLayout) {
      return undefined;
    }

    let ctx = gsap.context(() => {
      // Pin container
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top top',
        end: `+=${window.innerHeight * projects.length}`,
        pin: true,
        scrub: true,
      });

      // Animate cards
      cardsRef.current.forEach((card, index) => {
        if (!card) return;
        
        // Skip first card for timeline entry, it's already there
        if (index > 0) {
          gsap.fromTo(card,
            { y: window.innerHeight },
            {
              y: 0,
              ease: 'none',
              scrollTrigger: {
                trigger: containerRef.current,
                start: `top+=${(index - 1) * window.innerHeight} top`,
                end: `top+=${index * window.innerHeight} top`,
                scrub: true,
              }
            }
          );
        }

        // Only scale down if not the last card
        if (index < projects.length - 1) {
          gsap.to(card, {
            scale: 0.9,
            opacity: 0.4,
            ease: 'none',
            scrollTrigger: {
              trigger: containerRef.current,
              start: `top+=${index * window.innerHeight} top`,
              end: `top+=${(index + 1) * window.innerHeight} top`,
              scrub: true,
            }
          });
        }
      });
    }, containerRef);
    
    return () => ctx.revert();
  }, [projects.length, isRTL, prefersReducedMotion, isCompactLayout]);

  const setCardRef = (el, index) => {
    cardsRef.current[index] = el;
  };

  if (prefersReducedMotion || isCompactLayout) {
    return (
      <section id="portfolio" className="bg-Void px-6 py-24 text-White">
        <div className="mx-auto flex max-w-6xl flex-col gap-6">
          <h2 id="portfolio-heading" className="sr-only">{t('nav.portfolio')}</h2>
          <div className="flex justify-center md:justify-start">
            <span className="section-kicker border-White/10 bg-White/5 text-Sand-Soft shadow-none">
              {t('nav.portfolio')}
            </span>
          </div>

          {projects.map((project) => (
            <article
              key={project.id}
              className="overflow-hidden rounded-[2rem] border border-White/10 bg-gradient-to-b from-Void/[0.98] to-Void/[0.96] shadow-[0_24px_60px_theme('colors.Void/34%')]"
            >
              <div className="h-px bg-gradient-to-r from-transparent via-Sand/50 to-transparent"></div>
              <div className="grid gap-0 md:grid-cols-2">
                <div className="min-w-safe p-8 md:p-12">
                  <span className="mb-5 inline-flex max-w-full rounded-full border border-Sand/20 bg-Sand/15 px-3 py-1 text-[10px] font-mono text-Sand-Soft">
                    {project.industry}
                  </span>
                  <h3 className="text-safe mb-4 text-display-sm font-bold font-sans text-White">
                    {project.name}
                  </h3>
                  <p className="text-safe mb-3 max-w-2xl text-Muted-Light md:text-lg">
                    {project.desc}
                  </p>
                  <p className="text-safe mb-8 max-w-2xl text-sm font-medium text-Sand-Soft">
                    {project.result}
                  </p>
                  <div className="mb-8 flex flex-wrap gap-2">
                    {project.tech.map((tech) => (
                      <span key={tech} className="rounded-full border border-White/10 bg-White/5 px-3 py-1 text-xs font-mono text-Muted-Light">
                        {tech}
                      </span>
                    ))}
                  </div>
                  <Link to={project.link} className="interactive-lift inline-flex max-w-full items-center gap-2 font-medium text-Accent-Light transition-colors hover:text-Sand-Soft">
                    <span className="text-safe">{t('portfolio.viewProject')}</span>
                    <span aria-hidden="true">{isRTL ? '←' : '→'}</span>
                  </Link>
                </div>

                <div className="relative min-h-[16rem] md:min-h-full">
                  <img src={project.img} alt={project.name} loading="lazy" width="1600" height="1067" className="h-full w-full object-cover" />
                  <div className={`absolute inset-0 bg-gradient-to-${isRTL ? 'l' : 'r'} from-Ink via-Steel/85 to-transparent`} />
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section id="portfolio" className="bg-Void text-White">
      {/* Skip link for keyboard users — the pinned scroll section is not keyboard-traversable */}
      <a
        href="#process"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-1/2 focus:-translate-x-1/2 focus:z-[100] focus:px-4 focus:py-2 focus:bg-Accent focus:text-White focus:rounded-lg focus:shadow-lg focus:text-sm focus:font-medium"
      >
        Skip portfolio section
      </a>
      <div
        ref={containerRef}
        className="w-full h-screen flex items-center justify-center relative overflow-hidden"
      >
        <div className="absolute top-10 left-1/2 -translate-x-1/2 z-50">
          <span className="section-kicker border-White/10 bg-White/5 text-Sand-Soft shadow-none">
            {t('nav.portfolio')}
          </span>
        </div>

        {projects.map((project, idx) => (
          <article 
            key={project.id}
            ref={(el) => setCardRef(el, idx)}
            className="absolute w-[90%] max-w-5xl h-[70vh] overflow-hidden rounded-[2.5rem] border border-White/10 bg-gradient-to-b from-Void/[0.98] to-Void/[0.96] shadow-[0_20px_50px_theme('colors.Void/28%')] flex flex-col md:flex-row will-change-transform"
            style={{ zIndex: idx }}
          >
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-Sand/50 to-transparent"></div>
            {/* Background Graphic */}
            <div className="absolute inset-0 z-0 opacity-10 pointer-events-none overflow-hidden mix-blend-overlay">
              {project.bgLayer}
            </div>

            {/* Content Side */}
            <div className="relative z-10 w-full md:w-1/2 p-10 md:p-16 flex flex-col justify-center">
                <span className="mb-6 inline-flex max-w-full rounded-full border border-Sand/20 bg-Sand/15 px-3 py-1 text-[10px] font-mono text-Sand-Soft">
                  {project.industry}
                </span>
              <h3 className="text-safe text-display-md font-bold font-sans mb-4 text-White">
                {project.name}
              </h3>
              <p className="text-safe text-Muted-Light md:text-lg mb-3 max-w-md">
                {project.desc}
              </p>
              <p className="text-safe text-Sand-Soft text-sm font-medium mb-8 max-w-md">
                {project.result}
              </p>
              
              <div className="flex flex-wrap gap-2 mb-10">
                {project.tech.map(tech => (
                  <span key={tech} className="text-xs font-mono text-Muted-Light border border-White/10 rounded-full px-3 py-1 bg-White/5">
                    {tech}
                  </span>
                ))}
              </div>

              <Link to={project.link} className="flex max-w-full items-center gap-2 text-Accent-Light hover:text-Sand-Soft font-medium transition-colors w-max interactive-lift group drop-shadow-[0_0_18px_theme('colors.Accent-Light/18%')]">
                <span className="text-safe">{t('portfolio.viewProject')}</span>
                <span className="transition-transform group-hover:translate-x-1 inline-block">
                  {isRTL ? '←' : '→'}
                </span>
              </Link>
            </div>

            {/* Image Side */}
            <div className="relative z-10 w-full md:w-1/2 h-full hidden md:block">
              <img
                src={project.img}
                alt={project.name}
                loading="lazy"
                width="1600"
                height="1067"
                className="w-full h-full object-cover"
              />
              <div className={`absolute inset-0 bg-gradient-to-${isRTL ? 'l' : 'r'} from-Ink via-Steel/85 to-transparent`}></div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

// Subtle background graphics for each card

const RadarBg = () => (
  <div className="w-full h-full relative flex items-center justify-center">
    {[...Array(5)].map((_, i) => (
      <div
        key={i}
        className="absolute rounded-full border border-Accent/40"
        style={{ width: `${(i+1)*120}px`, height: `${(i+1)*120}px`, opacity: 0.2 - i*0.03 }}
      />
    ))}
    <div className="absolute w-[300px] h-1 bg-gradient-to-r from-transparent via-Accent/40 to-Sand origin-left rotate-45" />
  </div>
);


const WaveBg = () => (
  <svg aria-hidden="true" className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
    <path
      d="M0,50 C20,30 30,70 50,50 C70,3030 80,70 100,50 L100,100 L0,100 Z"
      fill="currentColor"
      className="text-Mint-Soft"
    />
  </svg>
);

export default Portfolio;
