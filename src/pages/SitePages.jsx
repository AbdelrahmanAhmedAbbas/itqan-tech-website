import { Link } from "react-router-dom";
import { copy } from "../content";
import { siteConfig } from "../site.config";
import { CTAGroup, Placeholder, Eyebrow } from "../components/UI";
import {
  Hero,
  Problem,
  Services,
  FeaturedWork,
  Offer,
  Process,
  FAQ,
  FinalCTA,
  StickyCTA,
} from "../components/Sections";
export function HomePage() {
  return (
    <>
      <Hero />
      <Problem />
      <Services />
      <FeaturedWork />
      <Offer />
      <Process />
      <FAQ />
      <FinalCTA />
      <StickyCTA />
    </>
  );
}
export function LegalPage({ type }) {
  return (
    <section className="section legal-page">
      <div className="container legal-content">
        <Eyebrow>{siteConfig.name}</Eyebrow>
        <h1>{copy.legal[type]}</h1>
        {siteConfig.legal[type] ? (
          <p>{siteConfig.legal[type]}</p>
        ) : (
          <Placeholder>{siteConfig.pending[type]}</Placeholder>
        )}
        <p className="legal-date">
          {copy.common.lastUpdated}:{" "}
          <time dateTime={siteConfig.legal.updated}>
            {siteConfig.legal.updated}
          </time>
        </p>
        {siteConfig.email ? (
          <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>
        ) : (
          <Placeholder>{siteConfig.pending.businessEmail}</Placeholder>
        )}
      </div>
    </section>
  );
}
export function NotFoundPage() {
  return (
    <section className="section not-found">
      <div className="container">
        <Eyebrow>404</Eyebrow>
        <h1>{copy.notFound.title}</h1>
        <p>{copy.notFound.description}</p>
        <Link className="text-link" to="/">
          {copy.common.homeLink}
        </Link>
        <CTAGroup location="final" />
      </div>
    </section>
  );
}
