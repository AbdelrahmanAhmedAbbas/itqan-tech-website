import { copy, projectForSlug } from "../content";
import { siteConfig } from "../site.config";
export function getMetadata(pathname) {
  const path = pathname.replace(/\/$/, "") || "/";
  const project =
    /^\/work\/[^/]+$/.test(path) && projectForSlug(path.split("/").pop());
  const page = copy.meta[path];
  const title = project
    ? `${project.name} — ${project.title} | Itqan Tech`
    : page?.title || `${copy.notFound.title} | Itqan Tech`;
  const description = project
    ? `${project.title}. ${project.status === "in-build" ? copy.common.planned : project.summary}`
    : page?.description || copy.notFound.description;
  const domain = siteConfig.domain;
  const url = domain + (path === "/" ? "/" : path);
  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "ProfessionalService",
      name: siteConfig.name,
      alternateName: siteConfig.alternateName,
      url: domain,
      logo: domain + "/brand/itqan-light.svg",
      sameAs: [siteConfig.linkedin],
      areaServed: ["Worldwide", "Egypt", "Gulf"],
      knowsLanguage: ["en", "ar"],
    },
  ];
  if (path === "/")
    structuredData.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: copy.faq.items.map(({ question, answer }) => ({
        "@type": "Question",
        name: question,
        acceptedAnswer: { "@type": "Answer", text: answer },
      })),
    });
  return {
    title,
    description,
    url,
    image: domain + "/og-image.png",
    structuredData,
    noindex:
      (!page && !project) ||
      (path === "/privacy" && !siteConfig.legal.privacy) ||
      (path === "/terms" && !siteConfig.legal.terms),
  };
}
