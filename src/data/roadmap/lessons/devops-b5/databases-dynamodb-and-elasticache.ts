import type { LessonEntry } from "@/types/roadmap";

export const DATABASES_DYNAMODB_AND_ELASTICACHE: LessonEntry = {
  track: "devops",
  section: "Cloud (AWS)",
  subsection: {
    title: "Databases: DynamoDB and ElastiCache",
    slug: "databases-dynamodb-and-elasticache",
    lesson: {
      summary: "Use DynamoDB for key-based lookups at any scale and ElastiCache to keep hot reads off your database.",
      minutes: 8,
      blocks: [
        { type: "h2", text: "Two different tools" },
        { type: "p", text: "**DynamoDB** is a managed key-value and document database. It is a primary store: your data lives there durably. **ElastiCache** is a managed in-memory cache running Redis-compatible engines or Memcached. It is a speed layer: you can lose it and rebuild it from the real database." },
        { type: "h2", text: "DynamoDB: design from the queries" },
        { type: "p", text: "Every item has a **partition key**, and optionally a **sort key**. Together they identify the item, and DynamoDB hashes the partition key to decide where it is stored. Reads by key are fast at any table size. Anything that is not a key lookup is awkward, because there are no joins and `Scan` reads the entire table." },
        { type: "p", text: "That flips the relational habit. You list your access patterns first (get a user, list a user's orders newest first) and shape the keys around them. Secondary indexes add extra query paths when one key design is not enough." },
        {
          type: "code",
          language: "bash",
          code: `aws dynamodb create-table --table-name orders \\
  --attribute-definitions AttributeName=userId,AttributeType=S AttributeName=createdAt,AttributeType=S \\
  --key-schema AttributeName=userId,KeyType=HASH AttributeName=createdAt,KeyType=RANGE \\
  --billing-mode PAY_PER_REQUEST

aws dynamodb put-item --table-name orders \\
  --item '{"userId":{"S":"u1"},"createdAt":{"S":"2026-10-01T10:00:00Z"},"total":{"N":"499"}}'

aws dynamodb query --table-name orders \\
  --key-condition-expression "userId = :u" \\
  --expression-attribute-values '{":u":{"S":"u1"}}' \\
  --no-scan-index-forward --limit 10`,
        },
        { type: "p", text: "**On-demand** billing charges per read and write and needs no capacity planning, which suits new or spiky workloads. **Provisioned** capacity is cheaper for steady, predictable traffic. Pick a partition key with many distinct values, because one very busy key becomes a hot partition and gets throttled." },
        { type: "h2", text: "ElastiCache: the cache-aside pattern" },
        { type: "p", text: "The usual use is **cache-aside**: the app asks the cache first, and on a miss reads the database and stores the result with a time to live (TTL). It also fits sessions, rate-limit counters and short-lived tokens." },
        {
          type: "code",
          language: "typescript",
          code: `async function getProduct(id: string) {
  const cached = await redis.get("product:" + id);
  if (cached) return JSON.parse(cached);

  const product = await db.products.findById(id);
  await redis.set("product:" + id, JSON.stringify(product), "EX", 300);
  return product;
}`,
        },
        { type: "p", text: "The hard part is invalidation. Either delete the key when the row changes, or accept staleness for the length of the TTL. Decide which per piece of data, and set a TTL on everything so mistakes heal on their own." },
        { type: "h2", text: "Choosing" },
        { type: "list", items: ["Need joins, ad-hoc queries, transactions across tables: RDS.", "Known key-based access at very high scale with little operations work: DynamoDB.", "Same data read again and again, and the database is the bottleneck: add ElastiCache in front.", "Cache nodes sit in private subnets, and their security group should allow the port only from the app."] },
        { type: "callout", tone: "gotcha", title: "Scans and unbounded caches", text: "A `Scan` on a large table is slow and expensive, and it is usually a sign the key design does not match the query. A cache with no TTL and no eviction plan eventually fills up and starts evicting the wrong things. Treat both as design smells, not tuning problems." },
      ],
      references: [
        { title: "What is Amazon DynamoDB?", url: "https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Introduction.html" },
        { title: "Best practices for designing and using partition keys effectively in DynamoDB", url: "https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/bp-partition-key-design.html" },
        { title: "What is Amazon ElastiCache?", url: "https://docs.aws.amazon.com/AmazonElastiCache/latest/dg/WhatIs.html" },
      ],
    },
    points: [
      {
        id: "devops.databases-dynamodb-and-elasticache.access-patterns-first",
        title: "DynamoDB: access patterns before keys",
        detail: "DynamoDB is fast for lookups by partition and sort key and poor for everything else, since it has no joins and Scan reads the whole table. List your queries first and design the keys and indexes to answer them.",
        question: "How would you model listing a user's ten most recent orders?",
      },
      {
        id: "devops.databases-dynamodb-and-elasticache.on-demand-vs-provisioned",
        title: "On-demand versus provisioned capacity",
        detail: "On-demand bills per request and needs no planning, which suits new or spiky tables. Provisioned capacity costs less when traffic is steady and predictable.",
        question: "Which billing mode would you start a brand-new table on, and why?",
      },
      {
        id: "devops.databases-dynamodb-and-elasticache.cache-aside",
        title: "ElastiCache and cache-aside",
        detail: "In cache-aside the app checks the cache first, loads from the database on a miss, and stores the result with a TTL. The cache can be lost at any time without losing data, so it is never the only copy.",
        question: "What happens to correctness if you cache a value with no TTL and never invalidate it?",
      },
    ],
  },
};
