import type { LessonEntry } from "@/types/roadmap";

export const RECOMMENDATION_ENGINE_CASE_STUDY: LessonEntry = {
  track: "system-design",
  section: "Classic case studies",
  subsection: {
    title: "Recommendation engine",
    slug: "recommendation-engine-case-study",
    lesson: {
      summary: "Serve a personalised list from millions of items in under 200 ms by narrowing with candidate generation, then ranking, then filtering.",
      minutes: 9,
      blocks: [
        { type: "h2", text: "Requirements and estimates" },
        { type: "p", text: "Functional: for a given user and context (home page, item page), return a ranked list of items they are likely to want, update as they interact, and handle brand-new users and items. Non-functional: latency under 200 ms at the 99th percentile, high availability (fall back to popular items rather than show nothing), and fresh behaviour signals." },
        { type: "p", text: "Assume 50 million users, 5 million items, 20,000 recommendation requests a second at peak. Scoring all 5 million items with a heavy model for each request is 100 billion scorings a second, which is impossible. That one number justifies the whole architecture: **funnel from millions to thousands to tens**." },
        { type: "h2", text: "API and data model" },
        {
          type: "code",
          language: "text",
          title: "API and stored data",
          code: `GET  /recs?userId=u1&surface=home&limit=20  -> [{itemId, score, reason}]
POST /events  {userId, itemId, type: view|click|buy|like, ts}

interactions : (user_id, item_id, type, ts)       -- log, append-only
item_features: item_id -> category, price, text/image embedding
user_features: user_id -> recent items, tastes, embedding
item_embeddings: item_id -> vector(64)  -- in a vector index`,
        },
        { type: "h2", text: "Architecture" },
        { type: "p", text: "A request runs through four stages." },
        {
          type: "list",
          ordered: true,
          items: [
            "**Candidate generation** (millions to about 1,000): cheap, recall-oriented sources run in parallel and are merged. Examples: items similar to what the user recently engaged with, nearest neighbours of the user's embedding in an approximate nearest neighbour index, collaborative filtering (users like you also bought), and trending items in their region.",
            "**Ranking** (1,000 to 50): a model predicts, for each candidate, the probability of a click or purchase using user, item and context features. It is slower and more precise, and can afford hundreds of features because it sees only 1,000 items.",
            "**Re-ranking and filtering**: remove items already seen or bought, enforce business rules (stock, age rating, regional licences), and add diversity so the list is not 20 near-identical items. Insert some exploration so new items get impressions.",
            "**Serve**: return the list, log which items were shown and which were clicked. These logs become next training data.",
          ],
        },
        { type: "p", text: "Offline, a batch pipeline trains the embeddings and ranking model on the interaction log, say daily, and pushes artifacts to a model server and the vector index. Online, a **feature store** supplies the same features at training and serving time, avoiding training-serving skew. A streaming job updates fast-moving features (the last five items viewed) within seconds, while slow ones (long-term tastes) are precomputed nightly. For the heaviest traffic, precompute top-N lists per user and cache them, falling back to real-time computation for users without one." },
        {
          type: "table",
          head: ["Technique", "Strength", "Weakness"],
          rows: [
            ["Collaborative filtering", "Learns taste from behaviour, no item metadata needed", "Cold start for new users and items; popularity bias"],
            ["Content-based", "Works for new items", "Narrow, repeats what the user already likes"],
            ["Hybrid (embeddings from both)", "Covers both cases", "More moving parts"],
            ["Popularity fallback", "Always available", "Not personalised"],
          ],
        },
        { type: "h2", text: "Bottlenecks and trade-offs" },
        {
          type: "list",
          items: [
            "**Cold start**: new user, use context and popularity and ask for a few preferences; new item, use content features and force some exposure.",
            "**Feedback loop**: the model only learns about items it showed. Keep a small random or exploratory slice so it can discover better ones.",
            "**Freshness vs latency**: precomputed lists are fast but stale; real-time scoring is fresh but costly. Mix both.",
            "**Metrics**: offline accuracy does not guarantee better outcomes. Judge changes with online A/B tests on click-through, conversion and long-term retention.",
          ],
        },
        { type: "callout", tone: "gotcha", title: "Optimising clicks alone", text: "A model tuned only for clicks drifts toward clickbait and one popular genre. Include diversity, satisfaction signals and guardrail metrics, and say so when asked how you would measure success." },
        { type: "p", text: "Common interview mistakes: jumping straight to a neural network without the funnel, ignoring cold start, and forgetting that the system needs a way to log impressions so it can learn. A good answer also names the fallback: if the ranker times out, return the cached or popular list instead of an error." },
      ],
      references: [
        { title: "Google ML: Recommendation systems overview", url: "https://developers.google.com/machine-learning/recommendation/overview/types" },
        { title: "Google ML: Candidate generation overview", url: "https://developers.google.com/machine-learning/recommendation/overview/candidate-generation" },
        { title: "Google ML: Collaborative filtering basics", url: "https://developers.google.com/machine-learning/recommendation/collaborative/basics" },
        { title: "Deep Neural Networks for YouTube Recommendations", url: "https://research.google/pubs/deep-neural-networks-for-youtube-recommendations/" },
      ],
    },
    points: [
      { id: "sd.recommendation-engine-case-study.funnel", title: "Candidate generation then ranking", detail: "Cheap sources narrow millions of items to about a thousand candidates, then a heavier model ranks only those. Scoring every item per request is far too expensive.", question: "Why can't you run the ranking model over the whole catalogue on every request?" },
      { id: "sd.recommendation-engine-case-study.feature-store", title: "Feature store and offline-online split", detail: "Models train offline on the interaction log, while a feature store serves identical features online. Fast signals update through streaming and slow ones are precomputed.", question: "What is training-serving skew and how does a feature store reduce it?" },
      { id: "sd.recommendation-engine-case-study.cold-start-and-feedback", title: "Cold start and feedback loops", detail: "New users and items have no history, so rely on popularity, context and content features. Keep an exploration slice so the model sees outcomes for items it would not otherwise show.", question: "How does a brand-new item ever get recommended if it has no clicks?" },
    ],
  },
};
