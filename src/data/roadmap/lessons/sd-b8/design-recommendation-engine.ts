import type { LessonEntry } from "@/types/roadmap";

export const DESIGN_RECOMMENDATION_ENGINE: LessonEntry = {
  track: "system-design",
  section: "AI system design",
  subsection: {
    title: "Design a recommendation engine: candidate generation, then ranking",
    slug: "design-recommendation-engine",
    lesson: {
      summary: "Narrow millions of items to a few hundred cheap candidates, rank those with a richer model on fresh features, then apply business rules and learn from the feedback loop.",
      minutes: 9,
      blocks: [
        { type: "h2", text: "Why two stages" },
        { type: "p", text: "A catalogue of 10 million videos and a request that must answer in 200 ms rule out scoring every item with a large model. So recommenders funnel: **candidate generation** cheaply picks a few hundred plausible items with high recall, then **ranking** scores only those with an expensive model and many features, then a final stage applies rules. The YouTube recommendation paper popularised this split." },
        { type: "code", language: "text", code: `10M items
  -> candidate generation (several sources, ~500 items, ~20 ms)
  -> ranking model (rich features, ~500 scored, ~50 ms)
  -> re-ranking / rules (diversity, freshness, already-seen, policy)
  -> top 20 shown` },
        { type: "h2", text: "Candidate generation" },
        { type: "p", text: "Use several sources and merge them. A two-tower model learns a user vector and an item vector so that relevant pairs are close; item vectors are precomputed and stored in an ANN index, and at request time you embed the user and fetch nearest items. Other sources: items similar to what the user recently engaged with, popular items in their region, items from followed creators, and collaborative filtering (users like you also watched). Several sources fix the weakness of any one, especially for new users and new items." },
        { type: "h2", text: "Ranking" },
        { type: "p", text: "The ranker predicts something like the probability of click, watch or purchase, often several outcomes combined into one score. Features include user history, item attributes, context (device, time) and cross features between them. A gradient-boosted tree or neural network is typical. Because it sees few items, it can afford expensive features and fresh signals read from a low-latency feature store." },
        { type: "table", head: ["Stage", "Input size", "Optimises", "Model"], rows: [
          ["Candidate generation", "Millions", "Recall, speed", "Two-tower + ANN, rules, co-engagement"],
          ["Ranking", "Hundreds", "Precision of ordering", "Large model, many features"],
          ["Re-ranking", "Tens", "Diversity, policy, freshness", "Rules, constraint optimisation"],
        ] },
        { type: "h2", text: "Data, training and serving" },
        { type: "list", items: [
          "Log every impression, click and outcome with the features used at serving time, so training data matches what the model saw (avoid training-serving skew).",
          "Batch jobs retrain models daily; a streaming path updates recent-activity features within seconds.",
          "Precompute for inactive users (home feed refreshed hourly); compute on demand for active ones.",
          "Cold start: new users get popular and contextual items; new items get exploration traffic.",
          "Evaluate offline with recall@k and ranking metrics, but decide launches with online A/B tests on engagement and long-term retention.",
        ] },
        { type: "callout", tone: "gotcha", title: "Feedback loops", text: "The system only learns from items it showed, so it can narrow into a bubble and never discover better ones. Reserve some traffic for exploration, enforce diversity in re-ranking, and watch long-term metrics, not just click rate, which can reward clickbait." },
        { type: "p", text: "Common interview mistakes: proposing one big model for the whole catalogue, forgetting cold start, and skipping how the feature values at serving time stay consistent with training." },
      ],
      references: [
        { title: "Deep Neural Networks for YouTube Recommendations (Covington et al.)", url: "https://research.google/pubs/deep-neural-networks-for-youtube-recommendations/" },
        { title: "Google ML course: Candidate generation overview", url: "https://developers.google.com/machine-learning/recommendation/overview/candidate-generation" },
        { title: "Google ML course: Deep neural network recommendation models", url: "https://developers.google.com/machine-learning/recommendation/dnn/softmax" },
        { title: "Wide & Deep Learning for Recommender Systems", url: "https://research.google/pubs/wide-deep-learning-for-recommender-systems/" },
      ],
    },
    points: [
      {
        id: "sd.design-recommendation-engine.two-stage-funnel",
        title: "Why candidate generation then ranking",
        detail: "Scoring every item with a heavy model is too slow, so a cheap high-recall stage cuts millions of items to hundreds and an expensive ranker orders only those. A final stage applies diversity and policy rules.",
        question: "Why not run the best model over the whole catalogue, and how many items does each stage handle?",
      },
      {
        id: "sd.design-recommendation-engine.two-tower-candidates",
        title: "Two-tower retrieval with an ANN index",
        detail: "A two-tower model embeds users and items into the same space, item vectors are precomputed in an ANN index, and the user vector is computed at request time. Merging several candidate sources covers new items and new users.",
        question: "How does a two-tower model retrieve candidates in milliseconds, and what extra sources do you merge in?",
      },
      {
        id: "sd.design-recommendation-engine.features-and-skew",
        title: "Feature store and training-serving skew",
        detail: "Log the exact features served with each impression and read them from a low-latency store at request time so training matches serving. A streaming path keeps recent-activity features fresh.",
        question: "What is training-serving skew and how does logging served features prevent it?",
      },
      {
        id: "sd.design-recommendation-engine.cold-start-and-feedback-loops",
        title: "Cold start and feedback loops",
        detail: "New users and items have no history, so use popularity, context and reserved exploration traffic. Because the system learns only from what it showed, add diversity and track long-term retention to avoid narrowing.",
        question: "A new item has no interactions. How does it ever get shown, and how do you avoid a filter bubble?",
      },
    ],
  },
};
