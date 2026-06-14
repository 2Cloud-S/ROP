import { defineType, defineField } from "sanity";

export const plantSpecies = defineType({
  name: "plantSpecies",
  title: "Plant Species",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "name" },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "rarity",
      title: "Rarity",
      type: "reference",
      to: [{ type: "rarityDefinition" }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "loreExcerpt",
      title: "Lore Excerpt",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "personality",
      title: "Personality",
      type: "string",
    }),
    defineField({
      name: "habitat",
      title: "Habitat",
      type: "string",
    }),
    defineField({ name: "attack", title: "Attack", type: "number" }),
    defineField({ name: "defense", title: "Defense", type: "number" }),
    defineField({ name: "health", title: "Health", type: "number" }),
    defineField({
      name: "evolutionStage",
      title: "Evolution Stage",
      type: "number",
      description: "1 = base, 2 = evolved, 3 = final",
    }),
    defineField({
      name: "image",
      title: "Main Image",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "gallery",
      title: "Gallery",
      type: "array",
      of: [{ type: "image" }],
    }),
    defineField({
      name: "primaryColor",
      title: "Primary Color",
      type: "string",
      description: "Hex color used for theming this species in the UI",
    }),
    defineField({
      name: "discoveryHint",
      title: "Discovery Hint",
      type: "text",
      rows: 2,
    }),
  ],
  preview: {
    select: { title: "name", subtitle: "habitat", media: "image" },
  },
});
