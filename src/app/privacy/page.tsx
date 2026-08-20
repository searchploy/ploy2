import type { Metadata } from "next";

export const metadata: Metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
  return (
    <div className="container max-w-3xl py-12">
      <article className="prose prose-neutral max-w-none dark:prose-invert">
        <h1>Privacy Policy</h1>
        <p className="text-sm text-muted-foreground">Last updated August 2026</p>

        <section className="mt-8 space-y-6">
          <div>
            <h2>1. Introduction</h2>
            <p>
              Ploy, Inc. ("Ploy", "we", "us", "our") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services.
            </p>
            <p>
              Please read this Privacy Policy carefully. If you do not agree with our policies and practices, please do not use our Service. By accessing and using Ploy, you signify that you have read, understood, and agree to be bound by all the provisions of this Privacy Policy.
            </p>
          </div>

          <div>
            <h2>2. Information We Collect</h2>
            <p>
              We collect information in several ways:
            </p>

            <h3>2.1 Information You Provide</h3>
            <ul>
              <li><strong>Account Information:</strong> Name, email address, phone number, company name, job title, business size, industry</li>
              <li><strong>Profile Information:</strong> Business description, website, location, budget, business needs, AI goals</li>
              <li><strong>Communication:</strong> Messages, inquiries, support requests, feedback, survey responses</li>
              <li><strong>Payment Information:</strong> Billing address, payment method (processed through Stripe; we do not store credit card details)</li>
              <li><strong>Content You Create:</strong> AI reports, assessments, saved preferences, project data</li>
            </ul>

            <h3>2.2 Information Collected Automatically</h3>
            <ul>
              <li><strong>Usage Data:</strong> Pages viewed, features used, time spent, search queries, filters applied</li>
              <li><strong>Device Information:</strong> Device type, browser, operating system, IP address, device identifiers</li>
              <li><strong>Analytics:</strong> Cookies, pixels, and similar tracking technologies to understand how you use our Service</li>
              <li><strong>Referral Information:</strong> How you found us, previous websites visited, referral source</li>
            </ul>

            <h3>2.3 Information from Third Parties</h3>
            <ul>
              <li>Information shared by agencies or service providers you interact with</li>
              <li>Information from authentication providers (Google, SSO)</li>
              <li>Aggregated data from analytics and market research partners</li>
            </ul>
          </div>

          <div>
            <h2>3. How We Use Your Information</h2>
            <p>
              We use the information we collect for the following purposes:
            </p>
            <ul>
              <li><strong>Service Delivery:</strong> Providing, maintaining, and improving the Ploy marketplace</li>
              <li><strong>Personalization:</strong> Customizing your experience and recommendations based on preferences</li>
              <li><strong>Communication:</strong> Sending service updates, security alerts, and customer support</li>
              <li><strong>Marketing:</strong> Sending promotional emails, newsletters, and product updates (with your consent)</li>
              <li><strong>Analytics:</strong> Analyzing usage patterns to improve our Service and user experience</li>
              <li><strong>Marketplace Operations:</strong> Connecting you with agencies and service providers, facilitating transactions</li>
              <li><strong>Legal Compliance:</strong> Fulfilling legal obligations, enforcing Terms of Service, preventing fraud</li>
              <li><strong>Research:</strong> Conducting surveys, research, and generating insights about AI adoption trends</li>
              <li><strong>Safety and Security:</strong> Detecting and preventing fraud, abuse, and security incidents</li>
            </ul>
          </div>

          <div>
            <h2>4. How We Share Your Information</h2>

            <h3>4.1 Service Providers</h3>
            <p>
              We share information with third-party service providers who assist in operating our Service, including:
            </p>
            <ul>
              <li><strong>Stripe:</strong> Payment processing and billing</li>
              <li><strong>Supabase/PostgreSQL:</strong> Database and data storage</li>
              <li><strong>Cloud providers:</strong> Hosting and infrastructure</li>
              <li><strong>Analytics providers:</strong> Usage analytics and performance monitoring</li>
              <li><strong>Email service providers:</strong> Sending emails and notifications</li>
            </ul>
            <p>
              These providers are contractually obligated to use your information only as necessary to provide services to us and are required to maintain confidentiality and security.
            </p>

            <h3>4.2 Agencies and Service Providers</h3>
            <p>
              If you express interest in an agency or service, we may share your contact information and relevant project details with that provider to facilitate connection and service delivery. You consent to this sharing by using our marketplace.
            </p>

            <h3>4.3 Legal Requirements</h3>
            <p>
              We may disclose your information when required by law or when we believe in good faith that disclosure is necessary to:
            </p>
            <ul>
              <li>Comply with legal obligations, court orders, or government requests</li>
              <li>Enforce our Terms of Service and other agreements</li>
              <li>Protect the security or integrity of our Service</li>
              <li>Protect the rights, privacy, safety, or property of Ploy, users, or the public</li>
              <li>Detect, prevent, or address fraud, security, or technical issues</li>
            </ul>

            <h3>4.4 Business Transfers</h3>
            <p>
              If Ploy is involved in a merger, acquisition, bankruptcy, or sale of assets, your information may be transferred as part of that transaction. We will provide notice before your personal information becomes subject to a different privacy policy.
            </p>

            <h3>4.5 Aggregated and De-Identified Data</h3>
            <p>
              We may share aggregated, anonymized data that cannot identify you personally, such as market trends, industry insights, and usage statistics. This sharing does not violate your privacy.
            </p>

            <h3>4.6 Your Consent</h3>
            <p>
              We may share your information with third parties when we have your explicit consent to do so.
            </p>
          </div>

          <div>
            <h2>5. Data Retention</h2>
            <p>
              We retain your personal information for as long as your account is active and for a reasonable period afterward to fulfill legal obligations, resolve disputes, and enforce agreements. Specifically:
            </p>
            <ul>
              <li><strong>Active Account Data:</strong> Retained during account active status and for 2 years after deletion</li>
              <li><strong>Usage Analytics:</strong> Retained for up to 1 year</li>
              <li><strong>Payment Records:</strong> Retained for 7 years as required by law</li>
              <li><strong>Email Communications:</strong> Retained for 2 years</li>
            </ul>
            <p>
              You may request deletion of your data, subject to legal retention requirements. We will not retain more information than necessary for our business purposes.
            </p>
          </div>

          <div>
            <h2>6. Your Privacy Rights</h2>

            <h3>6.1 GDPR Rights (EU Residents)</h3>
            <p>
              If you are located in the European Union, you have the following rights:
            </p>
            <ul>
              <li><strong>Right to Access:</strong> Request a copy of your personal data</li>
              <li><strong>Right to Rectification:</strong> Request correction of inaccurate data</li>
              <li><strong>Right to Erasure:</strong> Request deletion of your data (right to be forgotten)</li>
              <li><strong>Right to Restrict Processing:</strong> Limit how we use your data</li>
              <li><strong>Right to Data Portability:</strong> Receive your data in a portable format</li>
              <li><strong>Right to Object:</strong> Opt-out of certain uses of your data</li>
              <li><strong>Right to Lodge a Complaint:</strong> File a complaint with your local data protection authority</li>
            </ul>

            <h3>6.2 CCPA Rights (California Residents)</h3>
            <p>
              If you are a California resident, you have the following rights:
            </p>
            <ul>
              <li><strong>Right to Know:</strong> Request what personal information we collect, use, and share</li>
              <li><strong>Right to Delete:</strong> Request deletion of personal information</li>
              <li><strong>Right to Opt-Out:</strong> Opt-out of the "sale" or "sharing" of personal information</li>
              <li><strong>Right to Correct:</strong> Request correction of inaccurate data</li>
              <li><strong>Right to Limit Use:</strong> Limit our use of sensitive personal information</li>
            </ul>

            <h3>6.3 Exercising Your Rights</h3>
            <p>
              To exercise any of these rights, please contact us at support@searchploy.com with "Privacy Request" in the subject line. Include specific details about what you're requesting. We will verify your identity and respond within 30 days (or as required by applicable law).
            </p>
          </div>

          <div>
            <h2>7. Cookies and Tracking Technologies</h2>
            <p>
              We use cookies and similar tracking technologies to enhance your experience:
            </p>
            <ul>
              <li><strong>Essential Cookies:</strong> Required for authentication, security, and basic functionality</li>
              <li><strong>Analytics Cookies:</strong> Track usage patterns and performance metrics</li>
              <li><strong>Preference Cookies:</strong> Remember your settings and preferences</li>
              <li><strong>Marketing Cookies:</strong> Display personalized advertisements and track campaign effectiveness</li>
            </ul>
            <p>
              Most browsers allow you to control cookies through settings. Disabling cookies may impact Service functionality.
            </p>
          </div>

          <div>
            <h2>8. Third-Party Links and Services</h2>
            <p>
              Our Service may contain links to third-party websites, marketplaces, and services. We are not responsible for their privacy practices. We encourage you to review their privacy policies before providing personal information. This Privacy Policy applies only to information collected through Ploy.
            </p>
          </div>

          <div>
            <h2>9. Data Security</h2>
            <p>
              We implement industry-standard security measures to protect your information, including:
            </p>
            <ul>
              <li>Encryption in transit (HTTPS/TLS) and at rest</li>
              <li>Secure password hashing and authentication mechanisms</li>
              <li>Regular security audits and vulnerability assessments</li>
              <li>Restricted access to personal information</li>
              <li>Firewalls and intrusion detection systems</li>
            </ul>
            <p>
              However, no method of transmission over the internet or electronic storage is completely secure. While we strive to protect your information, we cannot guarantee absolute security. You use our Service at your own risk.
            </p>
          </div>

          <div>
            <h2>10. Children's Privacy</h2>
            <p>
              Ploy is not intended for users under 18 years old. We do not knowingly collect personal information from children under 18. If we become aware that a child has provided us with personal information, we will promptly delete such information. If you believe we have collected information from a child, please contact us immediately.
            </p>
          </div>

          <div>
            <h2>11. International Data Transfers</h2>
            <p>
              Your information may be stored and processed in countries other than where you reside. These countries may have different data protection laws than your home country. By using Ploy, you consent to the transfer of your information to countries outside your country of residence, which may not have the same data protection laws.
            </p>
            <p>
              For users in the EU, we comply with GDPR requirements for international data transfers, including Standard Contractual Clauses and other lawful mechanisms.
            </p>
          </div>

          <div>
            <h2>12. Marketing and Communications</h2>
            <p>
              We may send you marketing emails about new features, services, promotions, and industry insights. You can opt-out of marketing emails by:
            </p>
            <ul>
              <li>Clicking the "unsubscribe" link in any marketing email</li>
              <li>Updating your preferences in your account settings</li>
              <li>Contacting us at support@searchploy.com</li>
            </ul>
            <p>
              We will not send promotional emails to contacts marked as "do not contact" and will honor opt-out requests within 10 business days.
            </p>
          </div>

          <div>
            <h2>13. California Privacy Rights</h2>
            <p>
              Under California law, you have the right to request information about the categories of personal information we share with third parties for their direct marketing purposes. To make this request, please contact us at support@searchploy.com with "California Privacy Rights" in the subject line.
            </p>
          </div>

          <div>
            <h2>14. Changes to This Privacy Policy</h2>
            <p>
              We may update this Privacy Policy periodically to reflect changes in our practices or for other operational, legal, or regulatory reasons. We will notify you of material changes by updating the "Last updated" date and providing notice via email or prominent notice on the Service. Continued use of Ploy after changes constitutes your acceptance of the updated Privacy Policy.
            </p>
          </div>

          <div>
            <h2>15. Data Protection Officer</h2>
            <p>
              We have appointed a Data Protection Officer to oversee our compliance with privacy laws. For privacy-related concerns, you may contact:
            </p>
            <p>
              <strong>Email:</strong> support@searchploy.com<br />
              <strong>Subject:</strong> Privacy Inquiry
            </p>
          </div>

          <div>
            <h2>16. Contact Us</h2>
            <p>
              If you have questions, concerns, or requests regarding this Privacy Policy or our privacy practices, please contact us:
            </p>
            <p>
              <strong>Email:</strong> support@searchploy.com
            </p>
            <p>
              We will respond to all privacy inquiries within 30 days or as required by applicable law.
            </p>
          </div>
        </section>
      </article>
    </div>
  );
}
