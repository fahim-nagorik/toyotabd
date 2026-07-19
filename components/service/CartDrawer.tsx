"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import clsx from "clsx";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Check, Minus, Plus, Trash2, X } from "lucide-react";
import Button from "@/components/ui/Button";
import { useCart } from "@/components/service/CartContext";
import { partBySlug } from "@/lib/parts";
import { taka } from "@/lib/format";

type Stage = "cart" | "checkout" | "done";

const DIVISIONS = [
  "Dhaka",
  "Chattogram",
  "Sylhet",
  "Khulna",
  "Rajshahi",
  "Barishal",
  "Rangpur",
  "Mymensingh",
];

const PAYMENT_METHODS = ["bKash", "Card", "Cash on Delivery"] as const;

interface CheckoutFields {
  name: string;
  phone: string;
  address: string;
  division: string;
  payment: string;
}

export default function CartDrawer() {
  const cart = useCart();
  const reduced = useReducedMotion();
  const [stage, setStage] = useState<Stage>("cart");
  const [orderNo, setOrderNo] = useState("");
  const [fields, setFields] = useState<CheckoutFields>({
    name: "",
    phone: "",
    address: "",
    division: "",
    payment: "bKash",
  });
  const [errors, setErrors] = useState<Partial<CheckoutFields>>({});

  useEffect(() => {
    if (!cart.drawerOpen) return;
    const onKey = (e: KeyboardEvent) =>
      e.key === "Escape" && cart.closeDrawer();
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [cart.drawerOpen, cart]);

  const set = (key: keyof CheckoutFields) => (value: string) => {
    setFields((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const placeOrder = () => {
    const next: Partial<CheckoutFields> = {};
    if (!fields.name.trim()) next.name = "Required";
    if (!/^\+?[\d\s-]{10,}$/.test(fields.phone)) next.phone = "Valid phone required";
    if (!fields.address.trim()) next.address = "Required";
    if (!fields.division) next.division = "Required";
    setErrors(next);
    if (Object.keys(next).length > 0) return;
    setOrderNo(`TBD-${Date.now().toString(36).toUpperCase()}`);
    cart.clear();
    setStage("done");
  };

  const inputClasses = (error?: string) =>
    clsx(
      "w-full rounded-lg border bg-white px-4 py-2.5 text-sm text-black outline-none transition-colors duration-200",
      "placeholder:text-muted focus:border-black",
      error ? "border-toyota-red" : "border-grey",
    );

  return (
    // After a completed order the drawer resets to the cart view once the
    // close animation finishes, so reopening starts fresh.
    <AnimatePresence
      onExitComplete={() => {
        if (stage === "done") setStage("cart");
      }}
    >
      {cart.drawerOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-100 bg-black/40"
          onClick={cart.closeDrawer}
        >
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label="Shopping cart"
            initial={reduced ? { opacity: 0 } : { x: "100%" }}
            animate={reduced ? { opacity: 1 } : { x: 0 }}
            exit={reduced ? { opacity: 0 } : { x: "100%" }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-white shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-light-grey px-6 py-5">
              <h2 className="text-xl font-light text-black">
                {stage === "cart" && "Your Cart"}
                {stage === "checkout" && "Checkout"}
                {stage === "done" && "Order Confirmed"}
              </h2>
              <button
                type="button"
                aria-label="Close cart"
                onClick={cart.closeDrawer}
                className="flex size-9 items-center justify-center rounded-full text-muted transition-colors duration-200 hover:bg-off-white hover:text-black"
              >
                <X className="size-5" />
              </button>
            </div>

            {stage === "cart" && (
              <>
                <div className="flex-1 overflow-y-auto px-6 py-4">
                  {cart.lines.length === 0 ? (
                    <p className="py-16 text-center text-sm text-muted">
                      Your cart is empty.
                    </p>
                  ) : (
                    <ul className="flex flex-col gap-5">
                      {cart.lines.map((line) => {
                        const part = partBySlug(line.slug)!;
                        return (
                          <li key={line.slug} className="flex gap-4">
                            <div className="size-20 shrink-0 overflow-hidden rounded-lg bg-off-white">
                              <Image
                                src={part.image}
                                alt={part.name}
                                width={160}
                                height={160}
                                className="h-full w-full object-cover"
                              />
                            </div>
                            <div className="flex flex-1 flex-col">
                              <p className="text-sm font-medium leading-snug text-black">
                                {part.name}
                              </p>
                              <p className="mt-0.5 text-xs text-muted">
                                {taka(part.price)} each
                              </p>
                              <div className="mt-2 flex items-center justify-between">
                                <div className="flex items-center rounded-full border border-grey">
                                  <button
                                    type="button"
                                    aria-label={`Decrease ${part.name} quantity`}
                                    onClick={() =>
                                      cart.setQty(line.slug, line.qty - 1)
                                    }
                                    className="flex size-8 items-center justify-center text-dark-grey hover:text-black"
                                  >
                                    <Minus className="size-3.5" />
                                  </button>
                                  <span className="w-7 text-center text-sm">
                                    {line.qty}
                                  </span>
                                  <button
                                    type="button"
                                    aria-label={`Increase ${part.name} quantity`}
                                    onClick={() =>
                                      cart.setQty(line.slug, line.qty + 1)
                                    }
                                    className="flex size-8 items-center justify-center text-dark-grey hover:text-black"
                                  >
                                    <Plus className="size-3.5" />
                                  </button>
                                </div>
                                <button
                                  type="button"
                                  aria-label={`Remove ${part.name}`}
                                  onClick={() => cart.remove(line.slug)}
                                  className="text-muted transition-colors duration-200 hover:text-toyota-red"
                                >
                                  <Trash2 className="size-4" />
                                </button>
                              </div>
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>

                {cart.lines.length > 0 && (
                  <div className="border-t border-light-grey px-6 py-5">
                    <dl className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <dt className="text-muted">Subtotal</dt>
                        <dd className="text-black">{taka(cart.subtotal)}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-muted">VAT (15%)</dt>
                        <dd className="text-black">{taka(cart.vat)}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-muted">Delivery</dt>
                        <dd className="text-black">{taka(cart.delivery)}</dd>
                      </div>
                      <div className="flex justify-between border-t border-light-grey pt-2 text-base font-medium">
                        <dt className="text-black">Total</dt>
                        <dd className="text-black">{taka(cart.total)}</dd>
                      </div>
                    </dl>
                    <Button
                      onClick={() => setStage("checkout")}
                      className="mt-5 w-full"
                    >
                      Proceed to Checkout
                    </Button>
                  </div>
                )}
              </>
            )}

            {stage === "checkout" && (
              <div className="flex-1 overflow-y-auto px-6 py-5">
                <form
                  noValidate
                  onSubmit={(e) => {
                    e.preventDefault();
                    placeOrder();
                  }}
                  className="flex flex-col gap-4"
                >
                  {(
                    [
                      ["name", "Full name", "text", "Your name"],
                      ["phone", "Phone", "tel", "+880 1X XXXX XXXX"],
                      ["address", "Delivery address", "text", "House, road, area"],
                    ] as const
                  ).map(([key, label, type, placeholder]) => (
                    <div key={key}>
                      <label
                        htmlFor={`co-${key}`}
                        className="mb-1.5 block text-xs uppercase tracking-[0.15em] text-muted"
                      >
                        {label}
                      </label>
                      <input
                        id={`co-${key}`}
                        type={type}
                        value={fields[key]}
                        onChange={(e) => set(key)(e.target.value)}
                        placeholder={placeholder}
                        className={inputClasses(errors[key])}
                      />
                      {errors[key] && (
                        <p className="mt-1 text-xs text-toyota-red">
                          {errors[key]}
                        </p>
                      )}
                    </div>
                  ))}

                  <div>
                    <label
                      htmlFor="co-division"
                      className="mb-1.5 block text-xs uppercase tracking-[0.15em] text-muted"
                    >
                      Division
                    </label>
                    <select
                      id="co-division"
                      value={fields.division}
                      onChange={(e) => set("division")(e.target.value)}
                      className={inputClasses(errors.division)}
                    >
                      <option value="">Choose a division</option>
                      {DIVISIONS.map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                    {errors.division && (
                      <p className="mt-1 text-xs text-toyota-red">
                        {errors.division}
                      </p>
                    )}
                  </div>

                  <fieldset>
                    <legend className="mb-2 text-xs uppercase tracking-[0.15em] text-muted">
                      Payment method
                    </legend>
                    <div className="flex flex-col gap-2">
                      {PAYMENT_METHODS.map((m) => (
                        <label
                          key={m}
                          className={clsx(
                            "flex cursor-pointer items-center gap-3 rounded-lg border px-4 py-3 text-sm transition-colors duration-200",
                            fields.payment === m
                              ? "border-black bg-off-white"
                              : "border-grey hover:border-black",
                          )}
                        >
                          <input
                            type="radio"
                            name="payment"
                            value={m}
                            checked={fields.payment === m}
                            onChange={() => set("payment")(m)}
                            className="accent-toyota-red"
                          />
                          {m}
                        </label>
                      ))}
                    </div>
                  </fieldset>

                  <div className="mt-2 flex justify-between border-t border-light-grey pt-4 text-base font-medium">
                    <span>Total due</span>
                    <span>{taka(cart.total)}</span>
                  </div>

                  <Button type="submit" className="w-full">
                    Place Order — {taka(cart.total)}
                  </Button>
                  <button
                    type="button"
                    onClick={() => setStage("cart")}
                    className="text-sm text-muted transition-colors duration-200 hover:text-black"
                  >
                    ← Back to cart
                  </button>
                </form>
              </div>
            )}

            {stage === "done" && (
              <div
                className="flex flex-1 flex-col items-center justify-center px-6 text-center"
                role="status"
              >
                <span className="flex size-14 items-center justify-center rounded-full bg-toyota-red text-white">
                  <Check className="size-7" />
                </span>
                <p className="mt-5 text-xl font-light text-black">
                  Order placed.
                </p>
                <p className="mt-2 text-sm text-muted">
                  Your order number is{" "}
                  <span className="font-medium text-black">{orderNo}</span>.
                  We&apos;ll call {fields.phone} to confirm delivery.
                </p>
                <Button onClick={cart.closeDrawer} className="mt-8">
                  Continue Shopping
                </Button>
              </div>
            )}
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
