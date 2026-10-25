import type { LessonEntry } from "@/types/roadmap";

export const SOLID_PRINCIPLES: LessonEntry = {
  track: "system-design",
  section: "Low-level design",
  subsection: {
    title: "SOLID principles",
    slug: "solid-principles",
    lesson: {
      summary: "Five guidelines for classes that are easy to change, shown with one small report example and the mistake each one prevents.",
      minutes: 9,
      blocks: [
        { type: "h2", text: "What SOLID is for" },
        { type: "p", text: "SOLID is five guidelines for keeping code cheap to change. They are heuristics, not laws. Applied everywhere they produce a forest of one-method interfaces; applied where change actually happens they keep a design flexible. A good answer names the pressure that justifies each one." },
        { type: "h2", text: "Single Responsibility and Open/Closed" },
        { type: "p", text: "**Single Responsibility**: a class has one reason to change, meaning one stakeholder or axis of change. An `Invoice` that calculates totals, formats a PDF and writes to the database changes when tax rules, branding or the schema change. Split it into `InvoiceCalculator`, `InvoicePdfRenderer` and `InvoiceRepository`." },
        { type: "p", text: "**Open/Closed**: add behaviour by adding code, not by editing tested code. The tell is a growing `switch` on a type." },
        {
          type: "code",
          language: "typescript",
          title: "Closed to edits, open to new discounts",
          code: `interface DiscountRule {
  apply(subtotalCents: number): number;
}

class PercentOff implements DiscountRule {
  constructor(private readonly percent: number) {}
  apply(subtotalCents: number): number {
    return Math.round(subtotalCents * (1 - this.percent / 100));
  }
}

class FlatOff implements DiscountRule {
  constructor(private readonly cents: number) {}
  apply(subtotalCents: number): number {
    return Math.max(0, subtotalCents - this.cents);
  }
}

class Checkout {
  constructor(private readonly rules: readonly DiscountRule[]) {}
  total(subtotalCents: number): number {
    return this.rules.reduce((sum, r) => r.apply(sum), subtotalCents);
  }
}`,
        },
        { type: "p", text: "A new \"buy one get one\" rule is a new class. `Checkout` is untouched." },
        { type: "h2", text: "Liskov Substitution" },
        { type: "p", text: "Code written against a base type must keep working when handed any subtype. A subtype may not demand more (stricter inputs), promise less (weaker results) or throw surprises the base never threw. The classic example is `Square extends Rectangle`: code that sets width to 5 and height to 4 expects an area of 20, and the square returns 16." },
        { type: "p", text: "The warning signs are a subclass that throws `NotImplemented`, an overridden method that does nothing, or callers doing `instanceof` checks. The fix is usually a different hierarchy or composition." },
        { type: "h2", text: "Interface Segregation and Dependency Inversion" },
        { type: "p", text: "**Interface Segregation**: do not force a class to implement methods it cannot honour. A `Machine` interface with `print()`, `scan()` and `fax()` makes a basic printer stub two methods. Split it into `Printer`, `Scanner` and `Fax`; a multifunction device implements all three." },
        { type: "p", text: "**Dependency Inversion**: high-level policy should depend on an abstraction that it owns, and low-level details implement it. Pass the dependency in through the constructor instead of calling `new` inside." },
        {
          type: "code",
          language: "typescript",
          code: `interface OrderStore {
  save(orderId: string, totalCents: number): void;
}

class OrderService {
  constructor(private readonly store: OrderStore) {}
  place(orderId: string, totalCents: number): void {
    if (totalCents <= 0) throw new Error("empty order");
    this.store.save(orderId, totalCents);
  }
}

class InMemoryOrderStore implements OrderStore {
  readonly saved = new Map<string, number>();
  save(orderId: string, totalCents: number): void {
    this.saved.set(orderId, totalCents);
  }
}`,
        },
        { type: "p", text: "In production you pass a Postgres-backed store; in a test you pass `InMemoryOrderStore`. That is the practical payoff: testable policy with no database." },
        {
          type: "table",
          head: ["Principle", "Smell that points to it", "Typical fix"],
          rows: [
            ["SRP", "class changes for unrelated reasons", "split by reason to change"],
            ["OCP", "type-based `switch` keeps growing", "interface plus new implementations"],
            ["LSP", "`NotImplemented`, `instanceof` checks", "rework hierarchy or compose"],
            ["ISP", "empty or throwing stub methods", "split into role interfaces"],
            ["DIP", "`new` of a concrete class deep in logic", "inject an abstraction"],
          ],
        },
        { type: "callout", tone: "gotcha", title: "Abstraction with one implementation", text: "Adding an interface for every class \"for OCP\" is a common interview mistake. If there is one implementation and no test seam, you have only added indirection. Introduce the abstraction when a second variant or a test double actually appears, and say so out loud." },
      ],
      references: [
        { title: "SOLID (Wikipedia)", url: "https://en.wikipedia.org/wiki/SOLID" },
        { title: "Liskov substitution principle (Wikipedia)", url: "https://en.wikipedia.org/wiki/Liskov_substitution_principle" },
        { title: "Inversion of Control Containers and the Dependency Injection pattern (Martin Fowler)", url: "https://martinfowler.com/articles/injection.html" },
      ],
    },
  },
};
