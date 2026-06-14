import { defineType, defineField } from "sanity";

export const rewardDefinition = defineType({
  name: "rewardDefinition",
  title: "Reward Definition",
  type: "document",
  fields: [
    defineField({
      name: "rewardType",
      title: "Reward Type",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: "displayName", title: "Display Name", type: "string" }),
    defineField({
      name: "icon",
      title: "Icon",
      type: "string",
      description: "Emoji or lucide icon name",
    }),
    defineField({ name: "description", title: "Description", type: "text", rows: 2 }),
    defineField({ name: "value", title: "Value", type: "number" }),
  ],
  preview: {
    select: { title: "displayName", subtitle: "rewardType" },
  },
});
