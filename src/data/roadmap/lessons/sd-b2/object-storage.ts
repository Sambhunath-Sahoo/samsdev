import type { LessonEntry } from "@/types/roadmap";

export const OBJECT_STORAGE: LessonEntry = {
  track: "system-design",
  section: "Data storage",
  subsection: {
    title: "Object storage",
    slug: "object-storage",
    lesson: {
      summary: "Where files, images and backups belong: flat, durable, cheap storage reached over HTTP, with the database holding only the metadata.",
      minutes: 8,
      blocks: [
        { type: "h2", text: "What it is" },
        { type: "p", text: "Object storage, such as Amazon S3, Google Cloud Storage or Azure Blob Storage, stores **objects** in **buckets**. An object is a blob of bytes plus metadata, addressed by a key like `avatars/42/original.jpg`. The namespace is flat: slashes in keys look like folders, but there are no real directories. You create, read, overwrite and delete whole objects over HTTP. You cannot append to an object or edit a few bytes in the middle." },
        { type: "p", text: "That restriction is what lets it scale to trillions of objects and stay cheap. It is a different tool from a filesystem or a block disk, which allow in-place edits but belong to one machine." },
        { type: "h2", text: "Why not put files in the database" },
        { type: "p", text: "Storing a 4 MB image in a database row bloats the table, slows backups and replication, and pushes bytes through your database connection, which is your scarcest resource. Object storage costs a fraction per gigabyte and is designed for large sequential reads. The usual split: the **bytes** go in the bucket, and the **database stores the key**, size, content type and owner." },
        { type: "h2", text: "Properties to know" },
        { type: "list", items: ["**Durability:** S3 Standard is designed for 99.999999999% (eleven nines) annual durability by storing copies across several facilities. That is durability, not availability, which is lower.", "**Consistency:** S3 gives strong read-after-write consistency for new objects, overwrites and deletes since late 2020, so a read right after a successful write sees the new data.", "**Immutability:** a 'change' replaces the whole object. Turn on **versioning** to keep prior versions and recover from overwrites and deletes.", "**Limits:** one PUT up to 5 GB, an object up to 5 TB, so large files use **multipart upload** (parts from 5 MiB, up to 10,000 parts), which can upload parts in parallel and retry only a failed part."] },
        { type: "h2", text: "Uploading without your server in the middle" },
        { type: "p", text: "Streaming every upload through your API wastes bandwidth and ties up workers. Instead the API issues a **presigned URL**: a time-limited URL signed with your credentials that lets the client do exactly one operation on exactly one key." },
        {
          type: "code",
          language: "text",
          title: "Direct upload flow",
          code: `1. Client -> API: "I want to upload photo.jpg, 3 MB, image/jpeg"
2. API checks auth and limits, creates DB row (status=pending),
   returns presigned PUT URL for key uploads/<uuid>.jpg, expiring in 5 min
3. Client -> bucket: PUT the bytes straight to that URL
4. Bucket event / client callback -> API: mark row status=ready
5. Reads: serve through a CDN in front of the bucket`,
        },
        { type: "h2", text: "Cost and tiers" },
        {
          type: "table",
          head: ["Concern", "Typical answer"],
          rows: [
            ["Hot, frequently read", "Standard class, with a CDN to cut egress and latency"],
            ["Rarely read", "Infrequent-access or archive classes: cheaper storage, retrieval fees, minimum storage periods"],
            ["Aging data", "Lifecycle rules that move objects to colder tiers or delete them after N days"],
            ["Many small files", "Per-request charges dominate; batch or pack small objects"],
          ],
        },
        { type: "callout", tone: "cost", title: "Egress and requests are the surprise bill", text: "Storing a terabyte is cheap. Serving it to the internet is not, because data transfer out is billed per gigabyte, and every GET and PUT has a request charge. Put a CDN in front and set cache headers before the traffic arrives." },
        { type: "p", text: "In an interview, say 'bytes in object storage, metadata in the database' for any system with images, video or documents, and mention presigned URLs, multipart upload and a CDN for delivery. Keep the bucket private by default and never make it public just to serve user files." },
      ],
      references: [
        { title: "Amazon S3 User Guide: What is Amazon S3?", url: "https://docs.aws.amazon.com/AmazonS3/latest/userguide/Welcome.html" },
        { title: "Amazon S3 User Guide: Sharing objects with presigned URLs", url: "https://docs.aws.amazon.com/AmazonS3/latest/userguide/using-presigned-url.html" },
        { title: "Amazon S3 User Guide: Uploading and copying objects using multipart upload", url: "https://docs.aws.amazon.com/AmazonS3/latest/userguide/mpuoverview.html" },
        { title: "Amazon S3 User Guide: Using versioning in S3 buckets", url: "https://docs.aws.amazon.com/AmazonS3/latest/userguide/Versioning.html" },
        { title: "Amazon S3 User Guide: Understanding and managing Amazon S3 storage classes", url: "https://docs.aws.amazon.com/AmazonS3/latest/userguide/storage-class-intro.html" },
      ],
    },
    points: [
      { id: "sd.object-storage.bytes-in-bucket-metadata-in-db", title: "Bytes in the bucket, metadata in the database", detail: "Store files in object storage and keep only the key, size, type and owner in the database. This keeps tables small, backups fast and database connections free.", question: "Why not store user-uploaded images in a database column?" },
      { id: "sd.object-storage.presigned-and-multipart", title: "Presigned URLs and multipart upload", detail: "A presigned URL lets the client upload straight to the bucket for one key and a short time. Multipart upload splits big files into parts that upload in parallel and retry individually.", question: "Design an upload flow for a 2 GB video without sending the bytes through your API servers." },
      { id: "sd.object-storage.durability-and-tiers", title: "Durability, versioning and storage tiers", detail: "Eleven-nines durability protects against loss of hardware, not against your own delete, so use versioning. Lifecycle rules move old data to cheaper tiers or expire it.", question: "How would you protect against accidental deletion and keep storage cost down for 3-year-old data?" },
      { id: "sd.object-storage.egress-cost", title: "Egress and request costs", detail: "Data transfer out and per-request fees can exceed storage cost. A CDN and cache headers reduce both.", question: "What is the main cost driver for serving popular images from a bucket, and how do you reduce it?" },
    ],
  },
};
