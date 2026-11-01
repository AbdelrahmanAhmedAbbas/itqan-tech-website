import { Link } from "react-router-dom";
import { copy } from "../content";
import { siteConfig } from "../site.config";
import { Brand, Placeholder } from "./UI";
export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-top">
          <div className="footer-brand">
            <Brand />
            <p>{copy.footer.promise}</p>
          </div>
          <div className="footer-links">
            <p className="eyebrow">{copy.footer.explore}</p>
            {copy.nav.map((item) => (
              <Link key={item.path} to={item.path}>
                {item.label}
              </Link>
            ))}
          </div>
          <div className="footer-contact">
            <p className="eyebrow">{copy.footer.connect}</p>
            {siteConfig.email ? (
              <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>
            ) : (
              <Placeholder>{siteConfig.pending.businessEmail}</Placeholder>
            )}
            <a href={siteConfig.linkedin} target="_blank" rel="noreferrer">
              {copy.common.linkedin} ↗
            </a>
            <p>{copy.footer.location}</p>
          </div>
        </div>
        <div className="footer-bottom">
          <span>
            © {copy.footer.copyright} {siteConfig.year}
          </span>
          <div>
            <Link to="/privacy">{copy.common.privacy}</Link>
            <Link to="/terms">{copy.common.terms}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
