import type { LessonEntry } from "@/types/roadmap";

export const N_PLUS_ONE_QUERIES: LessonEntry = {
  track: "system-design",
  section: "Databases in practice",
  subsection: {
    title: "N+1 queries",
    slug: "n-plus-one-queries",
    lesson: {
      summary: "How one innocent loop turns into hundreds of queries, how to spot it, and the three standard fixes.",
      minutes: 7,
      blocks: [
        { type: "h2", text: "Recognising the N+1 query" },
        { type: "p", text: "You fetch a list with one query, then loop over the results and run one more query for each item. One query plus N more: N+1. It almost never looks wrong in code, because an ORM hides the queries behind attribute access." },
        {
          type: "code",
          language: "python",
          title: "Looks harmless",
          code: `posts = db.query(Post).limit(100).all()        # 1 query
for post in posts:
    print(post.title, post.author.name)        # lazy load: 1 query per post
# 101 queries for one page`,
        },
        { type: "p", text: "Each query is cheap, so it passes in development with 5 rows. In production, with a 2 ms round trip, 101 queries cost about 200 ms of pure waiting, and the database handles 100 times the query volume it should. It scales with the page size and with traffic, so it fails exactly when load rises." },
        { type: "p", text: "To detect it, count queries per request. Turn on query logging in a test environment, use your ORM's query counter, or look in a tracing tool for a request whose span shows the same statement repeated with different ids. A good habit is a test that fails if a list endpoint runs more than a fixed number of queries." },
        { type: "h2", text: "Fixing N+1: joins, batching and dataloaders" },
        { type: "p", text: "There are three standard fixes. All of them replace N lookups with one or two." },
        { type: "list", ordered: true, items: ["**Join:** fetch parent and child together in a single query.", "**Batching with `IN`:** fetch the parents, collect their foreign keys, and load all children in one extra query (two queries total).", "**Dataloader:** collect the keys requested during one tick of execution and issue one batched query, caching results per request."] },
        {
          type: "code",
          language: "sql",
          title: "Join, and the batched alternative",
          code: `-- 1) Join: one round trip
SELECT p.id, p.title, a.name
FROM posts p JOIN authors a ON a.id = p.author_id
ORDER BY p.created_at DESC LIMIT 100;

-- 2) Batch: two round trips, no row duplication
SELECT id, title, author_id FROM posts ORDER BY created_at DESC LIMIT 100;
SELECT id, name FROM authors WHERE id = ANY(:author_ids);`,
        },
        { type: "p", text: "ORMs name these differently: `joinedload` and `selectinload` in SQLAlchemy, `include` in Prisma and Sequelize, `select_related` and `prefetch_related` in Django, `preload` in Ecto and Rails. Learn your ORM's eager-loading option and use it deliberately." },
        {
          type: "table",
          head: ["Fix", "Round trips", "Best for", "Watch out for"],
          rows: [
            ["Join", "1", "To-one relations", "One-to-many multiplies rows and repeats parent data"],
            ["`IN` batching", "2", "To-many relations, large parents", "Very long id lists; chunk them"],
            ["Dataloader", "1 per batch", "GraphQL and nested resolvers where the call site is unpredictable", "Needs per-request instances so caches do not leak between users"],
          ],
        },
        { type: "h2", text: "Where it hides" },
        { type: "p", text: "GraphQL resolvers are the classic source: each field resolver fetches its own data, so a query for 50 posts with authors and comments triggers hundreds of lookups unless a dataloader batches them. Serialisers that touch a relation per item and template loops do the same." },
        { type: "callout", tone: "gotcha", title: "Eager loading everything is its own bug", text: "Joining every relation to dodge N+1 loads data you never use and can return huge, duplicated result sets. Load only the relations a specific endpoint renders, and select only the columns you need." },
        { type: "p", text: "In interviews, show you can reason from symptoms: high query count, low per-query time, latency that grows with list size. Then name the fix and its trade-off instead of just saying 'use eager loading'." },
      ],
      references: [
        { title: "GraphQL DataLoader", url: "https://github.com/graphql/dataloader" },
        { title: "PostgreSQL documentation: Performance Tips", url: "https://www.postgresql.org/docs/current/performance-tips.html" },
        { title: "Use The Index, Luke: SQL indexing and tuning for developers", url: "https://use-the-index-luke.com/" },
      ],
    },
  },
};
