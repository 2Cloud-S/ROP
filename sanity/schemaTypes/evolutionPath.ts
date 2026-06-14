import { defineType, defineField } from "sanity";

export const evolutionPath = defineType({
  name: "evolutionPath",
  title: "Evolution Path",
  type: "document",
  fields: [
    defineField({
      name: "fromPlant",
      title: "From Plant",
      type: "reference",
      to: [{ type: "plantSpecies" }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "toPlant",
      title: "To Plant",
      type: "reference",
      to: [{ type: "plantSpecies" }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "requiredLevel",
      title: "Required Level",
      type: "number",
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: "evolutionDescription",
      title: "Evolution Description",
      type: "text",
      rows: 3,
    }),
  ],
  preview: {
    select: { from: "fromPlant.name", to: "toPlant.name", level: "requiredLevel" },
    prepare({ from, to, level }) {
      return {
        title: `${from ?? "?"} → ${to ?? "?"}`,
        subtitle: `Requires level ${level ?? "?"}`,
      };
    },
  },
});
