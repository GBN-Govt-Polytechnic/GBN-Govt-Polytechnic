/**
 * @file page.tsx
 * @description About Us page — institution history, milestones timeline, vision & mission, quality objectives, and accreditation details
 * @author Gurkirat Singh
 * @org GBN Government Polytechnic, Nilokheri
 * @license All rights reserved — GBN Government Polytechnic, Nilokheri
 */
import { Metadata } from "next";
import Image from "next/image";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, MapPin, Calendar, Users, Award, Target, Eye, Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about GBN Govt. Polytechnic Nilokheri — a premier technical institution established in 1947 with 7+ decades of excellence.",
};

const milestones = [
  { year: "1947", event: "Nilokheri Polytechnic established by Govt. of India" },
  { year: "1951", event: "Govt. School of Engineering shifted to Nilokheri from Chhachrauli" },
  { year: "1958", event: "Both institutes merged as Punjab Polytechnic, Nilokheri" },
  { year: "1966", event: "Renamed to Haryana Polytechnic after state reorganization" },
  { year: "1975+", event: "New diploma courses added beyond Civil, Electrical & Mechanical" },
  { year: "Present", event: "Renamed Guru BrahmaNand Ji Govt. Polytechnic, running 6 programmes" },
];

const qualityObjectives = [
  "Enhance core competence of faculty through IEP and STC",
  "Produce industry-oriented skilled manpower",
  "Improve quality through feedback from industry and students",
  "Increase placements through campus interviews from reputed companies",
  "Reduce failure and dropout rate",
  "Strengthen institute through testing and consultancy work",
];

export default function AboutPage() {
  return (
    <>
      <PageHeader
        title="About Us"
        subtitle="A Legacy of Excellence in Technical Education Since 1947"
        breadcrumbs={[{ label: "About Us" }]}
      />

      {/* History Section */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-4 bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
                Est. 1947
              </Badge>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Our <span className="text-emerald-600">History</span>
              </h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  Guru BrahmaNand Ji Govt. Polytechnic, Nilokheri is a premier technical institute
                  approved by <strong>AICTE, New Delhi</strong> and affiliated to{" "}
                  <strong>HSBTE, Panchkula</strong>. Located 143 km from Delhi on NH-1, 
                  the institute has been shaping engineers for over seven decades.
                </p>
                <p>
                  Originally established as the Govt. School of Engineering in Rasool (West Punjab),
                  the institute was relocated after partition — first to Chhachrauli (Yamunanagar),
                  then to Nilokheri in 1951, where it merged with the existing Nilokheri Polytechnic
                  in 1958 on the recommendation of the Government of India.
                </p>
                <p>
                  After the reorganization of states on November 1, 1966, it was renamed 
                  Haryana Polytechnic and later Guru BrahmaNand Ji Govt. Polytechnic, Nilokheri. 
                  Today, the institute runs <strong>6 diploma programmes</strong> with a total 
                  intake of <strong>600 students</strong>.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="relative aspect-square rounded-2xl overflow-hidden shadow-lg">
                <Image
                  src="/images/campus-building.jpg"
                  alt="GBN Polytechnic Campus"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="absolute -bottom-4 -left-4 bg-emerald-600 text-white px-5 py-3 rounded-xl shadow-lg">
                <div className="text-2xl font-bold">75+</div>
                <div className="text-xs">Years of Excellence</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-3xl font-bold text-center mb-4">
            Our <span className="text-emerald-600">Journey</span>
          </h2>
          <p className="text-center text-gray-500 mb-12 max-w-xl mx-auto">
            Over seven decades shaping the future of technical education
          </p>
          <div className="relative max-w-2xl mx-auto">
            {/* Vertical line */}
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-emerald-200" />
            <div className="space-y-6">
              {milestones.map((item, i) => (
                <div key={i} className="relative pl-12">
                  {/* Dot on the line */}
                  <div className="absolute left-2.5 top-1.5 w-3 h-3 rounded-full bg-emerald-500 ring-4 ring-emerald-50" />
                  <div>
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                      {item.year}
                    </span>
                    <p className="text-gray-700 text-sm leading-relaxed mt-1.5">{item.event}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Vision, Mission, Quality Policy */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              What <span className="text-emerald-600">Drives Us</span>
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto">Our guiding principles for excellence in technical education</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Vision */}
            <div className="group rounded-2xl bg-white border border-gray-200 p-7 hover:shadow-xl hover:border-emerald-200 transition-all">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Eye className="w-7 h-7 text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Our Vision</h3>
              <p className="text-gray-600 leading-relaxed text-sm">
                To be a premier technical institution that caters to the needs of society
                by producing globally competitive entrepreneurs and employable engineers
                equipped with strong engineering skills and human values.
              </p>
            </div>

            {/* Mission */}
            <div className="group rounded-2xl bg-white border border-gray-200 p-7 hover:shadow-xl hover:border-blue-200 transition-all">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Target className="w-7 h-7 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Our Mission</h3>
              <p className="text-gray-600 leading-relaxed text-sm">
                To provide quality technical education and develop skilled manpower with
                unique entrepreneurship qualities. To upgrade knowledge and skills of
                faculty while modernizing facilities to meet evolving industry demands.
              </p>
            </div>

            {/* Quality Policy */}
            <div className="group rounded-2xl bg-white border border-gray-200 p-7 hover:shadow-xl hover:border-purple-200 transition-all">
              <div className="w-14 h-14 rounded-2xl bg-purple-50 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Sparkles className="w-7 h-7 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Quality Policy</h3>
              <p className="text-gray-600 leading-relaxed text-sm">
                Committed to producing industrial need-based skilled manpower with
                unique entrepreneurship quality — upgrading the knowledge and skills
                of our faculty, staff, and modernizing the facilities continuously.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Quality Objectives */}
      <section className="py-16 bg-linear-to-br from-emerald-600 to-emerald-800 text-white">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-3xl font-bold text-center mb-10">Quality Objectives</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {qualityObjectives.map((obj, i) => (
              <div
                key={i}
                className="flex items-start gap-3 bg-white/10 rounded-xl p-4 backdrop-blur-sm"
              >
                <CheckCircle2 className="w-5 h-5 text-emerald-300 mt-0.5 shrink-0" />
                <span className="text-white/90">{obj}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Info Cards */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <Calendar className="w-8 h-8 text-emerald-600 mx-auto mb-3" />
                <div className="text-2xl font-bold text-gray-900">1947</div>
                <div className="text-sm text-gray-500">Established</div>
              </CardContent>
            </Card>
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <MapPin className="w-8 h-8 text-emerald-600 mx-auto mb-3" />
                <div className="text-2xl font-bold text-gray-900">26.4</div>
                <div className="text-sm text-gray-500">Acres Campus</div>
              </CardContent>
            </Card>
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <Users className="w-8 h-8 text-emerald-600 mx-auto mb-3" />
                <div className="text-2xl font-bold text-gray-900">600</div>
                <div className="text-sm text-gray-500">Total Intake</div>
              </CardContent>
            </Card>
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <Award className="w-8 h-8 text-emerald-600 mx-auto mb-3" />
                <div className="text-2xl font-bold text-gray-900">6</div>
                <div className="text-sm text-gray-500">Diploma Programmes</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Affiliations */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4 max-w-4xl">
          <h3 className="text-center text-sm font-semibold text-gray-400 uppercase tracking-wider mb-8">
            Approved &amp; Affiliated By
          </h3>
          <div className="flex flex-wrap items-center justify-center gap-10">
            <div className="text-center">
              <div className="w-20 h-20 relative mx-auto mb-2">
                <Image src="/images/aicte-logo.png" alt="AICTE" fill className="object-contain" />
              </div>
              <p className="text-[10px] text-gray-500">AICTE, New Delhi</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-20 relative mx-auto mb-2">
                <Image src="/images/hsbte-logo.png" alt="HSBTE" fill className="object-contain" />
              </div>
              <p className="text-[10px] text-gray-500">HSBTE, Panchkula</p>
            </div>
            <div className="text-center">
              <div className="w-40 h-10 relative mx-auto mb-2">
                <Image src="/images/moe-logo.png" alt="Ministry of Education" fill className="object-contain" />
              </div>
              <p className="text-[10px] text-gray-500">Ministry of Education</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
