import { siteConfig } from "./src/site.config.ts";
export default function middleware(request: Request) {
  const url = new URL(request.url);
  if (url.hostname === "www.itqantech.org")
    return Response.redirect(
      siteConfig.domain + url.pathname + url.search,
      301,
    );
  if (url.pathname === "/case-study/core-en")
    return Response.redirect(new URL("/work/core-en" + url.search, url), 301);
  if (url.pathname === "/case-study/middlemen-mdos")
    return Response.redirect(
      new URL("/work/middlemen-mdos" + url.search, url),
      301,
    );
  if (["/work/wasfa", "/case-study/wasfa"].includes(url.pathname)) {
    if (!siteConfig.flags.showWasfa)
      return Response.redirect(new URL("/" + url.search + "#work", url), 301);
    if (url.pathname.startsWith("/case-study/"))
      return Response.redirect(new URL("/work/wasfa" + url.search, url), 301);
  }
  return undefined;
}
export const config = { matcher: ["/((?!api|assets|fonts|motion|brand).*)"] };
