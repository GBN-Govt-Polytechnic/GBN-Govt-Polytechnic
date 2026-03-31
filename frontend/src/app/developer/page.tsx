/**
 * @file page.tsx
 * @description Developer profile page — about the developer of this site, available for hire
 * @author Gurkirat Singh
 * @org GBN Government Polytechnic, Nilokheri
 * @license All rights reserved — GBN Government Polytechnic, Nilokheri
 */
import { Metadata } from "next";
import Link from "next/link";
import {
  Code2,
  Github,
  Linkedin,
  Mail,
  Twitter,
  Globe,
  Sparkles,
  Coffee,
  ArrowLeft,
  User

} from "lucide-react";

export const metadata: Metadata = {
  title: "Meet the Developer",
  description:
    "This site was designed and developed by Gurkirat Singh, a full-stack developer looking for his next opportunity.",
};

const socials = [
  {
    icon: Github,
    label: "GitHub",
    href: "https://github.com/Gurkirat-Singh-bit",
    handle: "@Gurkirat-Singh-bit",
  },
  {
    icon: Linkedin,
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/gurkirat-singh-bit/",
    handle: "gurkirat-singh-bit",
  },
  {
    icon: User,
    label: "Portfolio",
    href: "https://gurkirat-singh.me",
    handle: "@gurkiratsingh.me",
  },
  {
    icon: Mail,
    label: "Email",
    href: "mailto:contact.here.gurkirat.singh@gmail.com",
    handle: "contact.here.gurkirat.singh@gmail.com",
  },
];

export default function DeveloperPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 pt-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to site
        </Link>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-sm">
          {/* Top banner */}
          <div className="bg-linear-to-r from-gray-900 via-gray-800 to-emerald-900 px-8 py-10 relative overflow-hidden">
            <div
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
                backgroundSize: "24px 24px",
              }}
            />
            <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <div className="w-20 h-20 rounded-2xl bg-emerald-600/30 border-2 border-emerald-500/40 flex items-center justify-center shrink-0">
                <Code2 className="w-9 h-9 text-emerald-400" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 mb-1 block">
                  This site was built by a college student 
                </span>
                <h1 className="text-3xl font-extrabold text-white tracking-tight mb-1">
                  Gurkirat Singh
                </h1>
                <p className="text-gray-400 text-sm">
                  Generic Builder from Devlopement to Deployment. 
                </p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="px-8 py-8 grid md:grid-cols-2 gap-8">
            <div>
              <h2 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                About Me
              </h2>
              <p className="text-sm text-gray-600 leading-relaxed mb-4">
                I built this entire website from scratch: frontend, backend, admin panel,
                database, deployment. The previous site was a 95-page ASP.NET relic from 2008.
                This is a complete modern rebuild. Fast, clean, maintainable.
              </p>
              <p className="text-sm text-gray-600 leading-relaxed mb-4">
                Self-taught full-stack developer who loves clean architecture,
                solid TypeScript, and shipping things that actually work.
                Currently looking for my next opportunity.
              </p>
              <div className="flex items-center gap-2 text-sm font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3">
                <Coffee className="w-4 h-4 shrink-0" />
                <span>Want to hire me or support my work? Get in touch!</span>
              </div>
            </div>

            <div>
              <h2 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                <Globe className="w-4 h-4 text-emerald-600" />
                Find Me Online
              </h2>
              <div className="space-y-2">
                {socials.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-sm text-gray-600 hover:text-gray-900 transition-colors group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-gray-100 group-hover:bg-emerald-50 group-hover:text-emerald-600 flex items-center justify-center transition-colors">
                      <s.icon className="w-4 h-4" />
                    </div>
                    <span className="font-medium">{s.label}</span>
                    <span className="text-gray-400 text-xs ml-auto">{s.handle}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* CTA bar */}
          <div className="border-t border-gray-100 px-8 py-5 bg-gray-50 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-gray-500">
              Built with Next.js, Express, PostgreSQL &amp; a lot of late nights.
            </p>
            <a
              href="mailto:contact.here.gurkirat.singh@gmail.com"
              className="inline-flex items-center gap-2 bg-emerald-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-emerald-500 transition-colors"
            >
              <Mail className="w-4 h-4" />
              Get in Touch
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
