import { Link } from "react-router-dom";
import { Twitter, Github, Linkedin, ChevronDown } from "lucide-react";
import { useState } from "react";

const FooterSection = ({ title, links }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-white/5 md:border-none pb-4 md:pb-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between text-sm font-semibold text-zinc-100 md:mb-4 md:cursor-default"
      >
        {title}
        <ChevronDown
          className={`h-4 w-4 text-zinc-500 transition-transform md:hidden ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      <ul
        className={`space-y-3 overflow-hidden transition-all duration-300 md:block ${
          isOpen
            ? "mt-4 max-h-48 opacity-100"
            : "max-h-0 opacity-0 md:max-h-none md:opacity-100"
        }`}
      >
        {links.map((link) => (
          <li key={link.to}>
            <Link
              to={link.to}
              className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors block py-1 cursor-pointer"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export const Footer = () => {
  const productLinks = [
    { to: "/features", label: "Features" },
    { to: "/method", label: "Method" },
    { to: "/integrations", label: "Integrations" },
    { to: "/changelog", label: "Changelog" },
  ];

  const companyLinks = [
    { to: "/about", label: "About" },
    { to: "/blog", label: "Blog" },
    { to: "/contact", label: "Contact" },
  ];

  const legalLinks = [
    { to: "/privacy", label: "Privacy" },
    { to: "/terms", label: "Terms" },
    { to: "/security", label: "Security" },
  ];

  return (
    <footer className="border-t border-white/5 bg-zinc-950 pt-16 pb-12 transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-1 sm:col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <img src="/favicon.svg" alt="KanFlow" className="h-6 w-6" />
              <span className="font-semibold text-zinc-100">KanFlow</span>
            </div>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6">
              Designed for modern software teams.
            </p>
            <div className="flex gap-4">
              <a
                href="https://twitter.com"
                className="text-zinc-400 hover:text-zinc-300 transition-colors cursor-pointer"
                rel="noopener noreferrer"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="https://github.com"
                className="text-zinc-400 hover:text-zinc-300 transition-colors cursor-pointer"
                rel="noopener noreferrer"
              >
                <Github className="h-5 w-5" />
              </a>
              <a
                href="https://linkedin.com"
                className="text-zinc-400 hover:text-zinc-300 transition-colors cursor-pointer"
                rel="noopener noreferrer"
              >
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          <FooterSection title="Product" links={productLinks} />
          <FooterSection title="Company" links={companyLinks} />
          <FooterSection title="Legal" links={legalLinks} />
        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-zinc-400 text-center md:text-left">
            © 2026 KanFlow Inc. All rights reserved.
          </p>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-xs text-zinc-500">
              All systems operational
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
