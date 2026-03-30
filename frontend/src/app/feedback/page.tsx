/**
 * @file page.tsx
 * @description Grievance page — submit a complaint/grievance, plus AICTE feedback portal link
 * @author Gurkirat Singh
 * @org GBN Government Polytechnic, Nilokheri
 * @license All rights reserved — GBN Government Polytechnic, Nilokheri
 */
import { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent } from "@/components/ui/card";
import {
  MessageSquare,
  ExternalLink,
} from "lucide-react";
import { GrievanceForm } from "./grievance-form";

export const metadata: Metadata = {
  title: "Grievance",
  description:
    "Submit a grievance or complaint to GBN Govt. Polytechnic Nilokheri. Your concerns will be addressed promptly.",
};

export default function FeedbackPage() {
  return (
    <>
      <PageHeader
        title="Grievance"
        subtitle="Submit Your Grievance or Complaint"
        breadcrumbs={[{ label: "Grievance" }]}
      />

      <section className="py-16">
        <div className="container mx-auto px-4 max-w-3xl">
          {/* Grievance Form — first */}
          <p className="text-gray-600 text-center mb-8">
            Have a complaint or concern? Fill out the form below and we will address it promptly.
          </p>
          <GrievanceForm />

          {/* AICTE Feedback Portal — below */}
          <Card className="border-emerald-200 text-center mt-12">
            <CardContent className="p-6 sm:p-10">
              <MessageSquare className="w-12 h-12 text-emerald-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                AICTE Feedback Portal
              </h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                You can also submit feedback through the official AICTE portal to help improve the quality of technical education.
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
        </div>
      </section>
    </>
  );
}
