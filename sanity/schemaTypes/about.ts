import { defineField, defineType } from "sanity";

export default defineType({
  name: "about",
  title: "About",
  type: "document",
  // Singleton — only one document of this type should exist
  fields: [
    defineField({
      name: "nickname",
      title: "Nickname / Display Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "location",
      title: "Location",
      type: "string",
    }),
    defineField({
      name: "designation",
      title: "Designation / Role",
      type: "string",
    }),
    defineField({
      name: "experienceYears",
      title: "Years of Experience",
      type: "number",
    }),
    defineField({
      name: "shortDescription",
      title: "Short Description",
      type: "text",
      rows: 3,
      description: "A brief one-liner or tagline shown prominently.",
    }),
    defineField({
      name: "longDescription",
      title: "Long Description",
      type: "array",
      of: [{ type: "block" }],
      description: "Full rich-text bio shown on the About page.",
    }),
    defineField({
      name: "skills",
      title: "Skills",
      type: "object",
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
    }),
    defineField({
      name: "contacts",
      title: "Contacts",
      type: "object",
      fields: [
        defineField({ name: "email", title: "Email", type: "string" }),
        defineField({ name: "github", title: "GitHub", type: "url" }),
        defineField({ name: "linkedin", title: "LinkedIn", type: "url" }),
      ],
    }),
  ],
  preview: {
    select: { title: "nickname", subtitle: "designation" },
  },
});
