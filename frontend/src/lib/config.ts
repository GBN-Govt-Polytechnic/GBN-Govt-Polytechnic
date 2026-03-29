/**
 * @file config.ts
 * @description Site configuration — institution metadata, navigation links, department definitions, hero slides, stats, and footer links
 * @author Gurkirat Singh
 * @org GBN Government Polytechnic, Nilokheri
 * @license All rights reserved — GBN Government Polytechnic, Nilokheri
 */
import { GraduationCap, Users, IndianRupee, Handshake, Award, BookOpen, Building, Cpu, CircuitBoard, PlugZap, Landmark, Factory, SlidersHorizontal, Atom, Anvil, type LucideIcon } from "lucide-react";

export const siteConfig = {
  name: "GBN Govt. Polytechnic, Nilokheri",
  shortName: "GPN Nilokheri",
  description:
    "Government Polytechnic Nilokheri - Empowering New India with world-class technical education since 1959. Affiliated to HSBTE, approved by AICTE.",
  tagline: "Empowering New India with World-Class Technical Education",
  address: "GT Road, Nilokheri, Karnal, Haryana - 132117",
  phone: "+91-1745-246002",
  email: "gpaboratory@gmail.com",
  website: "https://gpnilokheri.ac.in",
  established: 1959,
} as const;

export type NavItem = { label: string; href: string };
export type NavGroup = { heading: string; items: NavItem[] };
export type NavLink = {
  label: string;
  href: string;
  children?: NavItem[];
  groups?: NavGroup[];
};

export const navLinks: NavLink[] = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "About Us",
    href: "/about",
    groups: [
      {
        heading: "Institute",
        items: [
          { label: "History & Vision", href: "/about" },
          { label: "Principal's Desk", href: "/about/principal" },
          { label: "Infrastructure", href: "/about/infrastructure" },
          { label: "Green Campus", href: "/about/green-campus" },
          { label: "Location", href: "/about/location" },
        ],
      },
      {
        heading: "Recognition",
        items: [
          { label: "Mandatory Disclosure", href: "/about/mandatory-disclosure" },
          { label: "AICTE / MHRD", href: "/mhrd" },
          { label: "IQAC", href: "/about/iqac" },
          { label: "NEP 2020", href: "/about/nep" },
          { label: "Documents & Approvals", href: "/documents" },
        ],
      },
      {
        heading: "More",
        items: [
          { label: "Achievements", href: "/about/achievements" },
          { label: "MoU with Industries", href: "/about/mou" },
        ],
      },
    ],
  },
  {
    label: "Academics",
    href: "/academics",
    groups: [
      {
        heading: "Programmes",
        items: [
          { label: "Courses Offered", href: "/academics/courses" },
          { label: "Admissions", href: "/admissions" },
          { label: "Scholarships", href: "/academics/scholarships" },
        ],
      },
      {
        heading: "Resources",
        items: [
          { label: "Results", href: "/academics/results" },
          { label: "Online Resources", href: "/academics/resources" },
          { label: "Faculty E-Services", href: "/services/faculty" },
        ],
      },
    ],
  },
  {
    label: "Departments",
    href: "/departments",
    children: [
      { label: "Computer Engineering", href: "/departments/cse" },
      { label: "Electronics & Comm.", href: "/departments/ece" },
      { label: "Electrical Engineering", href: "/departments/ee" },
      { label: "Civil Engineering", href: "/departments/ce" },
      { label: "Mechanical Engineering", href: "/departments/me" },
      { label: "Instrumentation & Control", href: "/departments/ice" },
      { label: "Applied Science", href: "/departments/as" },
      { label: "Workshop", href: "/departments/ws" },
    ],
  },
  {
    label: "Placement",
    href: "/placement",
    children: [
      { label: "Overview", href: "/placement" },
      { label: "Apprenticeship", href: "/placement/apprenticeship" },
    ],
  },
  {
    label: "Campus Life",
    href: "/gallery",
    groups: [
      {
        heading: "Activities",
        items: [
          { label: "Gallery", href: "/gallery" },
          { label: "NCC", href: "/campus/ncc" },
          { label: "Innovation Club", href: "/campus/innovation" },
        ],
      },
      {
        heading: "Committees",
        items: [
          { label: "Anti-Ragging", href: "/committees/anti-ragging" },
          { label: "Grievance Cell", href: "/committees/grievance" },
          { label: "Submit Grievance", href: "/feedback" },
          { label: "SC/ST Committee", href: "/committees/sc-st" },
          { label: "Discipline", href: "/committees/discipline" },
          { label: "ICC", href: "/committees/icc" },
          { label: "Code of Conduct", href: "/rules/code-of-conduct" },
        ],
      },
    ],
  },
  {
    label: "News",
    href: "/news",
  },
  {
    label: "Contact",
    href: "/contact",
  },
];

export const stats = [
  { icon: Users, value: "1700+", label: "Students" },
  { icon: GraduationCap, value: "100+", label: "Faculty & Staff" },
  { icon: IndianRupee, value: "₹40L+", label: "Scholarships" },
  { icon: Handshake, value: "150+", label: "Placements" },
] as const;

export const departments: {
  code: string;
  name: string;
  shortName: string;
  icon: LucideIcon;
  color: string;
  description: string;
  seats: number | null;
}[] = [
  {
    code: "cse",
    name: "Computer Engineering",
    shortName: "CSE",
    icon: Cpu,
    color: "from-gray-700 to-gray-900",
    description: "Learn cutting-edge technologies in software development, AI, and data science.",
    seats: 120,
  },
  {
    code: "ece",
    name: "Electronics & Communication Engineering",
    shortName: "ECE",
    icon: CircuitBoard,
    color: "from-gray-600 to-gray-800",
    description: "Master electronics, communication systems, and embedded technologies.",
    seats: 120,
  },
  {
    code: "ee",
    name: "Electrical Engineering",
    shortName: "EE",
    icon: PlugZap,
    color: "from-emerald-700 to-emerald-900",
    description: "Power systems, electrical machines, and renewable energy technologies.",
    seats: 60,
  },
  {
    code: "ce",
    name: "Civil Engineering",
    shortName: "CE",
    icon: Landmark,
    color: "from-emerald-600 to-emerald-800",
    description: "Design and build the infrastructure that shapes our world.",
    seats: 120,
  },
  {
    code: "me",
    name: "Mechanical Engineering",
    shortName: "ME",
    icon: Factory,
    color: "from-gray-700 to-gray-900",
    description: "Design, manufacture, and maintain mechanical systems and machinery.",
    seats: 120,
  },
  {
    code: "ice",
    name: "Instrumentation & Control Engineering",
    shortName: "ICE",
    icon: SlidersHorizontal,
    color: "from-emerald-700 to-teal-900",
    description: "Process control, automation, and industrial instrumentation.",
    seats: 60,
  },
  {
    code: "as",
    name: "Applied Science",
    shortName: "AS",
    icon: Atom,
    color: "from-gray-600 to-gray-800",
    description: "Foundation in mathematics, physics, chemistry, and communication skills.",
    seats: null,
  },
  {
    code: "ws",
    name: "Workshop",
    shortName: "WS",
    icon: Anvil,
    color: "from-stone-600 to-stone-800",
    description: "Practical training in fitting, welding, carpentry, and basic manufacturing processes.",
    seats: null,
  },
];

export const heroSlides = [
  {
    image: "/images/slider1.jpg",
    title: "Empowering New India",
    subtitle: "with world-class technical education since 1959",
  },
  {
    image: "/images/slider2.jpg",
    title: "Master the Skills",
    subtitle: "to drive your career forward",
  },
  {
    image: "/images/slider3.jpg",
    title: "Committed to Deliver",
    subtitle: "highly-trained professionals to the industry",
  },
] as const;

export const quickLinks = [
  { label: "Admissions", href: "/academics", icon: BookOpen },
  { label: "Results", href: "/academics/results", icon: Award },
  { label: "Placements", href: "/placement", icon: Handshake },
  { label: "Infrastructure", href: "/about/infrastructure", icon: Building },
] as const;

export const footerLinks = {
  institute: [
    { label: "About Us", href: "/about" },
    { label: "Principal's Desk", href: "/about/principal" },
    { label: "Infrastructure", href: "/about/infrastructure" },
    { label: "Achievements", href: "/about/achievements" },
    { label: "IQAC", href: "/about/iqac" },
    { label: "Documents & Approvals", href: "/documents" },
    { label: "Location", href: "/about/location" },
  ],
  academics: [
    { label: "Courses Offered", href: "/academics/courses" },
    { label: "Scholarships", href: "/academics/scholarships" },
    { label: "Results", href: "/academics/results" },
    { label: "Online Resources", href: "/academics/resources" },
    { label: "Admissions", href: "/admissions" },
  ],
  students: [
    { label: "Placements", href: "/placement" },
    { label: "Anti-Ragging", href: "/committees/anti-ragging" },
    { label: "Grievance Cell", href: "/committees/grievance" },
    { label: "Submit Grievance", href: "/feedback" },
    { label: "Helpline", href: "/contact/helpline" },
    { label: "Code of Conduct", href: "/rules/code-of-conduct" },
  ],
  quickAccess: [
    { label: "Gallery", href: "/gallery" },
    { label: "News & Notices", href: "/news" },
    { label: "Contact Us", href: "/contact" },
    { label: "Sitemap", href: "/site-map" },
  ],
} as const;
