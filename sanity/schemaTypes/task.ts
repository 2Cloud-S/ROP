import { defineType, defineField } from "sanity";

export const task = defineType({
  name: "task",
  title: "Task",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title" },
      description: "Stable identifier used by the game backend",
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: "description", title: "Description", type: "text", rows: 2 }),
    defineField({
      name: "icon",
      title: "Icon",
      type: "string",
      description: "Emoji or lucide icon name",
    }),
    defineField({
      name: "rewardType",
      title: "Reward Type",
      type: "string",
      options: {
        list: ["water", "nutrients", "sunlight", "mixed", "discovery"],
      },
    }),
    defineField({ name: "rewardAmount", title: "Reward Amount", type: "number" }),
    defineField({
      name: "cooldownHours",
      title: "Cooldown (hours)",
      type: "number",
      description: "Minimum hours before this task can be completed again (0 = repeatable)",
    }),
    defineField({ name: "category", title: "Category", type: "string" }),
    defineField({
      name: "difficulty",
      title: "Difficulty",
      type: "string",
      options: { list: ["easy", "medium", "hard"] },
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "rewardType" },
  },
});
