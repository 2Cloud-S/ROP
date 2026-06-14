import { defineType, defineField } from "sanity";

export const rarityDefinition = defineType({
  name: "rarityDefinition",
  title: "Rarity Definition",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "dropRate",
      title: "Drop Rate",
      type: "number",
      description: "Approximate discovery rate as a percentage",
    }),
    defineField({
      name: "colorHex",
      title: "Color Hex",
      type: "string",
      description: "Theme color for this rarity (hex)",
    }),
    defineField({
      name: "glowEffect",
      title: "Glow Effect",
      type: "string",
      description: "CSS color/value used for the rarity aura in the UI",
    }),
    defineField({ name: "description", title: "Description", type: "text", rows: 2 }),
  ],
  preview: {
    select: { title: "name", subtitle: "dropRate" },
    prepare({ title, subtitle }) {
      return {
        title: title ?? "Rarity",
        subtitle: subtitle != null ? `${subtitle}% drop rate` : undefined,
      };
    },
  },
});
