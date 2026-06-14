/**
 * Canonical launch content for Rise of the Plants.
 * Consumed by scripts/seed.ts to populate the Sanity dataset.
 * Sanity remains the source of truth — these are just the initial seeds.
 *
 * Roster (13 species = 5 Common / 5 Rare / 3 Legendary):
 *   Chain 1: Fernlet (C) -> Moon Fern (R) -> Celestial Fern (L)
 *   Chain 2: Ember Bud (C) -> Ember Blossom (R) -> Solar Lotus (L)
 *   Chain 3: Crystal Sprout (C) -> Crystal Vine (R) -> Celestial Rose (L)
 *   Standalone: Mossling (C, starter), Leaflet (C), Azure Orchid (R), Thorn Sage (R)
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
  cooldownHours?: number;
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
    dropRate: 55,
    colorHex: "#7CB342",
    glowEffect: "rgba(124, 179, 66, 0.45)",
    description: "Young species that adapt easily to the world around them.",
  },
  {
    key: "uncommon",
    name: "Uncommon",
    dropRate: 25,
    colorHex: "#26A69A",
    glowEffect: "rgba(38, 166, 154, 0.5)",
    description: "Species that have begun to draw on the deeper magic of Verdantia.",
  },
  {
    key: "rare",
    name: "Rare",
    dropRate: 14,
    colorHex: "#5C6BC0",
    glowEffect: "rgba(92, 107, 192, 0.55)",
    description: "Species touched by magical environments and rare conditions.",
  },
  {
    key: "epic",
    name: "Epic",
    dropRate: 5,
    colorHex: "#AB47BC",
    glowEffect: "rgba(171, 71, 188, 0.6)",
    description: "Storied spirits whose power bends the world around them.",
  },
  {
    key: "legendary",
    name: "Legendary",
    dropRate: 1,
    colorHex: "#FFD54F",
    glowEffect: "rgba(255, 213, 79, 0.7)",
    description:
      "Ancient guardians connected directly to the Verdant Weave itself.",
  },
];

export const species: SpeciesSeed[] = [
  // --- Common (5) ---
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
    slug: "ember-bud",
    name: "Ember Bud",
    rarityKey: "common",
    description:
      "A tiny bud that smolders with inner warmth, waiting to blossom in the heat of the highlands.",
    personality: "Restless and warm.",
    habitat: "Ember Highlands",
    attack: 14,
    defense: 11,
    health: 29,
    evolutionStage: 1,
    primaryColor: "#FF7043",
    discoveryHint: "Where the ground stays warm long after dusk, a bud smolders.",
  },
  {
    slug: "crystal-sprout",
    name: "Crystal Sprout",
    rarityKey: "common",
    description:
      "A fledgling sprout grown through raw crystal, glittering faintly in the dark of the hollow.",
    personality: "Quiet and curious.",
    habitat: "Crystal Hollow",
    attack: 11,
    defense: 15,
    health: 31,
    evolutionStage: 1,
    primaryColor: "#4DD0E1",
    discoveryHint: "Listen for the faint chime among the stones.",
  },
  // --- Rare (5) ---
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
    evolutionStage: 1,
    primaryColor: "#42A5F5",
    discoveryHint: "Where moonlight pools, a blue flame blooms.",
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
    evolutionStage: 1,
    primaryColor: "#7E57C2",
    discoveryHint: "The deepest thicket guards the wisest thorns.",
  },
  // --- Legendary (3) ---
  {
    slug: "celestial-fern",
    name: "Celestial Fern",
    rarityKey: "legendary",
    description:
      "The ascended Moon Fern, its fronds woven from captured starlight.",
    loreExcerpt:
      "It is said a Celestial Fern bridges the Verdant Weave and the night sky itself.",
    personality: "Serene and timeless.",
    habitat: "Celestial Canopy",
    attack: 52,
    defense: 48,
    health: 105,
    evolutionStage: 3,
    primaryColor: "#69F0AE",
    discoveryHint:
      "Only the patient witness its final unfurling beneath a thousand stars.",
  },
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
];

export const evolutions: EvolutionSeed[] = [
  // Chain 1: Fernlet -> Moon Fern -> Celestial Fern
  {
    from: "fernlet",
    to: "moon-fern",
    requiredLevel: 3,
    evolutionDescription:
      "Bathed in moonlight, the young Fernlet awakens its luminous Moon Fern form.",
  },
  {
    from: "moon-fern",
    to: "celestial-fern",
    requiredLevel: 7,
    evolutionDescription:
      "Remembering a thousand moonrises, the Moon Fern unfurls into the starlit Celestial Fern.",
  },
  // Chain 2: Ember Bud -> Ember Blossom -> Solar Lotus
  {
    from: "ember-bud",
    to: "ember-blossom",
    requiredLevel: 3,
    evolutionDescription:
      "Drinking deep of volcanic warmth, the Ember Bud flares open into the Ember Blossom.",
  },
  {
    from: "ember-blossom",
    to: "solar-lotus",
    requiredLevel: 7,
    evolutionDescription:
      "Reaching toward the Celestial Canopy, the Ember Blossom ignites into the legendary Solar Lotus.",
  },
  // Chain 3: Crystal Sprout -> Crystal Vine -> Celestial Rose
  {
    from: "crystal-sprout",
    to: "crystal-vine",
    requiredLevel: 3,
    evolutionDescription:
      "Crystallizing its stored light, the Crystal Sprout climbs skyward as the Crystal Vine.",
  },
  {
    from: "crystal-vine",
    to: "celestial-rose",
    requiredLevel: 7,
    evolutionDescription:
      "Refracting a fallen star, the Crystal Vine blooms into the Celestial Rose.",
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
    cooldownHours: 24,
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
    cooldownHours: 1,
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
    plantSlug: "ember-bud",
    lore: [
      "The Ember Bud keeps a single coal of warmth at its core, glowing brighter the longer it waits to bloom.",
      "Highland shepherds once followed wandering Ember Buds to find shelter on the coldest nights.",
    ],
    habitatDetails:
      "Ember Highlands — volcanic plateaus where the ground never fully cools.",
    discoveryStory:
      "First noted as a faint orange ember drifting across a darkened slope long after the sun had set.",
    botanicalNotes: "Its outer petals are cool to the touch, hiding the heat within.",
    hiddenFact: "An Ember Bud burns brightest just before it evolves.",
  },
  {
    plantSlug: "crystal-sprout",
    lore: [
      "The Crystal Sprout pushes up through veins of raw crystal, ringing softly as it grows.",
    ],
    habitatDetails: "Crystal Hollow — caverns lined with slow-growing crystal.",
    discoveryStory:
      "Discovered by miners who mistook its faint chiming for the echo of their own tools.",
    botanicalNotes:
      "Its stem hardens into gemstone over time, yet remains supple while young.",
    hiddenFact: "A Crystal Sprout hums a different note for each color of light.",
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
    plantSlug: "celestial-fern",
    lore: [
      "High above the clouds, the Celestial Fern unfurls fronds woven from threads of captured starlight.",
      "Scholars believe it is the living memory of every moonrise its Moon Fern ancestors ever witnessed.",
    ],
    habitatDetails: "Celestial Canopy — floating gardens that drift among the stars.",
    discoveryStory:
      "Recorded only once, glimpsed unfurling at the exact center of a meteor shower.",
    botanicalNotes:
      "Its fronds emit a soft constellation of light that shifts with the night sky.",
    hiddenFact: "A Celestial Fern is said to glow in time with distant stars.",
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
];
