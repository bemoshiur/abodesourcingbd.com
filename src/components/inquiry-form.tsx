"use client";

import { useState } from "react";
import { Icon } from "@/components/icon";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const fieldClass =
  "h-11 w-full rounded-lg border border-input bg-card/60 px-3.5 py-1 text-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 aria-[invalid=true]:border-destructive aria-[invalid=true]:ring-3 aria-[invalid=true]:ring-destructive/20";

const trustCues = [
  { icon: "Lock", text: "Stays private — never shared" },
  { icon: "Clock", text: "Reply within 24 hours" },
  { icon: "ShieldCheck", text: "Secure submission" },
];

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
type Values = Record<"name" | "company" | "email" | "country" | "category" | "quantity" | "message", string>;
type Errors = Partial<Record<keyof Values, string>>;

type SubmitState =
  | { status: "idle" }
  | { status: "sending" }
  | { status: "success"; message: string }
  | { status: "error"; message: string; fieldErrors?: Errors; mailto?: string }
  | { status: "fallback"; message: string; mailto: string };

const initial: SubmitState = { status: "idle" };

export function InquiryForm({
  markets,
  categories,
}: {
  markets: readonly { name: string; code: string }[];
  categories: readonly { slug: string; title: string }[];
}) {
  const [state, setState] = useState<SubmitState>(initial);
  const [values, setValues] = useState<Values>({
    name: "", company: "", email: "", country: "", category: "", quantity: "", message: "",
  });
  const [clientErrors, setClientErrors] = useState<Errors>({});

  const set = (k: keyof Values) => (e: { target: { value: string } }) => {
    setValues((v) => ({ ...v, [k]: e.target.value }));
    if (clientErrors[k]) setClientErrors((er) => ({ ...er, [k]: undefined }));
  };

  function validate(): boolean {
    const e: Errors = {};
    if (!values.name.trim()) e.name = "Please enter your name";
    if (!values.company.trim()) e.company = "Please enter your company";
    if (!values.email.trim()) e.email = "Please enter your email";
    else if (!emailRe.test(values.email.trim())) e.email = "Enter a valid email address";
    if (!values.message.trim()) e.message = "Please add a short message";
    setClientErrors(e);
    return Object.keys(e).length === 0;
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!validate()) return;
    setState({ status: "sending" });
    try {
      const res = await fetch("/api/inquiry/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, website: "" }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        message?: string;
        fieldErrors?: Errors;
        mailto?: string;
        fallback?: boolean;
      };
      if (data.ok) {
        setState({ status: "success", message: data.message ?? "Thank you — your inquiry is on its way." });
        return;
      }
      if (data.fallback && data.mailto) {
        setState({ status: "fallback", message: data.message ?? "Open the prefilled message in your mail app.", mailto: data.mailto });
        return;
      }
      if (data.fieldErrors) setClientErrors(data.fieldErrors);
      setState({
        status: "error",
        message: data.message ?? "Something went wrong. Please try again or email us directly.",
        fieldErrors: data.fieldErrors,
        mailto: data.mailto,
      });
    } catch {
      setState({
        status: "error",
        message: "Network error. Please try again or email us directly.",
      });
    }
  }

  const err = (k: keyof Values): string | undefined =>
    clientErrors[k] ?? (state.status === "error" ? state.fieldErrors?.[k] : undefined);
  const isPending = state.status === "sending";

  if (state.status === "success") {
    return (
      <div className="ring-gradient flex flex-col items-start gap-4 rounded-3xl p-8">
        <span className="grid size-12 place-items-center rounded-full bg-primary/10 text-primary">
          <Icon name="CircleCheck" className="size-6" />
        </span>
        <div>
          <h2 className="font-display text-xl font-semibold">Inquiry sent</h2>
          <p className="mt-1.5 text-sm text-muted-foreground">{state.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="glass rounded-3xl p-6 sm:p-8">
      <h2 className="font-display text-xl font-semibold sm:text-2xl">Tell us about your program</h2>
      <p className="mt-1.5 text-sm text-muted-foreground">
        A few details is all we need to come back with a clear next step.
      </p>

      <ul className="mt-4 flex flex-wrap gap-2">
        {trustCues.map((c) => (
          <li
            key={c.text}
            className="inline-flex items-center gap-1.5 rounded-full bg-primary/8 px-3 py-1.5 text-xs font-medium text-primary"
          >
            <Icon name={c.icon} className="size-3.5" />
            {c.text}
          </li>
        ))}
      </ul>

      {(state.status === "error" || state.status === "fallback") && (
        <div
          role="alert"
          className={cn(
            "mt-5 flex items-start gap-2.5 rounded-lg border p-3.5 text-sm",
            state.status === "fallback"
              ? "border-accent/40 bg-accent/10 text-foreground"
              : "border-destructive/30 bg-destructive/5 text-destructive",
          )}
        >
          <Icon
            name={state.status === "fallback" ? "Mail" : "CircleAlert"}
            className="mt-0.5 size-4 shrink-0"
          />
          <div className="space-y-2">
            <p>{state.message}</p>
            {"mailto" in state && state.mailto && (
              <a
                href={state.mailto}
                className={cn(buttonVariants({ size: "sm" }), "bg-accent text-accent-foreground")}
              >
                <Icon name="Mail" className="size-4" />
                Open in your email app
              </a>
            )}
          </div>
        </div>
      )}

      <form onSubmit={onSubmit} className="mt-6 space-y-4" noValidate>
        <div aria-hidden className="hidden">
          <label>
            Website
            <input type="text" name="website" tabIndex={-1} autoComplete="off" />
          </label>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Name" required error={err("name")}>
            <Input name="name" value={values.name} onChange={set("name")} autoComplete="name"
              aria-invalid={!!err("name")} className="h-11 bg-card/60 px-3.5" placeholder="Your full name" />
          </Field>
          <Field label="Company" required error={err("company")}>
            <Input name="company" value={values.company} onChange={set("company")} autoComplete="organization"
              aria-invalid={!!err("company")} className="h-11 bg-card/60 px-3.5" placeholder="Your company" />
          </Field>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Email" required error={err("email")}>
            <Input name="email" type="email" value={values.email} onChange={set("email")} autoComplete="email"
              aria-invalid={!!err("email")} className="h-11 bg-card/60 px-3.5" placeholder="you@company.com" />
          </Field>
          <Field label="Country" error={err("country")}>
            <select name="country" aria-label="Country" value={values.country} onChange={set("country")} className={fieldClass}>
              <option value="">Select country</option>
              {markets.map((m) => <option key={m.code} value={m.name}>{m.name}</option>)}
              <option value="Other">Other</option>
            </select>
          </Field>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Product category" error={err("category")}>
            <select name="category" aria-label="Product category" value={values.category} onChange={set("category")} className={fieldClass}>
              <option value="">Select category</option>
              {categories.map((c) => <option key={c.slug} value={c.title}>{c.title}</option>)}
            </select>
          </Field>
          <Field label="Target quantity / MOQ" error={err("quantity")}>
            <Input name="quantity" value={values.quantity} onChange={set("quantity")}
              className="h-11 bg-card/60 px-3.5" placeholder="e.g. 5,000 pcs / style" />
          </Field>
        </div>

        <Field label="Message" required error={err("message")}>
          <Textarea name="message" value={values.message} onChange={set("message")} rows={5}
            aria-invalid={!!err("message")} className="bg-card/60"
            placeholder="Tell us about your product, fabric, timeline, and target price." />
        </Field>

        <div className="flex flex-col-reverse items-stretch gap-3 pt-1 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-muted-foreground">Goes straight to our merchandising team.</p>
          <Button type="submit" size="xl" disabled={isPending} className="sm:min-w-44">
            {isPending ? (
              <>
                <Icon name="LoaderCircle" className="size-4 animate-spin" />
                Sending…
              </>
            ) : (
              <>
                Send inquiry
                <Icon name="Send" className="size-4" />
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}

function Field({
  label, required, error, children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="group space-y-1.5">
      <Label>
        {label}
        {required && <span className="text-destructive">*</span>}
      </Label>
      {children}
      {error && (
        <p className="flex items-center gap-1 text-xs text-destructive">
          <Icon name="CircleAlert" className="size-3" />
          {error}
        </p>
      )}
    </div>
  );
}
