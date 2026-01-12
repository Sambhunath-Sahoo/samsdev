"use client";

import { Github, Linkedin } from "lucide-react";
import { getUser } from "@/lib/content/user";

export function Footer() {
  const userData = getUser();

  return (
    <footer className="py-8 container-padding border-t border-border">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-small text-muted-foreground">
          © {new Date().getFullYear()} {userData.name}. All rights reserved.
        </p>
        <div className="flex items-center gap-4">
          <a
            href={userData.github}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground transition-colors"
            aria-label="GitHub"
          >
            <Github className="h-5 w-5" />
          </a>
          <a
            href={userData.linkedin}
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

