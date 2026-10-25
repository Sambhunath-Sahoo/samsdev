import type { LessonEntry } from "@/types/roadmap";

export const ANALYTICS_PIPELINE_AND_DATA_WAREHOUSE: LessonEntry = {
  track: "system-design",
  section: "Classic case studies",
  subsection: {
    title: "Analytics pipeline and data warehouse",
    slug: "analytics-pipeline-and-data-warehouse",
    lesson: {
      summary: "Move events from apps into a warehouse where analysts can query billions of rows, and choose between batch and streaming for each metric.",
      minutes: 9,
      blocks: [
        { type: "h2", text: "Requirements and estimates" },
        { type: "p", text: "Functional: collect product events (page views, clicks, purchases) and operational data, transform them into clean tables, and let analysts and dashboards query them. Non-functional: no event loss, flexible schema changes, query speed on large scans, and cost control. Analytics is a different workload from the production database: few, large, read-heavy queries instead of many small transactions." },
        { type: "p", text: "Assume 20 million daily users and 50 events each: 1 billion events a day, about 12,000 a second on average and 50,000 at peak. At 500 bytes raw that is 500 GB a day, 180 TB a year raw. Columnar compression typically shrinks that by 5 to 10 times, so a year in the warehouse is tens of terabytes." },
        { type: "h2", text: "API and data model" },
        {
          type: "code",
          language: "sql",
          title: "Event envelope and a star schema",
          code: `-- ingest: POST /collect  {event_id, user_id, name, ts, props{...}}

-- warehouse: one wide fact table plus small dimensions
CREATE TABLE fact_orders (
  order_id BIGINT, order_date DATE, user_key INT,
  product_key INT, quantity INT, revenue_cents BIGINT
) PARTITION BY (order_date);
-- dim_user(user_key, country, plan), dim_product(product_key, category)

SELECT d.country, SUM(f.revenue_cents) / 100.0 AS revenue
FROM fact_orders f JOIN dim_user d USING (user_key)
WHERE f.order_date >= CURRENT_DATE - 30
GROUP BY d.country;`,
        },
        { type: "p", text: "Every event needs a unique `event_id` generated at the source. Retries are normal, so you deduplicate on it downstream. A **star schema** puts measurable facts (orders, clicks) in one big table and descriptive attributes (user, product) in small dimension tables, which makes analyst queries simple and fast." },
        { type: "h2", text: "Architecture" },
        {
          type: "list",
          ordered: true,
          items: [
            "**Collect**: SDKs and servers send events to a stateless ingestion API that validates and writes to a durable log (Kafka or a managed equivalent). Acknowledge only after the write is durable.",
            "**Land raw**: a consumer writes the raw events untouched to an object-store data lake in partitioned columnar files (Parquet), by date. Raw data is the source you can always reprocess.",
            "**Transform**: batch jobs (Spark, SQL models run by a scheduler) clean, deduplicate by `event_id`, join with reference data from operational databases, and build the fact and dimension tables. This is ELT when raw data lands first and transformations run inside the warehouse; ETL when transformation happens before loading.",
            "**Serve**: the warehouse (or lake queried through an engine) runs analyst SQL and BI dashboards. Pre-aggregate hot dashboards into summary tables.",
            "**Stream path (optional)**: a stream processor computes the few metrics that must be fresh in seconds, such as live active users, into a fast store.",
          ],
        },
        { type: "p", text: "The warehouse is **columnar**: it stores each column together, so a query that sums one column out of fifty reads only that column, and similar values compress well. That is why it handles scans so much better than a row store, and why it is poor at single-row updates." },
        {
          type: "table",
          head: ["Approach", "Freshness", "Cost and complexity"],
          rows: [
            ["Nightly batch", "Hours", "Lowest, easy to reason about and rerun"],
            ["Micro-batch (every few minutes)", "Minutes", "Moderate"],
            ["Streaming", "Seconds", "Highest: state, late data, exactly-once concerns"],
            ["Lambda (batch plus stream)", "Seconds, corrected later", "Two code paths that must agree"],
          ],
        },
        { type: "h2", text: "Bottlenecks and trade-offs" },
        {
          type: "list",
          items: [
            "**Schema drift**: producers add and rename fields. Version the event schema, validate at ingestion, and send bad events to a dead-letter location.",
            "**Late and out-of-order events**: aggregate by event time, with a lateness window, not by arrival time.",
            "**Small files**: millions of tiny files slow queries. Compact into files of a few hundred MB.",
            "**Backfills**: because raw data is kept, a fixed bug is repaired by rerunning the job for the affected dates.",
            "**Cost**: partition by date and filter on it, so queries scan days, not years.",
          ],
        },
        { type: "callout", tone: "cost", title: "Scan cost is the bill", text: "On pay-per-scan warehouses an unfiltered `SELECT *` over a year of events can cost real money. Partition on date, select only needed columns, and put guardrails on analyst queries." },
        { type: "p", text: "Common mistakes: running analytics on the production database, skipping the raw layer, and choosing streaming when a daily number would do." },
      ],
      references: [
        { title: "Extract, transform, load (Wikipedia)", url: "https://en.wikipedia.org/wiki/Extract,_transform,_load" },
        { title: "Column-oriented DBMS (Wikipedia)", url: "https://en.wikipedia.org/wiki/Column-oriented_DBMS" },
        { title: "Apache Parquet documentation", url: "https://parquet.apache.org/docs/overview/" },
        { title: "Lambda architecture (Wikipedia)", url: "https://en.wikipedia.org/wiki/Lambda_architecture" },
      ],
    },
    points: [
      { id: "sd.analytics-pipeline-and-data-warehouse.event-ingestion-and-lake", title: "Durable ingestion and a raw lake", detail: "Events go through a durable log and are landed unchanged in partitioned columnar files. Keeping raw data lets you fix a transformation bug and rerun history.", question: "Why keep raw events when you already have clean warehouse tables?" },
      { id: "sd.analytics-pipeline-and-data-warehouse.columnar-star-schema", title: "Columnar storage and star schema", detail: "A warehouse stores columns together so scans read only what they need and compress well. A fact table joined to small dimension tables keeps analyst queries simple.", question: "Why is a columnar warehouse fast for reports and bad for updating one row?" },
      { id: "sd.analytics-pipeline-and-data-warehouse.batch-vs-streaming", title: "Batch versus streaming", detail: "Batch is cheap and easy to rerun, while streaming gives seconds of freshness with more state and late-data handling. Use streaming only for the metrics that need it and batch for the rest.", question: "A dashboard needs yesterday's revenue and live active users. Which pipeline serves each?" },
    ],
  },
};
