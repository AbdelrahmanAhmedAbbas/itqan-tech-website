import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowDown,
  ArrowUpRight,
  ArrowRight,
  Plus,
  Copy,
  MessageSquare,
  FileText,
  SlidersHorizontal,
} from "lucide-react";
import { copy, projects, money, interpolate } from "../content";
import { siteConfig } from "../site.config";
import { track } from "../lib/analytics";
import {
  CTAGroup,
  Eyebrow,
  SectionHeading,
  StatusChip,
  Placeholder,
} from "./UI";
import HyperframeScene from "./HyperframeScene";
import ProjectVisual from "./ProjectVisual";
import AuditForm from "./AuditForm";
export function Hero() {
  const h = copy.hero;
  const text = h.headlines[siteConfig.heroVariant] || h.headlines[0];
  const words = text.split(" ");
  const end = words.splice(-2).join(" ");
  return (
    <section className="hero hero-funnel" id="hero">
      <div className="hero-grid-pattern" aria-hidden="true" />
      <div className="container hero-layout">
        <div className="hero-copy">
          <Eyebrow>{h.eyebrow}</Eyebrow>
          <h1>
            {words.join(" ")} <em>{end}</em>
          </h1>
          <p className="hero-description">{h.description}</p>
          <CTAGroup location="hero" />
          <p className="hero-micro">{h.micro}</p>
        </div>
        <div className="hero-visual">
          <div className="hero-real-capture">
            <HyperframeScene slug={projects[0].slug} autoplay />
            <div className="hero-app-caption">
              <span>{projects[0].name}</span>
              <Link to={`/work/${projects[0].slug}`}>
                {copy.common.viewCase} <ArrowUpRight size={15} />
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="container hero-foot">
        <span>
          <span className="small-cross" aria-hidden="true">
            +
          </span>
          {h.scroll}
        </span>
        <a
          href="#problem"
          className="scroll-indicator"
          aria-label={copy.problem.title + " " + copy.problem.accent}
        >
          <ArrowDown size={18} />
        </a>
        <span className="hero-index" aria-hidden="true">
          01 — 08
        </span>
      </div>
    </section>
  );
}
const icons = [Copy, MessageSquare, FileText, SlidersHorizontal];
export function Problem() {
  const p = copy.problem;
  return (
    <section className="section problem-section" id="problem">
      <div className="container">
        <SectionHeading eyebrow={p.eyebrow} title={p.title} accent={p.accent} />
        <div className="pain-grid">
          {p.items.map((item, i) => {
            const Icon = icons[i];
            return (
              <div className="pain-item" key={item}>
                <div className="pain-item-top">
                  <Icon size={22} strokeWidth={1.5} />
                  <span>0{i + 1}</span>
                </div>
                <h3>{item}</h3>
              </div>
            );
          })}
        </div>
        <p className="problem-closing">
          <span aria-hidden="true">↳</span>
          {p.closing}
        </p>
      </div>
    </section>
  );
}
export function Services() {
  const s = copy.services;
  return (
    <section className="section solution-section" id="services">
      <div className="container">
        <SectionHeading eyebrow={s.eyebrow} title={s.title} />
        <div className="service-methods">
          {s.steps.map((step, i) => (
            <article className="solution-step" key={step.title}>
              <span className="solution-number">0{i + 1}</span>
              <div>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </div>
            </article>
          ))}
        </div>
        <div className="service-capabilities">
          {s.cards.map((card) => (
            <article className="capability-row" key={card.name}>
              <h3>{card.name}</h3>
              <p>
                <span>{card.from}</span>
                <ArrowRight size={16} aria-hidden="true" />
                <strong>{card.to}</strong>
              </p>
            </article>
          ))}
        </div>
        <CTAGroup location="services" />
      </div>
    </section>
  );
}
export function FeaturedWork() {
  return (
    <section className="section work-section" id="work">
      <div className="container">
        <SectionHeading eyebrow={copy.work.eyebrow} title={copy.work.title} />
        <div className="projects-grid">
          {projects
            .filter((p) => p.type !== "own")
            .map((project) => (
              <article className="project-card" key={project.slug}>
                <Link
                  className="project-visual-link"
                  to={`/work/${project.slug}`}
                  aria-label={`${copy.common.viewCase}: ${project.name}. ${copy.common.demo}`}
                >
                  <ProjectVisual project={project} decorative />
                  <span className="project-visual-arrow">
                    <ArrowUpRight size={20} />
                  </span>
                </Link>
                <div className="project-card-meta">
                  <span>{project.industry}</span>
                  <StatusChip project={project} />
                </div>
                <div className="project-card-title">
                  <h3>{project.name}</h3>
                </div>
                <p className="project-card-description">{project.title}</p>
                {project.status === "in-build" && (
                  <p className="planned-date">{copy.common.planned}</p>
                )}
                <Link className="text-link" to={`/work/${project.slug}`}>
                  {copy.common.viewCase}
                  <ArrowUpRight size={16} />
                </Link>
              </article>
            ))}
        </div>
        {projects
          .filter((p) => p.type === "own")
          .map((project) => (
            <div className="own-product-section" key={project.slug}>
              <div>
                <Eyebrow>{copy.common.ownProduct}</Eyebrow>
                <h3>{project.summary}</h3>
                <Link className="text-link" to={`/work/${project.slug}`}>
                  {copy.common.viewCase}
                  <ArrowUpRight size={16} />
                </Link>
              </div>
              <ProjectVisual project={project} />
            </div>
          ))}
        <CTAGroup location="case_study" />
      </div>
    </section>
  );
}
export function Offer() {
  const p = siteConfig.prices;
  const c = copy.pricing;
  const cards = [
    {
      name: c.blueprintName,
      type: c.blueprintType,
      description: c.blueprintCopy,
      price: money(p.blueprint) + " " + c.fixed,
      terms: interpolate(c.credit, {
        fee: money(p.blueprint),
        days: p.creditDays,
      }),
    },
    {
      name: c.buildName,
      type: c.buildType,
      description: c.buildCopy,
      price: c.from + " " + money(p.buildFrom),
      terms: c.buildTerms,
    },
    {
      name: c.careName,
      type: c.careType,
      description: c.careCopy,
      price: c.from + " " + money(p.careMonthlyFrom) + " " + c.monthly,
      terms: interpolate(c.minimum, { months: p.careMinimumMonths }),
    },
  ];
  return (
    <section className="section paper offer-section" id="pricing">
      <div className="container">
        <SectionHeading eyebrow={c.eyebrow} title={c.title} />
        <div className="offer-grid">
          {cards.map((card, i) => (
            <article
              className={`offer-card ${i === 1 ? "offer-featured" : ""}`}
              key={card.name}
            >
              <div className="offer-step-line">
                <span className="offer-node">0{i + 1}</span>
              </div>
              <p className="offer-tag">{card.type}</p>
              <h3>{card.name}</h3>
              <p className="offer-description">{card.description}</p>
              <p className="offer-price">{card.price}</p>
              <p className="offer-terms">{card.terms}</p>
              {i === 0 &&
                (siteConfig.approved.blueprintTimeline ? (
                  <p>{p.blueprintWeeks}</p>
                ) : (
                  <Placeholder>
                    {siteConfig.pending.blueprintTimeline}
                  </Placeholder>
                ))}
            </article>
          ))}
        </div>
        <p className="pricing-closing">{c.closing}</p>
        <p className="pricing-addon">{c.addon}</p>
        <CTAGroup location="pricing" />
      </div>
    </section>
  );
}
export function Process() {
  return (
    <section className="section process-section" id="process">
      <div className="container">
        <SectionHeading
          eyebrow={copy.process.eyebrow}
          title={copy.process.title}
        />
        <ol className="process-grid">
          {copy.process.steps.map((step, i) => (
            <li key={step.title}>
              <span className="process-number">
                0{i + 1}
                <span aria-hidden="true">
                  <ArrowRight size={16} />
                </span>
              </span>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
function FAQItem({ item }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`faq-item ${open ? "is-open" : ""}`}>
      <h3>
        <button
          type="button"
          aria-expanded={open}
          aria-controls={`faq-answer-${item.id}`}
          id={`faq-question-${item.id}`}
          onClick={() => {
            if (!open) track("faq_open", { question_id: item.id });
            setOpen(!open);
          }}
        >
          {item.question}
          <Plus size={19} aria-hidden="true" />
        </button>
      </h3>
      <div
        className="faq-answer-wrap"
        id={`faq-answer-${item.id}`}
        role="region"
        aria-labelledby={`faq-question-${item.id}`}
        inert={!open}
        aria-hidden={!open}
      >
        <div>
          <p>{item.answer}</p>
        </div>
      </div>
    </div>
  );
}
export function FAQ() {
  return (
    <section className="section paper faq-section" id="faq">
      <div className="container faq-layout">
        <div>
          <Eyebrow>{copy.faq.eyebrow}</Eyebrow>
          <h2>{copy.faq.title}</h2>
          <CTAGroup location="faq" />
        </div>
        <div className="faq-list">
          {copy.faq.items.map((item) => (
            <FAQItem item={item} key={item.id} />
          ))}
        </div>
      </div>
    </section>
  );
}
export function FinalCTA() {
  return (
    <section className="section final-cta-section" id="loom-request">
      <div className="container final-funnel-grid">
        <div className="final-cta-copy">
          <Eyebrow>{copy.final.eyebrow}</Eyebrow>
          <h2>{copy.final.title}</h2>
          <p>{copy.final.body}</p>
          <div className="cta-graphic" aria-hidden="true">
            <div className="cta-graphic-orbit" />
            <span className="cta-cross cross-one">+</span>
            <span className="cta-cross cross-two">+</span>
            <span className="cta-graphic-arrow">↗</span>
          </div>
        </div>
        <div className="inline-loom-form">
          <AuditForm />
        </div>
      </div>
    </section>
  );
}
export function StickyCTA() {
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const hero = document.getElementById("hero");
    if (!hero) return;
    const observer = new IntersectionObserver(
      ([entry]) =>
        setVisible(!entry.isIntersecting && entry.boundingClientRect.top < 0),
      { rootMargin: "-110px 0px 0px 0px" },
    );
    observer.observe(hero);
    return () => observer.disconnect();
  }, []);
  return visible ? (
    <div ref={ref} className="sticky-cta">
      <CTAGroup location="sticky_mobile" />
    </div>
  ) : null;
}
