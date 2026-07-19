import type { Metadata } from "next";
import { CartProvider } from "@/components/service/CartContext";
import PartsShop from "@/components/service/PartsShop";
import CartDrawer from "@/components/service/CartDrawer";
import BookService from "@/components/service/BookService";

export const metadata: Metadata = {
  title: "Service & Parts — Toyota Bangladesh",
  description:
    "Book a service and shop genuine Toyota parts. Demo site — no real orders.",
};

export default function ServicePage() {
  return (
    <main className="pt-16">
      <section className="bg-off-white">
        <div className="mx-auto w-full max-w-7xl px-6 py-20">
          <p className="text-xs uppercase tracking-[0.2em] text-toyota-red-text">
            Owners
          </p>
          <h1 className="mt-3 text-4xl font-light tracking-tight text-black md:text-6xl">
            Service &amp; Genuine Parts.
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-muted">
            Keep your Toyota a Toyota — genuine parts shipped nationwide, and
            workshop slots you can book in under a minute.
          </p>
        </div>
      </section>

      <CartProvider>
        <PartsShop />
        <CartDrawer />
      </CartProvider>

      <BookService />
    </main>
  );
}
