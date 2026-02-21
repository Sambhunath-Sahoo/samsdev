import { defineField, defineType } from "sanity";

export default defineType({
  name: "skills",
  title: "Skills",
  type: "document",
  fields: [
    defineField({
      name: "frontend",
      title: "Frontend",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "backend",
      title: "Backend",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "devopsCloud",
      title: "DevOps & Cloud",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "ai",
      title: "AI",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "toolsPractices",
      title: "Tools & Practices",
      type: "array",
      of: [{ type: "string" }],
    }),
  ],
  preview: {
    prepare() {
      return {
        title: "Skills",
      };
    },
  },
});
