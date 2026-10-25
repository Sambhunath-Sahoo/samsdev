import type { LessonEntry } from "@/types/roadmap";

export const OLTP_VS_OLAP: LessonEntry = {
  track: "system-design",
  section: "Data storage",
  subsection: {
    title: "OLTP vs OLAP",
    slug: "oltp-vs-olap",
    lesson: {
      summary: "Why the database that runs your app and the one that answers business questions are built differently, and how data moves between them.",
      minutes: 8,
      blocks: [
        { type: "h2", text: "Transactional and analytical workloads" },
        { type: "p", text: "**OLTP** (online transaction processing) is the workload of a live application: place an order, update a profile, read one user's cart. Each operation touches a few rows, must finish in milliseconds, and thousands run at once. **OLAP** (online analytical processing) is the workload of questions: revenue by country by month, the top 100 products this year. Each query scans millions of rows but touches only a few columns, runs for seconds or minutes, and few run at the same time." },
        {
          type: "table",
          head: ["", "OLTP", "OLAP"],
          rows: [
            ["Typical query", "Fetch or update one order by id", "Sum sales per region for a year"],
            ["Rows touched", "A handful", "Millions to billions"],
            ["Latency goal", "Milliseconds", "Seconds to minutes"],
            ["Concurrency", "Thousands of small operations", "Few heavy queries"],
            ["Writes", "Constant small inserts and updates", "Bulk loads, mostly reads"],
            ["Data shape", "Normalised, current state", "Often denormalised, full history"],
            ["Examples", "PostgreSQL, MySQL, DynamoDB", "BigQuery, Snowflake, Redshift, ClickHouse"],
          ],
        },
        { type: "h2", text: "Why one database does not do both well" },
        { type: "p", text: "The difference starts with storage layout. A **row store** keeps all columns of a row together, which suits 'fetch this order' with one read. Take a table of 1 billion rows with 50 columns and run `SELECT sum(amount) FROM sales`. A row store reads every row in full, all 50 columns, to use one. A **column store** keeps each column in its own file, so the query reads only the `amount` column, about one fiftieth of the data." },
        { type: "p", text: "Columns also compress very well, because values of one column look alike (repeated country codes, sorted timestamps), and analytical engines process them in vectorised batches. The cost is that rebuilding one whole row means touching many column files, which makes single-row writes and point reads slow." },
        { type: "p", text: "There is also contention. A 10-minute report scan running on your production primary competes with checkout traffic for cache, disk and CPU. Even with read replicas, analytics on the OLTP schema is slow, because that schema was built for transactions." },
        { type: "h2", text: "Moving data from one to the other" },
        { type: "list", ordered: true, items: ["**Extract** changes from the OLTP database, by nightly batch export or, for fresher data, by change data capture.", "**Load** into the warehouse. Modern pipelines often load raw data first and transform inside the warehouse (**ELT**), instead of transforming first (ETL).", "**Model** it for questions, commonly as a **star schema**: a central fact table of events (sales) joined to dimension tables (customer, product, date).", "**Query** with BI tools, with the app never touching the warehouse directly."] },
        {
          type: "code",
          language: "sql",
          title: "A typical analytical query on a star schema",
          code: `SELECT d.year, d.month, p.category, sum(f.amount_cents) / 100.0 AS revenue
FROM fact_sales f
JOIN dim_date d    ON d.id = f.date_id
JOIN dim_product p ON p.id = f.product_id
WHERE d.year = 2026
GROUP BY d.year, d.month, p.category
ORDER BY d.month, revenue DESC;`,
        },
        { type: "callout", tone: "gotcha", title: "The warehouse is not live", text: "Data in the warehouse lags the application by minutes to a day, depending on the pipeline. Never use it to make a real-time decision such as a stock check at checkout. Keep operational queries on the OLTP database." },
        { type: "p", text: "Some systems blur the line. **HTAP** databases try to serve both, and Postgres with a read replica handles small reporting. But when a team says 'our dashboards slow down production', the standard fix is to separate the workloads. In interviews, say which workload each part of your design serves and why the stores differ." },
      ],
      references: [
        { title: "Wikipedia: Online transaction processing", url: "https://en.wikipedia.org/wiki/Online_transaction_processing" },
        { title: "Wikipedia: Online analytical processing", url: "https://en.wikipedia.org/wiki/Online_analytical_processing" },
        { title: "Wikipedia: Column-oriented DBMS", url: "https://en.wikipedia.org/wiki/Column-oriented_DBMS" },
        { title: "Dremel: Interactive Analysis of Web-Scale Datasets", url: "https://research.google/pubs/dremel-interactive-analysis-of-web-scale-datasets-2/" },
      ],
    },
  },
};
