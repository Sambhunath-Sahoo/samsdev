import type { LessonEntry } from "@/types/roadmap";

export const FILE_STORAGE_VIDEO_STREAMING: LessonEntry = {
  track: "system-design",
  section: "Classic case studies",
  subsection: {
    title: "Storage and media: file storage, video streaming",
    slug: "case-file-storage-video-streaming",
    lesson: {
      summary: "Split big objects into chunks and keep metadata separate; for video, pre-encode many renditions and serve them from the edge.",
      minutes: 10,
      blocks: [
        { type: "h2", text: "File storage: chunking, deduplication and metadata" },
        { type: "p", text: "Requirements: upload, download and sync files across devices, share links, keep version history, never lose data. Estimates: 50M users, 10 GB each on average is 500 PB raw. Nobody stores that on one machine, so the design is about splitting and indexing." },
        { type: "p", text: "Split every file into chunks of about 4 MB. Each chunk is stored as an immutable blob in object storage under the hash of its content (for example SHA-256). A file is then a list of chunk hashes in a metadata row. Benefits: uploads resume per chunk, a changed file re-uploads only the changed chunks, and two files with the same chunk share one stored copy." },
        { type: "p", text: "**Deduplication** follows from content addressing: before uploading, the client sends the chunk hashes, the server answers which are missing, and only those are sent. Fixed-size chunks break dedup when a byte is inserted near the start; content-defined chunking fixes that at the cost of more CPU. Cross-user dedup also leaks whether someone else already has a file, which is a privacy trade-off to mention." },
        { type: "code", language: "sql", title: "metadata (relational, sharded by user)", code: `files(file_id, owner_id, path, version, size, updated_at)
file_versions(file_id, version, chunk_list /* ordered hashes */)
chunks(hash PRIMARY KEY, size, refcount, storage_key)` },
        { type: "p", text: "Metadata is small and needs transactions, so keep it in a relational store; the bytes go to object storage with replication or erasure coding across zones. Clients upload directly with a pre-signed URL so file bytes never pass through your API servers. For sync, the server pushes a change notification and the client fetches the new version's chunk list. Garbage-collect a chunk only when its refcount reaches zero, and delay it so an in-flight upload cannot lose a chunk it just matched." },
        { type: "h2", text: "Video streaming: transcoding, adaptive bitrate and CDN" },
        { type: "p", text: "Requirements: creators upload, viewers watch with little buffering on any network and device. The read path dwarfs the write path, and bandwidth is the main cost: 10 million concurrent viewers at 3 Mbps is 30 Tbps, which only an edge network can serve." },
        { type: "p", text: "Pipeline: the original upload lands in object storage. A job queue fans it out. A splitter cuts the video into segments of a few seconds; workers **transcode** each segment into a ladder of renditions (for example 240p, 480p, 720p, 1080p, 4K) and codecs; a packager writes manifests for HLS or DASH. Transcoding is CPU-heavy and parallel by segment, so it suits a queue plus autoscaled workers, and a failed segment is retried alone." },
        { type: "p", text: "**Adaptive bitrate**: the player downloads the manifest, measures throughput and buffer level, and picks the rendition for each next segment, switching up or down seamlessly. The server stays dumb; the client makes the decision, and everything it fetches is a plain cacheable HTTP file." },
        { type: "list", items: [
          "**CDN**: segments are static files, so they cache extremely well. Popular titles sit on edge servers, even inside ISP networks; cold titles pull from an origin shield, then object storage.",
          "**Pre-positioning**: push tomorrow's expected hits to edges overnight instead of waiting for the first miss.",
          "**Metadata and search** live in a normal database; view counts go through a queue.",
          "**DRM and signed URLs** protect paid content.",
        ] },
        { type: "table", head: ["Choice", "Upside", "Downside"], rows: [
          ["More renditions", "Smoother quality fit", "More storage and encode cost"],
          ["Shorter segments", "Faster switching", "More requests and overhead"],
          ["Encode everything upfront", "Instant playback", "Wasted work on never-watched videos"],
        ] },
        { type: "callout", tone: "cost", title: "Encode lazily for the long tail", text: "Most uploads are watched a handful of times. Encode a small default ladder at upload, and add the expensive renditions only once a video proves popular." },
      ],
      references: [
        { title: "Inside the Magic Pocket (Dropbox)", url: "https://dropbox.tech/infrastructure/inside-the-magic-pocket" },
        { title: "Rewriting the heart of our sync engine (Dropbox)", url: "https://dropbox.tech/infrastructure/rewriting-the-heart-of-our-sync-engine" },
        { title: "Uploading and copying objects using multipart upload (Amazon S3)", url: "https://docs.aws.amazon.com/AmazonS3/latest/userguide/mpuoverview.html" },
        { title: "RFC 8216: HTTP Live Streaming", url: "https://www.rfc-editor.org/rfc/rfc8216" },
        { title: "Netflix Open Connect", url: "https://openconnect.netflix.com/" },
      ],
    },
  },
};
