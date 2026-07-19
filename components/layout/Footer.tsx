import Link from "next/link";
import Image from "next/image";

// lucide-react no longer ships brand icons — feather-style paths inlined.
const SocialIcon = ({ paths }: { paths: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    strokeLinecap="round"
    strokeLinejoin="round"
    className="size-5"
    aria-hidden
    dangerouslySetInnerHTML={{ __html: paths }}
  />
);

const COLUMNS: { title: string; links: { label: string; href: string }[] }[] = [
  {
    title: "Vehicles",
    links: [
      { label: "RAV4 Hybrid", href: "/models/rav4" },
      { label: "Land Cruiser 300", href: "/models/land-cruiser" },
      { label: "Corolla Cross", href: "/models/corolla-cross" },
      { label: "Camry HEV", href: "/models/camry" },
      { label: "Hilux", href: "/models/hilux" },
    ],
  },
  {
    title: "Owners",
    links: [
      { label: "Book a Service", href: "/service#book" },
      { label: "Genuine Parts", href: "/service#parts" },
      { label: "Warranty", href: "#" },
      { label: "Owner's Manuals", href: "#" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Toyota Bangladesh", href: "#" },
      { label: "News", href: "#" },
      { label: "Careers", href: "#" },
      { label: "Contact", href: "#" },
    ],
  },
];

const SOCIALS = [
  {
    label: "Facebook",
    paths:
      '<path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>',
  },
  {
    label: "Instagram",
    paths:
      '<rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>',
  },
  {
    label: "YouTube",
    paths:
      '<path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"/><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/>',
  },
  {
    label: "LinkedIn",
    paths:
      '<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4V8h4v1.5"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/>',
  },
];

export default function Footer() {
  return (
    <footer className="bg-black text-white">
      <div className="mx-auto w-full max-w-7xl px-6 py-16">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-4">
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h3 className="text-xs uppercase tracking-[0.2em] text-mid-grey">
                {col.title}
              </h3>
              <ul className="mt-4 space-y-3">
                {col.links.map((l) => (
                  <li key={l.label}>
                    {l.href === "#" ? (
                      // Placeholder destinations render as text, not fake links.
                      <span className="text-sm text-grey/70">{l.label}</span>
                    ) : (
                      <Link
                        href={l.href}
                        className="text-sm text-grey transition-colors duration-200 hover:text-white"
                      >
                        {l.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div>
            <h3 className="text-xs uppercase tracking-[0.2em] text-mid-grey">
              Connect
            </h3>
            <div className="mt-2 -ml-3 flex gap-1">
              {SOCIALS.map(({ label, paths }) => (
                <Link
                  key={label}
                  href="#"
                  aria-label={label}
                  className="inline-flex size-11 items-center justify-center rounded-full text-grey transition-colors duration-200 hover:text-white"
                >
                  <SocialIcon paths={paths} />
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-6 border-t border-dark-grey pt-8 md:flex-row md:items-center md:justify-between">
          <Image
            src="/brand/ToyotaProductLogo_Secondary_White_RGB.png"
            alt="Toyota"
            width={124}
            height={41}
          />
          <div className="text-xs leading-relaxed text-mid-grey">
            <p>© {new Date().getFullYear()} Toyota Bangladesh. All rights reserved.</p>
            <p className="mt-1">
              Demo — not an official Toyota site. Vehicle imagery is placeholder.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
