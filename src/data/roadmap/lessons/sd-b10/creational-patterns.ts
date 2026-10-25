import type { LessonEntry } from "@/types/roadmap";

export const CREATIONAL_PATTERNS: LessonEntry = {
  track: "system-design",
  section: "Low-level design",
  subsection: {
    title: "Creational patterns",
    slug: "creational-patterns",
    lesson: {
      summary: "Singleton, Factory and Builder control how objects get created, and each solves a narrower problem than it first appears.",
      minutes: 8,
      blocks: [
        { type: "h2", text: "Why creation needs patterns" },
        { type: "p", text: "Writing `new Concrete()` all over the code couples every caller to one class and one way of building it. Creational patterns move that decision to one place. Three show up constantly in machine-coding rounds." },
        { type: "h2", text: "Singleton and its critique" },
        { type: "p", text: "A Singleton guarantees one instance and gives global access to it. Typical uses are a config object or a logger. In TypeScript a module-level constant already does it, because a module is evaluated once." },
        {
          type: "code",
          language: "typescript",
          code: `class Config {
  private static instance: Config | undefined;
  private constructor(readonly values: ReadonlyMap<string, string>) {}

  static get(): Config {
    if (!Config.instance) {
      Config.instance = new Config(new Map([["region", "ap-south-1"]]));
    }
    return Config.instance;
  }
}`,
        },
        { type: "p", text: "The critique is real. A Singleton is global state in disguise: classes that call `Config.get()` hide that dependency, and tests cannot swap it. In Java, the lazy version is not thread safe unless you use an enum, a holder class or double-checked locking with a `volatile` field. A better default is to create one object at startup and pass it in through the constructor. You get a single instance without the global." },
        { type: "h2", text: "Factory" },
        { type: "p", text: "A factory hides which concrete class is built behind a method or function. The caller asks for a kind and gets an interface back." },
        {
          type: "code",
          language: "typescript",
          code: `interface Vehicle {
  hourlyRateCents(): number;
}

class Bike implements Vehicle {
  hourlyRateCents(): number { return 500; }
}

class Car implements Vehicle {
  hourlyRateCents(): number { return 2000; }
}

type VehicleKind = "bike" | "car";

function createVehicle(kind: VehicleKind): Vehicle {
  switch (kind) {
    case "bike": return new Bike();
    case "car": return new Car();
  }
}`,
        },
        { type: "p", text: "The `switch` lives in one place. Adding a truck means one new class and one new case, instead of edits in every caller. The union type makes the compiler flag a missing case. For larger sets, register creators in a `Map<string, () => Vehicle>` so adding a type never edits the factory at all. The textbook **Factory Method** variant lets subclasses decide what to build; **Abstract Factory** builds a family of related objects, such as a light and a dark UI kit, so they always match." },
        { type: "h2", text: "Builder" },
        { type: "p", text: "Use a builder when an object has many fields, several optional, and a long constructor with positional arguments invites mistakes. The builder collects values step by step and validates once at `build()`." },
        {
          type: "code",
          language: "typescript",
          code: `class HttpRequest {
  constructor(
    readonly url: string,
    readonly method: string,
    readonly headers: Readonly<Record<string, string>>,
    readonly timeoutMs: number,
  ) {}
}

class HttpRequestBuilder {
  private method = "GET";
  private headers: Record<string, string> = {};
  private timeoutMs = 3000;

  constructor(private readonly url: string) {}

  withMethod(method: string): this { this.method = method; return this; }
  withHeader(name: string, value: string): this {
    this.headers = { ...this.headers, [name]: value };
    return this;
  }
  withTimeout(ms: number): this { this.timeoutMs = ms; return this; }

  build(): HttpRequest {
    if (this.timeoutMs <= 0) throw new Error("timeout must be positive");
    return new HttpRequest(this.url, this.method, this.headers, this.timeoutMs);
  }
}`,
        },
        { type: "p", text: "The finished `HttpRequest` is immutable; only the builder changes. In TypeScript an options object (`{ method: \"POST\", timeoutMs: 500 }`) often replaces a builder, so mention both and say why you chose one." },
        {
          type: "table",
          head: ["Pattern", "Use when", "Skip when"],
          rows: [
            ["Singleton", "exactly one is a true invariant", "you only want convenient global access"],
            ["Factory", "callers should not know the concrete class", "there is one class and no variation"],
            ["Builder", "many optional fields, validation at the end", "three required fields, plain constructor"],
          ],
        },
        { type: "callout", tone: "gotcha", title: "Singleton in a concurrency round", text: "If you reach for a Singleton in a design with threads, expect the follow-up on safe lazy initialisation. Either prepare that answer or avoid the pattern and inject a single shared instance." },
      ],
      references: [
        { title: "Singleton pattern (Wikipedia)", url: "https://en.wikipedia.org/wiki/Singleton_pattern" },
        { title: "Factory method pattern (Wikipedia)", url: "https://en.wikipedia.org/wiki/Factory_method_pattern" },
        { title: "Builder pattern (Wikipedia)", url: "https://en.wikipedia.org/wiki/Builder_pattern" },
        { title: "FluentInterface (Martin Fowler)", url: "https://martinfowler.com/bliki/FluentInterface.html" },
      ],
    },
  },
};
