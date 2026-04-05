import React, { useEffect } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { useLanguage } from '../context/useLanguage';
import { ArrowLeft, ArrowRight, Check, Monitor, Smartphone } from 'lucide-react';
import coreEnImg from '../assets/core-en-platform.png';
import wasfaImg from '../assets/wasfa-mobile-app.png';

const BASE_URL = 'https://itqan.tech';

const projectConfig = {
  'core-en': {
    key: 'coreEn',
    type: 'web',
    img: coreEnImg,
    tech: [
      'Next.js 14',
      'TypeScript',
      'Prisma',
      'MySQL',
      'Tailwind CSS',
      'Radix UI',
      'NextAuth',
      'React Hook Form',
    ],
    nextSlug: 'wasfa',
    glowColor: 'rgba(24,90,219,0.14)',
    seo: {
      titleEn: 'Core EN Platform — Case Study | Itqan Tech',
      titleAr: 'Core EN Platform — دراسة حالة | إتقان تك',
      descEn: 'How Itqan replaced every spreadsheet in an engineering office with one platform. Payroll dropped from 2 days to 4 hours.',
      descAr: 'كيف استبدلت إتقان كل جداول البيانات في مكتب هندسي بمنصة واحدة. الرواتب انخفضت من يومين إلى ٤ ساعات.',
    },
  },
  wasfa: {
    key: 'wasfa',
    type: 'mobile',
    img: wasfaImg,
    tech: ['React Native', 'Expo', 'TypeScript', 'Node.js', 'NativeWind'],
    nextSlug: 'core-en',
    glowColor: 'rgba(47,125,104,0.14)',
    seo: {
      titleEn: 'Wasfa — Case Study | Itqan Tech',
      titleAr: 'وصفة — دراسة حالة | إتقان تك',
      descEn: 'How Itqan built a meal planning app that users rate 4.8 stars. Three actions: plan meals, find recipes, build lists.',
      descAr: 'كيف بنت إتقان تطبيق تخطيط وجبات بتقييم ٤.٨ نجوم. ثلاث إجراءات: خطط وجباتك، اكتشف وصفات، أنشئ قوائم.',
    },
  },
};

/* ═══════════════════════════════════════════
   Device Frames
   ═══════════════════════════════════════════ */

const BrowserFrame = ({ children }) => (
  <div className="mx-auto w-full max-w-4xl">
    <div className="overflow-hidden rounded-xl border border-White/[0.08] shadow-[0_40px_80px_rgba(0,0,0,0.45)]">
      {/* Title bar */}
      <div className="flex items-center gap-3 bg-Steel/80 px-4 py-2.5">
        <div className="flex gap-1.5">
          <div className="h-2.5 w-2.5 rounded-full bg-[#FF5F57]/80" />
          <div className="h-2.5 w-2.5 rounded-full bg-[#FEBC2E]/80" />
          <div className="h-2.5 w-2.5 rounded-full bg-[#28C840]/80" />
        </div>
        <div className="mx-6 flex-1">
          <div className="mx-auto max-w-[200px] rounded-md bg-Void/50 px-3 py-1 text-center font-mono text-[10px] text-Muted-Light/50">
            app.core-en.platform
          </div>
        </div>
      </div>
      {/* Browser content */}
      <div className="bg-White">{children}</div>
    </div>
  </div>
);

const PhoneFrame = ({ children }) => (
  <div className="mx-auto w-[240px] md:w-[272px]">
    <div className="relative rounded-[2.8rem] border-[5px] border-[#1C1C1E] bg-[#1C1C1E] shadow-[0_40px_80px_rgba(0,0,0,0.45)]">
      {/* Dynamic Island */}
      <div className="absolute left-1/2 top-2.5 z-20 h-[14px] w-[56px] -translate-x-1/2 rounded-full bg-Void" />
      {/* Screen */}
      <div className="overflow-hidden rounded-[2.3rem]">{children}</div>
      {/* Home indicator */}
      <div className="absolute bottom-1.5 left-1/2 z-20 h-[3px] w-[56px] -translate-x-1/2 rounded-full bg-White/20" />
    </div>
  </div>
);

/* ═══════════════════════════════════════════
   Case Study Page
   ═══════════════════════════════════════════ */

const CaseStudy = () => {
  const { slug } = useParams();
  const { t, isRTL } = useLanguage();

  const project = projectConfig[slug];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  // Dynamic SEO: title, meta description, canonical, JSON-LD
  useEffect(() => {
    if (!project) return;

    const { seo } = project;
    const title = isRTL ? seo.titleAr : seo.titleEn;
    const description = isRTL ? seo.descAr : seo.descEn;
    const url = `${BASE_URL}/case-study/${slug}`;

    // Page title
    document.title = title;

    // Meta description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', description);

    // Canonical
    let canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) canonical.setAttribute('href', url);

    // OG tags
    const ogTags = { 'og:title': title, 'og:description': description, 'og:url': url, 'og:type': 'article' };
    Object.entries(ogTags).forEach(([prop, content]) => {
      let tag = document.querySelector(`meta[property="${prop}"]`);
      if (tag) tag.setAttribute('content', content);
    });

    // Twitter tags
    const twitterTags = { 'twitter:title': title, 'twitter:description': description, 'twitter:url': url };
    Object.entries(twitterTags).forEach(([prop, content]) => {
      let tag = document.querySelector(`meta[property="${prop}"]`);
      if (tag) tag.setAttribute('content', content);
    });

    // JSON-LD for case study
    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: isRTL ? seo.titleAr : seo.titleEn,
      description: description,
      url: url,
      author: { '@type': 'Organization', name: 'Itqan Tech', url: BASE_URL },
      publisher: { '@type': 'Organization', name: 'Itqan Tech', url: BASE_URL },
      mainEntityOfPage: { '@type': 'WebPage', '@id': url },
      inLanguage: isRTL ? 'ar' : 'en',
      about: {
        '@type': project.type === 'web' ? 'WebApplication' : 'MobileApplication',
        name: isRTL ? seo.titleAr.split('—')[0].trim() : seo.titleEn.split('—')[0].trim(),
        applicationCategory: project.type === 'web' ? 'BusinessApplication' : 'LifestyleApplication',
        operatingSystem: project.type === 'web' ? 'Web' : 'iOS, Android',
      },
    };

    let scriptTag = document.getElementById('case-study-jsonld');
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = 'case-study-jsonld';
      scriptTag.type = 'application/ld+json';
      document.head.appendChild(scriptTag);
    }
    scriptTag.textContent = JSON.stringify(jsonLd);

    // Cleanup: restore homepage SEO on unmount
    return () => {
      document.title = 'Itqan Tech | Master Craftsman in Tech & SaaS Development';
      if (metaDesc) metaDesc.setAttribute('content', 'Itqan Tech turns complex SaaS ideas into scalable, production-ready web and mobile products in weeks, not quarters. A premium technical partner for enterprise scaling.');
      if (canonical) canonical.setAttribute('href', BASE_URL);
      const scriptEl = document.getElementById('case-study-jsonld');
      if (scriptEl) scriptEl.remove();
    };
  }, [slug, isRTL, project]);

  if (!project) return <Navigate to="/" replace />;

  const cs = (field) => t(`caseStudy.${project.key}.${field}`);
  const features = t(`caseStudy.${project.key}.features`);
  const results = t(`caseStudy.${project.key}.results`);
  const nextProject = projectConfig[project.nextSlug];
  const BackArrow = isRTL ? ArrowRight : ArrowLeft;
  const isWeb = project.type === 'web';

  return (
    <article className="min-h-screen">
      {/* ─── Hero + Device Showcase ─── */}
      <section className="relative overflow-hidden bg-Void px-6 pb-16 pt-32 text-White md:pb-24">
        {/* Background texture */}
        <div className="pointer-events-none absolute inset-0 dark-grid opacity-[0.15]" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-Void via-Void/90 to-Void" />

        <div className="relative mx-auto max-w-5xl">
          {/* Back link */}
          <Link
            to="/#portfolio"
            className="interactive-lift mb-12 inline-flex items-center gap-2 text-sm text-Muted-Light transition-colors hover:text-White"
          >
            <BackArrow size={14} />
            <span>{t('caseStudy.backToPortfolio')}</span>
          </Link>

          {/* Type + industry badges */}
          <div className="mb-6 flex flex-wrap items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-White/[0.08] bg-White/[0.03] px-3 py-1 text-[10px] font-mono uppercase tracking-wider text-Muted-Light">
              {isWeb ? <Monitor size={11} /> : <Smartphone size={11} />}
              {isWeb
                ? isRTL
                  ? 'تطبيق ويب'
                  : 'Web Application'
                : isRTL
                  ? 'تطبيق موبايل'
                  : 'Mobile Application'}
            </span>
            <span className="inline-flex rounded-full border border-Sand/20 bg-Sand/10 px-3 py-1 text-[10px] font-mono text-Sand-Soft">
              {cs('industry')}
            </span>
          </div>

          {/* Title + Subtitle */}
          <h1 className="text-safe mb-3 text-display-lg font-bold">{cs('title')}</h1>
          <p className="mb-16 max-w-xl font-serif text-display-sm italic text-Muted-Light md:mb-20">
            {cs('subtitle')}
          </p>
        </div>

        {/* Device Showcase */}
        <div className="relative mx-auto max-w-5xl">
          {/* Accent glow behind device */}
          <div
            className="pointer-events-none absolute -inset-16"
            style={{
              background: `radial-gradient(ellipse at center, ${project.glowColor}, transparent 70%)`,
            }}
          />

          <div className="relative">
            {isWeb ? (
              <BrowserFrame>
                <div className="bg-Surface p-5 md:p-10">
                  <img
                    src={project.img}
                    alt={cs('title')}
                    className="w-full rounded-lg border border-Border"
                  />
                </div>
              </BrowserFrame>
            ) : (
              <PhoneFrame>
                <img src={project.img} alt={cs('title')} className="w-full" />
              </PhoneFrame>
            )}
          </div>
        </div>
      </section>

      {/* Dark → Light transition */}
      <div className="h-16 bg-gradient-to-b from-Void to-Snow md:h-20" />

      {/* ─── Overview ─── */}
      <section className="bg-Snow px-6 py-16 md:py-20">
        <div className="mx-auto max-w-3xl">
          <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.25em] text-Muted">
            {t('caseStudy.overview')}
          </p>
          <div className={`mb-8 h-px w-10 ${isWeb ? 'bg-Accent' : 'bg-Mint'}`} />
          <p className="text-safe text-lg leading-[1.85] text-Ink/75 md:text-xl">
            {cs('overview')}
          </p>
        </div>
      </section>

      {/* ─── Challenge & Solution ─── */}
      <section className="bg-Surface px-6 py-16 md:py-20">
        <div className="mx-auto grid max-w-5xl gap-12 md:grid-cols-2 md:gap-20">
          <div>
            <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.25em] text-Muted">
              {t('caseStudy.challenge')}
            </p>
            <div className="mb-6 h-px w-10 bg-Sand" />
            <p className="text-safe leading-[1.85] text-Ink/70">{cs('challenge')}</p>
          </div>
          <div>
            <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.25em] text-Muted">
              {t('caseStudy.solution')}
            </p>
            <div className={`mb-6 h-px w-10 ${isWeb ? 'bg-Accent' : 'bg-Mint'}`} />
            <p className="text-safe leading-[1.85] text-Ink/70">{cs('solution')}</p>
          </div>
        </div>
      </section>

      {/* ─── Tech Stack ─── */}
      <section className="bg-Snow px-6 py-14 md:py-16">
        <div className="mx-auto max-w-5xl">
          <p className="mb-8 text-center font-mono text-[11px] uppercase tracking-[0.25em] text-Muted">
            {t('caseStudy.techStack')}
          </p>
          <div className="flex flex-wrap justify-center gap-2.5">
            {project.tech.map((name) => (
              <span
                key={name}
                className="rounded-full border border-Border bg-White px-4 py-2 font-mono text-sm text-Ink shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Key Features ─── */}
      <section className="bg-Void px-6 py-16 text-White md:py-20">
        <div className="mx-auto max-w-4xl">
          <p className="mb-2 text-center font-mono text-[11px] uppercase tracking-[0.25em] text-Muted-Light">
            {t('caseStudy.keyFeatures')}
          </p>
          <div className={`mx-auto mb-12 h-px w-10 ${isWeb ? 'bg-Accent/40' : 'bg-Mint/40'}`} />

          <div className="grid gap-3 md:grid-cols-2">
            {Array.isArray(features) &&
              features.map((feature, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 rounded-xl border border-White/[0.06] bg-White/[0.02] px-5 py-4"
                >
                  <Check
                    size={15}
                    strokeWidth={2.5}
                    className={`mt-0.5 flex-shrink-0 ${isWeb ? 'text-Accent-Light' : 'text-Mint'}`}
                  />
                  <p className="text-safe text-sm leading-relaxed text-Muted-Light">{feature}</p>
                </div>
              ))}
          </div>
        </div>
      </section>

      {/* ─── Results ─── */}
      <section className="bg-Snow px-6 py-16 md:py-20">
        <div className="mx-auto max-w-4xl">
          <p className="mb-2 text-center font-mono text-[11px] uppercase tracking-[0.25em] text-Muted">
            {t('caseStudy.results')}
          </p>
          <div className={`mx-auto mb-12 h-px w-10 ${isWeb ? 'bg-Accent' : 'bg-Mint'}`} />

          <div className="grid gap-4 md:grid-cols-2">
            {Array.isArray(results) &&
              results.map((result, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-Border bg-White p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
                >
                  <span
                    className={`mb-3 inline-block font-mono text-2xl font-bold ${
                      isWeb ? 'text-Accent' : 'text-Mint'
                    }`}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <p className="text-safe text-sm font-medium leading-relaxed text-Ink/80">
                    {result}
                  </p>
                </div>
              ))}
          </div>
        </div>
      </section>

      {/* ─── Next Project ─── */}
      <section className="border-t border-Border bg-Surface px-6 py-14 md:py-16">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.25em] text-Muted">
            {t('caseStudy.nextProject')}
          </p>
          <Link
            to={`/case-study/${project.nextSlug}`}
            className="group inline-flex items-center gap-3"
          >
            <span className="text-display-sm font-bold text-Ink transition-colors group-hover:text-Accent">
              {t(`caseStudy.${nextProject.key}.title`)}
            </span>
            <span
              className={`inline-block text-xl text-Ink transition-all group-hover:text-Accent ${
                isRTL
                  ? 'group-hover:-translate-x-1'
                  : 'group-hover:translate-x-1'
              }`}
            >
              {isRTL ? '←' : '→'}
            </span>
          </Link>
          <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-Muted">
            {nextProject.type === 'web' ? (
              <Monitor size={12} />
            ) : (
              <Smartphone size={12} />
            )}
            {nextProject.type === 'web'
              ? isRTL
                ? 'تطبيق ويب'
                : 'Web Application'
              : isRTL
                ? 'تطبيق موبايل'
                : 'Mobile Application'}
          </p>
        </div>
      </section>
    </article>
  );
};

export default CaseStudy;
