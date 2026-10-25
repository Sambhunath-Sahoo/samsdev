import type { LessonEntry } from "@/types/roadmap";

export const CONCURRENCY_LLD_PROBLEMS: LessonEntry = {
  track: "system-design",
  section: "Low-level design",
  subsection: {
    title: "Concurrency-heavy problems: meeting room booking, BookMyShow seat locking",
    slug: "concurrency-lld-problems",
    lesson: {
      summary: "Design booking systems where two users want the same thing at once: make check-and-reserve atomic, and let temporary holds expire.",
      minutes: 9,
      blocks: [
        { type: "h2", text: "The race condition" },
        { type: "p", text: "Both problems share one bug. Two requests each check that a slot is free, both see yes, both book it. The check and the write must happen as one atomic step. Everything else is choosing the **scope of the lock**: wide enough to be correct, narrow enough that unrelated bookings do not wait." },
        { type: "h2", text: "Meeting room booking" },
        { type: "p", text: "Entities: `Room`, `Booking` (room, start, end, organiser), `Scheduler`. The core rule is interval overlap: two half-open intervals `[start, end)` conflict when `a.start < b.end && b.start < a.end`. Half-open means a meeting ending at 10:00 does not clash with one starting at 10:00. Searching for a free room is a loop over rooms; a room's own bookings can be kept sorted for binary search once the list grows." },
        {
          type: "code",
          language: "typescript",
          code: `interface Booking { readonly roomId: string; readonly startMs: number; readonly endMs: number; }

class Room {
  private bookings: readonly Booking[] = [];
  constructor(readonly id: string) {}

  isFree(startMs: number, endMs: number): boolean {
    return this.bookings.every((b) => !(startMs < b.endMs && b.startMs < endMs));
  }

  // check and add happen in one synchronous step
  tryBook(startMs: number, endMs: number): Booking | undefined {
    if (startMs >= endMs || !this.isFree(startMs, endMs)) return undefined;
    const booking = { roomId: this.id, startMs, endMs };
    this.bookings = [...this.bookings, booking];
    return booking;
  }
}`,
        },
        { type: "p", text: "In a single-threaded Node process the synchronous `tryBook` is already atomic. In Java, make it `synchronized` on the room, or use a per-room `ReentrantLock`. One lock per room lets different rooms be booked in parallel. A lock around the whole scheduler is correct but serialises everyone." },
        { type: "h2", text: "BookMyShow seat locking" },
        { type: "p", text: "A user picks seats, then takes a few minutes to pay. Locking the seat in the database for that whole time is wrong. The standard design is a **temporary hold with an expiry**: seats move `AVAILABLE` to `HELD` (with owner and expiry) to `BOOKED` on payment. If the hold lapses, the seat is available again." },
        {
          type: "code",
          language: "java",
          code: `import java.util.*;

final class Show {
    private record Hold(String userId, long expiresAtMs) {}

    private final Map<String, Hold> holds = new HashMap<>();
    private final Set<String> booked = new HashSet<>();

    private boolean canHold(String seat, String userId, long nowMs) {
        if (booked.contains(seat)) return false;
        Hold h = holds.get(seat);
        return h == null || h.expiresAtMs() <= nowMs || h.userId().equals(userId);
    }

    // all-or-nothing: either every seat is held, or none
    synchronized boolean tryHold(List<String> seats, String userId, long nowMs, long ttlMs) {
        for (String s : seats) if (!canHold(s, userId, nowMs)) return false;
        for (String s : seats) holds.put(s, new Hold(userId, nowMs + ttlMs));
        return true;
    }

    synchronized boolean confirm(List<String> seats, String userId, long nowMs) {
        for (String s : seats) {
            Hold h = holds.get(s);
            if (h == null || !h.userId().equals(userId) || h.expiresAtMs() <= nowMs) return false;
        }
        for (String s : seats) { holds.remove(s); booked.add(s); }
        return true;
    }
}`,
        },
        { type: "p", text: "One `Show` object per show means the lock covers one show, not the whole theatre chain. Expiry is checked lazily when someone looks at the seat, so no timer thread is needed to be correct; a background sweep is only for cleaning memory and refreshing the UI. Seats are checked together, so a user never ends up holding two of four seats." },
        {
          type: "table",
          head: ["Approach", "Good", "Bad"],
          rows: [
            ["One global lock", "trivially correct", "all bookings queue up"],
            ["Lock per room or show", "unrelated bookings run in parallel", "must pick the scope carefully"],
            ["Optimistic version check", "no lock held while thinking", "retries under contention"],
            ["Database row lock or unique constraint", "correct across servers", "needs a transaction and a clear timeout"],
          ],
        },
        { type: "callout", tone: "gotcha", title: "In-process locks stop at one server", text: "A `synchronized` block protects one JVM. With two app servers, two users can still book the same seat. In production the holds live in a shared store (a database row with a unique constraint or Redis with an atomic set-if-absent and a TTL), and you say so when asked about scaling." },
      ],
      references: [
        { title: "Optimistic concurrency control (Wikipedia)", url: "https://en.wikipedia.org/wiki/Optimistic_concurrency_control" },
        { title: "Intrinsic Locks and Synchronization (The Java Tutorials)", url: "https://docs.oracle.com/javase/tutorial/essential/concurrency/locksync.html" },
        { title: "ReentrantLock (Java SE 8 API)", url: "https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/locks/ReentrantLock.html" },
        { title: "Interval tree (Wikipedia)", url: "https://en.wikipedia.org/wiki/Interval_tree" },
      ],
    },
    points: [
      { id: "sd.concurrency-lld-problems.atomic-check-and-book", title: "Atomic check and book", detail: "A double booking happens when two requests both check availability before either writes. Make the check and the write one atomic step under a lock or a conditional update.", question: "Why is checking isFree and then calling add in two separate steps unsafe with two threads?" },
      { id: "sd.concurrency-lld-problems.interval-overlap", title: "Half-open interval overlap", detail: "Treat a meeting as [start, end) so two intervals conflict only when a.start < b.end and b.start < a.end. Back-to-back meetings then do not clash.", question: "Does a booking from 9:00 to 10:00 conflict with one from 10:00 to 11:00, and which comparison decides it?" },
      { id: "sd.concurrency-lld-problems.seat-hold-with-expiry", title: "Seat hold with expiry", detail: "Seats go from available to held to booked, and a hold carries an owner and an expiry time. Checking expiry when the seat is read means abandoned holds free themselves without a timer.", question: "What should happen if a user's payment completes one second after their hold expired?" },
      { id: "sd.concurrency-lld-problems.lock-scope", title: "Choosing the lock scope", detail: "A global lock is correct but serialises every booking, while a lock per room or per show lets unrelated bookings proceed together. In-process locks only help on one server, so multi-server systems need a shared store with an atomic operation.", question: "Why does a synchronized method not prevent double booking across two application servers?" },
    ],
  },
};
