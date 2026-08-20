import { SectionHeading } from "@/components/shared/section-heading";
import { Card } from "@/components/ui/card";

export default function ContactPage() {
  return (
    <div className="container max-w-xl py-20">
      <SectionHeading
        eyebrow="Contact"
        title="Get in touch"
        description="Questions about Ploy? Reach out to our support team."
        align="left"
        className="items-start text-left"
      />
      <Card className="mt-10 p-8">
        <div className="flex flex-col gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Support Email</h3>
            <p className="text-muted-foreground mb-4">
              For any questions, issues, or inquiries about Ploy, please contact us at:
            </p>
            <a
              href="mailto:support@searchploy.com"
              className="text-lg font-medium text-ploy-gold hover:underline break-all"
            >
              support@searchploy.com
            </a>
          </div>
          <div className="border-t border-border pt-4">
            <p className="text-sm text-muted-foreground">
              We typically respond to all inquiries within one business day.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
