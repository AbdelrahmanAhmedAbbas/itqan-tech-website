import { useSyncExternalStore } from "react";
const event = "itqan:theme";
function subscribe(callback) {
  window.addEventListener(event, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(event, callback);
    window.removeEventListener("storage", callback);
  };
}
export function setTheme(theme) {
  if (typeof document === "undefined") return;
  const value = theme === "light" ? "light" : "dark";
  document.documentElement.dataset.theme = value;
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute("content", value === "light" ? "#F7F5F2" : "#09090B");
  try {
    localStorage.setItem("itqan-theme", value);
  } catch {
    /* The current page still switches if storage is blocked. */
  }
  const url = new URL(window.location.href);
  if (url.searchParams.has("theme")) {
    url.searchParams.set("theme", value);
    window.history.replaceState(window.history.state, "", url);
  }
  window.dispatchEvent(new Event(event));
}
export function useTheme() {
  return useSyncExternalStore(
    subscribe,
    () =>
      document.documentElement.dataset.theme === "light" ? "light" : "dark",
    () => "dark",
  );
}
