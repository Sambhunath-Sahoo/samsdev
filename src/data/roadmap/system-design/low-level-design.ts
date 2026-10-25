import type { RoadmapSection } from "@/types/roadmap";
import { outline } from "../outline";

export const LOW_LEVEL_DESIGN: RoadmapSection = outline(
  "Low-level design",
  "Turn requirements into clean classes and interfaces, then write working code from the design.",
  [
    {
      title: "OOP and UML",
      points: [
        {
          id: "sd.lld.oop-pillars",
          title: "Four OOP principles in a design",
          detail:
            "Encapsulation keeps state private behind methods so invariants hold. Abstraction exposes what something does through an interface and hides how. Inheritance reuses and specialises behaviour through an is-a relationship, and polymorphism lets code call one interface and get type-specific behaviour. In an interview, point at where each appears in your design instead of reciting definitions, and prefer composition over inheritance when behaviour varies.",
          question: "Where do polymorphism and encapsulation show up in a parking-lot design?",
        },
        {
          id: "sd.lld.uml-class-relationships",
          title: "Class diagram relationships",
          detail:
            "Association means one class uses or knows another. Aggregation is a has-a where the part can exist on its own, such as a team and its players. Composition is a has-a where the part's lifecycle is bound to the whole, such as an order and its order lines. Generalization is the is-a link between a subtype and its parent.",
          question: "Is the relationship between a Library and its Books aggregation or composition, and why?",
        },
        {
          id: "sd.lld.uml-sequence-diagrams",
          title: "Sequence diagrams",
          detail:
            "A sequence diagram draws objects as vertical lifelines and the messages between them in time order. It validates a flow such as booking a ticket before you write code, and shows where responsibilities sit and where a call should be asynchronous. Use it for one important flow rather than the whole system.",
          question: "Sketch the sequence of calls when a user books a seat, from controller to payment.",
        },
      ],
    },
    {
      title: "SOLID principles",
      points: [
        {
          id: "sd.lld.solid-single-responsibility",
          title: "Single Responsibility",
          detail:
            "A class should have one reason to change. An invoice class that calculates totals, formats a PDF and sends email changes whenever tax rules, layout or the mail provider changes. Split it so each concern is its own class.",
          question: "Which three reasons to change does a class that calculates, prints and emails an invoice have?",
        },
        {
          id: "sd.lld.solid-open-closed",
          title: "Open/Closed",
          detail:
            "Code should be open for extension and closed for modification: adding behaviour should not require editing tested code. A new payment method is added by writing a new class that implements a PaymentMethod interface instead of adding another branch to a long if-else. Patterns such as Strategy exist to make this possible.",
          question: "How would you add a new discount type without editing the existing checkout code?",
        },
        {
          id: "sd.lld.solid-liskov",
          title: "Liskov Substitution",
          detail:
            "A subclass must be usable anywhere its parent is expected without surprising the caller. A Square that extends Rectangle but breaks the rule that width and height change independently violates it. If a subclass has to throw 'not supported' or weaken guarantees, the hierarchy is wrong.",
          question: "Why does making Square a subclass of Rectangle break code that sets width and height separately?",
        },
        {
          id: "sd.lld.solid-interface-segregation",
          title: "Interface Segregation",
          detail:
            "Prefer several small interfaces to one fat one, so a class is not forced to implement methods it cannot support. A Worker interface with work() and eat() forces a robot to implement eat(). Split it into Workable and Feedable.",
          question: "A Printer interface has print, scan and fax. What goes wrong for a basic printer, and what is the fix?",
        },
        {
          id: "sd.lld.solid-dependency-inversion",
          title: "Dependency Inversion",
          detail:
            "High-level code should depend on abstractions, not concrete classes, and concrete classes should implement those abstractions. An OrderService that takes a PaymentGateway interface in its constructor can be tested with a fake and switched between providers without edits. Dependency injection is the usual way to supply the implementation.",
          question: "How does constructor injection of an interface make OrderService easier to test?",
        },
      ],
    },
    {
      title: "Creational patterns",
      points: [
        {
          id: "sd.lld.pattern-singleton",
          title: "Singleton and its critique",
          detail:
            "A Singleton guarantees one instance with a global access point, for example a configuration holder. Interviewers now ask you to criticise it: it is global state, hides dependencies, is hard to replace in tests and needs care to be thread-safe, for example with an eager instance, a holder class or a Java enum. Prefer letting a dependency injection container manage a single shared instance.",
          question: "Why does a Singleton make unit tests harder, and what is the alternative?",
        },
        {
          id: "sd.lld.pattern-factory",
          title: "Factory",
          detail:
            "A factory delegates object creation to one place so callers depend on an interface instead of concrete classes. It helps when the exact class is known only at runtime, such as picking a notification sender from a channel name. It also keeps creation logic out of business code.",
          question: "Which class would you create with a factory in a notification system, and what does the caller depend on?",
        },
        {
          id: "sd.lld.pattern-builder",
          title: "Builder",
          detail:
            "A builder constructs a complex object step by step and produces it at the end, which suits objects with many optional fields. It avoids constructors with long parameter lists and allows the result to be immutable. Validation of required fields happens in build().",
          question: "Why is a builder better than a constructor with eight optional parameters?",
        },
      ],
    },
    {
      title: "Structural patterns",
      points: [
        {
          id: "sd.lld.pattern-adapter",
          title: "Adapter",
          detail:
            "An adapter wraps a class with an incompatible interface so it matches the interface your code expects. Use it to put a third-party payment SDK behind your own PaymentGateway interface. Your domain code then does not change when the vendor changes.",
          question: "How does an adapter let you replace one payment vendor with another without touching business logic?",
        },
        {
          id: "sd.lld.pattern-decorator",
          title: "Decorator",
          detail:
            "A decorator wraps an object that has the same interface and adds behaviour before or after delegating, so features combine at runtime without a subclass for every combination. Examples are adding logging, caching or compression around a data source, or toppings on a coffee. It follows Open/Closed.",
          question: "How would you add caching and logging around a repository without subclassing it?",
        },
      ],
    },
    {
      title: "Behavioral patterns",
      points: [
        {
          id: "sd.lld.pattern-strategy",
          title: "Strategy",
          detail:
            "Strategy puts interchangeable algorithms behind one interface so you can select one at runtime. A rate limiter can implement token bucket, sliding window and fixed window behind a RateLimitStrategy, and an elevator can choose a scheduling algorithm the same way. It removes large conditionals and supports Open/Closed.",
          question: "Design the class structure of a rate limiter that supports three algorithms.",
        },
        {
          id: "sd.lld.pattern-observer",
          title: "Observer",
          detail:
            "Observer lets a subject notify many subscribers when something changes, without knowing who they are. A booking system can notify email, SMS and analytics listeners when a booking is confirmed. Watch for slow or failing observers blocking the subject, which is when asynchronous delivery is used.",
          question: "Which observers would a meeting-room booking send to, and what if one of them is slow?",
        },
        {
          id: "sd.lld.pattern-state",
          title: "State",
          detail:
            "The State pattern lets an object change behaviour as its internal state changes by delegating to a state object. A vending machine moves between idle, has-money, dispensing and out-of-stock, and each state decides how to handle each action. It replaces large switch statements and makes illegal transitions explicit.",
          question: "What happens in each vending-machine state when the user presses 'dispense'?",
        },
        {
          id: "sd.lld.pattern-chain-of-responsibility",
          title: "Chain of Responsibility",
          detail:
            "A request is passed along a chain of handlers, each of which handles it or passes it on. It fits request validation, approval flows and middleware pipelines, and lets you add or reorder handlers without changing the sender. Decide what happens when no handler accepts the request.",
          question: "How would you model an expense approval that escalates from manager to director to finance?",
        },
      ],
    },
    {
      title: "Machine coding approach",
      points: [
        {
          id: "sd.lld.interview-framework",
          title: "The low-level design interview flow",
          detail:
            "Ask clarifying questions about scope and edge cases first. Identify core entities from the nouns in the problem, then define classes, interfaces and enums, applying SOLID and choosing patterns deliberately, since that is where most of the score is. Implement the primary flow first: a clean, partial solution beats a sloppy complete one.",
          question: "You have 45 minutes for a parking lot. What do you do in the first five and in the last ten?",
        },
        {
          id: "sd.lld.discuss-extensions",
          title: "Discuss extensions without being asked",
          detail:
            "After the core works, say how the design handles likely changes: 'if we needed a new vehicle type or pricing rule, we add a class and change no existing code, because ...'. Common follow-ups are multiple elevators, new payment methods and concurrency on shared resources. Showing the extension points proves the design is not accidental.",
          question: "Your elevator design handles one elevator. What changes for ten elevators?",
        },
      ],
    },
    "Starter problems: parking lot, library management, vending machine",
    "Intermediate problems: elevator system, Splitwise, rate limiter, URL shortener",
    "Concurrency-heavy problems: meeting room booking, BookMyShow seat locking",
    "Rule-engine problems: chess, Snake and Ladder",
  ],
);
