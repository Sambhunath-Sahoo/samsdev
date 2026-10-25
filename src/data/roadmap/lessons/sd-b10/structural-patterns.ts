import type { LessonEntry } from "@/types/roadmap";

export const STRUCTURAL_PATTERNS: LessonEntry = {
  track: "system-design",
  section: "Low-level design",
  subsection: {
    title: "Structural patterns",
    slug: "structural-patterns",
    lesson: {
      summary: "Adapter makes an incompatible class fit your interface, and Decorator adds behaviour around an object without subclassing.",
      minutes: 7,
      blocks: [
        { type: "h2", text: "What structural patterns do" },
        { type: "p", text: "Structural patterns are about how objects are wired together. Adapter and Decorator are the two worth knowing cold, and they are easy to confuse: an adapter changes the interface, a decorator keeps it." },
        { type: "h2", text: "Adapter" },
        { type: "p", text: "You own an interface your code depends on. A third-party class does the job but with different method names or units. Instead of changing your code or the library, write a thin class that implements your interface and translates." },
        {
          type: "code",
          language: "typescript",
          code: `// What our checkout code depends on.
interface PaymentGateway {
  charge(amountCents: number, currency: string): Promise<string>;
}

// A vendor SDK we cannot change. Amounts are decimal strings.
class AcmePayClient {
  async createPayment(req: { amount: string; cur: string }): Promise<{ ref: string }> {
    return { ref: "acme-" + req.amount + req.cur };
  }
}

class AcmePayAdapter implements PaymentGateway {
  constructor(private readonly client: AcmePayClient) {}

  async charge(amountCents: number, currency: string): Promise<string> {
    const amount = (amountCents / 100).toFixed(2);
    const result = await this.client.createPayment({ amount, cur: currency });
    return result.ref;
  }
}`,
        },
        { type: "p", text: "Checkout only knows `PaymentGateway`. Replacing the vendor means writing one new adapter. This is also where unit conversion and error mapping belong, so vendor quirks never spread." },
        { type: "h2", text: "Decorator" },
        { type: "p", text: "A decorator implements the same interface as the object it wraps, delegates to it, and adds something before or after. Because decorators stack, you combine behaviours at runtime instead of creating a subclass for every combination (`LoggedCachedRetryingClient` and friends)." },
        {
          type: "code",
          language: "typescript",
          code: `interface PriceSource {
  priceCents(sku: string): Promise<number>;
}

class RemotePriceSource implements PriceSource {
  async priceCents(sku: string): Promise<number> {
    return sku.length * 100; // stand-in for a network call
  }
}

class CachedPriceSource implements PriceSource {
  private readonly cache = new Map<string, number>();
  constructor(private readonly inner: PriceSource) {}

  async priceCents(sku: string): Promise<number> {
    const hit = this.cache.get(sku);
    if (hit !== undefined) return hit;
    const price = await this.inner.priceCents(sku);
    this.cache.set(sku, price);
    return price;
  }
}

class LoggedPriceSource implements PriceSource {
  constructor(private readonly inner: PriceSource) {}

  async priceCents(sku: string): Promise<number> {
    const start = Date.now();
    const price = await this.inner.priceCents(sku);
    console.log("price " + sku + " took " + (Date.now() - start) + "ms");
    return price;
  }
}

const source: PriceSource = new LoggedPriceSource(new CachedPriceSource(new RemotePriceSource()));`,
        },
        { type: "p", text: "Order matters. Here logging sits outside the cache, so it logs every call including hits. Swap the wrapping and it only logs misses. Java's `BufferedInputStream(new FileInputStream(...))` is the same pattern, and so is Express-style middleware." },
        {
          type: "table",
          head: ["", "Adapter", "Decorator"],
          rows: [
            ["Interface", "converts to the one you need", "same as the wrapped object"],
            ["Purpose", "make things fit", "add behaviour"],
            ["Stacking", "usually one layer", "many layers"],
            ["Typical home", "edge with a vendor or legacy API", "cross-cutting: cache, log, retry, auth"],
          ],
        },
        { type: "callout", tone: "tip", title: "Say which one you are using", text: "In an interview, name the pattern and the reason: \"I wrap the vendor client in an adapter so the rest of the code never sees its types.\" Naming it shows you chose it, rather than stumbled into it." },
      ],
      references: [
        { title: "Adapter pattern (Wikipedia)", url: "https://en.wikipedia.org/wiki/Adapter_pattern" },
        { title: "Decorator pattern (Wikipedia)", url: "https://en.wikipedia.org/wiki/Decorator_pattern" },
        { title: "Software design pattern (Wikipedia)", url: "https://en.wikipedia.org/wiki/Software_design_pattern" },
      ],
    },
  },
};
