/**
 * @file quick-links.tsx
 * @description Quick links section — homepage grid of shortcut icons for admissions, placements, news, documents, scholarships, gallery, contact, and grievance
 * @author Gurkirat Singh
 * @org GBN Government Polytechnic, Nilokheri
 * @license All rights reserved — GBN Government Polytechnic, Nilokheri
 */
import Link from "next/link";
import {
  BookOpen,
  Handshake,
  Newspaper,
  FileText,
  GraduationCap,
  Images,
  Phone,
  MessageSquareWarning,
} from "lucide-react";

const quickActions = [
  {
    label: "Admissions",
    href: "/admissions",
    icon: BookOpen,
    color: "bg-blue-50 text-blue-600 hover:bg-blue-100 border-blue-100",
  },
  {
    label: "Placements",
    href: "/placement",
    icon: Handshake,
    color: "bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border-emerald-100",
  },
  {
    label: "News & Notices",
    href: "/news",
    icon: Newspaper,
    color: "bg-purple-50 text-purple-600 hover:bg-purple-100 border-purple-100",
  },
  {
    label: "Documents",
    href: "/documents",
    icon: FileText,
    color: "bg-rose-50 text-rose-600 hover:bg-rose-100 border-rose-100",
  },
  {
    label: "Scholarships",
    href: "/academics/scholarships",
    icon: GraduationCap,
    color: "bg-indigo-50 text-indigo-600 hover:bg-indigo-100 border-indigo-100",
  },
  {
    label: "Gallery",
    href: "/gallery",
    icon: Images,
    color: "bg-teal-50 text-teal-600 hover:bg-teal-100 border-teal-100",
  },
  {
    label: "Contact Us",
    href: "/contact",
    icon: Phone,
    color: "bg-orange-50 text-orange-600 hover:bg-orange-100 border-orange-100",
  },
  {
    label: "Grievance",
    href: "/feedback",
    icon: MessageSquareWarning,
    color: "bg-amber-50 text-amber-600 hover:bg-amber-100 border-amber-100",
  },
];

export function QuickLinks() {
  return (
    <section className="py-10 lg:py-14 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
            Quick Access
          </h2>
          <p className="text-sm text-gray-500">Everything you need, one click away</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {quickActions.map((action) => (
            <Link key={action.label} href={action.href}>
              <div
                className={`${action.color} border rounded-2xl p-5 text-center transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 cursor-pointer`}
              >
                <action.icon className="h-7 w-7 mx-auto mb-2.5" strokeWidth={1.5} />
                <span className="font-semibold text-sm">{action.label}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
