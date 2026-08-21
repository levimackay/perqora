"use client";

import { useId, useState, type FormEvent } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { submissionSchema, type SubmissionInput } from "@/lib/validation";

type FormState = {
  benefitName: string;
  provider: string;
  url: string;
  description: string;
  category: string;
  studentRequirements: string;
  country: string;
  notes: string;
  submitterEmail: string;
  website: string;
};

const EMPTY_FORM: FormState = {
  benefitName: "",
  provider: "",
  url: "",
  description: "",
  category: "",
  studentRequirements: "",
  country: "",
  notes: "",
  submitterEmail: "",
  website: "",
};

type Status = { kind: "idle" } | { kind: "submitting" } | { kind: "success"; id: string } | { kind: "error"; message: string };

function toPayload(form: FormState): SubmissionInput {
  return {
    benefitName: form.benefitName,
    provider: form.provider,
    url: form.url,
    description: form.description,
    category: form.category,
    studentRequirements: form.studentRequirements || undefined,
    country: form.country || undefined,
    notes: form.notes || undefined,
    submitterEmail: form.submitterEmail || undefined,
    website: form.website || undefined,
  };
}

export function SubmitForm({ categorySuggestions }: { categorySuggestions: string[] }) {
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof SubmissionInput, string>>>({});
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const categoryListId = useId();

  function updateField<K extends keyof FormState>(key: K, value: string) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const payload = toPayload(form);
    const parsed = submissionSchema.safeParse(payload);

    if (!parsed.success) {
      const errors: Partial<Record<keyof SubmissionInput, string>> = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as keyof SubmissionInput | undefined;
        if (key && !errors[key]) errors[key] = issue.message;
      }
      setFieldErrors(errors);
      setStatus({ kind: "idle" });

      // Move focus to (and thereby announce) the first invalid field, since
      // nothing else moves focus or interrupts a screen reader after a
      // client-side validation failure.
      const firstErrorKey = Object.keys(errors)[0];
      const firstErrorField = firstErrorKey ? event.currentTarget.elements.namedItem(firstErrorKey) : null;
      if (firstErrorField instanceof HTMLElement) firstErrorField.focus();

      return;
    }

    setFieldErrors({});
    setStatus({ kind: "submitting" });

    try {
      const res = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });

      if (res.status === 429) {
        const body = await res.json().catch(() => null);
        setStatus({
          kind: "error",
          message:
            (body?.error as string | undefined) ??
            "You've submitted a few of these recently. Try again in a bit.",
        });
        return;
      }

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        setStatus({ kind: "error", message: (body?.error as string | undefined) ?? "Submission failed. Try again." });
        return;
      }

      const body = (await res.json()) as { id: string; status: string };
      setStatus({ kind: "success", id: body.id });
      setForm(EMPTY_FORM);
    } catch {
      setStatus({ kind: "error", message: "Couldn't reach the server. Check your connection and try again." });
    }
  }

  if (status.kind === "success") {
    return (
      <div className="mt-8 rounded-md border border-status-verified/30 bg-status-verified/10 px-6 py-8">
        <p className="font-mono-data text-xs tracking-[0.03em] text-status-verified uppercase">Submitted</p>
        <p className="mt-3 text-[17px] leading-[1.6] text-text-primary">
          Thanks, this is now in the review queue.
        </p>
        <p className="mt-2 max-w-[60ch] text-sm leading-[1.6] text-text-secondary">
          It is <span className="text-text-primary">not live yet</span> and won&apos;t appear in the catalog
          until a maintainer checks it against the provider&apos;s page and approves it. See{" "}
          <Link
            href="/how-it-works"
            className="rounded-sm text-accent hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            how submissions get reviewed
          </Link>
          .
        </p>
        <Button type="button" variant="secondary" className="mt-5" onClick={() => setStatus({ kind: "idle" })}>
          Submit another
        </Button>
      </div>
    );
  }

  const isSubmitting = status.kind === "submitting";
  const errorCount = Object.keys(fieldErrors).length;

  return (
    <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-6" aria-describedby={status.kind === "error" ? "submit-error" : undefined}>
      {status.kind === "error" && (
        <div id="submit-error" role="alert" className="rounded-md border border-status-error/30 bg-status-error/10 px-4 py-3 text-sm text-status-error">
          {status.message}
        </div>
      )}

      {errorCount > 0 && (
        <div role="alert" className="rounded-md border border-status-error/30 bg-status-error/10 px-4 py-3 text-sm text-status-error">
          {errorCount === 1 ? "1 field needs" : `${errorCount} fields need`} attention below before this can be
          submitted.
        </div>
      )}

      <Field
        label="Benefit name"
        name="benefitName"
        value={form.benefitName}
        onChange={(v) => updateField("benefitName", v)}
        error={fieldErrors.benefitName}
        required
        placeholder="e.g. Postman Student Plan"
      />

      <Field
        label="Provider"
        name="provider"
        value={form.provider}
        onChange={(v) => updateField("provider", v)}
        error={fieldErrors.provider}
        required
        placeholder="e.g. Postman"
      />

      <Field
        label="Official URL"
        name="url"
        type="url"
        value={form.url}
        onChange={(v) => updateField("url", v)}
        error={fieldErrors.url}
        required
        placeholder="https://"
      />

      <div>
        <label htmlFor="category" className="font-mono-data text-xs tracking-[0.03em] text-text-secondary uppercase">
          Category<span className="text-status-error"> *</span>
        </label>
        <input
          id="category"
          name="category"
          list={categoryListId}
          value={form.category}
          onChange={(e) => updateField("category", e.target.value)}
          required
          placeholder="e.g. Developer Tools"
          aria-invalid={Boolean(fieldErrors.category)}
          aria-describedby={fieldErrors.category ? "category-error" : undefined}
          className="mt-2 w-full rounded-md border border-control-border bg-surface px-3 py-2.5 text-[15px] text-text-primary outline-none placeholder:text-text-secondary/60 focus:border-accent"
        />
        <datalist id={categoryListId}>
          {categorySuggestions.map((name) => (
            <option key={name} value={name} />
          ))}
        </datalist>
        {fieldErrors.category && (
          <p id="category-error" className="mt-1.5 text-xs text-status-error">
            {fieldErrors.category}
          </p>
        )}
      </div>

      <TextAreaField
        label="Description"
        name="description"
        value={form.description}
        onChange={(v) => updateField("description", v)}
        error={fieldErrors.description}
        required
        rows={4}
        placeholder="What does this benefit actually include? (20-2000 characters)"
      />

      <TextAreaField
        label="Student requirements"
        name="studentRequirements"
        value={form.studentRequirements}
        onChange={(v) => updateField("studentRequirements", v)}
        error={fieldErrors.studentRequirements}
        rows={2}
        placeholder="Optional, e.g. requires a .edu email"
      />

      <Field
        label="Country"
        name="country"
        value={form.country}
        onChange={(v) => updateField("country", v)}
        error={fieldErrors.country}
        placeholder="Optional, leave blank if globally available"
      />

      <TextAreaField
        label="Notes for reviewers"
        name="notes"
        value={form.notes}
        onChange={(v) => updateField("notes", v)}
        error={fieldErrors.notes}
        rows={2}
        placeholder="Optional, anything that helps us verify this"
      />

      <Field
        label="Your email"
        name="submitterEmail"
        type="email"
        value={form.submitterEmail}
        onChange={(v) => updateField("submitterEmail", v)}
        error={fieldErrors.submitterEmail}
        placeholder="Optional, only used if we need to ask about this submission"
      />

      {/* Honeypot: visually hidden but present and focusable, real visitors never fill it. */}
      <div className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden">
        <label htmlFor="website">Leave this field blank</label>
        <input
          id="website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={form.website}
          onChange={(e) => updateField("website", e.target.value)}
        />
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Submitting…" : "Submit for review"}
      </Button>
    </form>
  );
}

function Field({
  label,
  name,
  value,
  onChange,
  error,
  required,
  type = "text",
  placeholder,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  required?: boolean;
  type?: string;
  placeholder?: string;
}) {
  const errorId = `${name}-error`;
  return (
    <div>
      <label htmlFor={name} className="font-mono-data text-xs tracking-[0.03em] text-text-secondary uppercase">
        {label}
        {required && <span className="text-status-error"> *</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        placeholder={placeholder}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        className="mt-2 w-full rounded-md border border-control-border bg-surface px-3 py-2.5 text-[15px] text-text-primary outline-none placeholder:text-text-secondary/60 focus:border-accent"
      />
      {error && (
        <p id={errorId} className="mt-1.5 text-xs text-status-error">
          {error}
        </p>
      )}
    </div>
  );
}

function TextAreaField({
  label,
  name,
  value,
  onChange,
  error,
  required,
  rows = 3,
  placeholder,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  required?: boolean;
  rows?: number;
  placeholder?: string;
}) {
  const errorId = `${name}-error`;
  return (
    <div>
      <label htmlFor={name} className="font-mono-data text-xs tracking-[0.03em] text-text-secondary uppercase">
        {label}
        {required && <span className="text-status-error"> *</span>}
      </label>
      <textarea
        id={name}
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        rows={rows}
        placeholder={placeholder}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        className="mt-2 w-full resize-y rounded-md border border-control-border bg-surface px-3 py-2.5 text-[15px] text-text-primary outline-none placeholder:text-text-secondary/60 focus:border-accent"
      />
      {error && (
        <p id={errorId} className="mt-1.5 text-xs text-status-error">
          {error}
        </p>
      )}
    </div>
  );
}
