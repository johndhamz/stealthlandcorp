import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { legal } from "@/data/content";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Stealth Land Corp collects, uses, discloses and safeguards your personal information.",
};

export default function PrivacyPage() {
  return (
    <>
      <PageHero eyebrow={`Effective ${legal.privacyEffective}`} title="Privacy Policy" crumbs={[{ label: "Privacy Policy" }]} compact />
      <section className="container-x max-w-3xl py-12 lg:py-16">
        <div className="prose-site">
          <p>Stealth Land Corp. values your privacy and is committed to protecting your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you interact with us, including through our website, services, and in-person engagements.</p>

          <h2>1. Information we collect</h2>
          <p>We may collect personal information from you when you:</p>
          <ul>
            <li>Visit our website.</li>
            <li>Inquire about our properties or services.</li>
            <li>Participate in property tours, open houses, or events.</li>
            <li>Sign up for newsletters or other communications.</li>
            <li>Engage in transactions or contracts with us.</li>
          </ul>
          <p>The types of information we collect may include:</p>
          <ul>
            <li><strong>Personal information:</strong> name, email address, phone number, mailing address, and other contact details.</li>
            <li><strong>Property interests:</strong> information related to your real estate preferences, such as property types, budget, and desired locations.</li>
            <li><strong>Financial information:</strong> details necessary for real estate transactions, such as income, mortgage pre-approval, or other financial data.</li>
            <li><strong>Transaction data:</strong> information regarding any contracts or agreements you enter into with us.</li>
            <li><strong>Online data:</strong> information about your interactions with our website, such as IP address, browser type, pages viewed, and cookies.</li>
          </ul>

          <h2>2. How we use your information</h2>
          <ul>
            <li><strong>To provide services:</strong> facilitating real estate transactions, property tours, and inquiries.</li>
            <li><strong>Communication:</strong> sending you information about our properties, services, promotions, and other updates.</li>
            <li><strong>Marketing:</strong> customising your experience with our services, including tailored advertising based on your property interests.</li>
            <li><strong>Legal compliance:</strong> meeting legal and regulatory requirements, including record-keeping and reporting obligations.</li>
            <li><strong>Improvement:</strong> enhancing our website, services, and customer experience through data analysis and feedback.</li>
          </ul>

          <h2>3. How we share your information</h2>
          <p>We do not sell or rent your personal information. However, we may share your information in the following ways:</p>
          <ul>
            <li><strong>With service providers:</strong> third-party vendors that assist us in providing services, such as payment processors, marketing agencies, and IT support.</li>
            <li><strong>With business partners:</strong> real estate agents, brokers, or financial institutions involved in your transaction, with your consent.</li>
            <li><strong>For legal purposes:</strong> if required by law or to protect our rights, property, or safety.</li>
          </ul>

          <h2>4. Data security</h2>
          <p>We implement appropriate security measures to protect your personal information from unauthorised access, alteration, or disclosure. However, please be aware that no data transmission over the internet or electronic storage system can be guaranteed to be 100% secure.</p>

          <h2>5. Your choices and rights</h2>
          <ul>
            <li><strong>Access:</strong> request access to the personal data we hold about you.</li>
            <li><strong>Correction:</strong> request corrections to any inaccurate or outdated information.</li>
            <li><strong>Deletion:</strong> request that we delete your personal information, subject to legal obligations.</li>
            <li><strong>Opt-out:</strong> unsubscribe from our marketing communications at any time.</li>
          </ul>
          <p>To exercise these rights, please contact us at <a href={`mailto:${site.privacyEmail}`} className="text-gold-400 underline-offset-2 hover:underline">{site.privacyEmail}</a>.</p>

          <h2>6. Cookies and tracking technologies</h2>
          <p>We may use cookies, web beacons, and similar tracking technologies to improve your experience on our website and deliver targeted advertisements. You can manage your cookie preferences through your browser settings.</p>

          <h2>7. Third-party links</h2>
          <p>Our website may contain links to third-party websites that are not operated by us. We are not responsible for the content or privacy practices of these external sites. We recommend reviewing their privacy policies before providing any personal information.</p>

          <h2>8. Changes to this Privacy Policy</h2>
          <p>We may update this Privacy Policy to reflect changes in our practices or for other operational, legal, or regulatory reasons. We will post any updates on this page with a revised effective date. We encourage you to review this policy periodically.</p>
        </div>
      </section>
    </>
  );
}
