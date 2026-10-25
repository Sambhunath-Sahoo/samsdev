import type { LessonEntry } from "@/types/roadmap";

export const MICROMETER: LessonEntry = {
  track: "devops",
  section: "Observability",
  subsection: {
    title: "Application metrics with Micrometer (Spring Boot)",
    slug: "application-metrics-micrometer-spring-boot",
    lesson: {
      summary: "Micrometer is the metrics API in Spring Boot: Actuator exposes it, and a Prometheus registry turns it into a scrape endpoint.",
      minutes: 8,
      blocks: [
        { type: "h2", text: "What Micrometer is" },
        { type: "p", text: "Micrometer is a metrics facade for JVM applications, similar to what SLF4J is for logging. Your code records counters, timers and gauges against a `MeterRegistry`. A registry implementation for a specific system (Prometheus, Datadog, CloudWatch and others) turns those into that system's format. Spring Boot Actuator wires it up and adds many metrics for free: JVM memory, garbage collection, threads, HTTP server requests, database connection pool." },
        { type: "h2", text: "Expose metrics to Prometheus" },
        { type: "p", text: "Add Actuator and the Prometheus registry, then expose the endpoint. Restrict exposure to what you need." },
        {
          type: "code",
          language: "xml",
          title: "pom.xml",
          code: `<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-actuator</artifactId>
</dependency>
<dependency>
  <groupId>io.micrometer</groupId>
  <artifactId>micrometer-registry-prometheus</artifactId>
</dependency>`,
        },
        {
          type: "code",
          language: "yaml",
          title: "application.yml",
          code: `management:
  endpoints:
    web:
      exposure:
        include: health,prometheus
  metrics:
    tags:
      application: orders-api
    distribution:
      percentiles-histogram:
        http.server.requests: true`,
        },
        { type: "p", text: "Prometheus can now scrape `/actuator/prometheus`. The common tag identifies the service on every metric, and the histogram setting publishes latency buckets so you can compute percentiles with `histogram_quantile` across instances. The built-in `http_server_requests_seconds` metric covers request count and latency by method, URI template and status." },
        { type: "h2", text: "Custom metrics" },
        { type: "p", text: "Inject the registry and create meters once, not on every call. Registering the same name and tags again returns the existing meter, but holding a reference is cheaper and clearer." },
        {
          type: "code",
          language: "java",
          title: "OrderService.java",
          code: `@Service
public class OrderService {
    private final Counter ordersCreated;
    private final Timer checkoutTimer;

    public OrderService(MeterRegistry registry) {
        this.ordersCreated = Counter.builder("orders.created")
                .description("Orders successfully created")
                .tag("channel", "web")
                .register(registry);
        this.checkoutTimer = Timer.builder("checkout.duration")
                .publishPercentileHistogram()
                .register(registry);
    }

    public Order checkout(Cart cart) {
        return checkoutTimer.record(() -> {
            Order order = process(cart);
            ordersCreated.increment();
            return order;
        });
    }
}`,
        },
        { type: "p", text: "Prometheus will show these as `orders_created_total` and `checkout_duration_seconds_*`. Micrometer converts the dotted names and adds the unit and `_total` suffixes for you. For a value that rises and falls, such as items in a queue, use a gauge: `Gauge.builder(\"queue.size\", queue, Queue::size).register(registry)`." },
        { type: "callout", tone: "gotcha", title: "Tags with unbounded values", text: "Never tag a meter with a user ID, an order ID or a raw URL. Each distinct value creates a new time series in Prometheus. Use bounded values such as channel, status or route template." },
        { type: "callout", tone: "gotcha", title: "Do not expose every actuator endpoint publicly", text: "Endpoints such as `env` and `heapdump` leak sensitive data. Expose only `health` and `prometheus`, and serve them on a separate management port or behind network rules." },
      ],
      references: [
        { title: "Micrometer reference", url: "https://docs.micrometer.io/micrometer/reference/" },
        { title: "Metrics (Spring Boot Actuator)", url: "https://docs.spring.io/spring-boot/reference/actuator/metrics.html" },
        { title: "Endpoints (Spring Boot Actuator)", url: "https://docs.spring.io/spring-boot/reference/actuator/endpoints.html" },
        { title: "Metric and label naming (Prometheus)", url: "https://prometheus.io/docs/practices/naming/" },
      ],
    },
    points: [
      {
        id: "devops.application-metrics-micrometer-spring-boot.facade",
        title: "Micrometer is a metrics facade",
        detail: "Your code records meters against `MeterRegistry`, and a registry for Prometheus or another system converts them to its format. Actuator adds JVM and HTTP metrics automatically.",
        question: "Why does your code depend on Micrometer and not on the Prometheus client directly?",
      },
      {
        id: "devops.application-metrics-micrometer-spring-boot.expose-endpoint",
        title: "Expose /actuator/prometheus",
        detail: "Add the Actuator starter and the Prometheus registry, include `prometheus` in the exposed web endpoints, and point a scrape job at the path.",
        question: "Which two dependencies and which property make the scrape endpoint available?",
      },
      {
        id: "devops.application-metrics-micrometer-spring-boot.custom-meters",
        title: "Counters, timers and gauges",
        detail: "Use a counter for events, a timer for durations and a gauge for values that rise and fall. Create meters once and keep tag values bounded.",
        question: "Which meter type fits the number of jobs waiting in a queue?",
      },
    ],
  },
};
