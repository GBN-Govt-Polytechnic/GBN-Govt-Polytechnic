/**
 * @file not-found.tsx
 * @description Custom 404 page — user-friendly not-found message with links to homepage and contact page
 * @author Gurkirat Singh
 * @org GBN Government Polytechnic, Nilokheri
 * @license All rights reserved — GBN Government Polytechnic, Nilokheri
 */
import Link from "next/link";
import { Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <section className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="text-7xl md:text-8xl font-bold text-emerald-600 mb-2">404</div>
        <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">
          Page Not Found
        </h1>
        <p className="text-sm text-gray-500 mb-8 leading-relaxed">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
          Try navigating from the homepage.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/">
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-sm">
              <Home className="w-3.5 h-3.5 mr-1.5" />
              Back to Home
            </Button>
          </Link>
          <Link href="/contact">
            <Button variant="outline" className="text-sm">
              Contact Us
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
