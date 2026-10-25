import type { LessonEntry } from "@/types/roadmap";

export const BLOOM_FILTERS: LessonEntry = {
  track: "system-design",
  section: "Data storage",
  subsection: {
    title: "Bloom filters",
    slug: "bloom-filters",
    lesson: {
      summary: "A tiny probabilistic set that answers 'definitely not present' or 'maybe present', used to avoid expensive lookups.",
      minutes: 6,
      blocks: [
        { type: "h2", text: "What it is" },
        { type: "p", text: "A Bloom filter is a compact structure that tests set membership. Ask it whether a key is in the set and it answers either **definitely not** or **probably yes**. It can give a false positive. It never gives a false negative. In exchange, it uses a few bits per element instead of storing the elements themselves." },
        { type: "h2", text: "How it works" },
        { type: "list", ordered: true, items: ["Start with a bit array of `m` bits, all zero, and choose `k` independent hash functions.", "To **add** a key, hash it `k` times and set those `k` bit positions to 1.", "To **check** a key, hash it the same way. If any of the `k` bits is 0, the key was never added. If all are 1, it was probably added, but those bits may have been set by other keys."] },
        {
          type: "code",
          language: "python",
          title: "A minimal Bloom filter",
          code: `import hashlib

class Bloom:
    def __init__(self, m_bits: int, k: int):
        self.m, self.k = m_bits, k
        self.bits = bytearray(m_bits // 8 + 1)

    def _positions(self, key: str):
        for i in range(self.k):
            digest = hashlib.sha256(f"{i}:{key}".encode()).digest()
            yield int.from_bytes(digest[:8], "big") % self.m

    def add(self, key: str):
        for p in self._positions(key):
            self.bits[p // 8] |= 1 << (p % 8)

    def might_contain(self, key: str) -> bool:
        return all(self.bits[p // 8] & (1 << (p % 8)) for p in self._positions(key))`,
        },
        { type: "h2", text: "Sizing it" },
        { type: "p", text: "The false-positive rate rises as you add more keys to a fixed array. A useful rule of thumb: about **10 bits per element with 7 hash functions gives roughly 1% false positives**, and each extra 4.8 bits per element divides the rate by about ten. So 100 million keys at 1% needs about 120 MB, far smaller than storing the keys, and small enough to keep in memory." },
        { type: "h2", text: "Where it earns its place" },
        {
          type: "table",
          head: ["Use", "What the filter saves"],
          rows: [
            ["LSM databases (Cassandra, RocksDB, HBase)", "Skips SSTable files that cannot contain the key, so most point reads touch one file or none"],
            ["Cache penetration", "Reject requests for ids that were never valid before they hit the database"],
            ["Crawler or feed dedup", "Cheap 'have I seen this URL or item?' check before the exact lookup"],
            ["Username or email availability", "Fast 'definitely free' path, with the real database check only on 'maybe taken'"],
          ],
        },
        { type: "p", text: "The pattern is always the same: put the filter in front of something expensive. A 'no' is trusted and returns immediately. A 'maybe' falls through to the real check, so the occasional false positive costs one wasted lookup and never a wrong answer." },
        { type: "h2", text: "Limits" },
        { type: "list", items: ["**No deletes.** Clearing a bit may remove other keys. A counting Bloom filter keeps small counters instead of bits and supports removal at higher memory cost; a cuckoo filter is another option.", "**No listing and no counts.** It cannot tell you which keys it holds.", "**Fixed capacity.** Overfill it and the false-positive rate climbs. Size for the expected maximum, or rebuild periodically."] },
        { type: "callout", tone: "gotcha", title: "A Bloom filter cannot confirm anything", text: "Never treat 'probably yes' as yes. If you use it to guard a uniqueness rule, the database unique constraint is still the final authority. The filter only removes work, it does not replace the check." },
      ],
      references: [
        { title: "Wikipedia: Bloom filter", url: "https://en.wikipedia.org/wiki/Bloom_filter" },
        { title: "Redis documentation: Bloom filter", url: "https://redis.io/docs/latest/develop/data-types/probabilistic/bloom-filter/" },
        { title: "Wikipedia: Log-structured merge-tree", url: "https://en.wikipedia.org/wiki/Log-structured_merge-tree" },
      ],
    },
    points: [
      { id: "sd.bloom-filters.no-false-negatives", title: "No false negatives, some false positives", detail: "If any hashed bit is 0 the key was never added, so a 'no' is certain. If all bits are 1 the key may be present or other keys may have set those bits.", question: "Why can a Bloom filter return a false positive but never a false negative?" },
      { id: "sd.bloom-filters.sizing", title: "Bits per element sets the error rate", detail: "Roughly 10 bits per element with 7 hash functions gives about 1% false positives. The rate rises if you insert more keys than the filter was sized for.", question: "How much memory does a 1% Bloom filter need for 100 million keys?" },
      { id: "sd.bloom-filters.filter-in-front", title: "Guard an expensive lookup", detail: "Use a trusted 'no' to skip disk reads or database queries, as LSM trees do for SSTables and caches do for invalid ids. A 'maybe' falls through to the authoritative check.", question: "Where would you place a Bloom filter to stop cache-penetration attacks, and what happens on a false positive?" },
    ],
  },
};
