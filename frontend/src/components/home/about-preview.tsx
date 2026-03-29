/**
 * @file about-preview.tsx
 * @description About preview section — homepage card with campus image, 75+ years badge, key highlights, and link to the full About Us page
 * @author Gurkirat Singh
 * @org GBN Government Polytechnic, Nilokheri
 * @license All rights reserved — GBN Government Polytechnic, Nilokheri
 */
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function AboutPreview() {
  return (
    <section className="py-12 lg:py-16">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          {/* Left: Image + Badge */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="/images/slider1.jpg"
                alt="GBN Polytechnic Campus"
                width={600}
                height={400}
                className="w-full h-80 md:h-104 object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent" />
            </div>
            <div className="absolute -bottom-6 -right-6 bg-emerald-600 text-white rounded-2xl p-6 shadow-xl hidden md:block">
              <p className="text-4xl font-bold">75+</p>
              <p className="text-sm opacity-90">Years of Excellence</p>
            </div>
          </div>

          {/* Right: Content */}
          <div>
            <Badge variant="secondary" className="mb-2 text-xs">About Us</Badge>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Shaping Engineers Since 1959
            </h2>
            <p className="text-sm text-gray-600 mb-4 leading-relaxed">
              GBN Govt. Polytechnic, Nilokheri, established in 1959, is one of the premier technical
              institutions in Haryana. Located on GT Road in Nilokheri, Karnal, the institute is
              committed to providing quality technical education and producing skilled professionals
              for the industry.
            </p>
            <p className="text-sm text-gray-600 mb-6 leading-relaxed">
              Affiliated to the Haryana State Board of Technical Education (HSBTE) and approved by
              AICTE, the institute offers diploma programs in 6 engineering branches with modern
              laboratories, experienced faculty, and excellent placement records.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-6">
              {[
                "AICTE Approved",
                "Affiliated to HSBTE",
                "Modern Laboratories",
                "Industry Partnerships",
                "Smart Classrooms",
                "Green Campus",
              ].map((item) => (
                <div key={item} className="flex items-center gap-2 text-xs text-gray-700">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>

            <Link href="/about">
              <Button className="bg-emerald-600 hover:bg-emerald-700">
                Learn More About Us
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
