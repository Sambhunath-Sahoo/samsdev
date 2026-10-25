import type { LessonEntry } from "@/types/roadmap";
import { URL_SHORTENER_RATE_LIMITER } from "./url-shortener-rate-limiter";
import { NEWS_FEED_CHAT_NOTIFICATIONS } from "./news-feed-chat-notifications";
import { FILE_STORAGE_VIDEO_STREAMING } from "./file-storage-video-streaming";
import { INFRASTRUCTURE_KV_CACHE_SCHEDULER } from "./infrastructure-kv-cache-scheduler";
import { BOOKING_AND_TICKETING } from "./booking-and-ticketing";
import { PAYMENT_SYSTEM } from "./case-payment-system";
import { TYPEAHEAD } from "./case-typeahead";
import { WEB_CRAWLER } from "./case-web-crawler";
import { RIDE_HAILING } from "./case-ride-hailing";

export const ENTRIES: readonly LessonEntry[] = [
  URL_SHORTENER_RATE_LIMITER,
  NEWS_FEED_CHAT_NOTIFICATIONS,
  FILE_STORAGE_VIDEO_STREAMING,
  INFRASTRUCTURE_KV_CACHE_SCHEDULER,
  BOOKING_AND_TICKETING,
  PAYMENT_SYSTEM,
  TYPEAHEAD,
  WEB_CRAWLER,
  RIDE_HAILING,
];
