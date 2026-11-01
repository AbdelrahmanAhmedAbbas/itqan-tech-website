import { useEffect, useRef } from "react";
import {
  Navigate,
  Route,
  Routes,
  useLocation,
  useParams,
} from "react-router-dom";
import MotionProvider from "./components/MotionProvider";
import PageMotion from "./components/PageMotion";
import SiteHeader from "./components/SiteHeader";
import SiteFooter from "./components/SiteFooter";
import BookingProvider from "./components/BookingProvider";
import { HomePage, LegalPage, NotFoundPage } from "./pages/SitePages";
import ProjectPage from "./pages/ProjectPage";
import { copy, projectForSlug } from "./content";
import { getAttribution, loadAnalytics, trackPageview } from "./lib/analytics";
import { getMetadata } from "./lib/metadata";
function LegacyCase() {
  const { slug } = useParams();
  return projectForSlug(slug) ? (
    <Navigate to={`/work/${slug}`} replace />
  ) : (
    <NotFoundPage />
  );
}
function RouteEffects() {
  const { pathname, hash } = useLocation();
  const previous = useRef(pathname);
  useEffect(() => {
    getAttribution();
    loadAnalytics();
    trackPageview(pathname);
    document.documentElement.lang = "en";
    document.documentElement.dir = "ltr";
    const m = getMetadata(pathname);
    document.title = m.title;
    const set = (selector, value) =>
      document.querySelector(selector)?.setAttribute("content", value);
    set('meta[name="description"]', m.description);
    set('meta[name="robots"]', m.noindex ? "noindex, follow" : "index, follow");
    for (const key of ["title", "description", "image"]) {
      set(`meta[property="og:${key}"]`, m[key]);
      set(`meta[name="twitter:${key}"]`, m[key]);
    }
    set('meta[property="og:url"]', m.url);
    document
      .querySelector('link[rel="canonical"]')
      ?.setAttribute("href", m.url);
    const schema = document.getElementById("site-schema");
    if (schema) schema.textContent = JSON.stringify(m.structuredData);
    const changed = previous.current !== pathname;
    previous.current = pathname;
    requestAnimationFrame(() => {
      if (hash) {
        const target = document.getElementById(
          decodeURIComponent(hash.slice(1)),
        );
        target?.scrollIntoView({
          behavior: window.matchMedia("(prefers-reduced-motion:reduce)").matches
            ? "instant"
            : "smooth",
        });
        if (target) {
          target.tabIndex = -1;
          target.focus({ preventScroll: true });
        }
      } else if (changed) {
        window.scrollTo({ top: 0, behavior: "instant" });
        const heading = document.querySelector("main h1");
        if (heading) {
          heading.tabIndex = -1;
          heading.focus({ preventScroll: true });
        }
      }
    });
  }, [pathname, hash]);
  return null;
}
export default function App() {
  const { pathname } = useLocation();
  return (
    <MotionProvider>
      <BookingProvider>
        <PageMotion />
        <RouteEffects />
        <a className="skip-link" href="#main-content">
          {copy.common.skip}
        </a>
        <SiteHeader />
        <main id="main-content" tabIndex={-1} key={pathname}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/work/:slug" element={<ProjectPage />} />
            <Route path="/privacy" element={<LegalPage type="privacy" />} />
            <Route path="/terms" element={<LegalPage type="terms" />} />
            <Route path="/case-study/:slug" element={<LegacyCase />} />
            {[
              ["/start", "/"],
              ["/services", "/#services"],
              ["/work", "/#work"],
              ["/how-we-work", "/#pricing"],
              ["/about", "/"],
              ["/contact", "/#loom-request"],
            ].map(([from, to]) => (
              <Route
                key={from}
                path={from}
                element={<Navigate to={to} replace />}
              />
            ))}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
        <SiteFooter />
      </BookingProvider>
    </MotionProvider>
  );
}
