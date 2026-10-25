import type { LessonEntry } from "@/types/roadmap";

export const BEHAVIORAL_PATTERNS: LessonEntry = {
  track: "system-design",
  section: "Low-level design",
  subsection: {
    title: "Behavioral patterns",
    slug: "behavioral-patterns",
    lesson: {
      summary: "Strategy, Observer, State and Chain of Responsibility decide who does the work and how objects talk to each other.",
      minutes: 9,
      blocks: [
        { type: "h2", text: "Four patterns you will use" },
        { type: "p", text: "Behavioral patterns organise how objects collaborate. These four appear in almost every machine-coding problem: pricing and fee rules, event notifications, workflows with modes, and request pipelines." },
        { type: "h2", text: "Strategy" },
        { type: "p", text: "Put interchangeable algorithms behind one interface and let the caller choose. Parking fee rules (hourly, flat, weekend) are the standard example. It removes an `if/else` on a mode and makes each rule testable alone." },
        {
          type: "code",
          language: "typescript",
          code: `interface FeeStrategy {
  feeCents(minutes: number): number;
}

class HourlyFee implements FeeStrategy {
  constructor(private readonly perHourCents: number) {}
  feeCents(minutes: number): number {
    return Math.ceil(minutes / 60) * this.perHourCents;
  }
}

class FlatFee implements FeeStrategy {
  constructor(private readonly cents: number) {}
  feeCents(): number { return this.cents; }
}

class Ticket {
  constructor(private readonly strategy: FeeStrategy) {}
  checkout(minutes: number): number { return this.strategy.feeCents(minutes); }
}`,
        },
        { type: "h2", text: "Observer" },
        { type: "p", text: "A subject keeps a list of listeners and notifies them when something happens, so it does not need to know who cares. Order placed should trigger email, inventory and analytics without `OrderService` calling each one." },
        {
          type: "code",
          language: "typescript",
          code: `type Listener<T> = (event: T) => void;

class EventBus<T> {
  private listeners: readonly Listener<T>[] = [];

  subscribe(listener: Listener<T>): () => void {
    this.listeners = [...this.listeners, listener];
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  publish(event: T): void {
    for (const listener of this.listeners) listener(event);
  }
}`,
        },
        { type: "p", text: "Design questions to raise: are notifications synchronous (a slow listener blocks the publisher)? What if one listener throws? Can a listener unsubscribe during delivery? Returning an unsubscribe function avoids the leak where listeners are never removed." },
        { type: "h2", text: "State" },
        { type: "p", text: "When an object behaves differently depending on its mode, model each mode as a class that handles the same actions. A vending machine reacts to `insertCoin` differently when idle, when it holds money and when it is dispensing. The state object also decides the next state." },
        {
          type: "code",
          language: "typescript",
          code: `interface MachineState {
  insertCoin(m: Machine, cents: number): void;
  select(m: Machine, sku: string): void;
}

class Idle implements MachineState {
  insertCoin(m: Machine, cents: number): void { m.addCredit(cents); m.setState(new HasMoney()); }
  select(): void { throw new Error("insert coin first"); }
}

class HasMoney implements MachineState {
  insertCoin(m: Machine, cents: number): void { m.addCredit(cents); }
  select(m: Machine, sku: string): void { m.dispense(sku); m.setState(new Idle()); }
}

class Machine {
  private state: MachineState = new Idle();
  private credit = 0;
  setState(s: MachineState): void { this.state = s; }
  addCredit(c: number): void { this.credit += c; }
  dispense(sku: string): void { this.credit = 0; console.log("dispensed " + sku); }
  insertCoin(c: number): void { this.state.insertCoin(this, c); }
  select(sku: string): void { this.state.select(this, sku); }
}`,
        },
        { type: "h2", text: "Chain of Responsibility" },
        { type: "p", text: "Pass a request along a list of handlers; each one handles it, rejects it, or forwards it. Validation pipelines, ATM note dispensers (500s, then 100s, then 50s) and middleware work this way. Keeping handlers as an ordered array is simpler than linked `next` pointers." },
        {
          type: "table",
          head: ["Pattern", "Replaces", "Core idea"],
          rows: [
            ["Strategy", "`if` on a mode or type", "caller picks the algorithm"],
            ["Observer", "direct calls to every interested party", "publish, subscribers react"],
            ["State", "`switch (state)` in every method", "object swaps its own behaviour"],
            ["Chain", "one giant validation or routing function", "ordered handlers, stop or pass on"],
          ],
        },
        { type: "callout", tone: "gotcha", title: "Strategy versus State", text: "They look identical in code. The difference is who changes the object: with Strategy the client picks and it rarely changes; with State the object transitions itself as events arrive. If you hear \"transitions\", it is State." },
      ],
      references: [
        { title: "Strategy pattern (Wikipedia)", url: "https://en.wikipedia.org/wiki/Strategy_pattern" },
        { title: "Observer pattern (Wikipedia)", url: "https://en.wikipedia.org/wiki/Observer_pattern" },
        { title: "State pattern (Wikipedia)", url: "https://en.wikipedia.org/wiki/State_pattern" },
        { title: "Chain-of-responsibility pattern (Wikipedia)", url: "https://en.wikipedia.org/wiki/Chain-of-responsibility_pattern" },
      ],
    },
  },
};
