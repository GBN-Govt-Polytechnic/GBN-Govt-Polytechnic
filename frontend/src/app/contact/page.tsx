/**
 * @file page.tsx
 * @description Contact Us page — institute address, phone, email, office hours, embedded map, and contact form
 * @author Gurkirat Singh
 * @org GBN Government Polytechnic, Nilokheri
 * @license All rights reserved — GBN Government Polytechnic, Nilokheri
 */
import { Metadata } from "next";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  MapPin, Phone, Mail, Clock, ExternalLink, Building2, CreditCard,
} from "lucide-react";
import { ContactForm } from "./contact-form";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with GBN Govt. Polytechnic Nilokheri — address, phone, email, and location map.",
};

const contactInfo = [
  {
    icon: MapPin,
    label: "Address",
    value: "Guru BrahmaNand Ji Govt. Polytechnic, Nilokheri",
    detail: "GT Road, Nilokheri, Distt. Karnal, Haryana - 132117",
  },
  {
    icon: Phone,
    label: "Phone",
    value: "01745-246002",
    href: "tel:+911745246002",
  },
  {
    icon: Mail,
    label: "Office Email",
    value: "gpnilokheri@hry.nic.in",
    href: "mailto:gpnilokheri@hry.nic.in",
  },
  {
    icon: Mail,
    label: "Exam Branch Email",
    value: "exam.gpnlk@gmail.com",
    href: "mailto:exam.gpnlk@gmail.com",
  },
  {
    icon: Clock,
    label: "Office Hours",
    value: "Monday to Saturday",
    detail: "9:00 AM - 5:00 PM",
  },
];

export default function ContactPage() {
  return (
    <>
      <PageHeader
        title="Contact Us"
        subtitle="We'd Love to Hear From You"
        breadcrumbs={[{ label: "Contact Us" }]}
      />

      <section className="py-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid md:grid-cols-2 gap-10">
            {/* Contact Details */}
            <div>
              <h2 className="text-2xl font-bold mb-6">
                Get in <span className="text-emerald-600">Touch</span>
              </h2>

              <div className="space-y-5">
                {contactInfo.map((item, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="w-11 h-11 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0">
                      <item.icon className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-400 uppercase tracking-wider">
                        {item.label}
                      </div>
                      {item.href ? (
                        <a
                          href={item.href}
                          className="text-gray-900 font-medium hover:text-emerald-600 transition-colors"
                        >
                          {item.value}
                        </a>
                      ) : (
                        <div className="text-gray-900 font-medium">{item.value}</div>
                      )}
                      {item.detail && (
                        <div className="text-sm text-gray-500">{item.detail}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <Separator className="my-8" />

              {/* Fee Payment */}
              <Card className="border-emerald-200 bg-emerald-50/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-emerald-600" />
                    Fee Payment
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-3">
                    Pay fees online through SBI Collect portal.
                  </p>
                  <a
                    href="https://www.onlinesbi.sbi/sbicollect/icollecthome.htm"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-emerald-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors"
                  >
                    Pay via SBI Collect
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  <p className="text-xs text-gray-400 mt-2">Corp ID: 4592373</p>
                </CardContent>
              </Card>
            </div>

            {/* Contact Form + Map */}
            <div className="space-y-8">
              <ContactForm />

              <Card className="overflow-hidden">
                <div className="h-64">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3445.5!2d76.9305!3d29.8385!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390e6f7a0e0e0e0f%3A0x0!2sGovt.+Polytechnic+Nilokheri!5e0!3m2!1sen!2sin!4v1700000000"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="GBN Polytechnic Location"
                  />
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-2xl font-bold text-center mb-8">
            Important <span className="text-emerald-600">Links</span>
          </h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { label: "HSBTE, Panchkula", href: "https://www.hsbte.org.in", icon: Building2 },
              { label: "Tech. Education Dept.", href: "https://techedu.haryana.gov.in", icon: Building2 },
              { label: "AICTE, New Delhi", href: "https://www.aicte-india.org", icon: Building2 },
            ].map((link, i) => (
              <a
                key={i}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <Card className="hover:shadow-lg transition-all hover:-translate-y-0.5 h-full">
                  <CardContent className="p-5 flex items-center gap-3">
                    <link.icon className="w-5 h-5 text-emerald-600 shrink-0" />
                    <div className="flex-1">
                      <div className="font-medium text-sm text-gray-900">{link.label}</div>
                    </div>
                    <ExternalLink className="w-4 h-4 text-gray-400" />
                  </CardContent>
                </Card>
              </a>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
