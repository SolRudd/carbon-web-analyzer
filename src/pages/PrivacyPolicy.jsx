import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  FaShieldAlt, 
  FaCookieBite, 
  FaInfoCircle, 
  FaEnvelope, 
  FaArrowLeft,
  FaFileAlt,
  FaChartBar,
  FaLock
} from "react-icons/fa";
import { motion } from "framer-motion";
import SEO from '../components/SEO'; // ✅ 1. Import our new SEO component

export default function PrivacyPolicy() {

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.8, 
        ease: "easeOut" 
      } 
    },
  };

  return (
    <>
      {/* ✅ 2. Use the SEO component. It's much cleaner! */}
      <SEO
        title="Privacy Policy"
        description="Your trust is important. This policy explains how GreenTracer collects, uses, and protects your personal data and information in accordance with privacy regulations."
        imageUrl="https://www.greentracer.org/GreenFavi.png" 
      />

      <div 
        className="bg-white dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-300 min-h-screen flex flex-col"
      >
        <section className="relative overflow-hidden py-20 px-4 text-center bg-gradient-to-br from-greenbuzz/5 to-blue-400/5">
          <div className="relative z-10 max-w-4xl mx-auto space-y-6">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-3 bg-greenbuzz/10 dark:bg-green-400/10 px-6 py-3 rounded-full border border-greenbuzz/20 dark:border-green-400/20"
            >
              <FaShieldAlt className="text-greenbuzz dark:text-green-400" />
              <span className="text-greenbuzz dark:text-green-400 font-semibold">Our Commitment to Your Privacy</span>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-4xl md:text-6xl font-extrabold bg-gradient-to-r from-slate-900 via-greenbuzz to-green-600 dark:from-white dark:via-green-400 dark:to-blue-400 bg-clip-text text-transparent leading-tight"
            >
              Privacy Policy
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed"
            >
              Your trust is important to us. This policy explains how we collect, use, and protect your personal data.
            </motion.p>
          </div>
        </section>

        {/* The rest of your component content is perfect and doesn't need to change. */}
        <main className="flex-grow py-16 px-4">
          <div className="max-w-4xl mx-auto space-y-12">
            <motion.section 
              variants={sectionVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800"
            >
              <h2 className="text-3xl font-bold mb-6 text-greenbuzz dark:text-green-400 flex items-center">
                <FaInfoCircle className="mr-3 text-2xl" />
                Introduction
              </h2>
              <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed">
                GreenTracer ("we," "our," or "us") is committed to protecting the privacy of our website visitors and users. This Privacy Policy outlines the types of information we collect, how it's used, and the steps we take to safeguard your data. By using our website, you agree to the collection and use of information in accordance with this policy.
              </p>
            </motion.section>
            <motion.section 
              variants={sectionVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800"
            >
              <h2 className="text-3xl font-bold mb-6 text-greenbuzz dark:text-green-400 flex items-center">
                <FaFileAlt className="mr-3 text-2xl" />
                Information We Collect
              </h2>
              <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                We collect several types of information for various purposes to provide and improve our service to you.
              </p>
              <h3 className="text-2xl font-semibold text-slate-800 dark:text-white mb-3">Personal Data</h3>
              <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                While using our service, we may ask you to provide us with certain personally identifiable information that can be used to contact or identify you ("Personal Data"). Personally identifiable information may include, but is not limited to:
              </p>
              <ul className="list-disc list-inside text-lg text-slate-700 dark:text-slate-300 space-y-2 ml-4">
                <li>Email address (e.g., for newsletter subscriptions)</li>
                <li>First name and last name (e.g., for contact forms)</li>
                <li>Cookies and Usage Data</li>
              </ul>
              <h3 className="text-2xl font-semibold text-slate-800 dark:text-white mt-6 mb-3">Usage Data</h3>
              <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                We may also collect information on how the service is accessed and used ("Usage Data"). This Usage Data may include information such as your computer's Internet Protocol address (e.g., IP address), browser type, browser version, the pages of our service that you visit, the time and date of your visit, the time spent on those pages, unique device identifiers, and other diagnostic data.
              </p>
            </motion.section>
            <motion.section 
              variants={sectionVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800"
            >
              <h2 className="text-3xl font-bold mb-6 text-greenbuzz dark:text-green-400 flex items-center">
                <FaChartBar className="mr-3 text-2xl" />
                How We Use Your Information
              </h2>
              <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                GreenTracer uses the collected data for various purposes:
              </p>
              <ul className="list-disc list-inside text-lg text-slate-700 dark:text-slate-300 space-y-2 ml-4">
                <li>To provide and maintain our website</li>
                <li>To notify you about changes to our service</li>
                <li>To allow you to participate in interactive features of our service when you choose to do so</li>
                <li>To provide customer support</li>
                <li>To gather analysis or valuable information so that we can improve our service</li>
                <li>To monitor the usage of our service</li>
                <li>To detect, prevent and address technical issues</li>
                <li>To provide you with news, special offers and general information about other goods, services and events which we offer that are similar to those that you have already purchased or enquired about unless you have opted not to receive such information</li>
              </ul>
            </motion.section>
            <motion.section 
              variants={sectionVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800"
            >
              <h2 className="text-3xl font-bold mb-6 text-greenbuzz dark:text-green-400 flex items-center">
                <FaLock className="mr-3 text-2xl" />
                Data Security
              </h2>
              <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed">
                The security of your data is important to us, but remember that no method of transmission over the Internet, or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your Personal Data, we cannot guarantee its absolute security.
              </p>
            </motion.section>
            <motion.section 
              variants={sectionVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800"
            >
              <h2 className="text-3xl font-bold mb-6 text-greenbuzz dark:text-green-400 flex items-center">
                <FaCookieBite className="mr-3 text-2xl" />
                Cookies Policy
              </h2>
              <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                Cookies are small pieces of data stored on your device (computer or mobile device). We use cookies and similar tracking technologies to track the activity on our service and hold certain information.
              </p>
              <h3 className="text-2xl font-semibold text-slate-800 dark:text-white mb-3">How We Use Cookies</h3>
              <ul className="list-disc list-inside text-lg text-slate-700 dark:text-slate-300 space-y-2 ml-4 mb-4">
                <li>
                  <strong>Essential Cookies:</strong> These cookies are strictly necessary to provide you with services available through our website and to enable you to use some of its features.
                </li>
                <li>
                  <strong>Analytics / Performance Cookies:</strong> These cookies collect information about how visitors use our website, for instance, which pages visitors go to most often, and if they get error messages from web pages. These cookies do not collect information that identifies a visitor. All information these cookies collect is aggregated and therefore anonymous. It is only used to improve how a website works.
                </li>
              </ul>
              <h3 className="text-2xl font-semibold text-slate-800 dark:text-white mt-6 mb-3">Your Choices Regarding Cookies</h3>
              <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed">
                You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our service.
                Most web browsers allow some control of most cookies through the browser settings. To find out more about cookies, including how to see what cookies have been set and how to manage and delete them, visit <a href="https://www.allaboutcookies.org" target="_blank" rel="noopener noreferrer" className="text-greenbuzz dark:text-green-400 hover:underline">www.allaboutcookies.org</a>.
              </p>
            </motion.section>
            <motion.section 
              variants={sectionVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800"
            >
              <h2 className="text-3xl font-bold mb-6 text-greenbuzz dark:text-green-400 flex items-center">
                <FaInfoCircle className="mr-3 text-2xl" />
                Links to Other Websites
              </h2>
              <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed">
                Our service may contain links to other websites that are not operated by us. If you click on a third-party link, you will be directed to that third party's site. We strongly advise you to review the Privacy Policy of every site you visit. We have no control over and assume no responsibility for the content, privacy policies, or practices of any third-party sites or services.
              </p>
            </motion.section>
            <motion.section 
              variants={sectionVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800"
            >
              <h2 className="text-3xl font-bold mb-6 text-greenbuzz dark:text-green-400 flex items-center">
                <FaInfoCircle className="mr-3 text-2xl" />
                Changes to This Privacy Policy
              </h2>
              <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed">
                We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. We will let you know via email and/or a prominent notice on our service, prior to the change becoming effective and update the "effective date" at the top of this Privacy Policy. You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-4">
                <em>Last updated: August 3, 2025</em>
              </p>
            </motion.section>
            <motion.section 
              variants={sectionVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800"
            >
              <h2 className="text-3xl font-bold mb-6 text-greenbuzz dark:text-green-400 flex items-center">
                <FaEnvelope className="mr-3 text-2xl" />
                Contact Us
              </h2>
              <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed">
                If you have any questions about this Privacy Policy, please contact us:
              </p>
              <ul className="list-disc list-inside text-lg text-slate-700 dark:text-slate-300 space-y-2 ml-4 mt-4">
                <li>By email: <a href="mailto:privacy@greentracer.org" className="text-greenbuzz dark:text-green-400 hover:underline">privacy@greentracer.org</a></li>
              </ul>
            </motion.section>
          </div>
        </main>
        <div className="text-center py-8">
          <Link
            to="/"
            className="inline-flex items-center text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
          >
            <FaArrowLeft className="mr-2" />
            Back to Homepage
          </Link>
        </div>
      </div>
    </>
  );
}