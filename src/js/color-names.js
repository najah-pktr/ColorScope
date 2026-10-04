/**
 * Curated Designer Color Name Dictionary & Perceptual Distance Matcher
 * Provides evocative, high-end names for palette extraction results.
 */

const COLOR_DICTIONARY = [
  // ─── Thematic Anchors ───
  { name: 'Autumn Ember', r: 224, g: 90, b: 43 },
  { name: 'Alpine Indigo', r: 27, g: 43, b: 74 },
  { name: 'Solar Gold', r: 230, g: 157, b: 59 },
  { name: 'Slate Cyan', r: 75, g: 110, b: 140 },
  { name: 'Crimson Bark', r: 142, g: 78, b: 90 },
  { name: 'Obsidian Night', r: 24, g: 30, b: 41 },
  // ─── Additional Dark / Neutral Bedrock ───
  { name: 'Espresso Ground', r: 42, g: 33, b: 28 },
  { name: 'Ink Basalt', r: 34, g: 37, b: 46 },
  { name: 'Smoked Pearl', r: 120, g: 128, b: 138 },
  { name: 'Dove Ash', r: 176, g: 180, b: 186 },
  { name: 'Moonlit Quartz', r: 226, g: 230, b: 236 },
  { name: 'Ironforge', r: 62, g: 66, b: 73 },
  { name: 'Pewter Dusk', r: 90, g: 96, b: 106 },
  { name: 'Champagne Frost', r: 233, g: 227, b: 214 },
  { name: 'Bone Ivory', r: 235, g: 233, b: 220 },
  { name: 'Cloud Linen', r: 246, g: 243, b: 237 },

  // ─── Additional Warm Embers, Oranges & Corals ───
  { name: 'Ember Ash', r: 168, g: 82, b: 54 },
  { name: 'Rust Canyon', r: 183, g: 73, b: 38 },
  { name: 'Clay Terracotta', r: 203, g: 107, b: 79 },
  { name: 'Sunbaked Adobe', r: 222, g: 143, b: 105 },
  { name: 'Apricot Whisper', r: 253, g: 186, b: 152 },
  { name: 'Tangerine Dream', r: 241, g: 145, b: 63 },
  { name: 'Harvest Pumpkin', r: 214, g: 106, b: 32 },
  { name: 'Copper Vein', r: 160, g: 88, b: 42 },
  { name: 'Golden Brass', r: 189, g: 144, b: 50 },
  { name: 'Antique Bronze', r: 128, g: 96, b: 40 },
  { name: 'Dusty Paprika', r: 190, g: 96, b: 82 },
  { name: 'Sunrise Nectar', r: 250, g: 204, b: 138 },
  { name: 'Peach Sorbet', r: 255, g: 218, b: 185 },
  { name: 'Melon Chiffon', r: 254, g: 230, b: 200 },

  // ─── Additional Reds, Rubies & Burgundy ───
  { name: 'Merlot Depths', r: 105, g: 22, b: 40 },
  { name: 'Oxblood Lacquer', r: 78, g: 16, b: 22 },
  { name: 'Brick Kiln', r: 156, g: 60, b: 42 },
  { name: 'Vermilion Pulse', r: 230, g: 51, b: 42 },
  { name: 'Crimson Tide', r: 220, g: 20, b: 60 },
  { name: 'Garnet Shadow', r: 118, g: 28, b: 32 },
  { name: 'Rose Ash', r: 196, g: 118, b: 116 },
  { name: 'Dusty Rose Petal', r: 214, g: 156, b: 154 },
  { name: 'Blush Silk', r: 240, g: 203, b: 201 },
  { name: 'Wine Cellar', r: 92, g: 32, b: 48 },
  { name: 'Cardinal Ember', r: 178, g: 34, b: 44 },

  // ─── Additional Violets, Purples & Orchids ───
  { name: 'Twilight Mulberry', r: 108, g: 48, b: 116 },
  { name: 'Velvet Aubergine', r: 66, g: 30, b: 74 },
  { name: 'Dusk Orchid', r: 156, g: 100, b: 180 },
  { name: 'Periwinkle Haze', r: 179, g: 173, b: 236 },
  { name: 'Royal Heliotrope', r: 168, g: 85, b: 231 },
  { name: 'Amethyst Dusk', r: 120, g: 88, b: 176 },
  { name: 'Wisteria Veil', r: 214, g: 200, b: 240 },
  { name: 'Plum Noir', r: 52, g: 24, b: 58 },
  { name: 'Ultraviolet Surge', r: 88, g: 28, b: 135 },
  { name: 'Mauve Reverie', r: 190, g: 160, b: 200 },
  { name: 'Iris Bloom', r: 138, g: 122, b: 214 },

  // ─── Additional Blues, Indigos & Cyans ───
  { name: 'Midnight Harbor', r: 18, g: 30, b: 52 },
  { name: 'Storm Petrol', r: 22, g: 58, b: 66 },
  { name: 'Denim Dusk', r: 64, g: 96, b: 148 },
  { name: 'Cornflower Field', r: 110, g: 150, b: 220 },
  { name: 'Cerulean Drift', r: 42, g: 152, b: 200 },
  { name: 'Lagoon Glass', r: 98, g: 208, b: 220 },
  { name: 'Arctic Breeze', r: 190, g: 232, b: 244 },
  { name: 'Steel Verdigris', r: 70, g: 130, b: 136 },
  { name: 'Prussian Vault', r: 20, g: 40, b: 74 },
  { name: 'Azure Velocity', r: 56, g: 152, b: 235 },
  { name: 'Twilight Cadet', r: 88, g: 118, b: 158 },
  { name: 'Deep Fjord', r: 16, g: 50, b: 92 },
  { name: 'Seafoam Whisper', r: 168, g: 230, b: 226 },

  // ─── Additional Greens, Mints & Emeralds ───
  { name: 'Canopy Verdant', r: 30, g: 122, b: 60 },
  { name: 'Emerald Vault', r: 8, g: 96, b: 78 },
  { name: 'Moss Agate', r: 94, g: 118, b: 60 },
  { name: 'Fern Hollow', r: 52, g: 92, b: 44 },
  { name: 'Lichen Stone', r: 126, g: 140, b: 102 },
  { name: 'Basil Frost', r: 148, g: 196, b: 140 },
  { name: 'Sea Glass Mint', r: 160, g: 224, b: 194 },
  { name: 'Chartreuse Spark', r: 186, g: 230, b: 73 },
  { name: 'Matcha Whisk', r: 196, g: 218, b: 156 },
  { name: 'Deep Juniper', r: 24, g: 68, b: 52 },
  { name: 'Verdigris Patina', r: 72, g: 152, b: 132 },
  { name: 'Lunar Celadon', r: 180, g: 214, b: 190 },
  { name: 'Pistachio Cream', r: 222, g: 238, b: 200 },
  { name: 'Hunter Wool', r: 68, g: 84, b: 58 },

  // ─── Additional Yellows & Golds ───
  { name: 'Pressed Gold Leaf', r: 212, g: 175, b: 55 },
  { name: 'Butter Cream', r: 255, g: 245, b: 214 },
  { name: 'Vanilla Lace', r: 249, g: 242, b: 224 },
  { name: 'Mustard Archive', r: 200, g: 164, b: 42 },
  { name: 'Lemon Zephyr', r: 253, g: 240, b: 143 },
  { name: 'Straw Field', r: 229, g: 208, b: 128 },
  { name: 'Honeycomb Glow', r: 242, g: 196, b: 62 },
  { name: 'Flax Linen', r: 224, g: 212, b: 168 },
];

/**
 * Calculates weighted Euclidean distance in RGB color space
 * taking human eye sensitivity into account (red: 30%, green: 59%, blue: 11%)
 */
export function getColorDistance(r1, g1, b1, r2, g2, b2) {
  const rmean = (r1 + r2) / 2;
  const dr = r1 - r2;
  const dg = g1 - g2;
  const db = b1 - b2;
  return Math.sqrt(
    (((512 + rmean) * dr * dr) >> 8) +
    4 * dg * dg +
    (((767 - rmean) * db * db) >> 8)
  );
}

/**
 * Finds the closest evocative color name from the designer dictionary
 */
export function getClosestColorName(r, g, b) {
  let closest = COLOR_DICTIONARY[0];
  let minDistance = Infinity;

  for (const item of COLOR_DICTIONARY) {
    const dist = getColorDistance(r, g, b, item.r, item.g, item.b);
    if (dist < minDistance) {
      minDistance = dist;
      closest = item;
    }
  }

  return closest.name;
}
