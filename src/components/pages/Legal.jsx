import { PageLayout } from "../layout/PageLayout";
import { Link, useLocation } from "react-router-dom";

const legalContent = {
  privacy: {
    title: "Privacy Policy",
    content: (
      <>
        <p className="lead">
          We believe you should be in control of your data. This policy outlines
          how we collect, use, and protect your personal information when you
          use KanFlow.
        </p>

        <h3>1. Information We Collect</h3>
        <p>
          We collect information to provide better services to all our users.
          The types of information we collect include:
        </p>
        <ul>
          <li>
            <strong>Account Information:</strong> When you sign up for KanFlow,
            we collect your email address and authentication credentials. If you
            sign up via a third-party service (like GitHub or Google), we
            receive your email and basic profile information.
          </li>
          <li>
            <strong>Usage Data:</strong> We collect data about how you interact
            with our services, such as the pages you visit, the features you
            use, and the time spent on the platform. This helps us understand
            user needs and improve the product.
          </li>
          <li>
            <strong>Content:</strong> We store the tasks, boards, comments, and
            other content you create within KanFlow. This data is strictly yours
            and is used solely to provide the service.
          </li>
        </ul>

        <h3>2. How We Use Information</h3>
        <p>We use the information we collect for the following purposes:</p>
        <ul>
          <li>
            <strong>Provide and Maintain the Service:</strong> To authenticate
            you, store your data, and ensure the platform runs smoothly.
          </li>
          <li>
            <strong>Improve and Develop:</strong> To understand how users use
            KanFlow and to build new features that solve real problems.
          </li>
          <li>
            <strong>Communicate:</strong> To send you technical notices,
            updates, security alerts, and administrative messages. We may also
            send you product updates, though you can opt out of these at any
            time.
          </li>
        </ul>

        <h3>3. Data Ownership & Sharing</h3>
        <p>
          <strong>We do not sell your personal data.</strong> We only share your
          information in the following limited circumstances:
        </p>
        <ul>
          <li>
            <strong>With Service Providers:</strong> We use trusted third-party
            service providers (such as Supabase for database hosting and Vercel
            for deployment) to help us provide our services. These providers
            have limited access to your information and are contractually bound
            to protect it.
          </li>
          <li>
            <strong>For Legal Reasons:</strong> We may disclose information if
            we believe it is necessary to comply with a law, regulation, or
            valid legal process.
          </li>
        </ul>

        <h3>4. Data Retention</h3>
        <p>
          We retain your information for as long as your account is active or as
          needed to provide you the services. If you delete your account, we
          will delete your personal information and content from our active
          databases, subject to a reasonable delay for backup and disaster
          recovery purposes.
        </p>

        <h3>5. Your Rights</h3>
        <p>
          You have the right to access, correct, or delete your personal
          information. You can manage your account settings directly within the
          application. If you have any questions or requests regarding your
          data, please contact us.
        </p>
      </>
    ),
  },
  terms: {
    title: "Terms of Service",
    content: (
      <>
        <p className="lead">
          By using KanFlow, you agree to these terms. We've tried to keep them
          as fair and readable as possible.
        </p>

        <h3>1. Acceptance of Terms</h3>
        <p>
          By accessing or using KanFlow ("the Service"), you agree to be bound
          by these Terms of Service ("Terms"). If you do not agree to these
          Terms, you may not use the Service. Ideally, we want to build a tool
          that helps you, and if it doesn't, you shouldn't feel locked in.
        </p>

        <h3>2. Description of Service</h3>
        <p>
          KanFlow is a project management tool designed for speed and
          efficiency. We provide the Service on an "as is" and "as available"
          basis. We are constantly improving the Service, and features may
          change or be removed over time.
        </p>

        <h3>3. User Accounts</h3>
        <p>
          To use KanFlow, you must create an account. You are responsible for
          maintaining the security of your account and password. KanFlow cannot
          and will not be liable for any loss or damage from your failure to
          comply with this security obligation.
        </p>

        <h3>4. Acceptable Use</h3>
        <p>You agree not to use the Service to:</p>
        <ul>
          <li>Violate any laws or regulations.</li>
          <li>Infringe the intellectual property rights of others.</li>
          <li>Transmit any viruses, malware, or other malicious code.</li>
          <li>
            Attempt to gain unauthorized access to the Service or related
            systems.
          </li>
        </ul>

        <h3>5. Intellectual Property</h3>
        <p>
          You retain all rights to the content you post to the Service. By
          posting content, you grant us a worldwide, non-exclusive, royalty-free
          license to use, store, and display that content solely for the purpose
          of providing the Service to you.
        </p>
        <p>
          The KanFlow name, logo, and interface are protected by copyright and
          trademark laws. You may not use them without our prior written
          permission.
        </p>

        <h3>6. Termination</h3>
        <p>
          You may stop using the Service at any time. We reserve the right to
          suspend or terminate your access to the Service at any time, with or
          without cause, and with or without notice. In practice, we would only
          do this for serious violations of these Terms.
        </p>

        <h3>7. Limitation of Liability</h3>
        <p>
          To the maximum extent permitted by law, KanFlow shall not be liable
          for any indirect, incidental, special, consequential, or punitive
          damages, or any loss of profits or revenues, whether incurred directly
          or indirectly.
        </p>
      </>
    ),
  },
  security: {
    title: "Security",
    content: (
      <>
        <p className="lead">
          Security is not an afterthought; it's a core feature. We use
          enterprise-grade infrastructure to keep your data safe.
        </p>

        <h3>1. Infrastructure</h3>
        <p>
          KanFlow is built on top of Supabase, an open-source Firebase
          alternative that provides enterprise-grade database security. Our data
          is hosted in secure data centers with strict physical and logical
          access controls.
        </p>

        <h3>2. Data Encryption</h3>
        <ul>
          <li>
            <strong>In Transit:</strong> All data sent between your browser and
            our servers is encrypted using TLS 1.2 or higher. We score an "A+"
            on SSL Labs tests.
          </li>
          <li>
            <strong>At Rest:</strong> Your data is encrypted at rest in our
            database using industry-standard AES-256 encryption.
          </li>
        </ul>

        <h3>3. Authentication</h3>
        <p>
          We use secure, token-based authentication (JWTs) to manage user
          sessions. We do not store passwords in plain text; in fact, we rely on
          Supabase Auth which handles password hashing (bcrypt) and secure
          session management.
        </p>

        <h3>4. Backups and Reliability</h3>
        <p>
          Our database is automatically backed up daily to ensure data
          durability. We maintain redundant infrastructure to minimize downtime
          and ensure that you can access your tasks when you need them.
        </p>

        <h3>5. Vulnerability Disclosure</h3>
        <p>
          If you believe you have found a security vulnerability in KanFlow,
          please contact us immediately at security@kanflow.app. We appreciate
          your help in making KanFlow more secure and will work with you to
          resolve the issue promptly.
        </p>
      </>
    ),
  },
};

export const Legal = ({ type }) => {
  const data = legalContent[type] || legalContent.privacy;
  const location = useLocation();

  const links = [
    { name: "Privacy Policy", path: "/privacy" },
    { name: "Terms of Service", path: "/terms" },
    { name: "Security", path: "/security" },
  ];

  return (
    <PageLayout>
      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-24">
        <div className="flex flex-col lg:flex-row gap-16">
          {/* Sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            <nav className="space-y-1 sticky top-32">
              <h3 className="text-sm font-semibold text-zinc-100 mb-4 px-3">
                Legal
              </h3>
              {links.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`block px-3 py-2 text-sm rounded-lg transition-colors ${
                    location.pathname === link.path
                      ? "bg-zinc-800 text-white font-medium"
                      : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="flex-grow max-w-3xl">
            <h1 className="text-4xl font-bold tracking-tight text-white mb-8">
              {data.title}
            </h1>
            <div className="prose prose-invert prose-lg prose-zinc max-w-none">
              {data.content}
              <p className="text-zinc-500 text-sm mt-12 pt-12 border-t border-white/5">
                Last updated: January 27, 2026
              </p>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};
