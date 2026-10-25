import type { LessonEntry } from "@/types/roadmap";

export const TEXT_TOOLS_AND_PIPES: LessonEntry = {
  track: "devops",
  section: "Linux and shell",
  subsection: {
    title: "Text tools and pipes: grep, sed, awk",
    slug: "text-tools-and-pipes",
    lesson: {
      summary: "Chain small tools with pipes to search, rewrite and summarise logs and config files from the command line.",
      minutes: 9,
      blocks: [
        { type: "h2", text: "The idea: small tools joined by pipes" },
        { type: "p", text: "Unix programs read text from standard input and write text to standard output. The pipe `|` connects one program's output to the next one's input, so you build the answer in steps. Redirects send streams to files: `>` overwrites, `>>` appends, `2>` redirects errors, and `2>&1` merges errors into the normal output." },
        { type: "h2", text: "grep: find lines" },
        { type: "code", language: "bash", code: `grep -i error app.log             # case-insensitive match
grep -rn "TODO" src/              # recursive, with line numbers
grep -v healthcheck access.log    # invert: drop matching lines
grep -E "5[0-9]{2} " access.log   # extended regex: status 500-599
grep -c " 404 " access.log        # count matching lines` },
        { type: "h2", text: "sed: rewrite lines" },
        { type: "p", text: "`sed` is a stream editor. Its everyday use is substitution with `s/old/new/`." },
        { type: "code", language: "bash", code: `sed 's/localhost/db.internal/' config.ini      # print result
sed -i.bak 's/^DEBUG=.*/DEBUG=false/' .env     # edit in place, keep .env.bak
sed -n '10,20p' app.log                        # print only lines 10-20
sed '/^#/d;/^$/d' nginx.conf                   # drop comments and blank lines` },
        { type: "h2", text: "awk: work with columns" },
        { type: "p", text: "`awk` splits each line into fields (`$1`, `$2`, ... `$NF` for the last) on whitespace and runs a small program per line. It is the tool for summing and grouping." },
        { type: "code", language: "bash", code: `awk '{print $1, $9}' access.log                 # IP and status
awk '$9 >= 500 {n++} END {print n+0, "server errors"}' access.log
awk -F: '{print $1, $7}' /etc/passwd            # custom separator` },
        { type: "h2", text: "A pipeline in practice" },
        { type: "p", text: "Question: which five client IPs hit the server most in an nginx access log?" },
        { type: "code", language: "bash", code: `awk '{print $1}' access.log | sort | uniq -c | sort -rn | head -5` },
        { type: "list", items: ["`awk` pulls out the first field, the client IP.", "`sort` groups equal IPs next to each other; `uniq -c` only collapses adjacent duplicates and counts them.", "`sort -rn` orders by count, largest first; `head -5` keeps five."] },
        { type: "p", text: "Add `cut`, `tr`, `wc -l`, `xargs` and `tee` and you can answer most log questions without leaving the shell. Use `less +F` or `tail -f` to follow a growing file." },
        { type: "callout", tone: "gotcha", title: "sed -i differs between systems", text: "GNU sed (Linux) accepts `sed -i 's/a/b/' file`. BSD sed (macOS) requires a suffix argument, so use `-i ''` there or `-i.bak` on both. A script that works on your laptop can fail in a Linux container, and the other way round. Also quote your patterns in single quotes so the shell does not expand `$` and `*` before the tool sees them." },
      ],
      references: [
        { title: "GNU Grep manual", url: "https://www.gnu.org/software/grep/manual/grep.html" },
        { title: "GNU sed manual", url: "https://www.gnu.org/software/sed/manual/sed.html" },
        { title: "The GNU Awk User's Guide", url: "https://www.gnu.org/software/gawk/manual/gawk.html" },
      ],
    },
    points: [
      { id: "devops.text-tools-and-pipes.pipes-redirects", title: "Pipes and redirects", detail: "A pipe feeds one command's output into the next. Redirects send stdout or stderr to files, and 2>&1 merges the two streams.", question: "What does command > out.txt 2>&1 do?" },
      { id: "devops.text-tools-and-pipes.grep", title: "Searching with grep", detail: "grep filters lines by pattern, with flags for case, inversion, recursion, line numbers and counts. -E gives extended regular expressions.", question: "How do you count the 404 lines in a log?" },
      { id: "devops.text-tools-and-pipes.sed-awk", title: "sed for edits, awk for columns", detail: "sed substitutes and deletes lines in a stream, and -i edits a file in place. awk splits lines into fields and can sum, count and filter on them.", question: "Which tool would you use to total the bytes column of an access log, and why?" },
      { id: "devops.text-tools-and-pipes.top-n", title: "The sort, uniq, head pattern", detail: "uniq only merges adjacent lines, so you sort first, count, sort by count, then take the top few. The pattern answers most top-N questions.", question: "Why must sort come before uniq -c?" },
    ],
  },
};
