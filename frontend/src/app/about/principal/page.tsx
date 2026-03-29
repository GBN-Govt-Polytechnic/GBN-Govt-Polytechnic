/**
 * @file page.tsx
 * @description Principal's Desk page — principal's photo, welcome message, and contact details
 * @author Gurkirat Singh
 * @org GBN Government Polytechnic, Nilokheri
 * @license All rights reserved — GBN Government Polytechnic, Nilokheri
 */
import { Metadata } from "next";
import Image from "next/image";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mail, Phone } from "lucide-react";

export const metadata: Metadata = {
  title: "Principal's Desk",
  description: "Message from the Principal of GBN Govt. Polytechnic, Nilokheri.",
};

export default function PrincipalPage() {
  return (
    <>
      <PageHeader
        title="Principal's Desk"
        subtitle="Leadership Driving Excellence in Technical Education"
        breadcrumbs={[
          { label: "About Us", href: "/about" },
          { label: "Principal's Desk" },
        ]}
      />

      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid md:grid-cols-3 gap-10">
            {/* Principal Photo Card */}
            <div className="md:col-span-1">
              <Card className="overflow-hidden sticky top-24">
                <div className="relative aspect-3/4 bg-linear-to-b from-emerald-100 to-emerald-50">
                  <Image
                    src="/images/principal_gpn.jpg"
                    alt="Principal, GBN Govt. Polytechnic, Nilokheri"
                    fill
                    className="object-cover object-top"
                  />
                </div>
                <CardContent className="p-5 text-center">
                  <h3 className="text-lg font-bold text-gray-900">Sh. Jwala Prasad</h3>
                  <p className="text-emerald-600 font-medium text-sm mt-1">Principal</p>
                  <p className="text-gray-500 text-xs mt-1">
                    G.B.N. Govt. Polytechnic, Nilokheri
                  </p>
                  <div className="mt-4 flex flex-col gap-2 text-sm">
                    <a
                      href="mailto:gpnilokheri@hry.nic.in"
                      className="flex items-center justify-center gap-2 text-gray-600 hover:text-emerald-600 transition-colors"
                    >
                      <Mail className="w-4 h-4" />
                      gpnilokheri@hry.nic.in
                    </a>
                    <a
                      href="tel:+911745246002"
                      className="flex items-center justify-center gap-2 text-gray-600 hover:text-emerald-600 transition-colors"
                    >
                      <Phone className="w-4 h-4" />
                      01745-246002
                    </a>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Message */}
            <div className="md:col-span-2">
              <div className="mb-6">
                <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
                  Principal&apos;s Message
                </Badge>
              </div>

              <div className="space-y-5 text-gray-600 leading-relaxed text-[15px]">
                <p>
                  Dear Students, Parents, and Well-wishers,
                </p>
                <p>
                  It is a matter of immense pride that <strong>Guru BrahmaNand Ji Govt. Polytechnic, Nilokheri</strong> has 
                  been serving the nation for over <strong>seven decades</strong> as a pioneer 
                  and premier institution in the field of technical education. Our alumni have 
                  infiltrated into all sectors — government, private, and public — and are 
                  contributing significantly to national development.
                </p>
                <p>
                  The institute provides a strong foundation in engineering skills and human 
                  values, preparing students to face the challenges of a rapidly evolving 
                  technological landscape. Our mission is to cater to the needs of society 
                  by producing globally competitive entrepreneurs and employable engineers.
                </p>
                <p>
                  We focus on holistic development — not just academic excellence, but also 
                  nurturing leadership, teamwork, ethics, and innovation. Our state-of-the-art 
                  laboratories, experienced faculty, and industry connections ensure that 
                  every student who passes through our gates is well-prepared for the future.
                </p>
                <p>
                  The institute has forged partnerships with leading companies like 
                  <strong> Toyota Boshoku, Maruti Suzuki, Asian Paints, and Schneider Electric</strong>, 
                  providing our students with real-world exposure and placement opportunities 
                  with packages up to <strong>₹5 LPA</strong>.
                </p>
                <p>
                  I welcome new aspirants to be a part of this great tradition and assure 
                  you all that the glorious reputation and pre-eminence of this institution 
                  will give new dimensions to your life and career.
                </p>
                <p className="font-semibold text-gray-800 mt-8">
                  With warm regards,
                  <br />
                  <span className="text-emerald-700">Sh. Jwala Prasad</span>
                  <br />
                  <span className="text-sm font-normal text-gray-500">
                    Principal, G.B.N. Govt. Polytechnic, Nilokheri
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
