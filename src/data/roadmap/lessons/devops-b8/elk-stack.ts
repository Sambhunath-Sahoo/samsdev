import type { LessonEntry } from "@/types/roadmap";

export const ELK_STACK: LessonEntry = {
  track: "devops",
  section: "Observability",
  subsection: {
    title: "Logs: the ELK stack (Elasticsearch, Logstash, Kibana)",
    slug: "logs-elk-stack",
    lesson: {
      summary: "ELK collects, indexes and searches logs with full-text search: Logstash processes them, Elasticsearch stores them and Kibana shows them.",
      minutes: 8,
      blocks: [
        { type: "h2", text: "The three parts" },
        { type: "p", text: "**Elasticsearch** is a distributed search and analytics engine. It stores JSON documents in indexes and builds an inverted index, so searching for a word across billions of log lines is fast. **Logstash** is a pipeline tool: it receives events, parses and transforms them, and writes them out. **Kibana** is the web interface for searching (Discover), building dashboards and managing the cluster." },
        { type: "p", text: "In practice a fourth part is common. **Beats**, especially Filebeat, are small shippers that run on each host, read log files and send them onward. The stack is often called Elastic Stack for that reason." },
        { type: "h2", text: "How a log line travels" },
        {
          type: "list",
          ordered: true,
          items: [
            "Your app writes a line to a file or to stdout.",
            "Filebeat on the node reads it and sends it to Logstash (or straight to Elasticsearch).",
            "Logstash parses the line into fields, fixes the timestamp and adds metadata.",
            "Elasticsearch stores the document in a daily or size-rolled index.",
            "You search and graph it in Kibana.",
          ],
        },
        {
          type: "code",
          language: "ruby",
          title: "logstash.conf",
          code: `input {
  beats { port => 5044 }
}

filter {
  json { source => "message" }
  date { match => ["ts", "ISO8601"] }
  mutate { remove_field => ["agent", "ecs"] }
}

output {
  elasticsearch {
    hosts => ["http://elasticsearch:9200"]
    index => "app-logs-%{+YYYY.MM.dd}"
  }
}`,
        },
        { type: "p", text: "If your apps already write JSON, you can often skip Logstash and let Filebeat send directly to Elasticsearch, which removes a moving part. Keep Logstash when you need heavy parsing, enrichment or routing to several outputs." },
        { type: "h2", text: "Indexes, mappings and retention" },
        { type: "p", text: "Elasticsearch needs a **mapping** that says which fields are text, keywords, numbers or dates. It can guess, but guesses go wrong: a field that is a number in one line and a string in another will be rejected. Log data grows forever, so use index lifecycle management (ILM) to roll indexes over by age or size, move old ones to cheaper storage and delete them after a retention period." },
        { type: "p", text: "Searching in Kibana uses KQL, for example `level: \"error\" and service: \"payments\"`, plus a time range at the top. Always narrow the time range first." },
        { type: "callout", tone: "gotcha", title: "Index and field explosion", text: "Logging free-form objects with dynamic keys creates a new field per key, and an index with thousands of fields gets slow and memory hungry. Elasticsearch has a limit on fields per index for this reason. Keep log schemas flat and consistent, and put variable data in a single field." },
        { type: "callout", tone: "cost", title: "It is heavy to run", text: "Elasticsearch wants real memory and fast disks, and a production cluster has several nodes with replicas. Storage cost is high because full-text indexing stores more than the raw logs. Compare it with a label-indexed store such as Loki before committing." },
        { type: "h2", text: "When to choose it" },
        { type: "p", text: "Choose ELK when you need powerful free-text search, aggregations across fields, or security and audit analytics. Choose a lighter tool when you mainly look up logs by service and time range next to your metrics. Do not expose Elasticsearch or Kibana to the internet, and turn on authentication and TLS, which recent versions enable by default." },
      ],
      references: [
        { title: "Elasticsearch introduction", url: "https://www.elastic.co/guide/en/elasticsearch/reference/current/elasticsearch-intro.html" },
        { title: "Logstash introduction", url: "https://www.elastic.co/guide/en/logstash/current/introduction.html" },
        { title: "Kibana introduction", url: "https://www.elastic.co/guide/en/kibana/current/introduction.html" },
      ],
    },
    points: [
      {
        id: "devops.logs-elk-stack.roles",
        title: "What each component does",
        detail: "Filebeat ships log files, Logstash parses and routes events, Elasticsearch stores and indexes documents, and Kibana is the UI for search and dashboards.",
        question: "Which component would you remove first if your apps already log JSON?",
      },
      {
        id: "devops.logs-elk-stack.mapping-ilm",
        title: "Mappings and index lifecycle",
        detail: "A mapping defines field types, and mismatches cause rejected documents. ILM rolls indexes over and deletes old data so storage does not grow without bound.",
        question: "How do you stop log indexes from filling the disk over time?",
      },
      {
        id: "devops.logs-elk-stack.cost-tradeoff",
        title: "Full-text indexing costs resources",
        detail: "Indexing every word gives fast, flexible search but needs more memory, disk and nodes than label-only stores. Choose it when you need that search power.",
        question: "When is Elasticsearch worth its cost over a lighter log store?",
      },
    ],
  },
};
