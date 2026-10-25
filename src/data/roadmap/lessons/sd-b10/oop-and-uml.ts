import type { LessonEntry } from "@/types/roadmap";

export const OOP_AND_UML: LessonEntry = {
  track: "system-design",
  section: "Low-level design",
  subsection: {
    title: "OOP and UML",
    slug: "oop-and-uml",
    lesson: {
      summary: "Use the four OOP principles to shape classes, and draw class and sequence diagrams that a reviewer can read in a minute.",
      minutes: 8,
      blocks: [
        { type: "h2", text: "The four principles, in a design" },
        { type: "p", text: "In an interview nobody asks you to define encapsulation. They watch whether your classes protect their own rules. Each principle has one practical meaning in a design." },
        {
          type: "list",
          items: [
            "**Encapsulation**: a class owns its state and exposes behaviour, not fields. A `Wallet` has `debit(amount)` that refuses to go below zero; it does not expose a public `balance` that callers edit.",
            "**Abstraction**: callers depend on what something does, not how. `PaymentGateway.charge()` hides whether it is Stripe or a fake.",
            "**Inheritance**: a subtype can be used wherever the parent is expected. Use it for a real is-a relationship with the same behaviour, not to reuse code.",
            "**Polymorphism**: one call, different behaviour depending on the object. It replaces long `if (type === ...)` chains.",
          ],
        },
        {
          type: "code",
          language: "typescript",
          title: "Encapsulation and polymorphism together",
          code: `interface Notifier {
  send(userId: string, message: string): void;
}

class EmailNotifier implements Notifier {
  send(userId: string, message: string): void {
    console.log("email to " + userId + ": " + message);
  }
}

class SmsNotifier implements Notifier {
  send(userId: string, message: string): void {
    console.log("sms to " + userId + ": " + message);
  }
}

class Wallet {
  private balanceCents = 0;

  credit(cents: number): void {
    if (cents <= 0) throw new Error("amount must be positive");
    this.balanceCents += cents;
  }

  debit(cents: number): void {
    if (cents > this.balanceCents) throw new Error("insufficient funds");
    this.balanceCents -= cents;
  }

  get balance(): number {
    return this.balanceCents;
  }
}`,
        },
        { type: "p", text: "`Wallet` can never hold a negative balance, because the only way in is through methods that check. Any code holding a `Notifier` works with either implementation without knowing which." },
        { type: "h2", text: "Class diagram relationships" },
        { type: "p", text: "A class diagram is boxes (name, fields, methods) joined by lines. The lines carry the design, so know the five that matter and what each says about lifetime." },
        {
          type: "table",
          head: ["Relationship", "Meaning", "Example", "Code shape"],
          rows: [
            ["Association", "A uses or knows B", "Order knows Customer", "a field or method parameter"],
            ["Aggregation", "A has B, B lives on without A", "Team has Players", "field set from outside"],
            ["Composition", "A owns B, B dies with A", "Order owns OrderLines", "A creates B in its constructor"],
            ["Inheritance", "A is a kind of B", "Car is a Vehicle", "`extends`"],
            ["Realization", "A implements interface B", "EmailNotifier realizes Notifier", "`implements`"],
          ],
        },
        { type: "p", text: "Add multiplicity at the line ends (`1`, `0..1`, `*`) and say which side holds the reference. Many candidates skip it, and it is where the interesting questions are: can an `Order` exist with zero lines?" },
        { type: "h2", text: "Sequence diagrams" },
        { type: "p", text: "A class diagram is static. A sequence diagram shows one scenario over time: participants across the top, a dashed lifeline down from each, arrows for calls in order, dashed arrows for returns. Draw it for the one flow that matters, such as checkout, not for every method." },
        {
          type: "code",
          language: "text",
          title: "Checkout, text form",
          code: `Client -> OrderService : placeOrder(cart)
OrderService -> Inventory : reserve(items)
Inventory --> OrderService : ok
OrderService -> PaymentGateway : charge(total)
PaymentGateway --> OrderService : receipt
OrderService -> Notifier : send(userId, "order placed")
OrderService --> Client : orderId`,
        },
        { type: "p", text: "Reading it tells you the order of side effects, which is where failures hide. If `charge` succeeds and `send` throws, is the order placed? Questions like that are what the diagram is for." },
        { type: "callout", tone: "gotcha", title: "Inheritance for code reuse", text: "The common mistake is `class Stack extends ArrayList` because it saves typing. Now every list method leaks into your stack. If it is not a true is-a with the same promises, hold the other class as a field (composition) and expose only what you need." },
        { type: "p", text: "Keep diagrams light. In an interview, a text sketch of classes and arrows on a whiteboard is enough; accuracy of relationships matters more than UML notation purity." },
      ],
      references: [
        { title: "Object-oriented programming (Wikipedia)", url: "https://en.wikipedia.org/wiki/Object-oriented_programming" },
        { title: "Class diagram (Wikipedia)", url: "https://en.wikipedia.org/wiki/Class_diagram" },
        { title: "Sequence diagram (Wikipedia)", url: "https://en.wikipedia.org/wiki/Sequence_diagram" },
        { title: "Composition over inheritance (Wikipedia)", url: "https://en.wikipedia.org/wiki/Composition_over_inheritance" },
      ],
    },
  },
};
