/**
 * @file page.tsx
 * @description Rules & Regulations page — student conduct rules, anti-ragging policy, discipline guidelines, and helpline numbers
 * @author Gurkirat Singh
 * @org GBN Government Polytechnic, Nilokheri
 * @license All rights reserved — GBN Government Polytechnic, Nilokheri
 */
import { Metadata } from "next";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ShieldAlert, Phone, AlertTriangle, Scale, Users,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Rules & Regulations",
  description:
    "Student conduct rules, anti-ragging policy, discipline guidelines, and helpline at GBN Govt. Polytechnic Nilokheri.",
};

const rules = [
  "Students must carry their ID cards at all times within the campus.",
  "Ragging in any form is strictly prohibited and punishable under law.",
  "Consumption of alcohol, tobacco, or any prohibited substance is strictly banned.",
  "Students must maintain discipline and decorum in classrooms, labs, and campus premises.",
  "Damage to institute property will result in disciplinary action and recovery of cost.",
  "Mobile phones must be kept on silent mode during classes and examinations.",
  "Students must attend a minimum of 75% classes to be eligible for examinations.",
  "Any act of indiscipline may lead to suspension or expulsion from the institute.",
];

export default function RulesPage() {
  return (
    <>
      <PageHeader
        title="Rules & Regulations"
        subtitle="Maintaining Discipline, Safety & Academic Integrity"
        breadcrumbs={[{ label: "Rules & Regulations" }]}
      />

      {/* Anti-Ragging */}
      <section className="py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <Card className="border-red-200 bg-red-50/50 overflow-hidden">
            <div className="bg-linear-to-r from-red-500 to-red-600 p-4 flex items-center gap-3">
              <ShieldAlert className="w-6 h-6 text-white" />
              <h2 className="text-white font-bold text-lg">Anti-Ragging Policy</h2>
            </div>
            <CardContent className="p-6">
              <p className="text-gray-700 leading-relaxed mb-4">
                GBN Govt. Polytechnic, Nilokheri has a <strong>zero tolerance policy</strong> against 
                ragging in any form — physical, verbal, or mental. Any student found indulging in 
                ragging is liable for strict disciplinary action including but not limited to:
              </p>
              <div className="grid sm:grid-cols-2 gap-3 mb-4">
                {[
                  "Suspension from attending classes",
                  "Withholding / withdrawing scholarship",
                  "Debarring from examination",
                  "Suspension / expulsion from hostel",
                  "Rustication from the institute",
                  "FIR and criminal prosecution",
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-red-700">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    {item}
                  </div>
                ))}
              </div>
              <Badge className="bg-red-100 text-red-700 hover:bg-red-100">
                UGC Regulation on Curbing Menace of Ragging
              </Badge>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Student Conduct Rules */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <Scale className="w-6 h-6 text-emerald-600" />
            Student <span className="text-emerald-600">Code of Conduct</span>
          </h2>
          <Card>
            <CardContent className="p-6">
              <div className="space-y-3">
                {rules.map((rule, i) => (
                  <div key={i} className="flex items-start gap-3 py-2">
                    <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-bold shrink-0">
                      {i + 1}
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed pt-1">{rule}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Helpline */}
      <section className="py-12" id="helpline">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <Phone className="w-6 h-6 text-emerald-600" />
            Student <span className="text-emerald-600">Helpline</span>
          </h2>
          <div className="grid sm:grid-cols-2 gap-6">
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-3">
                  <ShieldAlert className="w-7 h-7 text-red-600" />
                </div>
                <h3 className="font-bold text-gray-900 mb-1">Anti-Ragging Helpline</h3>
                <a href="tel:18001805522" className="text-2xl font-bold text-red-600 block mb-1">
                  1800-180-5522
                </a>
                <p className="text-xs text-gray-500">National Anti-Ragging Helpline (Toll-Free, 24x7)</p>
              </CardContent>
            </Card>
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-3">
                  <Phone className="w-7 h-7 text-emerald-600" />
                </div>
                <h3 className="font-bold text-gray-900 mb-1">College Helpline</h3>
                <a href="tel:+911745246002" className="text-2xl font-bold text-emerald-600 block mb-1">
                  01745-246002
                </a>
                <p className="text-xs text-gray-500">Office Hours: Mon-Sat, 9 AM - 5 PM</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Grievance */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4 max-w-4xl">
          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="p-6 flex items-start gap-4">
              <Users className="w-8 h-8 text-blue-500 shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-gray-900 mb-1">
                  Grievance Redressal Committee
                </h3>
                <p className="text-sm text-gray-600 mb-3">
                  Students can submit their grievances to the Grievance Redressal Committee 
                  of the institute. All complaints are handled confidentially and resolved 
                  within a stipulated timeframe.
                </p>
                <p className="text-sm text-gray-600">
                  For SC/ST related grievances, a separate SC/ST Grievance Committee is active 
                  at the institute.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </>
  );
}
