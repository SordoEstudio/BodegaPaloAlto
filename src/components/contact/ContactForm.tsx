"use client";

import { useState, useCallback } from "react";
import type { ContactFormData } from "@/types/sections";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type FormStatus = "idle" | "loading" | "success" | "error";

interface FormState {
  name: string;
  email: string;
  phone: string;
  message: string;
  privacy: boolean;
  company: string;
}

interface FieldErrors {
  name?: string;
  email?: string;
  message?: string;
  privacy?: string;
}

interface ContactFormProps {
  data: ContactFormData;
  locale: string;
  sourcePage?: string;
  /** Si true, labels e inputs usan estilos para sobre overlay oscuro */
  onDark?: boolean;
}

function getInitialState(): FormState {
  return {
    name: "",
    email: "",
    phone: "",
    message: "",
    privacy: false,
    company: "",
  };
}

export function ContactForm({ data, locale, sourcePage = "contacto", onDark = false }: ContactFormProps) {
  const [state, setState] = useState<FormState>(getInitialState);
  const [status, setStatus] = useState<FormStatus>("idle");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  const update = useCallback((field: keyof FormState, value: string | boolean) => {
    setState((prev) => ({ ...prev, [field]: value }));
    setFieldErrors((prev) => {
      const next = { ...prev };
      delete next[field as keyof FieldErrors];
      return next;
    });
  }, []);

  const validate = useCallback((): boolean => {
    const errors: FieldErrors = {};
    const name = state.name.trim();
    const email = state.email.trim();
    const message = state.message.trim();

    if (name.length < 2) errors.name = "Mínimo 2 caracteres";
    if (!EMAIL_REGEX.test(email)) errors.email = "Email no válido";
    if (message.length < 10) errors.message = "Mínimo 10 caracteres";
    if (!state.privacy) errors.privacy = "Requerido";

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }, [state.name, state.email, state.message, state.privacy]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (status === "loading") return;
      if (state.company) return;

      if (!validate()) return;

      setStatus("loading");
      setFieldErrors({});

      try {
        const res = await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: state.name.trim(),
            email: state.email.trim(),
            phone: state.phone.trim(),
            message: state.message.trim(),
            locale,
            source_page: sourcePage,
            privacy: true,
            company: state.company,
          }),
        });

        if (!res.ok) {
          setStatus("error");
          return;
        }
        setStatus("success");
        setState(getInitialState());
      } catch {
        setStatus("error");
      }
    },
    [state, validate, status, locale, sourcePage]
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

  return (
    <div className="mx-auto max-w-md" aria-live="polite">
      <h2 id="contact-form-heading" className={titleClass}>
        {data.sectionTitle}
      </h2>
      {data.sectionDescription && (
        <p className={`mt-2 text-sm ${onDark ? "text-white/90" : "text-foreground/90"}`}>
          {data.sectionDescription}
        </p>
      )}

      {status === "success" && (
        <p className="mt-6 rounded-lg bg-palo-alto-primary p-4 text-white" role="status">
          {data.successMessage}
        </p>
      )}

      {status === "error" && (
        <p className="mt-6 rounded-lg bg-red-50 p-4 text-red-700" role="alert">
          {data.errorMessage}
        </p>
      )}

      {status !== "success" && (
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div className="absolute -left-[9999px] opacity-0" aria-hidden>
            <label htmlFor="contact-company">Company</label>
            <input
              id="contact-company"
              type="text"
              name="company"
              tabIndex={-1}
              autoComplete="off"
              value={state.company}
              onChange={(e) => update("company", e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="contact-name" className={labelClass}>
              {labels.name} *
            </label>
            <input
              id="contact-name"
              type="text"
              required
              minLength={2}
              disabled={isDisabled}
              value={state.name}
              onChange={(e) => update("name", e.target.value)}
              aria-invalid={!!fieldErrors.name}
              
              aria-describedby={fieldErrors.name ? "contact-name-err" : undefined}
              className={inputClass}
            />
            {fieldErrors.name && (
              <p id="contact-name-err" className="mt-1 text-sm text-red-400">
                {fieldErrors.name}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="contact-email" className={labelClass}>
              {labels.email} *
            </label>
            <input
              id="contact-email"
              type="email"
              required
              disabled={isDisabled}
              value={state.email}
              onChange={(e) => update("email", e.target.value)}
              aria-invalid={!!fieldErrors.email}
              aria-describedby={fieldErrors.email ? "contact-email-err" : undefined}
              className={inputClass}
            />
            {fieldErrors.email && (
              <p id="contact-email-err" className="mt-1 text-sm text-red-400">
                {fieldErrors.email}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="contact-phone" className={labelClass}>
              {labels.phone}
            </label>
            <input
              id="contact-phone"
              type="tel"
              disabled={isDisabled}
              value={state.phone}
              onChange={(e) => update("phone", e.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="contact-message" className={labelClass}>
              {labels.message} *
            </label>
            <textarea
              id="contact-message"
              required
              minLength={10}
              rows={4}
              disabled={isDisabled}
              value={state.message}
              onChange={(e) => update("message", e.target.value)}
              aria-invalid={!!fieldErrors.message}
              aria-describedby={fieldErrors.message ? "contact-message-err" : undefined}
              className={inputClass + " resize-y"}
            />
            {fieldErrors.message && (
              <p id="contact-message-err" className="mt-1 text-sm text-red-400">
                {fieldErrors.message}
              </p>
            )}
          </div>

          <div>
            <label className="flex items-start gap-3">
              <input
                type="checkbox"
                required
                checked={state.privacy}
                disabled={isDisabled}
                onChange={(e) => update("privacy", e.target.checked)}
                aria-invalid={!!fieldErrors.privacy}
                className="mt-1 h-4 w-4 rounded border-zinc-300 bg-zinc-900 text-palo-alto-primary focus:ring-palo-alto-primary"
              />
              <span className={`text-sm ${onDark ? "text-white/95" : "text-foreground"}`}>
                {labels.privacy}
              </span>
            </label>
            {fieldErrors.privacy && (
              <p className="mt-1 text-sm text-red-400">{fieldErrors.privacy}</p>
            )}
          </div>

          <div>
            <button
              type="submit"
              disabled={isDisabled}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-palo-alto-primary px-6 py-3 font-semibold text-palo-alto-secondary transition focus:outline-none focus:ring-2 focus:ring-palo-alto-primary focus:ring-offset-2 disabled:opacity-60 hover:opacity-90"
            >
              {status === "loading" ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-palo-alto-secondary border-t-transparent" />
                  {labels.submit}
                </>
              ) : (
                labels.submit
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
