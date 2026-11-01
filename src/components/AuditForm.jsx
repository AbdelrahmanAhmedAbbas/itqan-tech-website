import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { LoaderCircle, CheckCircle2 } from "lucide-react";
import { copy, interpolate } from "../content";
import { siteConfig } from "../site.config";
import { getAttribution, track } from "../lib/analytics";
import { validateLead } from "../lib/lead-validation";
import { BookLink } from "./UI";
export default function AuditForm({ prefix = "audit" }) {
  const f = copy.form;
  const form = useRef(null),
    summary = useRef(null),
    success = useRef(null),
    opened = useRef(false),
    requestId = useRef(null);
  const [errors, setErrors] = useState({}),
    [status, setStatus] = useState("idle"),
    [message, setMessage] = useState(""),
    [name, setName] = useState(""),
    [country, setCountry] = useState("Unknown");
  const [attribution, setAttribution] = useState({});
  useEffect(() => {
    const abort = new AbortController();
    fetch(siteConfig.form.visitorEndpoint, { signal: abort.signal })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d?.country) setCountry(d.country);
      })
      .catch(() => {});
    return () => abort.abort();
  }, []);
  useEffect(() => {
    if (status === "success") success.current?.focus();
  }, [status]);
  const id = (key) => `${prefix}-${key}`;
  async function submit(e) {
    e.preventDefault();
    if (status === "sending") return;
    setMessage("");
    const fields = Object.fromEntries(new FormData(form.current));
    if (fields.contactAddress) return;
    const validation = validateLead(fields, {
      showEmailField: siteConfig.form.showEmailField,
    });
    setErrors(validation.errors);
    if (Object.keys(validation.errors).length) {
      const first = Object.keys(validation.errors)[0];
      track("loom_form_error", { field: first });
      requestAnimationFrame(() =>
        form.current?.querySelector(`[name="${first}"]`)?.focus(),
      );
      return;
    }
    setStatus("sending");
    requestId.current ||= crypto.randomUUID();
    try {
      const response = await fetch(siteConfig.form.endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...validation.data,
          ...getAttribution(),
          country,
          timestamp: new Date().toISOString(),
          requestId: requestId.current,
          contactAddress: fields.contactAddress || "",
        }),
      });
      const body = await response.json().catch(() => ({}));
      if (!response.ok || body.ok !== true)
        throw new Error(
          response.status === 429
            ? "rate"
            : response.status === 503
              ? "config"
              : "delivery",
        );
      setName(validation.data.name.split(/\s+/)[0]);
      setStatus("success");
      track("loom_form_submit");
    } catch (error) {
      setStatus("idle");
      setMessage(
        error.message === "rate"
          ? f.rateError
          : error.message === "config"
            ? f.configurationError
            : f.deliveryError,
      );
      track("loom_form_error", { field: "delivery" });
      requestAnimationFrame(() => summary.current?.focus());
    }
  }
  const props = (key) => ({
    id: id(key),
    name: key,
    required: true,
    "aria-invalid": errors[key] ? true : undefined,
    "aria-describedby": errors[key]
      ? id(`${key}-error`)
      : key === "workflow"
        ? id("workflow-hint")
        : undefined,
  });
  const error = (key) =>
    errors[key] && (
      <span className="field-error" id={id(`${key}-error`)}>
        {f.errors[key]}
      </span>
    );
  if (status === "success")
    return (
      <div className="form-success" role="status">
        <CheckCircle2 size={32} aria-hidden="true" />
        <h3 ref={success} tabIndex={-1}>
          {interpolate(f.thanks, { firstName: name })}
        </h3>
        <p>
          {f.success} {siteConfig.approved.turnaround}
        </p>
        <p>{f.sooner}</p>
        <BookLink location="thank_you" />
        <button
          type="button"
          className="text-link"
          onClick={() => {
            setStatus("idle");
            requestId.current = null;
            requestAnimationFrame(() =>
              document.getElementById(id("name"))?.focus(),
            );
          }}
        >
          {f.another}
        </button>
      </div>
    );
  return (
    <form
      ref={form}
      className="audit-form"
      onSubmit={submit}
      noValidate
      onFocus={() => {
        if (!opened.current) {
          opened.current = true;
          setAttribution({
            ...getAttribution(),
            timestamp: new Date().toISOString(),
          });
          if (prefix !== "modal")
            track("loom_form_open", { location: "final" });
        }
      }}
    >
      {(message || Object.keys(errors).length > 0) && (
        <p ref={summary} tabIndex={-1} className="error-summary" role="alert">
          {message || f.errorSummary}
        </p>
      )}
      <div className="form-field">
        <label htmlFor={id("name")}>{f.name}</label>
        <input {...props("name")} autoComplete="name" maxLength={100} />
        {error("name")}
      </div>
      {siteConfig.form.showEmailField && (
        <div className="form-field">
          <label htmlFor={id("email")}>{f.email}</label>
          <input
            {...props("email")}
            type="email"
            autoComplete="email"
            maxLength={254}
          />
          {error("email")}
        </div>
      )}
      <div className="form-field">
        <label htmlFor={id("website")}>{f.website}</label>
        <input
          {...props("website")}
          type="text"
          inputMode="url"
          autoComplete="url"
          maxLength={500}
        />
        {error("website")}
      </div>
      <div className="form-field">
        <label htmlFor={id("role")}>{f.role}</label>
        <input
          {...props("role")}
          type="text"
          list={id("roles")}
          autoComplete="organization-title"
          maxLength={100}
        />
        <datalist id={id("roles")}>
          {f.roles.map((role) => (
            <option key={role} value={role} />
          ))}
        </datalist>
        {error("role")}
      </div>
      <div className="form-field">
        <label htmlFor={id("workflow")}>{f.workflow}</label>
        <textarea
          {...props("workflow")}
          minLength={20}
          maxLength={600}
          rows={4}
        />
        <small id={id("workflow-hint")}>{f.workflowHint}</small>
        {error("workflow")}
      </div>
      <div className="form-honeypot" hidden aria-hidden="true">
        <label htmlFor={id("contactAddress")}>{f.honeypot}</label>
        <input
          id={id("contactAddress")}
          name="contactAddress"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>
      {Object.entries({ ...attribution, country }).map(([key, value]) => (
        <input key={key} type="hidden" name={key} value={value} />
      ))}
      <button
        className="button button-primary form-submit"
        type="submit"
        disabled={status === "sending"}
      >
        {status === "sending" ? (
          <>
            <LoaderCircle
              size={17}
              className="sending-spinner"
              aria-hidden="true"
            />
            {f.sending}
          </>
        ) : (
          copy.common.primary
        )}
      </button>
      <p className="form-privacy">
        {f.privacy} <Link to="/privacy">{copy.common.privacy}</Link>.
      </p>
      <BookLink location={prefix === "modal" ? "nav" : "final"} />
    </form>
  );
}
