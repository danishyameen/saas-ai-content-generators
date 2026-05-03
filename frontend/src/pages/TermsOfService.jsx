import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FileText, ArrowLeft } from 'lucide-react';

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

export default function TermsOfService() {
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
            <FileText size={32} className="text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold mb-2">Terms of Service</h1>
            <p className="text-dark-400">Last updated: April 30, 2026</p>
          </div>
        </motion.div>

        <motion.div variants={item} className="card space-y-8">
          <section>
            <h2 className="text-2xl font-bold mb-4 text-primary-400">1. Acceptance of Terms</h2>
            <p className="text-dark-300 leading-relaxed">
              By accessing or using Genifai ("Service"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, you may not access or use the Service. These Terms apply to all visitors, users, and others who access or use the Service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-primary-400">2. Description of Service</h2>
            <p className="text-dark-300 leading-relaxed">
              Genifai is an AI-powered content generation platform that provides tools for creating product descriptions, SEO content, advertisements, business ideas, social media content, competitor analysis, and marketing campaigns. The Service uses artificial intelligence technology to generate content based on user prompts.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-primary-400">3. User Accounts</h2>
            <div className="space-y-4 text-dark-300">
              <div>
                <h3 className="text-lg font-semibold mb-2 text-white">3.1 Account Creation</h3>
                <p className="leading-relaxed">
                  To use certain features of the Service, you must register for an account. You agree to provide accurate, current, and complete information during registration and to update such information to keep it accurate, current, and complete.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2 text-white">3.2 Account Security</h3>
                <p className="leading-relaxed">
                  You are responsible for safeguarding your account password and for any activities or actions under your account. You must notify us immediately of any unauthorized use of your account or any other breach of security.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2 text-white">3.3 Account Termination</h3>
                <p className="leading-relaxed">
                  We reserve the right to suspend or terminate your account at any time for any reason, including violation of these Terms, without prior notice or liability.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-primary-400">4. Subscription Plans and Payments</h2>
            <div className="space-y-4 text-dark-300">
              <div>
                <h3 className="text-lg font-semibold mb-2 text-white">4.1 Plans</h3>
                <p className="leading-relaxed mb-2">We offer the following subscription plans:</p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li><strong>Free Plan:</strong> 10 AI requests per day</li>
                  <li><strong>Pro Plan:</strong> 100 AI requests per day for 30 days ($20/month)</li>
                  <li><strong>Enterprise Plan:</strong> Unlimited AI requests for 90 days ($50/3 months)</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2 text-white">4.2 Payment</h3>
                <p className="leading-relaxed">
                  Payments are processed through our payment providers. By providing payment information, you represent that you are authorized to use the payment method. All fees are non-refundable unless otherwise stated.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2 text-white">4.3 Manual Approval</h3>
                <p className="leading-relaxed">
                  Pro and Enterprise plan activations require manual approval by our admin team. Once payment is verified, your plan will be activated within 24-48 hours.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-primary-400">5. Usage Limits and Restrictions</h2>
            <div className="space-y-4 text-dark-300">
              <p className="leading-relaxed">You agree not to:</p>
              <ul className="list-disc list-inside ml-4 space-y-2">
                <li>Use the Service for any illegal or unauthorized purpose</li>
                <li>Violate any laws in your jurisdiction</li>
                <li>Infringe upon or violate our intellectual property rights or the rights of others</li>
                <li>Submit false, misleading, or fraudulent information</li>
                <li>Upload viruses or malicious code</li>
                <li>Attempt to bypass usage limits or access restrictions</li>
                <li>Use automated systems (bots, scrapers) to access the Service</li>
                <li>Resell or redistribute the Service without authorization</li>
                <li>Generate content that is harmful, offensive, or violates third-party rights</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-primary-400">6. Intellectual Property Rights</h2>
            <div className="space-y-4 text-dark-300">
              <div>
                <h3 className="text-lg font-semibold mb-2 text-white">6.1 Service Content</h3>
                <p className="leading-relaxed">
                  The Service and its original content, features, and functionality are owned by Genifai and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2 text-white">6.2 User-Generated Content</h3>
                <p className="leading-relaxed">
                  You retain ownership of content you generate using the Service. However, AI-generated content may not be unique, and similar content may be generated for other users. You are responsible for ensuring that your use of generated content complies with applicable laws and does not infringe third-party rights.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-primary-400">7. Content Accuracy and Liability</h2>
            <p className="text-dark-300 leading-relaxed">
              AI-generated content is provided "as is" without warranties of any kind. We do not guarantee the accuracy, completeness, or reliability of generated content. You are solely responsible for reviewing, editing, and verifying all content before use. We are not liable for any damages resulting from your use of AI-generated content.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-primary-400">8. Affiliate Program</h2>
            <p className="text-dark-300 leading-relaxed">
              Our affiliate program allows users to earn commissions by referring new customers. Affiliate terms, commission rates, and payout conditions are subject to our separate Affiliate Program Agreement. We reserve the right to modify or terminate the affiliate program at any time.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-primary-400">9. Disclaimer of Warranties</h2>
            <p className="text-dark-300 leading-relaxed">
              THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT. WE DO NOT WARRANT THAT THE SERVICE WILL BE UNINTERRUPTED, SECURE, OR ERROR-FREE.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-primary-400">10. Limitation of Liability</h2>
            <p className="text-dark-300 leading-relaxed">
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, GENIFAI SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES, WHETHER INCURRED DIRECTLY OR INDIRECTLY, OR ANY LOSS OF DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES RESULTING FROM YOUR USE OF THE SERVICE.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-primary-400">11. Indemnification</h2>
            <p className="text-dark-300 leading-relaxed">
              You agree to indemnify, defend, and hold harmless Genifai and its officers, directors, employees, and agents from any claims, liabilities, damages, losses, and expenses, including reasonable attorneys' fees, arising out of or in any way connected with your access to or use of the Service or your violation of these Terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-primary-400">12. Modifications to Service and Terms</h2>
            <p className="text-dark-300 leading-relaxed">
              We reserve the right to modify or discontinue the Service at any time without notice. We may also modify these Terms at any time. Continued use of the Service after changes constitutes acceptance of the modified Terms. We will notify users of material changes via email or through the Service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-primary-400">13. Governing Law</h2>
            <p className="text-dark-300 leading-relaxed">
              These Terms shall be governed by and construed in accordance with the laws of Pakistan, without regard to its conflict of law provisions. Any disputes arising from these Terms or the Service shall be subject to the exclusive jurisdiction of the courts of Karachi, Pakistan.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-primary-400">14. Contact Information</h2>
            <p className="text-dark-300 leading-relaxed mb-4">
              If you have any questions about these Terms, please contact us:
            </p>
            <div className="bg-dark-900 rounded-lg p-4 space-y-2 text-dark-300">
              <p><strong className="text-white">Email:</strong> support@genifai.com</p>
              <p><strong className="text-white">Phone:</strong> +923132942320</p>
              <p><strong className="text-white">Address:</strong> Bhorapir Aslam Road, Karachi South, Sindh, Pakistan</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-primary-400">15. Severability</h2>
            <p className="text-dark-300 leading-relaxed">
              If any provision of these Terms is found to be unenforceable or invalid, that provision will be limited or eliminated to the minimum extent necessary so that these Terms will otherwise remain in full force and effect.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-primary-400">16. Entire Agreement</h2>
            <p className="text-dark-300 leading-relaxed">
              These Terms constitute the entire agreement between you and Genifai regarding the Service and supersede all prior agreements and understandings, whether written or oral.
            </p>
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
