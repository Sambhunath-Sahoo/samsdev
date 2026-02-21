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


  ],
  preview: {
    select: { title: "nickname", subtitle: "designation" },
  },
});
