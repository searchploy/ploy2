import type { Metadata } from "next";
import { ReportWizard } from "@/app/report/report-wizard";

export const metadata: Metadata = {
  title: "AI Report",
  description: "Generate your free AI Workforce Report — readiness score, savings estimate, and recommended AI employees in under 5 minutes.",
};

export default function ReportPage() {
  return (
    <div className="container">
      <ReportWizard />
    </div>
  );
}
