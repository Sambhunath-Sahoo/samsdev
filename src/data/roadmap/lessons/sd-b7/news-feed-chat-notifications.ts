import type { LessonEntry } from "@/types/roadmap";

export const NEWS_FEED_CHAT_NOTIFICATIONS: LessonEntry = {
  track: "system-design",
  section: "Classic case studies",
  subsection: {
    title: "Social and messaging: news feed, chat, notifications",
    slug: "case-news-feed-chat-notifications",
    lesson: {
      summary: "Three fan-out problems: push the work to write time for feeds, keep long-lived connections for chat, and hand off to providers for notifications.",
      minutes: 10,
      blocks: [
        { type: "h2", text: "News feed: fan-out on write versus read" },
        { type: "p", text: "Requirements: a user posts, followers see it in a ranked or reverse-chronological feed within seconds. Estimates: 300M daily users, each opens the feed 10 times a day, so about 35,000 feed reads per second against perhaps 3,000 posts per second. Reads dominate, so make reads cheap." },
        { type: "p", text: "**Fan-out on write** (push): when a user posts, copy the post id into the feed list of every follower, typically a Redis list or a wide-column row per user. Reading is one lookup. Cost: a user with 50 followers costs 50 writes, a celebrity with 50 million costs 50 million." },
        { type: "p", text: "**Fan-out on read** (pull): store posts once; at read time fetch the latest posts of everyone you follow and merge. Writes are cheap, reads are expensive and slow." },
        { type: "table", head: ["", "Push", "Pull"], rows: [
          ["Read latency", "Very low", "Grows with follows"],
          ["Write cost", "Followers per post", "One"],
          ["Celebrity problem", "Severe", "None"],
          ["Wasted work", "Inactive followers", "Repeated merges"],
        ] },
        { type: "p", text: "The standard answer is a hybrid: push for normal accounts, skip push for accounts above a follower threshold (say 100,000), and merge those few celebrity posts in at read time. Also skip pushing to users inactive for 30 days. Store ids only; hydrate post bodies from a cache." },
        { type: "h2", text: "Chat: connections, ordering and presence" },
        { type: "p", text: "Clients hold a **WebSocket** to a chat server because the server must push messages. A connection registry (user id to server, in Redis) tells the sender's server where to forward. Sending flow: client sends, server persists the message, then forwards to the recipient's server, or queues it if the recipient is offline and sends a push notification." },
        { type: "p", text: "Ordering only matters within a conversation. Give each conversation a monotonically increasing sequence number, assigned by whichever node owns that conversation, and have clients sort by it. Wall-clock timestamps from different servers are not safe for this. Store messages partitioned by conversation id and clustered by sequence so history is one range scan." },
        { type: "p", text: "Presence: each client sends a heartbeat every 5 to 10 seconds; the server sets a key with a TTL slightly longer. No heartbeat means offline. Do not broadcast every change to every friend; fan out presence only to users who have the conversation or friend list open." },
        { type: "h2", text: "Notification system: fan-out and delivery" },
        { type: "p", text: "Flow: a service calls the notification API with a user, a template and a channel preference. The API validates, checks user settings and rate limits, then writes to a queue per channel (push, email, SMS). Workers pull from the queue and call the providers (APNs, FCM, an email service). Separating queues means a slow SMS provider does not delay push." },
        { type: "list", items: [
          "**At-least-once delivery**: workers retry with backoff, so the same notification can arrive twice. Give each one an id and dedupe at the worker.",
          "**Priority**: a login code must not wait behind a marketing blast of 5 million emails; use separate queues.",
          "**Templates and preferences** live in a database; the payload carries only ids and variables.",
          "**Tracking**: record sent, delivered and failed states so you can answer why a user did not get something.",
        ] },
        { type: "callout", tone: "gotcha", title: "Hot partitions in feeds and chat", text: "A celebrity post or a huge group chat concentrates writes on one key. Candidates should say how they cap group size, batch the fan-out through a queue, or fall back to pull for that key, rather than assuming load spreads evenly." },
      ],
      references: [
        { title: "Timelines at Scale (InfoQ, Twitter)", url: "https://www.infoq.com/presentations/Twitter-Timeline-Scalability/" },
        { title: "RFC 6455: The WebSocket Protocol", url: "https://www.rfc-editor.org/rfc/rfc6455" },
        { title: "How Discord Stores Trillions of Messages", url: "https://discord.com/blog/how-discord-stores-trillions-of-messages" },
        { title: "What is Amazon SNS?", url: "https://docs.aws.amazon.com/sns/latest/dg/welcome.html" },
      ],
    },
  },
};
