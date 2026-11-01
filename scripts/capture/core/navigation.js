const params = new URLSearchParams("from=2026-11-01&to=2026-11-30");
export const useSearchParams = () => params;
export const useRouter = () => ({
  push() {},
  replace() {},
  refresh() {},
  back() {},
});
export const usePathname = () => "/expenses";
export const redirect = () => {
  throw new Error("No navigation in the isolated screenshot fixture.");
};
