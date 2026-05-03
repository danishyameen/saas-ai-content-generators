import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Shield, ArrowLeft } from 'lucide-react';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-dark-950">
      {/* Header */}
      <header className="border-b border-dark-800 bg-dark-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2 group">
              <motion.div
                whileHover={{ rotate: 180 }}
                transition={{ duration: 0.5 }}
                className="w-8 h-8 bg-gradient-to-br from-primary-500 to-purple-600 rounded-lg flex items-center justify-center"
              >
                <span className="text-white font-bold text-sm">AI</span>
              </motion.div>
              <span className="text-white font-bold group-hover:text-primary-400 transition-colors">Genifai</span>
            </Link>
            <Link to="/" className="btn-secondary text-sm">
              <ArrowLeft size={16} className="inline mr-2" />
              Back to Home
            </Link>
          </div>
        </div>
      </header>

      {/* Content */}
      <motion.div
        initial="hidden"
        animate="show"
        variants={container}
        className="container mx-auto px-4 py-12 max-w-4xl"
      >
        <motion.div variants={item} className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
            <Shield size={32} className="text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold mb-2">Privacy Policy</h1>
            <p className="text-dark-400">Last updated: April 30, 2026</p>
          </div>
        </motion.div>

        <motion.div variants={item} className="card space-y-8">
          <section>
            <h2 className="text-2xl font-bold mb-4 text-primary-400">1. Introduction</h2>
            <p className="text-dark-300 leading-relaxed">
              Welcome to Genifai ("we," "our," or "us"). We are committed to protecting your personal information and your right to privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our AI-powered content generation platform.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-primary-400">2. Information We Collect</h2>
            <div className="space-y-4 text-dark-300">
              <div>
                <h3 className="text-lg font-semibold mb-2 text-white">2.1 Personal Information</h3>
                <p className="leading-relaxed">We collect information that you provide directly to us, including:</p>
                <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                  <li>Name and email address</li>
                  <li>Company details (name, address, website, phone number)</li>
                  <li>Payment information (processed securely through our payment providers)</li>
                  <li>Account credentials (encrypted passwords)</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2 text-white">2.2 Usage Information</h3>
                <p className="leading-relaxed">We automatically collect certain information when you use our services:</p>
                <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                  <li>AI generation prompts and results</li>
                  <li>Usage statistics and request history</li>
                  <li>Device information and IP addresses</li>
                  <li>Browser type and operating system</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-primary-400">3. How We Use Your Information</h2>
            <p className="text-dark-300 leading-relaxed mb-3">We use the information we collect to:</p>
            <ul className="list-disc list-inside ml-4 space-y-2 text-dark-300">
              <li>Provide, maintain, and improve our AI generation services</li>
              <li>Process your transactions and manage your subscription</li>
              <li>Send you technical notices, updates, and support messages</li>
              <li>Respond to your comments, questions, and customer service requests</li>
              <li>Monitor and analyze trends, usage, and activities</li>
              <li>Detect, prevent, and address technical issues and fraudulent activity</li>
              <li>Personalize your experience and deliver relevant content</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-primary-400">4. Data Sharing and Disclosure</h2>
            <div className="space-y-4 text-dark-300">
              <p className="leading-relaxed">We do not sell your personal information. We may share your information in the following circumstances:</p>
              <ul className="list-disc list-inside ml-4 space-y-2">
                <li><strong>Service Providers:</strong> We share data with third-party vendors who perform services on our behalf (e.g., OpenAI for AI generation, payment processors, email services)</li>
                <li><strong>Legal Requirements:</strong> We may disclose information if required by law or in response to valid legal requests</li>
                <li><strong>Business Transfers:</strong> In connection with any merger, sale of company assets, or acquisition</li>
                <li><strong>With Your Consent:</strong> We may share information with your explicit consent</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-primary-400">5. Data Security</h2>
            <p className="text-dark-300 leading-relaxed">
              We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. This includes encryption of sensitive data, secure password hashing, and regular security audits. However, no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-primary-400">6. Data Retention</h2>
            <p className="text-dark-300 leading-relaxed">
              We retain your personal information for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required or permitted by law. When you delete your account, we will delete or anonymize your personal information within 30 days, except where we are required to retain it for legal or regulatory purposes.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-primary-400">7. Your Rights</h2>
            <p className="text-dark-300 leading-relaxed mb-3">Depending on your location, you may have the following rights:</p>
            <ul className="list-disc list-inside ml-4 space-y-2 text-dark-300">
              <li><strong>Access:</strong> Request access to your personal information</li>
              <li><strong>Correction:</strong> Request correction of inaccurate or incomplete data</li>
              <li><strong>Deletion:</strong> Request deletion of your personal information</li>
              <li><strong>Portability:</strong> Request a copy of your data in a structured format</li>
              <li><strong>Objection:</strong> Object to processing of your personal information</li>
              <li><strong>Restriction:</strong> Request restriction of processing</li>
            </ul>
            <p className="text-dark-300 leading-relaxed mt-4">
              To exercise these rights, please contact us at the email address provided below.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-primary-400">8. Cookies and Tracking</h2>
            <p className="text-dark-300 leading-relaxed">
              We use cookies and similar tracking technologies to track activity on our service and store certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-primary-400">9. Children's Privacy</h2>
            <p className="text-dark-300 leading-relaxed">
              Our service is not intended for children under the age of 13. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe your child has provided us with personal information, please contact us so we can delete it.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-primary-400">10. International Data Transfers</h2>
            <p className="text-dark-300 leading-relaxed">
              Your information may be transferred to and maintained on computers located outside of your state, province, country, or other governmental jurisdiction where data protection laws may differ. We take appropriate safeguards to ensure your data is treated securely and in accordance with this Privacy Policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-primary-400">11. Changes to This Privacy Policy</h2>
            <p className="text-dark-300 leading-relaxed">
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date. You are advised to review this Privacy Policy periodically for any changes.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-primary-400">12. Contact Us</h2>
            <p className="text-dark-300 leading-relaxed mb-4">
              If you have any questions about this Privacy Policy, please contact us:
            </p>
            <div className="bg-dark-900 rounded-lg p-4 space-y-2 text-dark-300">
              <p><strong className="text-white">Email:</strong> support@genifai.com</p>
              <p><strong className="text-white">Phone:</strong> +923132942320</p>
              <p><strong className="text-white">Address:</strong> Bhorapir Aslam Road, Karachi South, Sindh, Pakistan</p>
            </div>
          </section>
        </motion.div>

        <motion.div variants={item} className="mt-8 text-center">
          <Link to="/" className="btn-primary inline-flex items-center gap-2">
            <ArrowLeft size={18} />
            Back to Home
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
