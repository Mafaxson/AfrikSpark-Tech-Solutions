import { Link } from "react-router-dom";
import { Mail, MapPin, Phone } from "lucide-react";
import logo from "@/assets/afrikspark-logo.jpeg";

const footerLinks = {
  Company: [
    { label: "About", path: "/about" },
    { label: "Services", path: "/services" },
    { label: "Projects", path: "/projects" },
    { label: "Impact", path: "/impact" },
    { label: "Partners", path: "/partners" },
  ],
  Programs: [
    { label: "Digital Skills Scholarship", path: "/dss" },
    { label: "Venture Studio", path: "/venture-studio" },
    { label: "Community", path: "/community" },
    { label: "Blog", path: "/blog" },
  ],
  Legal: [
    { label: "Privacy Policy", path: "/privacy" },
    { label: "Terms of Service", path: "/terms" },
  ],
};

export function Footer() {
  return (
    <footer className="bg-foreground text-background">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <h3 className="font-display text-xl font-bold mb-4">
              Afrik<span className="text-primary">Spark</span>
            </h3>
            <p className="text-background/60 text-sm leading-relaxed mb-6">
              Empowering Africa through digital skills and technology innovation.
            </p>
            <div className="flex flex-col gap-2 text-sm text-background/60">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                Sierra Leone
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary" />
                info@afrikspark.com
              </div>
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-display font-semibold mb-4 text-sm uppercase tracking-wider text-background/40">
                {title}
              </h4>
              <ul className="flex flex-col gap-2">
                {links.map((link) => (
                  <li key={link.path}>
                    <Link
                      to={link.path}
                      className="text-sm text-background/60 hover:text-primary transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-background/10 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-background/40">
            © {new Date().getFullYear()} AfrikSpark Tech Solutions. All rights reserved.
          </p>
          <div className="flex gap-4">
            {["Twitter", "LinkedIn", "Facebook", "Instagram"].map((social) => (
              <a
                key={social}
                href="#"
                className="text-sm text-background/40 hover:text-primary transition-colors"
              >
                {social}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
