import type { LessonEntry } from "@/types/roadmap";

export const STARTER_LLD_PROBLEMS: LessonEntry = {
  track: "system-design",
  section: "Low-level design",
  subsection: {
    title: "Starter problems: parking lot, library management, vending machine",
    slug: "starter-lld-problems",
    lesson: {
      summary: "Three entry-level design problems, with the entities, the one rule that shapes each design, and a working core for the parking lot.",
      minutes: 9,
      blocks: [
        { type: "h2", text: "How to read these problems" },
        { type: "p", text: "Each starter problem has one central idea. Find it early and the design follows. Parking lot is about **allocation**, library management is about **state of a copy**, and a vending machine is about **modes**." },
        { type: "h2", text: "Parking lot" },
        { type: "p", text: "Entities: `ParkingLot`, `Slot` (id, type, occupied), `Vehicle` (plate, type), `Ticket` (id, slot, entry time). Operations: `park(vehicle)` returns a ticket, `unpark(ticketId)` returns the fee. Decisions to state: which slot is picked (first free of a matching type, or nearest to the entrance) and how the fee is computed. Both are strategies, so keep them behind interfaces." },
        {
          type: "code",
          language: "typescript",
          code: `type Kind = "bike" | "car";
interface Vehicle { readonly plate: string; readonly kind: Kind; }
interface Ticket { readonly id: string; readonly slotId: string; readonly enteredAt: Date; }

class Slot {
  private taken = false;
  constructor(readonly id: string, readonly kind: Kind) {}
  get isFree(): boolean { return !this.taken; }
  occupy(): void { this.taken = true; }
  release(): void { this.taken = false; }
}

class ParkingLot {
  private readonly tickets = new Map<string, Ticket>();
  private nextId = 1;
  constructor(private readonly slots: readonly Slot[], private readonly perHourCents = 500) {}

  park(vehicle: Vehicle, now = new Date()): Ticket {
    const slot = this.slots.find((s) => s.isFree && s.kind === vehicle.kind);
    if (!slot) throw new Error("no free slot for " + vehicle.kind);
    slot.occupy();
    const ticket = { id: "T" + this.nextId++, slotId: slot.id, enteredAt: now };
    this.tickets.set(ticket.id, ticket);
    return ticket;
  }

  unpark(ticketId: string, now = new Date()): number {
    const ticket = this.tickets.get(ticketId);
    if (!ticket) throw new Error("unknown ticket " + ticketId);
    this.slots.find((s) => s.id === ticket.slotId)?.release();
    this.tickets.delete(ticketId);
    const hours = Math.max(1, Math.ceil((now.getTime() - ticket.enteredAt.getTime()) / 3_600_000));
    return hours * this.perHourCents;
  }
}`,
        },
        { type: "p", text: "Deleting the ticket on `unpark` makes a second unpark with the same ticket fail loudly, which is the double-exit case an interviewer will probe. Passing `now` in keeps the fee testable." },
        { type: "h2", text: "Library management" },
        { type: "p", text: "Separate the book (title, author, ISBN) from the **copy** (barcode, status). People borrow copies, not titles. Entities: `Book`, `BookCopy`, `Member`, `Loan` (copy, member, due date, returned date), `Library`. Rules to pin down: max loans per member, loan length, late fee per day, reservations." },
        { type: "p", text: "The copy has a small lifecycle: `AVAILABLE`, `LOANED`, `RESERVED`, `LOST`. Writing the allowed transitions as a table first keeps `checkout` and `return` short. Search by title or author can be a `SearchStrategy`, but start with a plain filter." },
        { type: "h2", text: "Vending machine" },
        { type: "p", text: "This is the State pattern's home problem: `Idle`, `HasMoney`, `Dispensing`, `OutOfService`. Entities: `Machine`, `Slot` (product, price, quantity), `Coin` or amount, and the current state object. The details that earn marks are returning change, refunding on cancel, and refusing a sale when stock is zero." },
        {
          type: "table",
          head: ["Problem", "Core idea", "Pattern that fits", "Edge case to mention"],
          rows: [
            ["Parking lot", "slot allocation", "Strategy for slot choice and fee", "double unpark, lot full"],
            ["Library", "copy lifecycle", "State for copy, plain rules for fines", "member over the loan limit"],
            ["Vending machine", "modes and transitions", "State", "exact change, empty slot"],
          ],
        },
        { type: "callout", tone: "tip", title: "Money as integers", text: "Store prices in cents as integers. Floating point money gives `0.1 + 0.2` surprises, and interviewers do notice." },
        { type: "p", text: "After the core works, say what you would do next: concurrent entry gates need a lock per slot, and the in-memory maps would move behind repository interfaces." },
      ],
      references: [
        { title: "Finite-state machine (Wikipedia)", url: "https://en.wikipedia.org/wiki/Finite-state_machine" },
        { title: "State pattern (Wikipedia)", url: "https://en.wikipedia.org/wiki/State_pattern" },
        { title: "ValueObject (Martin Fowler)", url: "https://martinfowler.com/bliki/ValueObject.html" },
      ],
    },
    points: [
      { id: "sd.starter-lld-problems.parking-slot-allocation", title: "Parking lot allocation", detail: "A parking lot is mostly about picking a free slot of the right type and computing a fee at exit. Keep slot choice and pricing behind strategy interfaces, and make the ticket the proof of entry so a second exit with the same ticket fails.", question: "How would you change slot selection from first-free to nearest-to-entrance without touching ParkingLot.park?" },
      { id: "sd.starter-lld-problems.library-copy-vs-book", title: "Book versus copy in a library", detail: "A title can have many physical copies, and each copy has its own status. Loans, reservations and late fees attach to the copy and the member, not to the book record.", question: "Why does modelling Loan against Book instead of BookCopy break as soon as the library owns two copies?" },
      { id: "sd.starter-lld-problems.vending-state-machine", title: "Vending machine as a state machine", detail: "The machine reacts to the same buttons differently in each mode, so each mode becomes a state class that performs the action and picks the next state. This removes nested if statements and makes illegal actions explicit.", question: "Which transition handles a coin inserted while the machine is dispensing, and why?" },
      { id: "sd.starter-lld-problems.money-and-errors", title: "Money as integers and loud failures", detail: "Keep amounts in the smallest currency unit as integers and throw clear errors for invalid operations such as an unknown ticket or an empty slot. Both are cheap and show care in a short round.", question: "What bug appears if the vending machine sums coin values as floating point numbers?" },
    ],
  },
};
