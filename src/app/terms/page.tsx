import type { Metadata } from "next";

export const metadata: Metadata = { title: "Terms of Service" };

export default function TermsPage() {
  return (
    <div className="container max-w-3xl py-12">
      <article className="prose prose-neutral max-w-none dark:prose-invert">
        <h1>Terms of Service</h1>
        <p className="text-sm text-muted-foreground">Last updated August 2026</p>

        <section className="mt-8 space-y-6">
          <div>
            <h2>1. Agreement to Terms</h2>
            <p>
              By accessing and using Ploy ("Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
            </p>
          </div>

          <div>
            <h2>2. Service Description</h2>
            <p>
              Ploy is a marketplace and AI adoption platform that connects businesses with AI service providers. The Service provides:
            </p>
            <ul>
              <li>AI employee marketplace for discovering and evaluating AI solutions</li>
              <li>AI readiness assessments and reporting tools</li>
              <li>Consultant network for AI implementation guidance</li>
              <li>Agency directory for AI employee development</li>
            </ul>
            <p>
              <strong>Important:</strong> Ploy is a discovery and facilitation platform only. We do not:
            </p>
            <ul>
              <li>Build, develop, or maintain AI employees or products</li>
              <li>Process payments for third-party services</li>
              <li>Provide direct AI implementation services</li>
              <li>Hold liability for AI employees or implementations</li>
            </ul>
            <p>
              All transactions between users occur directly with service providers. Agencies and service providers are solely responsible for their products and services.
            </p>
          </div>

          <div>
            <h2>3. User Eligibility</h2>
            <p>
              By using Ploy, you represent and warrant that:
            </p>
            <ul>
              <li>You are at least 18 years old</li>
              <li>You have the authority to enter into this agreement</li>
              <li>You are not a resident of any country under US embargo</li>
              <li>You are not listed on any US government denied party lists</li>
              <li>You will use the Service only for lawful purposes</li>
            </ul>
          </div>

          <div>
            <h2>4. User Accounts</h2>
            <p>
              To use certain features of Ploy, you must create an account. You agree to:
            </p>
            <ul>
              <li>Provide accurate, current, and complete information</li>
              <li>Maintain the confidentiality of your account credentials</li>
              <li>Be responsible for all activity under your account</li>
              <li>Notify us immediately of unauthorized access</li>
              <li>Not share your account with others</li>
            </ul>
            <p>
              We reserve the right to suspend or terminate accounts that violate these terms or contain false information.
            </p>
          </div>

          <div>
            <h2>5. Acceptable Use Policy</h2>
            <p>
              You agree NOT to:
            </p>
            <ul>
              <li>Use the Service for illegal purposes or to violate any laws</li>
              <li>Harass, threaten, or defame any person or organization</li>
              <li>Upload or transmit viruses, malware, or malicious code</li>
              <li>Attempt to gain unauthorized access to our systems</li>
              <li>Use automated tools to scrape, crawl, or harvest data</li>
              <li>Send spam, unsolicited commercial email, or phishing attempts</li>
              <li>Violate intellectual property rights of others</li>
              <li>Collect or track personal information without consent</li>
              <li>Impersonate any person or entity</li>
              <li>Resell or redistribute Ploy services</li>
            </ul>
            <p>
              Violation of this policy may result in immediate account termination and legal action.
            </p>
          </div>

          <div>
            <h2>6. Intellectual Property Rights</h2>
            <p>
              The Service and its original content (excluding content provided by users) are the exclusive property of Ploy, Inc. and are protected by international copyright, trademark, and other intellectual property laws. You may not reproduce, distribute, display, transmit, or modify any content without our prior written consent.
            </p>
            <p>
              User-generated content (such as business profiles or AI reports) remains your property. By submitting content to Ploy, you grant us a non-exclusive, royalty-free, worldwide license to use, reproduce, and display that content for operating and improving the Service.
            </p>
          </div>

          <div>
            <h2>7. Third-Party Content and Links</h2>
            <p>
              Ploy includes links to third-party websites and services. We are not responsible for the content, accuracy, or practices of third-party sites. Your use of third-party services is governed by their terms of service. We do not endorse or warrant any third-party products or services.
            </p>
            <p>
              Agency listings and AI employee descriptions are provided by third parties. Ploy does not verify the accuracy or legality of this information. You are responsible for conducting due diligence before engaging with any service provider.
            </p>
          </div>

          <div>
            <h2>8. Paid Subscriptions</h2>
            <p>
              Certain features of Ploy require paid subscription. By subscribing, you agree to:
            </p>
            <ul>
              <li>Pay all charges according to the pricing displayed at purchase</li>
              <li>Subscriptions renew automatically unless cancelled</li>
              <li>Cancellations take effect at the end of the current billing period</li>
              <li>No refunds for partial billing periods except as required by law</li>
              <li>We may change pricing with 30 days' notice</li>
            </ul>
          </div>

          <div>
            <h2>9. Disclaimer of Warranties</h2>
            <p>
              <strong>THE SERVICE IS PROVIDED ON AN "AS-IS" AND "AS-AVAILABLE" BASIS.</strong>
            </p>
            <p>
              PLOY MAKES NO WARRANTIES, EXPRESS OR IMPLIED, REGARDING:
            </p>
            <ul>
              <li>Accuracy or completeness of listings, reviews, or ratings</li>
              <li>Quality, reliability, or safety of AI employees or services</li>
              <li>Performance, results, or outcomes from using third-party services</li>
              <li>That the Service will be uninterrupted, error-free, or secure</li>
              <li>Any advice, recommendations, or ROI projections</li>
            </ul>
            <p>
              You assume all risk for your use of the Service and any decisions based on information provided.
            </p>
          </div>

          <div>
            <h2>10. Limitation of Liability</h2>
            <p>
              <strong>TO THE MAXIMUM EXTENT PERMITTED BY LAW:</strong>
            </p>
            <ul>
              <li>Ploy shall not be liable for any indirect, incidental, special, or consequential damages</li>
              <li>Ploy shall not be liable for lost profits, revenue, data, or business opportunities</li>
              <li>Ploy's total liability shall not exceed the amount paid in the 12 months prior to the claim</li>
              <li>These limitations apply even if we have been advised of the possibility of such damages</li>
            </ul>
            <p>
              This applies to all claims arising from use of the Service, whether based on warranty, contract, tort, or any other legal theory.
            </p>
          </div>

          <div>
            <h2>11. Indemnification</h2>
            <p>
              You agree to indemnify, defend, and hold harmless Ploy, its officers, directors, employees, and agents from any claims, damages, losses, or expenses (including attorney's fees) arising from:
            </p>
            <ul>
              <li>Your violation of these Terms</li>
              <li>Your use of the Service</li>
              <li>Your violation of any third-party rights</li>
              <li>Your violation of any law or regulation</li>
            </ul>
          </div>

          <div>
            <h2>12. Data and Privacy</h2>
            <p>
              Your use of Ploy is governed by our Privacy Policy. By using the Service, you consent to our collection and use of personal information as described in the Privacy Policy. We may share information with service providers and agencies as necessary to operate the marketplace.
            </p>
          </div>

          <div>
            <h2>13. Termination</h2>
            <p>
              We may terminate or suspend your account immediately, without notice or liability, for any reason including:
            </p>
            <ul>
              <li>Violation of these Terms</li>
              <li>Illegal activity or fraud</li>
              <li>Abuse of the Service</li>
              <li>Non-payment of fees</li>
            </ul>
            <p>
              Upon termination, your right to use the Service ceases immediately. We may delete your account and data after a reasonable period.
            </p>
          </div>

          <div>
            <h2>14. Changes to Terms and Service</h2>
            <p>
              We reserve the right to modify these Terms and the Service at any time. Changes to these Terms become effective when posted. Continued use of the Service after changes constitutes acceptance of new Terms. For material changes, we will provide 30 days' notice.
            </p>
          </div>

          <div>
            <h2>15. Dispute Resolution</h2>
            <p>
              Any disputes arising from these Terms or your use of Ploy shall be governed by and construed in accordance with the laws of Delaware, without regard to conflicts of law principles. You agree to submit to the exclusive jurisdiction of the state and federal courts located in Delaware.
            </p>
          </div>

          <div>
            <h2>16. Severability</h2>
            <p>
              If any provision of these Terms is found to be unenforceable, the remaining provisions shall remain in full force and effect.
            </p>
          </div>

          <div>
            <h2>17. Entire Agreement</h2>
            <p>
              These Terms constitute the entire agreement between you and Ploy regarding the Service and supersede all prior agreements and understandings.
            </p>
          </div>

          <div>
            <h2>18. Contact Us</h2>
            <p>
              For questions about these Terms of Service, please contact us at:
            </p>
            <p>
              <strong>Email:</strong> support@searchploy.com
            </p>
          </div>
        </section>
      </article>
    </div>
  );
}
