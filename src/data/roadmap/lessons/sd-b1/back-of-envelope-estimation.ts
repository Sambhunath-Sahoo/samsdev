import type { LessonEntry } from "@/types/roadmap";

export const BACK_OF_ENVELOPE_ESTIMATION: LessonEntry = {
  track: "system-design",
  section: "Foundations",
  subsection: {
    title: "Back-of-envelope estimation",
    slug: "back-of-envelope-estimation",
    lesson: {
      summary: "Rough arithmetic on users, requests, bytes and latency tells you whether a design needs one box or a fleet.",
      minutes: 8,
      blocks: [
        { type: "h2", text: "Why estimate at all" },
        { type: "p", text: "Estimates decide architecture. 50 writes per second fits on one database; 50,000 does not. 2 TB of data fits on one disk; 2 PB does not. You are not after precision, only the right order of magnitude, so round aggressively and write your assumptions down." },
        { type: "h2", text: "Numbers to memorize" },
        { type: "list", items: ["A day has about 86,400 seconds; round to **100,000** (10^5).", "A month is about 2.5 million seconds; a year about 30 million.", "1 KB = 10^3 bytes, 1 MB = 10^6, 1 GB = 10^9, 1 TB = 10^12.", "Typical sizes: a tweet-like text row about 300 bytes, a JSON API response 1-10 KB, a photo 200 KB-2 MB, a minute of video 5-50 MB depending on quality."] },
        { type: "h2", text: "Traffic: QPS" },
        { type: "p", text: "Start from users and per-user behaviour. QPS is requests per day divided by 86,400, then multiplied by a peak factor of roughly 2-5 because traffic is not flat." },
        { type: "code", language: "text", title: "Example: a photo-sharing feed", code: `10M daily active users, each opens the feed 5 times/day
reads/day = 50M              -> 50M / 10^5 = 500 avg read QPS -> ~1,500 peak
1M photos uploaded/day       -> 10 avg write QPS  -> ~30 peak
read:write ratio = 50:1      -> a read-heavy system: cache, replicas, CDN` },
        { type: "h2", text: "Storage and bandwidth" },
        { type: "p", text: "Storage is items per day, times size, times retention, times replication. Bandwidth is bytes per second: QPS times response size." },
        { type: "code", language: "text", code: `Storage:   1M photos/day x 500 KB = 500 GB/day
           x 365 days x 3 replicas = ~550 TB/year
Egress:    1,500 peak read QPS x 20 photos x 200 KB thumbnails = 6 GB/s ~ 48 Gbps
           -> a CDN is not optional` },
        { type: "p", text: "Notice that the bandwidth number, not the database, settled the design here. Always finish by saying what the number implies: shard or not, cache or not, how many servers." },
        { type: "p", text: "For servers, assume one well-tuned application server handles on the order of 1,000-5,000 simple requests per second, and a single relational database on decent hardware handles roughly 5,000-20,000 simple queries per second. These vary widely with workload, so state them as assumptions." },
        { type: "h2", text: "Latency numbers to know" },
        { type: "table", head: ["Operation", "Rough time"], rows: [["CPU cache or main memory read", "1-100 ns"], ["Read 1 MB from memory", "tens of microseconds"], ["SSD random read", "~100 microseconds"], ["Round trip in the same data centre", "~0.5 ms"], ["Read 1 MB from SSD, sequential", "~0.5-1 ms"], ["Disk seek (spinning)", "~10 ms"], ["Round trip across continents", "~100-150 ms"]] },
        { type: "p", text: "The useful ratios: memory is roughly 1,000 times faster than SSD and 100,000 times faster than a cross-continent network call. That is why caches work and why you avoid chatty calls between regions." },
        { type: "callout", tone: "tip", title: "Show the work", text: "Interviewers care about the chain of reasoning more than the final figure. Say each assumption out loud, use powers of ten, label units, and sanity check: if your estimate says one server holds all of YouTube, something is off." },
        { type: "callout", tone: "gotcha", title: "Average versus peak", text: "Sizing for average QPS is a frequent mistake. Provision for peak, and remember that replication multiplies storage while overhead such as indexes can add another 30-100% on top of raw data." },
      ],
      references: [
        { title: "Teach Yourself Programming in Ten Years (latency numbers)", url: "https://norvig.com/21-days.html" },
        { title: "Interactive Latency Numbers (Colin Scott)", url: "https://colin-scott.github.io/personal_website/research/interactive_latency.html" },
        { title: "The Tail at Scale (Google Research)", url: "https://research.google/pubs/the-tail-at-scale/" },
      ],
    },
  },
};
