export type TokenKind = "plain" | "comment" | "string" | "keyword" | "flag";

export interface Token {
  readonly kind: TokenKind;
  readonly text: string;
}

const DOCKERFILE_WORDS = ["FROM", "AS", "RUN", "COPY", "ADD", "ENV", "ARG", "WORKDIR", "USER", "CMD", "ENTRYPOINT", "EXPOSE", "VOLUME", "HEALTHCHECK"];
const SHELL_WORDS = ["docker", "aws", "curl", "sudo", "mv", "chmod", "scp", "ssh", "cat", "mkdir", "echo", "exit", "git", "npm", "pnpm", "uv", "dnf", "systemctl", "usermod", "compose"];
const YAML_WORDS = ["services", "build", "image", "ports", "env_file", "depends_on", "healthcheck", "restart", "name", "args", "context", "condition", "test", "interval", "timeout", "retries"];
const INI_WORDS = ["sso_start_url", "sso_region", "sso_registration_scopes", "sso_session", "sso_account_id", "sso_role_name", "region", "output"];

const KEYWORDS: Readonly<Record<string, ReadonlySet<string>>> = {
  dockerfile: new Set(DOCKERFILE_WORDS),
  bash: new Set(SHELL_WORDS),
  yaml: new Set(YAML_WORDS),
  ini: new Set(INI_WORDS),
};

const HAS_COMMENTS = new Set(["dockerfile", "bash", "yaml", "ini"]);
const HAS_FLAGS = new Set(["dockerfile", "bash"]);

// Groups: 1 comment (a # at line start or after whitespace), 2 string, 3 flag (-x or --long after whitespace), 4 word.
const PATTERN = /((?:^|(?<=\s))#.*$)|("(?:[^"\\\n]|\\.)*"|'[^'\n]*')|((?<=\s)--?[A-Za-z][\w-]*)|([A-Za-z_][\w-]*)/gm;

/** Splits code into coloured tokens. The tokens always join back to the exact input. Unknown languages stay plain. */
export function highlight(code: string, language: string): Token[] {
  const words = KEYWORDS[language];
  if (!words) return [{ kind: "plain", text: code }];

  const tokens: Token[] = [];
  let cursor = 0;
  const push = (kind: TokenKind, text: string) => {
    if (text) tokens.push({ kind, text });
  };

  for (const match of code.matchAll(PATTERN)) {
    const text = match[0];
    const index = match.index ?? 0;
    let kind: TokenKind = "plain";
    if (match[1] !== undefined && HAS_COMMENTS.has(language)) kind = "comment";
    else if (match[2] !== undefined) kind = "string";
    else if (match[3] !== undefined && HAS_FLAGS.has(language)) kind = "flag";
    else if (match[4] !== undefined && words.has(text)) kind = "keyword";
    if (kind === "plain") continue;
    push("plain", code.slice(cursor, index));
    push(kind, text);
    cursor = index + text.length;
  }
  push("plain", code.slice(cursor));
  return tokens;
}
