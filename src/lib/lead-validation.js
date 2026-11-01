export function normalizeWebsite(value) {
  const text = typeof value === "string" ? value.trim() : "";
  if (!text || text.length > 500) return "";
  try {
    const url = new URL(
      /^[a-z][a-z\d+.-]*:\/\//i.test(text) ? text : `https://${text}`,
    );
    if (
      !["http:", "https:"].includes(url.protocol) ||
      !url.hostname.includes(".") ||
      url.username ||
      url.password
    )
      return "";
    return url.href;
  } catch {
    return "";
  }
}
export function validateLead(input = {}, { showEmailField = true } = {}) {
  const raw = input && typeof input === "object" ? input : {};
  const text = (key) => (typeof raw[key] === "string" ? raw[key].trim() : "");
  const data = {
    name: text("name"),
    ...(showEmailField ? { email: text("email") } : {}),
    website: normalizeWebsite(text("website")),
    role: text("role"),
    workflow: text("workflow"),
  };
  const errors = {};
  if (data.name.length < 2 || data.name.length > 100) errors.name = "name";
  if (
    showEmailField &&
    (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email) || data.email.length > 254)
  )
    errors.email = "email";
  if (!data.website) errors.website = "website";
  if (data.role.length < 2 || data.role.length > 100) errors.role = "role";
  if (data.workflow.length < 20 || data.workflow.length > 600)
    errors.workflow = "workflow";
  return { errors, data };
}
