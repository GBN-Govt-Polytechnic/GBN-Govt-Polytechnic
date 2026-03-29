/**
 * @file footer.tsx
 * @description Site footer — CTA banner, institute info with logo, quick links columns, contact details, and copyright bar
 * @author Gurkirat Singh
 * @org GBN Government Polytechnic, Nilokheri
 * @license All rights reserved — GBN Government Polytechnic, Nilokheri
 */
import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, MapPin, ExternalLink, ArrowRight, GraduationCap } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { siteConfig, footerLinks } from "@/lib/config";

export function Footer() {
  return (
    <footer>
      {/* CTA Section */}
      <div className="bg-linear-to-br from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden">
        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "40px 40px" }} />

        <div className="container mx-auto px-4 py-14 md:py-16 relative">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-left">
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
                Ready to Shape Your Future?
              </h3>
              <p className="text-gray-400 max-w-lg">
                Join 600+ students building careers in engineering at one of Haryana&apos;s oldest polytechnics.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/admissions"
                className="inline-flex items-center gap-2 bg-emerald-600 text-white font-semibold px-6 py-3 rounded-xl hover:bg-emerald-500 transition-colors"
              >
                <GraduationCap className="w-5 h-5" />
                Apply Now
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white font-medium px-6 py-3 rounded-xl border border-white/10 hover:bg-white/15 transition-colors"
              >
                Contact Us
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="bg-gray-950 text-gray-300">
        <div className="container mx-auto px-4 py-14 lg:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-10">
            {/* Brand — wider column */}
            <div className="lg:col-span-4 text-center md:text-left">
              <Link href="/" className="inline-flex items-center gap-3 mb-5">
                <Image
                  src="/images/Logo.jpeg"
                  alt="GPN Logo"
                  width={52}
                  height={52}
                  className="rounded-full ring-2 ring-white/10"
                />
                <div className="text-left">
                  <h3 className="font-bold text-white text-lg">GBN Govt. Polytechnic</h3>
                  <p className="text-xs text-gray-500">Nilokheri, Karnal (Haryana)</p>
                </div>
              </Link>
              <p className="text-sm text-gray-500 mb-6 leading-relaxed max-w-sm mx-auto md:mx-0">
                Empowering New India with world-class technical education since {siteConfig.established}.
                Approved by AICTE, New Delhi and affiliated to HSBTE, Panchkula.
              </p>
              <div className="inline-flex flex-col gap-3 text-sm text-left">
                <a href={`mailto:${siteConfig.email}`} className="flex items-center gap-3 hover:text-emerald-400 transition-colors group">
                  <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-emerald-500/10 transition-colors shrink-0">
                    <Mail className="h-4 w-4" />
                  </div>
                  <span>{siteConfig.email}</span>
                </a>
                <a href={`tel:${siteConfig.phone}`} className="flex items-center gap-3 hover:text-emerald-400 transition-colors group">
                  <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-emerald-500/10 transition-colors shrink-0">
                    <Phone className="h-4 w-4" />
                  </div>
                  <span>{siteConfig.phone}</span>
                </a>
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <span className="pt-2">{siteConfig.address}</span>
                </div>
              </div>
            </div>

            {/* Links — centered on mobile, 2-col grid */}
            <div className="lg:col-span-8">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
                <FooterLinkSection title="Institute" links={footerLinks.institute} />
                <FooterLinkSection title="Academics" links={footerLinks.academics} />
                <FooterLinkSection title="Students" links={footerLinks.students} />
                <FooterLinkSection title="Quick Access" links={footerLinks.quickAccess} />
              </div>
            </div>
          </div>
        </div>

        <Separator className="bg-white/5" />

        {/* Bottom Bar */}
        <div className="container mx-auto px-4 py-5">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-600">
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <p>
                &copy; {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
              </p>
              <span className="hidden sm:inline text-gray-800">·</span>
              <Link
                href="/developer"
                className="text-gray-500 hover:text-emerald-400 transition-colors"
              >
                ✦ Developed by Gurkirat Singh
              </Link>
            </div>
            <div className="flex items-center gap-1 flex-wrap justify-center">
              {[
                { label: "HSBTE", href: "https://hsbte.org.in" },
                { label: "Tech Edu Dept", href: "https://techeduhry.gov.in" },
                { label: "AICTE", href: "https://aicte-india.org" },
                { label: "DTE Haryana", href: "https://dtehryseva.org.in" },
              ].map((link, i) => (
                <span key={link.label} className="flex items-center">
                  {i > 0 && <span className="mx-2 text-gray-800">·</span>}
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-emerald-400 transition-colors flex items-center gap-1"
                  >
                    {link.label}
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterLinkSection({
  title,
  links,
}: {
  title: string;
  links: readonly { label: string; href: string }[];
}) {
  return (
    <div className="text-center sm:text-left">
      <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">
        {title}
      </h4>
      <ul className="space-y-2.5">
        {links.map((link) => (
          <li key={link.label}>
            <Link
              href={link.href}
              className="text-sm text-gray-400 hover:text-emerald-400 hover:translate-x-0.5 inline-block transition-all"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
