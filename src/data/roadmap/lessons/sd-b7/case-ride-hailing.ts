import type { LessonEntry } from "@/types/roadmap";

export const RIDE_HAILING: LessonEntry = {
  track: "system-design",
  section: "Classic case studies",
  subsection: {
    title: "Ride hailing",
    slug: "case-ride-hailing",
    lesson: {
      summary: "Index moving drivers by geographic cell, keep their positions in memory, and match each rider to a nearby driver exactly once.",
      minutes: 10,
      blocks: [
        { type: "h2", text: "Requirements and estimates" },
        { type: "p", text: "Functional: a rider requests a trip, the system finds a nearby available driver, the driver accepts, both see live location until the trip ends, then fare and payment. Non-functional: matching within a few seconds, location data that is fresh, and **one driver is never assigned to two trips**." },
        { type: "p", text: "Estimates: 1 million drivers online, each sending a location every 4 seconds, is 250,000 writes per second at 100 bytes, about 25 MB/s. Ride requests are far fewer, perhaps 1,000 per second. So the location store is write-heavy and the matching query is small and local." },
        { type: "h2", text: "Geospatial indexing" },
        { type: "p", text: "Finding the nearest drivers by computing distance to all of them does not scale. Instead, divide the map into cells and index drivers by cell id; a nearby search then looks at the rider's cell and its neighbours." },
        { type: "table", head: ["Index", "Idea", "Note"], rows: [
          ["Geohash", "Base32 string; shared prefix means nearby", "Simple; edges between cells are awkward"],
          ["Quadtree", "Split dense regions into four", "Adapts to density; harder to shard"],
          ["S2 / H3", "Hierarchical cells on a sphere or hexagons", "Uniform neighbours; H3 comes from Uber"],
          ["Redis GEO", "Sorted set with geohash scores", "Good first version; one key per region"],
        ] },
        { type: "p", text: "Cell size is a tuning knob: roughly 1 km cells in a city, larger in rural areas. Expand to a ring of neighbouring cells if too few drivers are found. Shard the location service by city or by cell range, because trips rarely cross regions." },
        { type: "h2", text: "Location updates and matching" },
        { type: "p", text: "Location writes go to an in-memory store, not a disk database. Only the latest position matters, so each update overwrites the previous one under the driver id with a TTL of about 30 seconds; a driver who stops reporting drops out of the index. A stream (Kafka) copies updates to long-term storage for trip history and analytics, off the hot path." },
        { type: "list", items: [
          "Rider sends a request; the matching service queries the cell and neighbours for available drivers.",
          "Rank candidates by estimated time of arrival using a road-network estimate, not straight-line distance, and by rating or acceptance rate.",
          "Offer the trip to the top driver with a 10-15 second timeout; on decline or timeout, offer to the next.",
          "Claim the driver atomically, for example a compare-and-set on `driver.status` from `available` to `offered`, so two concurrent requests cannot both get the same driver.",
        ] },
        { type: "code", language: "text", code: `GEOADD drivers:sf 77.59 12.97 driver:42        # update position
GEOSEARCH drivers:sf FROMLONLAT 77.59 12.97 BYRADIUS 2 km ASC COUNT 10` },
        { type: "p", text: "Rider and driver see each other's location over a WebSocket or server-sent stream during the trip, fed by the same update pipeline. The trip itself is a state machine (requested, matched, arriving, in progress, completed) stored in a durable database, since that data must not be lost." },
        { type: "h2", text: "Bottlenecks and trade-offs" },
        { type: "p", text: "Dense places such as an airport or stadium concentrate drivers and riders into one cell, so subdivide hot cells or shard them separately. Batching requests for a second or two and solving the assignment together gives better global matches than greedy one-by-one matching, at the price of a small delay. Reducing update frequency when a driver is stationary saves a lot of write load." },
        { type: "callout", tone: "tip", title: "Split hot data from durable data", text: "Driver positions are ephemeral and high-volume, so keep them in memory with a TTL. Trips and payments are low-volume and must survive, so keep them in a transactional database. Saying this clearly shows you understand the two workloads." },
      ],
      references: [
        { title: "H3: Hexagonal hierarchical geospatial indexing system", url: "https://h3geo.org/docs" },
        { title: "S2 Geometry", url: "https://s2geometry.io/" },
        { title: "GEOSEARCH (Redis)", url: "https://redis.io/docs/latest/commands/geosearch/" },
        { title: "Geohash (Wikipedia)", url: "https://en.wikipedia.org/wiki/Geohash" },
      ],
    },
  },
};
