import type { DetailedProject } from "@/types/content";

export const FOODISHI: DetailedProject = {
  slug: "foodishi",
  title: "Foodishi",
  subtitle: "Food ordering platform",
  status: "in-progress",
  description:
    "A three-sided food ordering platform: a customer app for discovering kitchens and placing orders, a restaurant console for the kitchen, and an operator console for the people running the network.",
  image: "/projects/foodishi/operator-live.jpg",
  gallery: [
    "/projects/foodishi/partner-menu.jpg",
    "/projects/foodishi/customer-discover.jpg",
    "/projects/foodishi/customer-restaurant.jpg",
  ],
  tech: ["Next.js", "TypeScript", "TanStack Query", "FastAPI", "PostgreSQL", "Supabase", "Turborepo"],
  fullDescription:
    "Foodishi is built as a Turborepo monorepo with three Next.js apps on one shared design system and one typed API client. The customer app handles discovery, menus with dish choices, cart, checkout, payments and order tracking. The restaurant console gives managers and staff a live order queue, menu and offer management, team permissions, reports and settlements. The operator console sees every restaurant: onboarding applications, live orders, deliveries, SLAs, refunds and revenue. Behind them sits a fully async FastAPI service over PostgreSQL on Supabase with JWT auth, a 75-route API, an order state machine, pricing and ETA rules, payments and refunds. Both consoles can also run against bundled fixture data that enforces the same permissions and order rules as the API, so every screen is reachable with nothing deployed.",
  features: [
    "Customer app: kitchen discovery with search, cuisine filters, sort and open-now",
    "Menus with dish modifiers, cart pricing and quote-then-place checkout",
    "Order tracking with status events, receipts and support",
    "Restaurant console: live queue, board and list views, lateness chips",
    "Role and permission model: managers grant staff specific actions",
    "Operator console: applications queue, live orders, deliveries, SLA and revenue",
    "Self-serve restaurant onboarding and application review",
    "Async FastAPI backend with order state machine, payments and refunds",
    "Fixture data source that mirrors API rules for offline development",
  ],
  links: {
    github: "https://github.com/Sambhunath-Sahoo/foodishi-web",
  },
};
