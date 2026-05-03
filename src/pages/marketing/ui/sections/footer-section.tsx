import { Link } from '@tanstack/react-router';
import { LinkedinIcon, GithubIcon, Mail } from 'lucide-react';

function FooterLink({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <Link
      to={to}
      className="text-13 text-secondary hover:text-primary transition-colors duration-150"
    >
      {children}
    </Link>
  );
}

export function FooterSection() {
  return (
    <footer className="w-full flex justify-center py-8 border-t border-subtle">
      <div className="w-full max-w-[1200px] mx-auto px-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-8">

          {/* Left — Branding */}
          <div className="flex flex-col gap-1">
            <span className="text-16 font-semibold text-primary">Collabifyy</span>
            <p className="text-13 text-secondary">
              Team collaboration without the tab switching.
            </p>
            <p className="text-13 text-tertiary mt-2">
              © 2026 Collabifyy
            </p>
            <p className="text-13 text-tertiary">
              Built and maintained by Sarthak
            </p>
          </div>

          {/* Center — Social links */}
          <div className="flex flex-col gap-2">
            <span className="text-13 font-semibold text-primary mb-1">Connect</span>
            <div className="flex flex-row gap-3">
              <a
                href="https://www.linkedin.com/in/its-sarthak-chaudhari/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="text-secondary hover:text-primary transition-colors duration-150"
              >
                <LinkedinIcon size={18} />
              </a>
              <a
                href="https://github.com/chill-czar"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="text-secondary hover:text-primary transition-colors duration-150"
              >
                <GithubIcon size={18} />
              </a>
              <a
                href="mailto:contact@collabifyy.com"
                aria-label="Email"
                className="text-secondary hover:text-primary transition-colors duration-150"
              >
                <Mail size={18} />
              </a>
            </div>
          </div>

          {/* Right — Nav links */}
          <div className="flex flex-col gap-2 text-right sm:items-end">
            <FooterLink to="/sign-up">Try Collabifyy</FooterLink>
            <a
              href="mailto:contact@collabifyy.com"
              className="text-13 text-secondary hover:text-primary transition-colors duration-150"
            >
              Contact
            </a>
          </div>

        </div>
      </div>
    </footer>
  );
}
