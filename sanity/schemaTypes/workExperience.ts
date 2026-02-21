import { defineField, defineType } from "sanity";

export default defineType({
  name: "workExperience",
  title: "Work Experience",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title / Role",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "companyName",
      title: "Company Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "companyLogo",
      title: "Company Logo",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "companyUrl",
      title: "Company URL",
      type: "url",
    }),
    defineField({
      name: "startDate",
      title: "Start Date",
      type: "date",
      options: { dateFormat: "YYYY-MM" },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "endDate",
      title: "End Date",
      type: "date",
      options: { dateFormat: "YYYY-MM" },
      hidden: ({ document }) => document?.currentlyWorking === true,
    }),
    defineField({
      name: "currentlyWorking",
      title: "Currently Working Here?",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "location",
      title: "Location",
      type: "string",
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "array",
      of: [{ type: "string" }],
      description: "Bullet points of your responsibilities and achievements.",
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "companyName",
      media: "companyLogo",
    },
  },
});
