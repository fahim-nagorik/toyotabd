"use client";

import { useState } from "react";
import clsx from "clsx";
import { Check } from "lucide-react";
import Button from "@/components/ui/Button";
import { VEHICLES } from "@/lib/vehicles";
import { DEALERS } from "@/lib/dealers";

interface TestDriveFormProps {
  /** Pre-selected model, e.g. when opened from an offer. */
  defaultModel?: string;
  /** Compact spacing for use inside the modal. */
  compact?: boolean;
}

interface Fields {
  name: string;
  phone: string;
  email: string;
  model: string;
  dealer: string;
  date: string;
}

const EMPTY: Fields = {
  name: "",
  phone: "",
  email: "",
  model: "",
  dealer: "",
  date: "",
};

// Fake-submit per §0: validates client-side, then swaps to a success state.
export default function TestDriveForm({
  defaultModel,
  compact = false,
}: TestDriveFormProps) {
  const [fields, setFields] = useState<Fields>({
    ...EMPTY,
    model: defaultModel ?? "",
  });
  const [errors, setErrors] = useState<Partial<Fields>>({});
  const [done, setDone] = useState(false);

  const set = (key: keyof Fields) => (value: string) => {
    setFields((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const validate = (): boolean => {
    const next: Partial<Fields> = {};
    if (!fields.name.trim()) next.name = "Please enter your name.";
    if (!/^\+?[\d\s-]{10,}$/.test(fields.phone))
      next.phone = "Please enter a valid phone number.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email))
      next.email = "Please enter a valid email address.";
    if (!fields.model) next.model = "Please choose a model.";
    if (!fields.dealer) next.dealer = "Please choose a dealer.";
    if (!fields.date) next.date = "Please pick a date.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  if (done) {
    return (
      <div className="flex flex-col items-center py-10 text-center" role="status">
        <span className="flex size-14 items-center justify-center rounded-full bg-toyota-red text-white">
          <Check className="size-7" />
        </span>
        <p className="mt-5 text-xl font-light text-black">
          You&apos;re booked in.
        </p>
        <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted">
          Thanks {fields.name.split(" ")[0]} — {fields.dealer} will call{" "}
          {fields.phone} to confirm your {fields.model} test drive.
        </p>
      </div>
    );
  }

  const inputClasses = (error?: string) =>
    clsx(
      "w-full rounded-lg border bg-white px-4 py-3 text-sm text-black outline-none transition-colors duration-200",
      "placeholder:text-muted focus:border-black",
      error ? "border-toyota-red" : "border-grey",
    );

  const field = (
    key: keyof Fields,
    label: string,
    input: React.ReactNode,
  ) => (
    <div>
      <label
        htmlFor={`td-${key}`}
        className="mb-1.5 block text-xs uppercase tracking-[0.15em] text-muted"
      >
        {label}
      </label>
      {input}
      {errors[key] && (
        <p className="mt-1 text-xs text-toyota-red">{errors[key]}</p>
      )}
    </div>
  );

  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        if (validate()) setDone(true);
      }}
      className={clsx("grid gap-5", !compact && "sm:grid-cols-2")}
    >
      {field(
        "name",
        "Name",
        <input
          id="td-name"
          type="text"
          value={fields.name}
          onChange={(e) => set("name")(e.target.value)}
          placeholder="Your full name"
          className={inputClasses(errors.name)}
        />,
      )}
      {field(
        "phone",
        "Phone",
        <input
          id="td-phone"
          type="tel"
          value={fields.phone}
          onChange={(e) => set("phone")(e.target.value)}
          placeholder="+880 1X XXXX XXXX"
          className={inputClasses(errors.phone)}
        />,
      )}
      {field(
        "email",
        "Email",
        <input
          id="td-email"
          type="email"
          value={fields.email}
          onChange={(e) => set("email")(e.target.value)}
          placeholder="you@example.com"
          className={inputClasses(errors.email)}
        />,
      )}
      {field(
        "model",
        "Model",
        <select
          id="td-model"
          value={fields.model}
          onChange={(e) => set("model")(e.target.value)}
          className={inputClasses(errors.model)}
        >
          <option value="">Choose a model</option>
          {VEHICLES.map((v) => (
            <option key={v.slug} value={v.name}>
              {v.name}
            </option>
          ))}
        </select>,
      )}
      {field(
        "dealer",
        "Preferred dealer",
        <select
          id="td-dealer"
          value={fields.dealer}
          onChange={(e) => set("dealer")(e.target.value)}
          className={inputClasses(errors.dealer)}
        >
          <option value="">Choose a dealer</option>
          {DEALERS.map((d) => (
            <option key={d.id} value={d.name}>
              {d.name} — {d.city}
            </option>
          ))}
        </select>,
      )}
      {field(
        "date",
        "Preferred date",
        <input
          id="td-date"
          type="date"
          value={fields.date}
          onChange={(e) => set("date")(e.target.value)}
          className={inputClasses(errors.date)}
        />,
      )}
      <div className={clsx(!compact && "sm:col-span-2", "mt-1")}>
        <Button type="submit" className="w-full sm:w-auto">
          Request Test Drive
        </Button>
      </div>
    </form>
  );
}
