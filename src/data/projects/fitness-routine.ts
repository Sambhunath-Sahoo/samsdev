import type { DetailedProject } from "@/types/content";

export const FITNESS_ROUTINE: DetailedProject = {
  slug: "fitness-routine",
  title: "Fitness Routine",
  subtitle: "7-day fat loss guide",
  status: "live",
  description:
    "A single-page 7-day fat loss plan with a daily workout, a timed Indian diet plan, a weekly progress tracker and five switchable colour themes.",
  image: "",
  tech: ["HTML", "CSS", "JavaScript", "Vercel"],
  fullDescription:
    "Fitness Routine is a dependency-free single-page guide built around a home training plan. It lays out eight core exercises and a six-minute ab finisher, a day-by-day schedule with a rest day, a timed diet plan from wake-up to bedtime with hydration and foods to avoid, and week-by-week expectations for results. Each day expands to show its session with tickable exercises, and a weekly tracker lets you mark days as done. Five colour themes (Dark, Light, Ocean, Forest and Sunset) are built on CSS custom properties, and the chosen theme is remembered between visits.",
  features: [
    "Eight core exercises plus a six-minute ab finisher",
    "Day-by-day weekly plan with an evening session and rest days",
    "Timed diet plan with hydration and foods to avoid",
    "Weekly tracker and tickable exercises for each day",
    "Four-phase progression guidance",
    "Five colour themes on CSS custom properties, remembered in local storage",
  ],
  links: {
    live: "https://fitness-routinev2.vercel.app/",
  },
};
