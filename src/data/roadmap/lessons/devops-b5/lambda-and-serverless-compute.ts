import type { LessonEntry } from "@/types/roadmap";

export const LAMBDA_AND_SERVERLESS_COMPUTE: LessonEntry = {
  track: "devops",
  section: "Cloud (AWS)",
  subsection: {
    title: "Lambda and serverless compute",
    slug: "lambda-and-serverless-compute",
    lesson: {
      summary: "Run a function on demand without managing servers, and know when cold starts, timeouts and cost make a container the better choice.",
      minutes: 8,
      blocks: [
        { type: "h2", text: "What Lambda is" },
        { type: "p", text: "**AWS Lambda** runs your function in response to an event: an HTTP request through a function URL or API Gateway, a message on SQS, a file landing in S3, a schedule from EventBridge. You upload code, choose memory and a timeout, and AWS starts as many copies as the traffic needs. There is no server to patch and nothing running, or billing, when no events arrive." },
        { type: "p", text: "You pay per request and per millisecond of run time, scaled by the memory you configure. Memory also sets CPU: more memory means proportionally more CPU, so a function that is slow at 128 MB is sometimes cheaper at 512 MB because it finishes much sooner." },
        { type: "h2", text: "A minimal function" },
        {
          type: "code",
          language: "javascript",
          title: "index.mjs",
          code: `export const handler = async (event) => {
  const name = event.queryStringParameters?.name ?? "world";
  return {
    statusCode: 200,
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ message: "hello " + name }),
  };
};`,
        },
        {
          type: "code",
          language: "bash",
          code: `zip fn.zip index.mjs
aws lambda create-function --function-name hello \\
  --runtime nodejs22.x --handler index.handler \\
  --role arn:aws:iam::111122223333:role/hello-lambda-role \\
  --zip-file fileb://fn.zip
aws lambda invoke --function-name hello --payload '{}' --cli-binary-format raw-in-base64-out out.json
aws logs tail /aws/lambda/hello --since 5m`,
        },
        { type: "p", text: "The role is the function's **execution role**. It must at least let the function write logs; anything else, such as reading a DynamoDB table, is whatever you add to it. Keep it to exactly those actions." },
        { type: "h2", text: "How it behaves under load" },
        { type: "list", items: ["**Cold start**: the first request on a new copy has to start the runtime and run your initialisation code, adding latency. Warm copies are reused for later requests.", "**Concurrency**: each copy handles one request at a time. A burst of 200 requests means up to 200 copies, subject to your account's concurrency limit.", "**Time limit**: a function can run for at most 15 minutes. Longer work belongs in a container or a workflow.", "**No local state**: the filesystem and memory may vanish between calls. Keep state in S3, DynamoDB or a database.", "**Connections**: many copies each opening a database connection can overwhelm RDS. Use RDS Proxy, or reuse the client created outside the handler."] },
        { type: "h2", text: "When to use it, when not" },
        { type: "p", text: "Lambda fits spiky or low traffic, glue between AWS services, scheduled jobs and webhooks. It is a poor fit for steady high traffic, where an always-on container is cheaper, for long-running jobs, and for apps that need a persistent connection or very low, predictable latency. Moving a whole Next.js or FastAPI app into Lambda is possible, but you inherit all the constraints above." },
        { type: "callout", tone: "gotcha", title: "Runaway loops cost real money", text: "A function that writes to the same S3 bucket that triggers it will invoke itself endlessly. Use separate buckets or prefixes, set a reserved concurrency limit as a brake, and add a budget alert before experimenting." },
      ],
      references: [
        { title: "What is AWS Lambda?", url: "https://docs.aws.amazon.com/lambda/latest/dg/welcome.html" },
        { title: "Understanding the Lambda execution environment lifecycle", url: "https://docs.aws.amazon.com/lambda/latest/dg/lambda-runtime-environment.html" },
        { title: "Understanding Lambda Event Function scaling", url: "https://docs.aws.amazon.com/lambda/latest/dg/lambda-concurrency.html" },
      ],
    },
    points: [
      {
        id: "devops.lambda-and-serverless-compute.cold-start",
        title: "Cold starts and warm copies",
        detail: "A new execution environment must start the runtime and run your initialisation code before handling its first request. Later requests reuse the warm copy, so work done outside the handler is paid once per copy.",
        question: "Where would you create a database client so that warm invocations can reuse it?",
      },
      {
        id: "devops.lambda-and-serverless-compute.memory-and-cost",
        title: "Memory sets CPU and cost",
        detail: "Lambda bills by request count and by duration multiplied by configured memory. CPU scales with memory, so raising memory can shorten the run enough to lower the bill.",
        question: "Why can a function cost less after you give it more memory?",
      },
      {
        id: "devops.lambda-and-serverless-compute.limits",
        title: "Know the limits before choosing it",
        detail: "A single invocation is limited to 15 minutes, handles one request per copy and keeps no durable local state. Workloads that exceed these, or that run steadily at high volume, usually fit a container better.",
        question: "Name two workloads where you would pick Fargate over Lambda.",
      },
    ],
  },
};
