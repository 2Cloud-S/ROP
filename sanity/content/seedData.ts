/**
 * Canonical launch content for Rise of the Plants.
 * Consumed by scripts/seed.ts to populate the Sanity dataset.
 * Sanity remains the source of truth — these are just the initial seeds.
 */

export interface RaritySeed {
  key: string; // rarity-<key>
  name: string;
  dropRate: number;
  colorHex: string;
  glowEffect: string;
  description: string;
}

export interface SpeciesSeed {
  slug: string;
  name: string;
  rarityKey: string;
  description: string;
  loreExcerpt?: string;
  personality?: string;
  habitat: string;
  attack: number;
  defense: number;
  health: number;
  evolutionStage: number;
  primaryColor: string;
  discoveryHint?: string;
}

export interface EvolutionSeed {
  from: string; // species slug
  to: string; // species slug
  requiredLevel: number;
  evolutionDescription: string;
}

export interface TaskSeed {
  slug: string;
  title: string;
  description: string;
  icon: string;
  rewardType: string;
  rewardAmount: number;
  category: string;
  difficulty: string;
}

export interface RewardSeed {
  rewardType: string;
  displayName: string;
  icon: string;
  description: string;
  value: number;
}

export interface CodexSeed {
  plantSlug: string;
  lore: string[];
  habitatDetails: string;
  discoveryStory: string;
  botanicalNotes: string;
  hiddenFact: string;
}

export const rarities: RaritySeed[] = [
  {
    key: "common",
    name: "Common",
    dropRate: 70,
    colorHex: "#7CB342",
    glowEffect: "rgba(124, 179, 66, 0.45)",
    description: "Young species that adapt easily to the world around them.",
  },
  {
    key: "rare",
    name: "Rare",
    dropRate: 25,
    colorHex: "#5C6BC0",
    glowEffect: "rgba(92, 107, 192, 0.55)",
    description: "Species touched by magical environments and rare conditions.",
  },
  {
    key: "legendary",
    name: "Legendary",
    dropRate: 5,
    colorHex: "#FFD54F",
    glowEffect: "rgba(255, 213, 79, 0.7)",
    description:
      "Ancient guardians connected directly to the Verdant Weave itself.",
  },
];

export const species: SpeciesSeed[] = [
  // --- Common ---
  {
    slug: "mossling",
    name: "Mossling",
    rarityKey: "common",
    description:
      "A cheerful moss-covered spirit known for restoring life wherever it travels.",
    personality: "Curious and playful.",
    habitat: "Dewgrove Meadows",
    attack: 10,
    defense: 15,
    health: 30,
    evolutionStage: 1,
    primaryColor: "#7CB342",
    discoveryHint: "Look where morning dew gathers longest.",
  },
  {
    slug: "leaflet",
    name: "Leaflet",
    rarityKey: "common",
    description: "A tiny leaf spirit carried by gentle winds.",
    personality: "Energetic and adventurous.",
    habitat: "Dewgrove Meadows",
    attack: 14,
    defense: 10,
    health: 28,
    evolutionStage: 1,
    primaryColor: "#9CCC65",
    discoveryHint: "Follow the dancing leaves.",
  },
  {
    slug: "dewbud",
    name: "Dewbud",
    rarityKey: "common",
    description: "A flower bud spirit that stores magical dew.",
    personality: "Gentle and patient.",
    habitat: "Dewgrove Meadows",
    attack: 11,
    defense: 14,
    health: 31,
    evolutionStage: 1,
    primaryColor: "#80CBC4",
    discoveryHint: "Where petals hold the dawn, a bud waits to wake.",
  },
  {
    slug: "fernlet",
    name: "Fernlet",
    rarityKey: "common",
    description: "A young fern guardian with surprising resilience.",
    personality: "Protective.",
    habitat: "Emerald Wilds",
    attack: 12,
    defense: 16,
    health: 34,
    evolutionStage: 1,
    primaryColor: "#66BB6A",
    discoveryHint: "Beneath the oldest canopy, small guardians stand watch.",
  },
  {
    slug: "rootkin",
    name: "Rootkin",
    rarityKey: "common",
    description: "A stubborn root creature that anchors itself during storms.",
    personality: "Loyal and dependable.",
    habitat: "Emerald Wilds",
    attack: 13,
    defense: 18,
    health: 35,
    evolutionStage: 1,
    primaryColor: "#8D6E63",
    discoveryHint: "Seek the roots that refuse to be moved.",
  },
  // --- Rare ---
  {
    slug: "moon-fern",
    name: "Moon Fern",
    rarityKey: "rare",
    description: "A luminous fern that blooms only beneath moonlight.",
    loreExcerpt:
      "Ancient stories claim Moon Ferns remember every moonrise they have witnessed.",
    personality: "Quiet and mysterious.",
    habitat: "Moonshade Glades",
    attack: 25,
    defense: 22,
    health: 55,
    evolutionStage: 2,
    primaryColor: "#5C6BC0",
    discoveryHint: "It only reveals itself under a full and patient moon.",
  },
  {
    slug: "crystal-vine",
    name: "Crystal Vine",
    rarityKey: "rare",
    description: "A climbing plant infused with crystal energy.",
    loreExcerpt: "Its crystalline petals can refract magical energy.",
    personality: "Analytical and calm.",
    habitat: "Crystal Hollow",
    attack: 24,
    defense: 28,
    health: 52,
    evolutionStage: 2,
    primaryColor: "#26C6DA",
    discoveryHint: "Follow the light that bends inside the stone.",
  },
  {
    slug: "azure-orchid",
    name: "Azure Orchid",
    rarityKey: "rare",
    description: "A radiant orchid with glowing blue petals.",
    personality: "Elegant and wise.",
    habitat: "Moonshade Glades",
    attack: 27,
    defense: 21,
    health: 53,
    evolutionStage: 2,
    primaryColor: "#42A5F5",
    discoveryHint: "Where moonlight pools, a blue flame blooms.",
  },
  {
    slug: "ember-blossom",
    name: "Ember Blossom",
    rarityKey: "rare",
    description: "A fiery flower spirit fueled by volcanic heat.",
    personality: "Bold and competitive.",
    habitat: "Ember Highlands",
    attack: 30,
    defense: 18,
    health: 50,
    evolutionStage: 2,
    primaryColor: "#EF5350",
    discoveryHint: "Listen for the bloom that crackles like a hearth.",
  },
  {
    slug: "thorn-sage",
    name: "Thorn Sage",
    rarityKey: "rare",
    description: "An ancient thorn-covered protector.",
    personality: "Stoic and disciplined.",
    habitat: "Emerald Wilds",
    attack: 22,
    defense: 32,
    health: 60,
    evolutionStage: 2,
    primaryColor: "#7E57C2",
    discoveryHint: "The deepest thicket guards the wisest thorns.",
  },
  // --- Legendary ---
  {
    slug: "solar-lotus",
    name: "Solar Lotus",
    rarityKey: "legendary",
    description:
      "A radiant lotus said to channel sunlight directly from the heavens.",
    loreExcerpt: "Legends say the first dawn was born from a Solar Lotus bloom.",
    personality: "Noble and compassionate.",
    habitat: "Celestial Canopy",
    attack: 50,
    defense: 45,
    health: 100,
    evolutionStage: 3,
    primaryColor: "#FFD54F",
    discoveryHint: "Only those who chase the dawn will ever see it open.",
  },
  {
    slug: "celestial-rose",
    name: "Celestial Rose",
    rarityKey: "legendary",
    description: "A sacred rose whose petals resemble stars.",
    loreExcerpt:
      "Its petals are believed to contain fragments of forgotten constellations.",
    personality: "Wise and serene.",
    habitat: "Celestial Canopy",
    attack: 48,
    defense: 50,
    health: 95,
    evolutionStage: 3,
    primaryColor: "#F48FB1",
    discoveryHint: "Count the stars that fall and one may bloom in your hands.",
  },
  {
    slug: "worldroot",
    name: "Worldroot",
    rarityKey: "legendary",
    description: "The oldest known Plant Spirit, ancient beyond comprehension.",
    loreExcerpt:
      "Worldroot is believed to be directly connected to the Verdant Weave itself.",
    personality: "Ancient beyond comprehension.",
    habitat: "Worldroot Depths",
    attack: 55,
    defense: 55,
    health: 120,
    evolutionStage: 3,
    primaryColor: "#A1887F",
    discoveryHint: "Many botanists doubt it truly exists.",
  },
];

export const evolutions: EvolutionSeed[] = [
  {
    from: "mossling",
    to: "azure-orchid",
    requiredLevel: 3,
    evolutionDescription:
      "Drinking deep of moonlit dew, the Mossling unfurls into a radiant Azure Orchid.",
  },
  {
    from: "azure-orchid",
    to: "solar-lotus",
    requiredLevel: 7,
    evolutionDescription:
      "Reaching toward the Celestial Canopy, the orchid ignites into the legendary Solar Lotus.",
  },
  {
    from: "fernlet",
    to: "moon-fern",
    requiredLevel: 3,
    evolutionDescription:
      "Bathed in moonlight, the young Fernlet awakens its luminous Moon Fern form.",
  },
  {
    from: "moon-fern",
    to: "celestial-rose",
    requiredLevel: 7,
    evolutionDescription:
      "Remembering a thousand moonrises, the Moon Fern blooms into the Celestial Rose.",
  },
  {
    from: "rootkin",
    to: "thorn-sage",
    requiredLevel: 3,
    evolutionDescription:
      "Years of weathered storms harden the Rootkin into the disciplined Thorn Sage.",
  },
  {
    from: "thorn-sage",
    to: "worldroot",
    requiredLevel: 7,
    evolutionDescription:
      "Sinking its roots to the heart of Verdantia, the Thorn Sage becomes the eternal Worldroot.",
  },
  {
    from: "dewbud",
    to: "crystal-vine",
    requiredLevel: 3,
    evolutionDescription:
      "Crystallizing its stored dew, the Dewbud climbs skyward as the Crystal Vine.",
  },
  {
    from: "leaflet",
    to: "ember-blossom",
    requiredLevel: 3,
    evolutionDescription:
      "Carried to the highlands, the Leaflet catches volcanic warmth and flares into the Ember Blossom.",
  },
];

export const tasks: TaskSeed[] = [
  {
    slug: "drink-water",
    title: "Drink Water",
    description: "Hydrate yourself and your plants.",
    icon: "💧",
    rewardType: "water",
    rewardAmount: 10,
    category: "wellness",
    difficulty: "easy",
  },
  {
    slug: "exercise",
    title: "Exercise",
    description: "Healthy movement strengthens growth.",
    icon: "🏃",
    rewardType: "nutrients",
    rewardAmount: 10,
    category: "wellness",
    difficulty: "medium",
  },
  {
    slug: "study-session",
    title: "Study Session",
    description: "Knowledge fuels magical development.",
    icon: "📚",
    rewardType: "sunlight",
    rewardAmount: 10,
    category: "growth",
    difficulty: "medium",
  },
  {
    slug: "daily-check-in",
    title: "Daily Check-In",
    description: "Consistency creates flourishing gardens.",
    icon: "🌙",
    rewardType: "mixed",
    rewardAmount: 5,
    category: "daily",
    difficulty: "easy",
  },
  {
    slug: "nature-walk",
    title: "Nature Walk",
    description: "Explore the natural world around you.",
    icon: "🍃",
    rewardType: "discovery",
    rewardAmount: 0,
    category: "exploration",
    difficulty: "easy",
  },
];

export const rewards: RewardSeed[] = [
  {
    rewardType: "water",
    displayName: "Water",
    icon: "💧",
    description: "Essential hydration that fuels steady growth.",
    value: 10,
  },
  {
    rewardType: "nutrients",
    displayName: "Nutrients",
    icon: "🌱",
    description: "Rich minerals that strengthen plant spirits.",
    value: 10,
  },
  {
    rewardType: "sunlight",
    displayName: "Sunlight",
    icon: "☀️",
    description: "Radiant energy that powers evolution.",
    value: 10,
  },
  {
    rewardType: "mixed",
    displayName: "Mixed Resources",
    icon: "✨",
    description: "A balanced bundle of water, nutrients, and sunlight.",
    value: 5,
  },
  {
    rewardType: "discovery",
    displayName: "Discovery Chance",
    icon: "🔮",
    description: "A bonus roll to uncover a new species.",
    value: 0,
  },
];

export const codex: CodexSeed[] = [
  {
    plantSlug: "mossling",
    lore: [
      "The Mossling is among the first spirits to wake each spring, rolling across the Dewgrove Meadows and leaving a trail of fresh green wherever it pauses.",
      "Botanists believe a single Mossling can revive an entire meadow if left undisturbed for a season.",
    ],
    habitatDetails:
      "Dewgrove Meadows — rolling grasslands blanketed in glowing morning dew.",
    discoveryStory:
      "The earliest Codex pages describe a Mossling guiding a lost explorer home by lighting the dew beneath their feet.",
    botanicalNotes:
      "Its mossy coat absorbs moisture from the air, allowing it to thrive far from any stream.",
    hiddenFact: "A Mossling hums faintly when it is content.",
  },
  {
    plantSlug: "leaflet",
    lore: [
      "Leaflets ride the wind in great spirals, racing one another across the meadow until they tire and settle on a sunlit stone.",
    ],
    habitatDetails: "Dewgrove Meadows — open grasslands swept by gentle winds.",
    discoveryStory:
      "A Leaflet was first catalogued after one landed on a botanist's open journal and refused to leave.",
    botanicalNotes:
      "Its single leaf is impossibly light, letting it glide for hours without rest.",
    hiddenFact: "Leaflets are said to whisper directions to lost travelers.",
  },
  {
    plantSlug: "dewbud",
    lore: [
      "The Dewbud holds a single drop of enchanted dew at its heart, releasing it only to heal a wilting friend.",
    ],
    habitatDetails: "Dewgrove Meadows — quiet hollows where dew lingers past noon.",
    discoveryStory:
      "Discovered beside a dried spring it had single-handedly kept alive.",
    botanicalNotes: "Its bud never fully opens until the moment it evolves.",
    hiddenFact: "A Dewbud's dew is sweeter than any spring water.",
  },
  {
    plantSlug: "fernlet",
    lore: [
      "Small but unshakeable, the Fernlet plants itself between danger and the weak, refusing to yield.",
    ],
    habitatDetails: "Emerald Wilds — dense magical forests dappled with light.",
    discoveryStory:
      "A Fernlet was found shielding a nest of smaller spirits from a storm.",
    botanicalNotes: "Its fronds stiffen like armor when threatened.",
    hiddenFact: "Fernlets grow a new frond for every friend they protect.",
  },
  {
    plantSlug: "rootkin",
    lore: [
      "When the storms of the Emerald Wilds rage, the Rootkin digs in and becomes immovable, anchoring the soil itself.",
    ],
    habitatDetails: "Emerald Wilds — storm-battered groves of ancient trees.",
    discoveryStory:
      "Explorers once survived a flood by holding onto a Rootkin that would not budge.",
    botanicalNotes: "Its roots can extend many times its visible height.",
    hiddenFact: "Rootkin remember every place they have ever taken root.",
  },
  {
    plantSlug: "moon-fern",
    lore: [
      "The Moon Fern glows softly in the dark, unfurling its fronds only when moonlight touches them.",
      "It is said each frond records a single moonrise, and the oldest Moon Ferns hold centuries of nights.",
    ],
    habitatDetails: "Moonshade Glades — forests lit entirely by the moon.",
    discoveryStory:
      "First seen as a pale light drifting between trees on a moonless expedition.",
    botanicalNotes: "Its luminescence fades to grey under direct sunlight.",
    hiddenFact: "Moon Ferns bloom brightest during a lunar eclipse.",
  },
  {
    plantSlug: "crystal-vine",
    lore: [
      "Growing through veins of luminous crystal, the Crystal Vine refracts magic into shimmering rainbows.",
    ],
    habitatDetails: "Crystal Hollow — caverns filled with glowing crystal.",
    discoveryStory:
      "Found weaving itself through a collapsed crystal cavern, holding the ceiling aloft.",
    botanicalNotes: "Its petals are as hard as gemstone yet flex like silk.",
    hiddenFact: "A Crystal Vine can store and release sunlight days later.",
  },
  {
    plantSlug: "azure-orchid",
    lore: [
      "The Azure Orchid blooms in pools of moonlight, its petals burning a cool, steady blue.",
    ],
    habitatDetails: "Moonshade Glades — silver clearings within moonlit forests.",
    discoveryStory:
      "Mistaken at first for a fallen star resting on the forest floor.",
    botanicalNotes: "Its glow intensifies in the presence of other spirits.",
    hiddenFact: "Azure Orchids are believed to calm troubled minds.",
  },
  {
    plantSlug: "ember-blossom",
    lore: [
      "Fueled by the heat of the Ember Highlands, the Ember Blossom crackles and sparks with restless energy.",
    ],
    habitatDetails: "Ember Highlands — volcanic plateaus rich in magic minerals.",
    discoveryStory:
      "Spotted blooming defiantly at the very edge of an active vent.",
    botanicalNotes: "Its petals are warm to the touch but never burn a friend.",
    hiddenFact: "Ember Blossoms bloom larger the hotter their surroundings.",
  },
  {
    plantSlug: "thorn-sage",
    lore: [
      "The Thorn Sage has stood guard over the deep wilds for generations, patient and unyielding.",
    ],
    habitatDetails: "Emerald Wilds — the oldest and densest thickets.",
    discoveryStory:
      "Found at the center of a thorn maze that seemed to part only for the worthy.",
    botanicalNotes: "Its thorns regrow instantly and never dull.",
    hiddenFact: "A Thorn Sage will lower its thorns for those it trusts.",
  },
  {
    plantSlug: "solar-lotus",
    lore: [
      "High in the Celestial Canopy, the Solar Lotus opens at dawn to drink sunlight straight from the sky.",
      "Legends say the very first sunrise was born from a single Solar Lotus bloom.",
    ],
    habitatDetails: "Celestial Canopy — floating gardens above the clouds.",
    discoveryStory:
      "Witnessed only once, blooming at the exact moment of a solar dawn.",
    botanicalNotes: "Its glow is warm enough to be felt from far below.",
    hiddenFact: "A blooming Solar Lotus can briefly turn night into day.",
  },
  {
    plantSlug: "celestial-rose",
    lore: [
      "The Celestial Rose wears petals like scattered constellations, each one a fragment of a forgotten sky.",
    ],
    habitatDetails: "Celestial Canopy — the highest floating gardens.",
    discoveryStory:
      "Said to appear only to botanists who have mapped the night sky by heart.",
    botanicalNotes: "Its petals shimmer with starlight even in total darkness.",
    hiddenFact: "Each Celestial Rose is said to mirror a different constellation.",
  },
  {
    plantSlug: "worldroot",
    lore: [
      "Worldroot is the oldest spirit of all, its roots said to thread through the entire Verdant Weave.",
      "So few have seen it that many botanists insist it is only a beautiful myth.",
    ],
    habitatDetails: "Worldroot Depths — the hidden heart of Verdantia.",
    discoveryStory:
      "No verified sighting exists; only a single page in the Grand Codex, written in an unknown hand.",
    botanicalNotes:
      "If Worldroot exists, every plant spirit may be a distant leaf of its endless root.",
    hiddenFact: "Worldroot is rumored to dream the future of the forest.",
  },
];
