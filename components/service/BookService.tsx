"use client";

import { useMemo, useState } from "react";
import clsx from "clsx";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { CalendarPlus, Check } from "lucide-react";
import Section from "@/components/ui/Section";
import Reveal from "@/components/ui/Reveal";
import Button from "@/components/ui/Button";
import { VEHICLES } from "@/lib/vehicles";
import { DEALERS } from "@/lib/dealers";
import { SERVICE_TYPES, TIME_SLOTS } from "@/lib/serviceTypes";

const STEPS = ["Vehicle", "Service", "Schedule", "Confirm"] as const;

interface Booking {
  model: string;
  year: string;
  registration: string;
  mileage: string;
  serviceType: string;
  dealer: string;
  date: string; // ISO yyyy-mm-dd
  slot: string;
  name: string;
  phone: string;
}

const EMPTY: Booking = {
  model: "",
  year: "",
  registration: "",
  mileage: "",
  serviceType: "",
  dealer: "",
  date: "",
  slot: "",
  name: "",
  phone: "",
};

// A few slots are deterministically "booked" for realism (§5.2 step 3).
const isBooked = (dayIndex: number, slotIndex: number) =>
  (dayIndex * 7 + slotIndex * 3) % 5 === 0;

const buildIcs = (b: Booking, reference: string) => {
  const type = SERVICE_TYPES.find((t) => t.id === b.serviceType);
  const dealer = DEALERS.find((d) => d.name === b.dealer);
  const start = new Date(`${b.date}T${b.slot}:00`);
  const end = new Date(
    start.getTime() + (type?.durationHours ?? 2) * 3600 * 1000,
  );
  const stamp = (d: Date) =>
    d
      .toISOString()
      .replace(/[-:]/g, "")
      .replace(/\.\d{3}Z$/, "Z");
  const local = (d: Date) =>
    `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(
      d.getDate(),
    ).padStart(2, "0")}T${String(d.getHours()).padStart(2, "0")}${String(
      d.getMinutes(),
    ).padStart(2, "0")}00`;
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Toyota Bangladesh Demo//Service Booking//EN",
    "BEGIN:VEVENT",
    `UID:${reference}@toyota-bd-demo`,
    `DTSTAMP:${stamp(new Date())}`,
    `DTSTART:${local(start)}`,
    `DTEND:${local(end)}`,
    `SUMMARY:Toyota Service — ${type?.name ?? "Service"}`,
    `LOCATION:${b.dealer}${dealer ? `, ${dealer.address}` : ""}`,
    `DESCRIPTION:Booking reference ${reference}. ${b.model} (${b.registration}).`,
    "END:VEVENT",
    "END:VCALENDAR",
  ];
  return `data:text/calendar;charset=utf-8,${encodeURIComponent(
    lines.join("\r\n"),
  )}`;
};

export default function BookService() {
  const reduced = useReducedMotion();
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [booking, setBooking] = useState<Booking>(EMPTY);
  const [error, setError] = useState("");
  const [reference, setReference] = useState("");

  // Next 14 days — only rendered on step 3, which is reached client-side.
  const days = useMemo(() => {
    const out: { iso: string; label: string; dow: string }[] = [];
    const now = new Date();
    for (let i = 1; i <= 14; i++) {
      const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() + i);
      out.push({
        iso: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`,
        label: `${d.getDate()} ${d.toLocaleString("en", { month: "short" })}`,
        dow: d.toLocaleString("en", { weekday: "short" }),
      });
    }
    return out;
  }, []);

  const set = (key: keyof Booking) => (value: string) => {
    setBooking((b) => ({ ...b, [key]: value }));
    setError("");
  };

  const stepValid = (): string => {
    const b = booking;
    switch (step) {
      case 0:
        if (!b.model) return "Please choose your model.";
        if (!/^(19|20)\d{2}$/.test(b.year)) return "Please enter a valid year.";
        if (!b.registration.trim()) return "Please enter your registration number.";
        if (!/^\d{1,7}$/.test(b.mileage)) return "Please enter mileage in km.";
        return "";
      case 1:
        return b.serviceType ? "" : "Please choose a service type.";
      case 2:
        if (!b.dealer) return "Please choose a dealer.";
        if (!b.date) return "Please pick a date.";
        if (!b.slot) return "Please pick a time slot.";
        return "";
      case 3:
        if (!b.name.trim()) return "Please enter your name.";
        if (!/^\+?[\d\s-]{10,}$/.test(b.phone)) return "Please enter a valid phone number.";
        return "";
      default:
        return "";
    }
  };

  const go = (delta: number) => {
    if (delta > 0) {
      const err = stepValid();
      if (err) {
        setError(err);
        return;
      }
    }
    setError("");
    setDirection(delta);
    setStep((s) => Math.min(3, Math.max(0, s + delta)));
  };

  const submit = () => {
    const err = stepValid();
    if (err) {
      setError(err);
      return;
    }
    setReference(`TSB-${Date.now().toString(36).toUpperCase()}`);
  };

  const inputClasses =
    "w-full rounded-lg border border-grey bg-white px-4 py-3 text-sm text-black outline-none transition-colors duration-200 placeholder:text-muted focus:border-black";

  const label = (text: string, htmlFor: string) => (
    <label
      htmlFor={htmlFor}
      className="mb-1.5 block text-xs uppercase tracking-[0.15em] text-muted"
    >
      {text}
    </label>
  );

  const selectedType = SERVICE_TYPES.find((t) => t.id === booking.serviceType);
  const selectedDay = days.find((d) => d.iso === booking.date);

  if (reference) {
    return (
      <Section id="book" bleed className="scroll-mt-16 bg-off-white">
        <div className="mx-auto flex w-full max-w-2xl flex-col items-center px-6 py-24 text-center" role="status">
          <span className="flex size-14 items-center justify-center rounded-full bg-toyota-red text-white">
            <Check className="size-7" />
          </span>
          <h2 className="mt-6 text-3xl font-light text-black">
            Booking confirmed.
          </h2>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-muted">
            Your reference is{" "}
            <span className="font-medium text-black">{reference}</span>.{" "}
            {booking.dealer} expects your {booking.model} on{" "}
            {selectedDay?.label} at {booking.slot}. We&apos;ll call{" "}
            {booking.phone} to confirm.
          </p>
          <a
            href={buildIcs(booking, reference)}
            download={`toyota-service-${reference}.ics`}
            className="mt-8 inline-flex items-center gap-2 rounded-full border border-grey px-7 py-3 text-sm font-medium text-black transition-colors duration-200 hover:border-black active:scale-[0.98]"
          >
            <CalendarPlus className="size-4" />
            Add to calendar
          </a>
        </div>
      </Section>
    );
  }

  return (
    <Section id="book" bleed className="scroll-mt-16 bg-off-white">
      <div className="mx-auto w-full max-w-3xl px-6 py-24">
        <Reveal>
          <h2 className="text-3xl font-light tracking-tight text-black md:text-5xl">
            Book a Service.
          </h2>
        </Reveal>

        {/* Progress bar */}
        <Reveal delay={0.08}>
          <ol className="mt-10 flex gap-2" aria-label="Booking progress">
            {STEPS.map((s, i) => (
              <li key={s} className="flex-1">
                <div
                  className={clsx(
                    "h-1 rounded-full transition-colors duration-300",
                    i <= step ? "bg-toyota-red" : "bg-grey/60",
                  )}
                />
                <span
                  className={clsx(
                    "mt-2 block text-xs",
                    i === step ? "text-black" : "text-muted",
                  )}
                  aria-current={i === step ? "step" : undefined}
                >
                  {i + 1}. {s}
                </span>
              </li>
            ))}
          </ol>
        </Reveal>

        <div className="relative mt-10 overflow-hidden">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={step}
              custom={direction}
              initial={reduced ? { opacity: 0 } : { opacity: 0, x: direction * 48 }}
              animate={{ opacity: 1, x: 0 }}
              exit={reduced ? { opacity: 0 } : { opacity: 0, x: direction * -48 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            >
              {step === 0 && (
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    {label("Model", "bk-model")}
                    <select
                      id="bk-model"
                      value={booking.model}
                      onChange={(e) => set("model")(e.target.value)}
                      className={inputClasses}
                    >
                      <option value="">Choose a model</option>
                      {VEHICLES.map((v) => (
                        <option key={v.slug} value={v.name}>
                          {v.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    {label("Year", "bk-year")}
                    <input
                      id="bk-year"
                      type="text"
                      inputMode="numeric"
                      placeholder="2022"
                      value={booking.year}
                      onChange={(e) => set("year")(e.target.value)}
                      className={inputClasses}
                    />
                  </div>
                  <div>
                    {label("Registration number", "bk-reg")}
                    <input
                      id="bk-reg"
                      type="text"
                      placeholder="DHK-GA-11-2233"
                      value={booking.registration}
                      onChange={(e) => set("registration")(e.target.value)}
                      className={inputClasses}
                    />
                  </div>
                  <div>
                    {label("Mileage (km)", "bk-mileage")}
                    <input
                      id="bk-mileage"
                      type="text"
                      inputMode="numeric"
                      placeholder="45000"
                      value={booking.mileage}
                      onChange={(e) => set("mileage")(e.target.value)}
                      className={inputClasses}
                    />
                  </div>
                </div>
              )}

              {step === 1 && (
                <div className="grid gap-4 sm:grid-cols-2">
                  {SERVICE_TYPES.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => set("serviceType")(t.id)}
                      aria-pressed={booking.serviceType === t.id}
                      className={clsx(
                        "rounded-2xl border p-5 text-left transition-colors duration-200",
                        booking.serviceType === t.id
                          ? "border-black bg-white"
                          : "border-grey bg-white/60 hover:border-black",
                      )}
                    >
                      <p className="text-base font-medium text-black">{t.name}</p>
                      <p className="mt-1.5 text-sm leading-relaxed text-muted">
                        {t.description}
                      </p>
                      <p className="mt-3 text-xs uppercase tracking-[0.12em] text-dark-grey">
                        {t.duration} · {t.price}
                      </p>
                    </button>
                  ))}
                </div>
              )}

              {step === 2 && (
                <div className="flex flex-col gap-6">
                  <div>
                    {label("Dealer", "bk-dealer")}
                    <select
                      id="bk-dealer"
                      value={booking.dealer}
                      onChange={(e) => set("dealer")(e.target.value)}
                      className={inputClasses}
                    >
                      <option value="">Choose a dealer</option>
                      {DEALERS.map((d) => (
                        <option key={d.id} value={d.name}>
                          {d.name} — {d.city}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <p className="mb-1.5 text-xs uppercase tracking-[0.15em] text-muted">
                      Date
                    </p>
                    <div className="grid grid-cols-4 gap-2 sm:grid-cols-7">
                      {days.map((d) => (
                        <button
                          key={d.iso}
                          type="button"
                          onClick={() => set("date")(d.iso)}
                          aria-pressed={booking.date === d.iso}
                          className={clsx(
                            "rounded-lg border px-2 py-2.5 text-center transition-colors duration-200",
                            booking.date === d.iso
                              ? "border-black bg-black text-white"
                              : "border-grey bg-white text-dark-grey hover:border-black",
                          )}
                        >
                          <span className="block text-[10px] uppercase opacity-70">
                            {d.dow}
                          </span>
                          <span className="mt-0.5 block text-sm">{d.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {booking.date && (
                    <div>
                      <p className="mb-1.5 text-xs uppercase tracking-[0.15em] text-muted">
                        Time
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {TIME_SLOTS.map((slot, si) => {
                          const dayIndex = days.findIndex(
                            (d) => d.iso === booking.date,
                          );
                          const booked = isBooked(dayIndex, si);
                          return (
                            <button
                              key={slot}
                              type="button"
                              disabled={booked}
                              onClick={() => set("slot")(slot)}
                              aria-pressed={booking.slot === slot}
                              className={clsx(
                                "rounded-full border px-5 py-2 text-sm transition-colors duration-200",
                                booked &&
                                  "cursor-not-allowed border-light-grey bg-light-grey text-muted line-through",
                                !booked &&
                                  (booking.slot === slot
                                    ? "border-black bg-black text-white"
                                    : "border-grey bg-white text-dark-grey hover:border-black"),
                              )}
                            >
                              {slot}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {step === 3 && (
                <div className="flex flex-col gap-6">
                  <dl className="rounded-2xl border border-grey bg-white p-6 text-sm">
                    {(
                      [
                        ["Vehicle", `${booking.model} (${booking.year}) — ${booking.registration}`],
                        ["Mileage", `${Number(booking.mileage).toLocaleString("en-IN")} km`],
                        ["Service", `${selectedType?.name} · ${selectedType?.price}`],
                        ["Where & when", `${booking.dealer}, ${selectedDay?.dow} ${selectedDay?.label} at ${booking.slot}`],
                      ] as const
                    ).map(([k, v]) => (
                      <div
                        key={k}
                        className="flex justify-between gap-6 border-b border-light-grey py-2.5 last:border-0"
                      >
                        <dt className="shrink-0 text-muted">{k}</dt>
                        <dd className="text-right font-medium text-black">{v}</dd>
                      </div>
                    ))}
                  </dl>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      {label("Name", "bk-name")}
                      <input
                        id="bk-name"
                        type="text"
                        placeholder="Your full name"
                        value={booking.name}
                        onChange={(e) => set("name")(e.target.value)}
                        className={inputClasses}
                      />
                    </div>
                    <div>
                      {label("Phone", "bk-phone")}
                      <input
                        id="bk-phone"
                        type="tel"
                        placeholder="+880 1X XXXX XXXX"
                        value={booking.phone}
                        onChange={(e) => set("phone")(e.target.value)}
                        className={inputClasses}
                      />
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {error && (
          <p className="mt-4 text-sm text-toyota-red" role="alert">
            {error}
          </p>
        )}

        <div className="mt-8 flex items-center justify-between">
          <button
            type="button"
            onClick={() => go(-1)}
            className={clsx(
              "text-sm text-muted transition-colors duration-200 hover:text-black",
              step === 0 && "invisible",
            )}
          >
            ← Back
          </button>
          {step < 3 ? (
            <Button onClick={() => go(1)}>Continue</Button>
          ) : (
            <Button onClick={submit}>Confirm Booking</Button>
          )}
        </div>
      </div>
    </Section>
  );
}
