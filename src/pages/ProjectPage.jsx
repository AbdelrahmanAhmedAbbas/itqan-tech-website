import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { copy, projects, projectForSlug } from "../content";
import { track } from "../lib/analytics";
import { Eyebrow, StatusChip, CTAGroup } from "../components/UI";
import { NotFoundPage } from "./SitePages";
import ScrollShowcase from "../components/ScrollShowcase";
export default function ProjectPage() {
  const { slug } = useParams();
  const project = projectForSlug(slug);
  useEffect(() => {
    if (project) track("case_study_view", { slug });
  }, [slug, project]);
  if (!project) return <NotFoundPage />;
  const next = projects[(projects.indexOf(project) + 1) % projects.length];
  return (
    <article className="case-study">
      <section className="case-hero">
        <div className="container">
          <Link to="/#work" className="back-link">
            <ArrowLeft size={14} />
            {copy.common.backWork}
          </Link>
          <div className="case-hero-meta">
            <Eyebrow>
              {project.industry} /{" "}
              {project.type === "own"
                ? copy.common.ownProduct
                : copy.common.caseStudy}
            </Eyebrow>
            <StatusChip project={project} />
          </div>
          <h1>
            {project.name}
            <span>{project.title}</span>
          </h1>
          <p className="case-summary">{project.summary}</p>
          {project.status === "in-build" && (
            <p className="planned-date">{copy.common.planned}</p>
          )}
        </div>
      </section>
      <section className="section case-story">
        <div className="container case-story-grid">
          <div className="case-section-label">
            <span>01 /</span>
            <h2>{copy.common.problem}</h2>
          </div>
          <div className="case-story-copy">
            <p>{project.problem}</p>
          </div>
        </div>
      </section>
      <section className="section paper case-features">
        <div className="container">
          <Eyebrow>
            02 /{" "}
            {project.status === "in-build"
              ? copy.common.building
              : copy.common.built}
          </Eyebrow>
          <h2>{project.title}</h2>
          <div className="case-feature-grid">
            {project.features.map((feature, i) => (
              <div className="case-feature" key={feature}>
                <span className="feature-index">0{i + 1}</span>
                <h3>{feature}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>
      <ScrollShowcase project={project} />
      <section className="section case-flow-section">
        <div className="container">
          <Eyebrow>03 / {copy.common.howWorked}</Eyebrow>
          <h2>{copy.pricing.title}</h2>
          <ol className="case-flow">
            {copy.process.steps.map((step, i) => (
              <li key={step.title}>
                <span className="case-flow-index">0{i + 1}</span>
                <div>
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>
      {project.stack.length > 0 && (
        <section className="case-stack-section">
          <div className="container">
            <Eyebrow>{copy.common.stack}</Eyebrow>
            <div className="stack-tags">
              {project.stack.map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
          </div>
        </section>
      )}
      {next && next !== project && (
        <section className="section next-case">
          <div className="container">
            <Eyebrow>{copy.common.nextCase}</Eyebrow>
            <Link to={`/work/${next.slug}`}>
              <h2>{next.name}</h2>
              <ArrowUpRight size={32} />
            </Link>
          </div>
        </section>
      )}
      <section className="section case-end-cta">
        <div className="container">
          <h2>{copy.final.title}</h2>
          <CTAGroup location="case_study" />
        </div>
      </section>
    </article>
  );
}
