// src/pages/PrivacyPolicy.jsx
import React from "react";
import { Link } from "react-router-dom";
import Title from "../components/Title";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl border-2 border-gray-200 p-8 sm:p-12">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl text-black mb-4">
            <Title text1={"Privacy"} text2={"Policy"} />
          </h1>
          <p className="text-lg text-gray-600">
            Last updated: November 07, 2025
          </p>
        </div>

        <div className="prose prose-lg max-w-none text-gray-700 space-y-8 leading-relaxed">
          <section>
            <p className="text-base">
              At <strong>Phenz</strong>, we respect your privacy and are committed to protecting your personal information. 
              This Privacy Policy explains how we collect, use, and safeguard your data when you visit our website 
              <Link to="/" className="text-black underline font-medium"> phenz.com</Link> or make a purchase.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-black mb-4">1. Information We Collect</h2>
            <ul className="list-disc pl-8 space-y-3">
              <li><strong>Personal Information:</strong> Name, email address, phone number, delivery address, and payment details when you create an account or place an order.</li>
              <li><strong>Order Information:</strong> Items purchased, order total, delivery preferences, and tracking details.</li>
              <li><strong>Payment Information:</strong> Processed securely via Paystack. We do <strong>not store</strong> your card details.</li>
              <li><strong>Browsing Data:</strong> IP address, browser type, pages visited, and time spent on site (via cookies & analytics).</li>
              <li><strong>Communication:</strong> Emails, support messages, or reviews you send us.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-black mb-4">2. How We Use Your Information</h2>
            <p>We use your data to:</p>
            <ul className="list-disc pl-8 space-y-3 mt-3">
              <li>Process and deliver your orders</li>
              <li>Send order confirmations, tracking updates, and delivery notifications via email/SMS</li>
              <li>Improve your shopping experience (recommend products, show recently viewed items)</li>
              <li>Prevent fraud and secure your account</li>
              <li>Send promotional offers (only if you opt-in)</li>
              <li>Respond to customer support inquiries</li>
              <li>Comply with Nigerian law (NDPR) and tax requirements</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-black mb-4">3. How We Share Your Information</h2>
            <p>We <strong>never sell</strong> your personal data. We only share with trusted partners who help us run the store:</p>
            <ul className="list-disc pl-8 space-y-3 mt-3">
              <li><strong>Delivery Partners:</strong> Name, phone, and address for doorstep delivery</li>
              <li><strong>Paystack:</strong> Secure payment processing (PCI-DSS compliant)</li>
              <li><strong>Cloudinary:</strong> For hosting product images</li>
              <li><strong>Email/SMS Providers:</strong> For order updates (e.g., SendGrid, Termii)</li>
              <li><strong>Legal Authorities:</strong> Only if required by Nigerian law</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-black mb-4">4. Cookies & Tracking</h2>
            <p>
              We use cookies to remember your cart, login session, and preferences. 
              You can disable cookies in your browser, but some features (like checkout) may not work.
            </p>
            <p className="mt-4">
              We use <strong>Google Analytics</strong> to understand how visitors use our site. 
              You can opt out at{" "}
              <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noreferrer" className="text-black underline">
                google.com/dlpage/gaoptout
              </a>.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-black mb-4">5. Data Security</h2>
            <p>
              Your data is encrypted using SSL (HTTPS) and stored securely on protected servers. 
              Payment transactions are handled by Paystack — a certified Level 1 PCI DSS provider.
            </p>
            <p className="mt-4">
              We regularly audit our systems and limit access to authorized personnel only.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-black mb-4">6. Your Rights (NDPR & GDPR)</h2>
            <p>You have the right to:</p>
            <ul className="list-disc pl-8 space-y-3 mt-3">
              <li>Access your personal data</li>
              <li>Correct inaccurate information</li>
              <li>Request deletion of your account</li>
              <li>Opt out of marketing emails</li>
              <li>Withdraw consent at any time</li>
            </ul>
            <p className="mt-4">
              To exercise these rights, email us at{" "}
              <a href="mailto:support@phenz.com" className="text-black font-bold underline">
                support@phenz.com
              </a>
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-black mb-4">7. Data Retention</h2>
            <p>
              We keep your information only as long as needed:
            </p>
            <ul className="list-disc pl-8 space-y-2 mt-3">
              <li>Order history: 7 years (for tax & warranty)</li>
              <li>Account data: Until you delete your account</li>
              <li>Marketing preferences: Until you unsubscribe</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-black mb-4">8. Children's Privacy</h2>
            <p>
              Phenz is not intended for children under 18. We do not knowingly collect data from minors.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-black mb-4">9. Changes to This Policy</h2>
            <p>
              We may update this policy from time to time. Changes will be posted here with the updated date.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-black mb-4">10. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us:
            </p>
            <div className="bg-gray-100 rounded-2xl p-6 mt-6 font-medium">
              <p>Email: <a href="mailto:support@phenz.com" className="text-black underline">support@phenz.com</a></p>
              <p>Phone: <a href="tel:+2349012345678" className="text-black underline">+234 901 234 5678</a></p>
              <p>Address: 123 Fashion Street, Ibadan, Oyo State, Nigeria</p>
            </div>
          </section>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-16">
          <Link
            to="/"
            className="bg-black text-white px-16 py-3 text-sm"
            // inline-block bg-black text-white px-12 py-4 rounded-full text-lg font-bold hover:bg-gray-800 transition shadow-xl
          >
            Back to Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;