/**
 * @file page.tsx
 * @description Location page — campus address, embedded Google Map, and nearest railway station, city, and airport details
 * @author Gurkirat Singh
 * @org GBN Government Polytechnic, Nilokheri
 * @license All rights reserved — GBN Government Polytechnic, Nilokheri
 */
import { Metadata } from "next";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Train, Building2, Plane } from "lucide-react";

export const metadata: Metadata = {
  title: "Location",
  description:
    "How to reach GBN Govt. Polytechnic Nilokheri — location map, address, and nearest transport hubs.",
};

const reachInfo = [
  {
    icon: Train,
    label: "Nearest Railway Station",
    value: "Nilokheri (2 km)",
  },
  {
    icon: Building2,
    label: "Nearest City",
    value: "Karnal (15 km)",
  },
  {
    icon: Plane,
    label: "Nearest Airport",
    value: "Chandigarh (120 km)",
  },
];

export default function LocationPage() {
  return (
    <>
      <PageHeader
        title="Location"
        subtitle="How to Reach GBN Govt. Polytechnic Nilokheri"
        breadcrumbs={[
          { label: "About Us", href: "/about" },
          { label: "Location" },
        ]}
      />

      <section className="container mx-auto px-4 py-12 space-y-8">
        {/* Google Maps Embed */}
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3451.2!2d76.931193!3d29.839474!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390e5f1b5c2b5e4d%3A0x7b3a1b2c3d4e5f6g!2sGBN%20Govt.%20Polytechnic%20Nilokheri!5e0!3m2!1sen!2sin!4v1234567890"
              width="100%"
              height="400"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="GBN Govt. Polytechnic Nilokheri Location"
              className="w-full h-70 sm:h-100"
            />
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Address Card */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-emerald-100 p-2.5">
                  <MapPin className="h-6 w-6 text-emerald-700" />
                </div>
                <CardTitle className="text-xl">Address</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed text-lg">
                GBN Govt. Polytechnic, Nilokheri,
                <br />
                Karnal, Haryana — 132117
              </p>
            </CardContent>
          </Card>

          {/* How to Reach */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-xl">How to Reach</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {reachInfo.map((info) => {
                  const Icon = info.icon;
                  return (
                    <li key={info.label} className="flex items-center gap-3">
                      <div className="rounded-lg bg-emerald-100 p-2">
                        <Icon className="h-5 w-5 text-emerald-700" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">
                          {info.label}
                        </p>
                        <p className="font-medium">{info.value}</p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>
    </>
  );
}
