/**
 * @file page.tsx
 * @description Feedback page — stakeholder feedback areas (curriculum, faculty, infrastructure, support) with external Google Form link
 * @author Gurkirat Singh
 * @org GBN Government Polytechnic, Nilokheri
 * @license All rights reserved — GBN Government Polytechnic, Nilokheri
 */
import { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  MessageSquare,
  ExternalLink,
  BookOpen,
  Users,
  Building2,
  HeadphonesIcon,
} from "lucide-react";
import { GrievanceForm } from "./grievance-form";

export const metadata: Metadata = {
  title: "Feedback",
  description:
    "Student and stakeholder feedback for continuous improvement at GBN Govt. Polytechnic Nilokheri.",
};

const feedbackAreas = [
  { icon: BookOpen, label: "Curriculum" },
  { icon: Users, label: "Faculty" },
  { icon: Building2, label: "Infrastructure" },
  { icon: HeadphonesIcon, label: "Support Services" },
];

export default function FeedbackPage() {
  return (
    <>
      <PageHeader
        title="Feedback"
        subtitle="Your Feedback Drives Continuous Improvement"
        breadcrumbs={[{ label: "Feedback" }]}
      />

      <section className="py-16">
        <div className="container mx-auto px-4 max-w-3xl">
          {/* Description */}
          <Card className="border-emerald-200 bg-emerald-50/50 mb-12">
            <CardContent className="p-6 sm:p-8">
              <p className="text-gray-700 leading-relaxed text-lg">
                Student and stakeholder feedback is crucial for continuous
                improvement. GBN Govt. Polytechnic participates in the AICTE
                feedback system.
              </p>
            </CardContent>
          </Card>

          {/* Feedback Areas */}
          <h2 className="text-xl font-bold text-gray-900 mb-4 text-center">
            Feedback Covers
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12">
            {feedbackAreas.map((area, i) => (
              <Card key={i} className="text-center hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center mx-auto mb-2">
                    <area.icon className="w-5 h-5 text-emerald-600" />
                  </div>
                  <Badge variant="secondary">{area.label}</Badge>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* CTA Card */}
          <Card className="border-emerald-200 text-center mb-12">
            <CardContent className="p-6 sm:p-10">
              <MessageSquare className="w-12 h-12 text-emerald-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                AICTE Feedback Portal
              </h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Submit your feedback through the official AICTE portal to help
                us improve the quality of technical education.
              </p>
              <Link
                href="https://www.aicte-india.org/feedback"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-emerald-700 transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                Go to AICTE Feedback Portal
              </Link>
            </CardContent>
          </Card>

          {/* Grievance Form */}
          <h2 className="text-xl font-bold text-gray-900 mb-4 text-center">
            Submit a Grievance
          </h2>
          <p className="text-gray-600 text-center mb-6">
            Have a complaint or concern? Submit it here and we will address it promptly.
          </p>
          <GrievanceForm />
        </div>
      </section>
    </>
  );
}
