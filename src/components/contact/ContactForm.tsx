"use client";

import { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import type { ContactFormData } from "@/types/sections";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type FormStatus = "idle" | "loading" | "success" | "error";

type FormValue = string | string[] | boolean;
type FormValues = Record<string, FormValue>;

interface LocalizedText {
  es?: string;
  en?: string;
  [key: string]: string | undefined;
}

interface FormOption {
  value: string;
  label?: LocalizedText | string;
}

interface DynamicField {
  id: string;
  type: string;
  label?: LocalizedText | string;
  placeholder?: LocalizedText | string;
  required?: boolean;
  order?: number;
  width?: "full" | "half";
  options?: FormOption[];
}

interface FormSchema {
  slug: string;
  name?: LocalizedText | string;
  description?: LocalizedText | string;
  fields: DynamicField[];
  settings?: {
    success_message?: LocalizedText | string;
  };
}

type FieldErrors = Record<string, string>;

interface ContactFormProps {
  data: ContactFormData;
  locale: string;
  sourcePage?: string;
  /** Si true, labels e inputs usan estilos para sobre overlay oscuro */
  onDark?: boolean;
}

function localize(text: LocalizedText | string | undefined, locale: string, fallback: string): string {
  if (!text) return fallback;
  if (typeof text === "string") return text || fallback;
  return text[locale] ?? text.es ?? fallback;
}

function shouldUseAutoTextarea(field: DynamicField, locale: string): boolean {
  if (field.type === "textarea") return true;
  if (field.type !== "text") return false;
  const label = localize(field.label, locale, "").toLowerCase();
  return label.includes("consulta") || label.includes("consultation") || label.includes("message");
}

function getInitialValues(fields: DynamicField[]): FormValues {
  return fields.reduce<FormValues>((acc, field) => {
    acc[field.id] = field.type === "multiselect" ? [] : "";
    return acc;
  }, {});
}

export function ContactForm({ data, locale, sourcePage = "contacto", onDark = false }: ContactFormProps) {
  const [schema, setSchema] = useState<FormSchema | null>(null);
  const [values, setValues] = useState<FormValues>({});
  const [honeypot, setHoneypot] = useState("");
  const [schemaLoading, setSchemaLoading] = useState(true);
  const [status, setStatus] = useState<FormStatus>("idle");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  const formSlug = sourcePage?.trim() || "contacto";
  const fields = [...(schema?.fields ?? [])].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  const update = useCallback((field: string, value: FormValue) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    setFieldErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }, []);

  const validate = useCallback((): boolean => {
    const errors: FieldErrors = {};
    for (const field of fields) {
      const rawValue = values[field.id];
      if (field.required) {
        if (field.type === "multiselect") {
          const arr = Array.isArray(rawValue) ? rawValue : [];
          if (arr.length === 0) errors[field.id] = locale === "en" ? "Required field" : "Campo requerido";
        } else if (typeof rawValue !== "string" || rawValue.trim() === "") {
          errors[field.id] = locale === "en" ? "Required field" : "Campo requerido";
        }
      }
      if (field.type === "email" && typeof rawValue === "string" && rawValue.trim() !== "") {
        if (!EMAIL_REGEX.test(rawValue.trim())) {
          errors[field.id] = locale === "en" ? "Invalid email" : "Email no valido";
        }
      }
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }, [fields, values, locale]);

  useEffect(() => {
    const url = `/api/public/forms/${encodeURIComponent(formSlug)}?locale=${encodeURIComponent(locale)}`;
    const cacheKey = `form_schema_${formSlug}_${locale}`;

    const fetchFormSchema = async () => {
      try {
        setSchemaLoading(true);

        // Intentar leer del cache de sesión
        if (typeof window !== "undefined") {
          try {
            const cached = sessionStorage.getItem(cacheKey);
            if (cached) {
              const parsed: FormSchema = JSON.parse(cached);
              if (parsed?.fields) {
                setSchema(parsed);
                setValues(getInitialValues(parsed.fields));
                setSchemaLoading(false);
                return;
              }
            }
          } catch {
            // ignore cache errors
          }
        }

        const res = await fetch(url, {
          method: "GET",
          headers: { Accept: "application/json" },
        });
        const json = await res.json().catch(() => null);

        const fetchedSchema = json?.success ? (json.data as FormSchema) : null;
        if (fetchedSchema?.fields) {
          setSchema(fetchedSchema);
          setValues(getInitialValues(fetchedSchema.fields));
          try { sessionStorage.setItem(cacheKey, JSON.stringify(fetchedSchema)); } catch { /* ignore */ }
        } else {
          setSchema(null);
        }
      } catch (error) {
        console.error("[ContactForm] GET form schema error", error);
        setSchema(null);
      } finally {
        setSchemaLoading(false);
      }
    };

    fetchFormSchema();
  }, [locale, sourcePage]);

  useEffect(() => {
    if (!successNotice) return;
    const timeoutId = setTimeout(() => setSuccessNotice(null), 6000);
    return () => clearTimeout(timeoutId);
  }, [successNotice]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (status === "loading") return;
      if (honeypot) return;
      if (!schema) return;

      if (!validate()) return;

      setStatus("loading");
      setFieldErrors({});
      setSubmitError(null);

      try {
        const normalizedValues = fields.reduce<Record<string, unknown>>((acc, field) => {
          const raw = values[field.id];
          if (field.type === "multiselect") {
            acc[field.id] = Array.isArray(raw) ? raw : [];
            return acc;
          }
          acc[field.id] = typeof raw === "string" ? raw.trim() : raw ?? "";
          return acc;
        }, {});
        const payload = { ...normalizedValues, _hp: "", locale };
        const submitUrl = `/api/public/forms/${encodeURIComponent(formSlug)}/submit`;

        console.log("[ContactForm] POST form submit request", {
          method: "POST",
          url: submitUrl,
          payload,
        });

        const res = await fetch(submitUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const responseBody = await res.json().catch(() => null);
        console.log("[ContactForm] POST form submit response", {
          ok: res.ok,
          status: res.status,
          body: responseBody,
        });

        if (!res.ok || !responseBody?.success) {
          const backendError =
            (Array.isArray(responseBody?.details) && responseBody.details.length > 0
              ? responseBody.details.join(" | ")
              : responseBody?.error) ||
            data.errorMessage ||
            (locale === "en" ? "Unable to submit form" : "No se pudo enviar el formulario");
          setSubmitError(backendError);
          setStatus("error");
          return;
        }
        const successText = localize(schema?.settings?.success_message, locale, data.successMessage);
        setStatus("idle");
        setValues(getInitialValues(fields));
        setHoneypot("");
        setSuccessNotice(successText);
      } catch (error) {
        console.error("[ContactForm] POST form submit error", error);
        setSubmitError(data.errorMessage || (locale === "en" ? "Network error" : "Error de red"));
        setStatus("error");
      }
    },
    [status, honeypot, schema, validate, fields, values, formSlug, locale, data.errorMessage, data.successMessage]
  );

  const labels = data.labels;
  const isDisabled = status === "loading";
  const labelClass = onDark
    ? "mb-1 block text-sm font-medium text-white/95"
    : "mb-1 block text-sm font-medium text-palo-alto-secondary";

  // Cambia el color de fondo de los inputs a un color más oscuro de la paleta
  // Puedes ajustar el color aquí (usando por ejemplo bg-zinc-800). Puedes cambiarlo a bg-palo-alto-secondary/80 si tienes esa clase.
  const inputClass =
    "w-full rounded-lg border border-white/20 bg-white/20 px-4 py-2.5 text-white transition focus:border-palo-alto-primary focus:outline-none focus:ring-1 focus:ring-palo-alto-primary disabled:opacity-60 placeholder:text-zinc-400";

  const titleClass = onDark
    ? "font-heading text-2xl font-bold text-white sm:text-3xl"
    : "font-heading text-2xl font-bold text-palo-alto-secondary sm:text-3xl";
  const schemaTitle = localize(schema?.name, locale, data.sectionTitle);
  const schemaDescription = localize(schema?.description, locale, data.sectionDescription ?? "");
  const privacyLead = locale === "en" ? "By clicking Send, " : "Al hacer click en Enviar, ";
  const privacyDefault = locale === "en" ? "you accept the privacy policy." : "aceptas la politica de privacidad.";
  const submitLabel =
    locale === "en"
      ? "Send"
      : labels.submit?.trim()
        ? labels.submit
        : "Enviar";

  const renderField = (field: DynamicField) => {
    const fieldLabel = localize(field.label, locale, field.id);
    const placeholder = localize(field.placeholder, locale, "");
    const value = values[field.id];
    const fieldError = fieldErrors[field.id];
    const isHalf = field.width === "half";
    const wrapperClass = isHalf ? "md:col-span-1" : "md:col-span-2";
    const requiredFlag = field.required ? " *" : "";

    if (shouldUseAutoTextarea(field, locale)) {
      return (
        <div key={field.id} className={wrapperClass}>
          <label htmlFor={field.id} className={labelClass}>
            {fieldLabel}
            {requiredFlag}
          </label>
          <textarea
            id={field.id}
            required={field.required}
            disabled={isDisabled}
            rows={4}
            placeholder={placeholder}
            value={typeof value === "string" ? value : ""}
            onChange={(e) => update(field.id, e.target.value)}
            onInput={(e) => {
              const target = e.currentTarget;
              target.style.height = "auto";
              target.style.height = `${target.scrollHeight}px`;
            }}
            aria-invalid={!!fieldError}
            className={inputClass + " min-h-[44px] resize-none overflow-hidden"}
          />
          {fieldError && <p className="mt-1 text-sm text-red-400">{fieldError}</p>}
        </div>
      );
    }

    if (field.type === "multiselect") {
      const selected = Array.isArray(value) ? value : [];
      return (
        <div key={field.id} className={wrapperClass}>
          <label className={labelClass}>
            {fieldLabel}
            {requiredFlag}
          </label>
          <div className="flex flex-wrap gap-x-5 gap-y-2 rounded-lg border border-white/20 bg-white/10 p-3">
            {(field.options ?? []).map((opt) => {
              const optLabel = localize(opt.label, locale, opt.value);
              const checked = selected.includes(opt.value);
              return (
                <label key={opt.value} className={`inline-flex items-center gap-2 text-sm ${onDark ? "text-white/95" : "text-foreground"}`}>
                  <input
                    type="checkbox"
                    checked={checked}
                    disabled={isDisabled}
                    onChange={(e) => {
                      const next = e.target.checked
                        ? [...selected, opt.value]
                        : selected.filter((v) => v !== opt.value);
                      update(field.id, next);
                    }}
                    className="h-4 w-4 rounded border-zinc-300 bg-zinc-900 text-palo-alto-primary focus:ring-palo-alto-primary"
                  />
                  <span>{optLabel}</span>
                </label>
              );
            })}
          </div>
          {fieldError && <p className="mt-1 text-sm text-red-400">{fieldError}</p>}
        </div>
      );
    }

    const inputType =
      field.type === "phone"
        ? "tel"
        : field.type === "number" || field.type === "date" || field.type === "email"
          ? field.type
          : "text";

    return (
      <div key={field.id} className={wrapperClass}>
        <label htmlFor={field.id} className={labelClass}>
          {fieldLabel}
          {requiredFlag}
        </label>
        <input
          id={field.id}
          type={inputType}
          required={field.required}
          disabled={isDisabled}
          placeholder={placeholder}
          value={typeof value === "string" ? value : ""}
          onChange={(e) => update(field.id, e.target.value)}
          aria-invalid={!!fieldError}
          className={inputClass}
        />
        {fieldError && <p className="mt-1 text-sm text-red-400">{fieldError}</p>}
      </div>
    );
  };

  return (
    <div className="mx-auto max-w-md" aria-live="polite">
      <h2 id="contact-form-heading" className={titleClass}>
        {schemaTitle}
      </h2>
      {schemaDescription && (
        <p className={`mt-2 text-sm ${onDark ? "text-white/90" : "text-foreground/90"}`}>
          {schemaDescription}
        </p>
      )}

      {successNotice && (
        <p className="mt-6 rounded-lg bg-palo-alto-primary p-4 text-white" role="status">
          {successNotice}
        </p>
      )}

      {status === "error" && (
        <p className="mt-6 rounded-lg bg-red-50 p-4 text-red-700" role="alert">
          {submitError ?? data.errorMessage}
        </p>
      )}

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div className="absolute -left-[9999px] opacity-0">
            <label htmlFor="form-hp">Company</label>
            <input
              id="form-hp"
              type="text"
              name="_hp"
              tabIndex={-1}
              autoComplete="off"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
            />
          </div>

          {schemaLoading ? (
            <div className="animate-pulse grid grid-cols-1 gap-4 md:grid-cols-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className={i % 3 === 2 ? "md:col-span-2" : ""}>
                  <div className={`mb-1 h-3 w-24 rounded ${onDark ? "bg-white/20" : "bg-zinc-300/50"}`} />
                  <div className={`h-10 w-full rounded-lg ${onDark ? "bg-white/10" : "bg-zinc-200/60"}`} />
                </div>
              ))}
              <div className="md:col-span-2">
                <div className={`mb-1 h-3 w-24 rounded ${onDark ? "bg-white/20" : "bg-zinc-300/50"}`} />
                <div className={`h-24 w-full rounded-lg ${onDark ? "bg-white/10" : "bg-zinc-200/60"}`} />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {fields.map(renderField)}
            </div>
          )}

          <div>
            <label className="flex items-start gap-3">
              <span className={`text-sm ${onDark ? "text-white/95" : "text-foreground"}`}>
                {locale === "en" ? (
                  <>
                    By clicking Send, I accept the{" "}
                    <Link
                      href={`/${locale}/politica-de-privacidad`}
                      className="underline transition hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-palo-alto-primary focus:ring-offset-1 rounded"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Privacy Policy
                    </Link>{" "}
                    and authorize the processing of my personal data as set out therein.
                  </>
                ) : labels.privacyPrefix != null && labels.privacyLinkText != null && labels.privacySuffix != null ? (
                  <>
                    {privacyLead}
                    {labels.privacyPrefix}
                    <Link
                      href={`/${locale}/politica-de-privacidad`}
                      className="underline transition hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-palo-alto-primary focus:ring-offset-1 rounded"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {labels.privacyLinkText}
                    </Link>
                    {labels.privacySuffix}
                  </>
                ) : (
                  <>
                    {privacyLead}
                    <Link
                      href={`/${locale}/politica-de-privacidad`}
                      className="underline transition hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-palo-alto-primary focus:ring-offset-1 rounded"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {locale === "en" ? "Privacy Policy" : "politica de privacidad"}
                    </Link>
                    {" "}{labels.privacy?.trim() || privacyDefault}
                  </>
                )}
              </span>
            </label>
          </div>

          <div>
            <button
              type="submit"
              disabled={isDisabled || schemaLoading || fields.length === 0}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-palo-alto-primary px-6 py-3 font-semibold text-palo-alto-secondary transition focus:outline-none focus:ring-2 focus:ring-palo-alto-primary focus:ring-offset-2 disabled:opacity-60 hover:opacity-90"
            >
              {status === "loading" ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-palo-alto-secondary border-t-transparent" />
                  {submitLabel}
                </>
              ) : (
                submitLabel
              )}
            </button>
          </div>
      </form>
    </div>
  );
}
