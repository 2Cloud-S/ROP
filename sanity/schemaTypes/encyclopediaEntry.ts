import { defineType, defineField } from "sanity";

export const encyclopediaEntry = defineType({
  name: "encyclopediaEntry",
  title: "Encyclopedia Entry",
  type: "document",
  fields: [
    defineField({
      name: "plantReference",
      title: "Plant",
      type: "reference",
      to: [{ type: "plantSpecies" }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "lore",
      title: "Lore",
      type: "array",
      of: [{ type: "block" }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "habitatDetails",
      title: "Habitat Details",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "discoveryStory",
      title: "Discovery Story",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "botanicalNotes",
      title: "Botanical Notes",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "hiddenFact",
      title: "Hidden Fact",
      type: "text",
      rows: 2,
    }),
  ],
  preview: {
    select: { title: "plantReference.name" },
    prepare({ title }) {
      return { title: title ? `Codex: ${title}` : "Codex Entry" };
    },
  },
});
