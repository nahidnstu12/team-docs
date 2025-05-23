import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="py-16 border-t bg-background">
      <div className="container px-4 mx-auto">
        <div className="flex flex-col justify-between md:flex-row">
          <div className="mb-10 md:mb-0">
            <div className="flex items-center mb-4">
              <Image src="/logo.svg" alt="Team Docs Logo" width={32} height={32} className="mr-2" />
              <span className="text-xl font-bold">Team Docs</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-10">
            <div>
              <h3 className="mb-4 font-semibold">Community</h3>
              <ul className="space-y-2">
                {communityLinks.map((link, index) => (
                  <li key={index}>
                    <Link
                      href={link.href}
                      className="transition-colors text-muted-foreground hover:text-foreground"
                    >
                      {link.text}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="mb-4 font-semibold">Company</h3>
              <ul className="space-y-2">
                {companyLinks.map((link, index) => (
                  <li key={index}>
                    <Link
                      href={link.href}
                      className="transition-colors text-muted-foreground hover:text-foreground"
                    >
                      {link.text}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div className="pt-8 mt-16 text-sm border-t border-muted text-muted-foreground">
          © {new Date().getFullYear()} Team Docs, Inc.
        </div>
      </div>
    </footer>
  );
}

const communityLinks = [
  { text: "Contact Us", href: "/contact" },
  { text: "Email", href: "mailto:contact@teamdocs.com" },
  { text: "WhatsApp", href: "https://wa.me/1234567890" },
  { text: "Telegram", href: "https://t.me/teamdocs" },
];

const companyLinks = [
  { text: "About", href: "/about" },
  { text: "Terms of Use", href: "/terms" },
];
