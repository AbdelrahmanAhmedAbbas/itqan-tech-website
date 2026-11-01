import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom";
import App from "./App";
export { getMetadata } from "./lib/metadata";
export { pagePaths } from "./content";
export { siteConfig } from "./site.config";

export function render(pathname) {
  return renderToString(
    <StaticRouter location={pathname}>
      <App />
    </StaticRouter>,
  );
}
