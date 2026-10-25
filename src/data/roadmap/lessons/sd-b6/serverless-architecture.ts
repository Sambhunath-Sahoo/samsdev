import type { LessonEntry } from "@/types/roadmap";

export const SERVERLESS_ARCHITECTURE: LessonEntry = {
  track: "system-design",
  section: "Architecture styles",
  subsection: {
    title: "Serverless",
    slug: "serverless-architecture",
    lesson: {
      summary: "Run code as short-lived functions on a platform that scales and bills per use, and know the limits that decide when it fits.",
      minutes: 8,
      blocks: [
        { type: "h2", text: "What serverless means" },
        { type: "p", text: "Serverless does not mean no servers. It means you do not provision, patch or scale them. There are two flavours. **Functions as a service** (AWS Lambda, Google Cloud Functions, Azure Functions) runs your code per event. **Backend as a service** replaces parts of your backend with managed products: a managed database, auth provider, queue or object store. Most real serverless systems combine both." },
        { type: "p", text: "A typical shape: an API gateway receives a request and invokes a function, the function reads a managed database, and an upload to object storage triggers another function that makes thumbnails and puts a message on a queue." },
        { type: "h2", text: "How a function runs" },
        { type: "p", text: "The platform starts an execution environment on demand, loads your code, and sends it one request at a time. If more requests arrive than environments exist, it creates more, so each concurrent request gets its own instance. When traffic stops, environments are eventually frozen or discarded. You pay for invocations and for execution time multiplied by allocated memory, and nothing while idle." },
        { type: "h2", text: "Cold starts" },
        { type: "p", text: "The first request to a new environment pays a **cold start**: downloading code, starting the runtime and running your initialisation. Depending on runtime, package size and network setup, that can range from tens of milliseconds to a few seconds. Later requests reuse the warm environment and skip it." },
        {
          type: "list",
          items: [
            "Keep packages small and avoid heavy initialisation; create database clients outside the handler so warm calls reuse them.",
            "Pick lighter runtimes where latency matters.",
            "Use provisioned or reserved capacity to keep some environments warm, at a fixed cost.",
            "Do not put a cold start on a path with a strict latency target without measuring it.",
          ],
        },
        { type: "h2", text: "Limits and trade-offs" },
        {
          type: "table",
          head: ["Strength", "Limit"],
          rows: [
            ["Scales to zero and to thousands of instances without work", "Concurrency has caps; a burst can hit the limit and get throttled"],
            ["Pay per use; cheap for spiky or low traffic", "At steady high traffic, always-on servers or containers are often cheaper"],
            ["No server maintenance", "Maximum run time (Lambda: 15 minutes), memory and payload size limits"],
            ["Fast to ship small services", "Stateless: nothing persists in the function between calls, so state lives in external stores"],
            ["Built-in high availability across zones", "Vendor lock-in and harder local testing and debugging"],
          ],
        },
        { type: "p", text: "Cost example with round numbers: 10 million requests a month at 100 ms and 512 MB is a small bill, usually a few dollars to tens of dollars. A service at 1,000 requests per second around the clock is 2.6 billion requests a month, and a pair of small containers behind a load balancer will often win. Run the actual pricing numbers in an interview rather than asserting either way." },
        { type: "h2", text: "Design consequences" },
        {
          type: "list",
          items: [
            "**Stateless and idempotent:** events can be delivered more than once, and retries happen, so handlers must tolerate duplicates.",
            "**Mind the database:** a thousand parallel functions can open a thousand connections and exhaust a relational database. Use a connection pooler, a proxy, or a database made for this.",
            "**Async by default:** put queues between functions so that slow work, retries and dead-letter handling are built in.",
            "**Observability:** many tiny functions make tracing and structured logs even more important.",
          ],
        },
        { type: "callout", tone: "gotcha", title: "Recursive and runaway invocations", text: "A function that writes to the bucket that triggers it, or a retry loop with no limit, can invoke itself thousands of times and produce a surprise bill within hours. Set concurrency limits, budgets and alarms, and use dead-letter queues so failed events stop retrying forever." },
        { type: "p", text: "Serverless fits event-driven glue, webhooks, periodic jobs, spiky APIs and prototypes. It fits poorly for long-running jobs, steady heavy traffic, low-latency work that cannot tolerate cold starts, and workloads that need specialised hardware or persistent connections like WebSockets without extra services." },
      ],
      references: [
        { title: "Serverless Architectures (Martin Fowler)", url: "https://martinfowler.com/articles/serverless.html" },
        { title: "Understanding the Lambda execution environment lifecycle (AWS Lambda Developer Guide)", url: "https://docs.aws.amazon.com/lambda/latest/dg/lambda-runtime-environment.html" },
        { title: "Understanding Lambda function scaling (AWS Lambda Developer Guide)", url: "https://docs.aws.amazon.com/lambda/latest/dg/lambda-concurrency.html" },
      ],
    },
    points: [
      { id: "sd.serverless-architecture.functions-and-baas", title: "Functions and managed services", detail: "Function platforms run your code per event and bill for execution, while managed services replace parts of the backend. Real systems combine both, so the architecture is mostly events flowing between managed pieces.", question: "Sketch an image-upload pipeline using only functions, object storage and a queue." },
      { id: "sd.serverless-architecture.cold-starts", title: "Cold starts", detail: "A new execution environment pays for downloading code, starting the runtime and initialising, which adds latency to the first request. Smaller packages, lighter runtimes, initialising clients outside the handler and provisioned capacity reduce it.", question: "Your checkout API on functions has a p99 of 2 seconds due to cold starts. What are your options?" },
      { id: "sd.serverless-architecture.limits-and-cost", title: "Limits and cost crossover", detail: "Functions have caps on run time, memory, payload and concurrency, and cost scales with usage. Spiky or low traffic is cheap, while steady high load often costs less on containers or servers.", question: "At what traffic profile would you move an API off functions, and how would you work that out?" },
      { id: "sd.serverless-architecture.idempotent-handlers", title: "Idempotent handlers and database connections", detail: "Event sources can deliver a message more than once and functions are retried, so handlers must tolerate duplicates. Many parallel instances can also exhaust database connections unless you pool or proxy them.", question: "How do you make a payment-confirmation function safe to run twice for the same event?" },
    ],
  },
};
