import type { LessonEntry } from "@/types/roadmap";

export const DESIGN_CONTENT_MODERATION: LessonEntry = {
  track: "system-design",
  section: "AI system design",
  subsection: {
    title: "Design content moderation: classifier pipeline with human review",
    slug: "design-content-moderation",
    lesson: {
      summary: "Cheap automated checks handle the clear cases, uncertain content goes to prioritised human review, and appeals and reviewer decisions feed back into the models.",
      minutes: 8,
      blocks: [
        { type: "h2", text: "Requirements" },
        { type: "p", text: "Clarify the content types (text, images, video, live chat), the policy categories (spam, hate, violence, adult, self-harm, illegal), whether checks must run before publishing or can run after, volume, and the cost of each error. Example: 5 million posts per day, about 60 per second average and 300 at peak, with text checks under 100 ms and images under 1 s." },
        { type: "p", text: "Two error types trade off. A false negative leaves harmful content live; a false positive removes legitimate content and angers users. The right balance differs per category: be strict on child safety, looser on borderline humour." },
        { type: "h2", text: "Pipeline" },
        { type: "code", language: "text", code: `upload -> hash match (known-bad lists)         -> block immediately
       -> fast rules (blocklist, rate, link reputation)
       -> ML classifiers per category (text, image, video frames)
            score >= high   -> auto-remove, notify, allow appeal
            score <= low    -> publish
            between         -> review queue (prioritised)
       -> published content: user reports + periodic re-scan
review decisions -> audit log -> labelled data -> retrain classifiers` },
        { type: "list", items: [
          "**Hash matching** catches re-uploads of already-banned media cheaply and with high precision.",
          "**Classifiers** return a score per category. Two thresholds create three zones: act, allow, review. Tune thresholds per category on labelled data.",
          "**Async by default.** Run heavy video checks off a queue. For high-risk surfaces use pre-publish checks or hold content visible only to the author until cleared.",
          "**Feedback inputs:** user reports, trusted-flagger signals and spikes from one account raise priority.",
        ] },
        { type: "h2", text: "Human review" },
        { type: "p", text: "Reviewer time is the scarce resource, so prioritise the queue by severity, predicted violation score, reach (views so far or follower count) and age. Show the content with context and policy, collect a decision and reason code, sample some decisions for a second review to measure agreement, and protect reviewers by blurring graphic content and limiting exposure time. Appeals go to a different reviewer." },
        { type: "table", head: ["Zone", "Action", "Why"], rows: [
          ["Score very high", "Auto-remove, allow appeal", "Volume too large for humans; high precision"],
          ["Middle", "Human review queue", "Model unsure; context matters"],
          ["Score very low", "Publish, sample for audit", "Cheap; still audit for misses"],
        ] },
        { type: "h2", text: "Operating it" },
        { type: "p", text: "Measure precision and recall per category using audit samples, queue wait time, reviewer agreement, appeal overturn rate and time to remove after a report. Adversaries adapt with misspellings, images with text, or coded words, so retrain regularly and keep a fast path for adding rules. Keep an audit log of every action with the model version and policy version, and store only what the law and policy allow." },
        { type: "callout", tone: "gotcha", title: "Thresholds are policy decisions", text: "Moving a threshold changes how many people are wrongly removed and how much harm stays up. Treat it as a reviewed change with monitoring, not a quiet tuning tweak, and keep a human path for appeals." },
      ],
      references: [
        { title: "Llama Guard: LLM-based Input-Output Safeguard for Human-AI Conversations", url: "https://arxiv.org/abs/2312.06674" },
        { title: "OpenAI: Moderation guide", url: "https://platform.openai.com/docs/guides/moderation" },
        { title: "Azure AI Content Safety overview", url: "https://learn.microsoft.com/en-us/azure/ai-services/content-safety/overview" },
        { title: "Perspective API: About the API", url: "https://developers.perspectiveapi.com/s/about-the-api" },
      ],
    },
    points: [
      {
        id: "sd.design-content-moderation.two-threshold-zones",
        title: "Two thresholds create act, allow and review zones",
        detail: "A classifier score above a high threshold auto-removes, below a low one publishes, and the middle goes to human review. Thresholds are tuned per category on labelled data because the cost of each error differs.",
        question: "Why use two thresholds instead of one, and how do you choose them for a high-harm category?",
      },
      {
        id: "sd.design-content-moderation.async-and-hash-matching",
        title: "Hash matching and async processing",
        detail: "Hash lists catch re-uploads of known-bad media cheaply, and heavy video checks run off a queue. Risky surfaces can hold content until cleared or show it only to the author in the meantime.",
        question: "Which checks run synchronously before publishing, and which can run after?",
      },
      {
        id: "sd.design-content-moderation.review-queue-priority",
        title: "Prioritising the human review queue",
        detail: "Rank queue items by severity, model score, reach and age so scarce reviewer time goes where harm is greatest. Sample decisions for second review and protect reviewers from graphic content.",
        question: "A post with 2 million views is waiting behind thousands of low-reach items. How should the queue handle it?",
      },
      {
        id: "sd.design-content-moderation.feedback-and-appeals",
        title: "Appeals and the labelling feedback loop",
        detail: "Reviewer decisions and overturned appeals become labelled data for retraining, and an audit log records the model and policy version behind each action. Track precision, recall and overturn rate per category.",
        question: "How do reviewer decisions improve the classifier, and what metric tells you it is wrongly removing content?",
      },
    ],
  },
};
