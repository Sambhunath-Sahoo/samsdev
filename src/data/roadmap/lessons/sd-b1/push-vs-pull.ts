import type { LessonEntry } from "@/types/roadmap";

export const PUSH_VS_PULL: LessonEntry = {
  track: "system-design",
  section: "Networking and APIs",
  subsection: {
    title: "Push vs pull",
    slug: "push-vs-pull",
    lesson: {
      summary: "Push sends data to the consumer as it happens; pull lets the consumer fetch at its own pace, and the choice decides who controls the rate.",
      minutes: 6,
      blocks: [
        { type: "h2", text: "Who starts the transfer" },
        { type: "p", text: "In a **push** model the producer sends data to the consumer when something changes: a webhook, a WebSocket message, a mobile push notification. In a **pull** model the consumer asks when it is ready: a client polling an API, a worker reading from a queue, a metrics server scraping an endpoint. The same question appears everywhere: who knows best when to move the data, and who gets overwhelmed if the rates differ?" },
        { type: "table", head: ["", "Push", "Pull"], rows: [["Freshness", "Immediate", "Up to the polling interval"], ["Back-pressure", "Hard: producer can flood a slow consumer", "Natural: consumer takes what it can handle"], ["Producer needs to know", "Every consumer's address and state", "Nothing about consumers"], ["Idle cost", "None", "Empty requests"], ["Failure handling", "Producer must retry and track delivery", "Consumer just asks again"]] },
        { type: "h2", text: "Examples in real systems" },
        { type: "list", items: ["**Kafka consumers pull.** Each consumer reads from an offset at its own speed, so a slow consumer falls behind without hurting others, and it can rewind to reprocess.", "**Prometheus pulls** metrics by scraping targets. It knows immediately when a target is down because the scrape fails, and targets need no knowledge of the monitoring system.", "**Webhooks push**. Stripe calls your URL when a payment succeeds, so you avoid polling, but you must handle retries, duplicates and out-of-order events.", "**News feeds** choose per user: push a post into followers' timelines at write time (fan-out on write) or pull and merge at read time."] },
        { type: "h2", text: "Fan-out on write versus on read" },
        { type: "p", text: "Push at write time makes reads cheap: a user's timeline is a single list lookup. It is expensive when one author has 10 million followers, since a single post becomes 10 million writes. Pull at read time stores the post once and merges at request time, which is cheap to write and slow to read. Large systems combine the two: push for ordinary accounts, pull for celebrities, merged when the timeline is loaded." },
        { type: "h2", text: "Making push safe" },
        { type: "p", text: "Pure push needs a delivery guarantee. The usual design puts a durable queue between producer and consumer, retries with backoff, and gives every message an id so receivers can deduplicate." },
        { type: "code", language: "text", title: "Hybrid: push a hint, pull the data", code: `producer -> (push) "order 42 changed" -> consumer
consumer -> (pull) GET /orders/42      # fetch latest state at its own pace` },
        { type: "p", text: "That hybrid is common: the notification is tiny and can be lost or duplicated safely because the consumer always fetches the current state. It also avoids sending stale payloads." },
        { type: "callout", tone: "gotcha", title: "Push without back-pressure", text: "Pushing at full speed to a slow consumer fills its memory or your retry queue. Interviewers often probe this: say how the consumer signals it is overloaded, or choose pull so that signal is built in." },
      ],
      references: [
        { title: "Prometheus: When to use the Pushgateway", url: "https://prometheus.io/docs/practices/pushing/" },
        { title: "Prometheus FAQ: Why do you pull rather than push?", url: "https://prometheus.io/docs/introduction/faq/" },
        { title: "Apache Kafka Documentation", url: "https://kafka.apache.org/documentation/" },
      ],
    },
    points: [
      { id: "sd.push-vs-pull.back-pressure", title: "Back-pressure decides the model", detail: "Pull lets a consumer take work at its own rate, so a slow consumer never gets flooded. Push needs an explicit mechanism such as a queue, rate limit or acknowledgement window.", question: "A producer emits 5,000 events per second and a consumer handles 1,000. What happens under push and under pull?" },
      { id: "sd.push-vs-pull.fan-out", title: "Fan-out on write versus read", detail: "Pushing a post to each follower's timeline makes reads cheap and writes costly for popular accounts. Pulling at read time inverts that, and large feeds use a hybrid.", question: "How would you handle a user with 20 million followers in a timeline design?" },
      { id: "sd.push-vs-pull.push-a-hint", title: "Push a hint, pull the state", detail: "Send a small change notification and let the consumer fetch current data. Lost or duplicate notifications become harmless because the fetch is idempotent.", question: "Why can a hybrid of push and pull be safer than pushing the full payload?" },
    ],
  },
};
