import { defineField, defineType } from "sanity";

export default defineType({
  name: "contacts",
  title: "Contacts",
  type: "document",
  fields: [
    defineField({ name: "email", title: "Email", type: "string" }),
    defineField({ name: "github", title: "GitHub", type: "url" }),
    defineField({ name: "linkedin", title: "LinkedIn", type: "url" }),
  ],
  preview: {
    prepare() {
      return {
        title: "Contacts",
      };
    },
  },
});
