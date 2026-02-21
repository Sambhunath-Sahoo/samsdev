import { Github, Linkedin } from "lucide-react";
import { getAbout } from "@/lib/content/about";
import { getContacts } from "@/lib/content/contacts";

export async function Footer() {
  const [about, contacts] = await Promise.all([getAbout(), getContacts()]);
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-8 container-padding border-t border-border">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-small text-muted-foreground">
          © {currentYear} {about?.nickname ?? "Sams"}. All rights reserved.
        </p>
        <div className="flex items-center gap-4">
          <a
            href={contacts?.github ?? "https://github.com/Sambhunath-Sahoo"}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground transition-colors"
            aria-label="GitHub"
          >
            <Github className="h-5 w-5" />
          </a>
          <a
            href={contacts?.linkedin ?? "https://linkedin.com/in/sams25/"}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground transition-colors"
            aria-label="LinkedIn"
          >
            <Linkedin className="h-5 w-5" />
          </a>
        </div>
      </div>
    </footer>
  );
}

