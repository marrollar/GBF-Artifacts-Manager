export const elements = {
  FIRE: "Fire",
  WATER: "Water",
  EARTH: "Earth",
  WIND: "Wind",
  LIGHT: "Light",
  DARK: "Dark",
  // NONE = "None"
} as const;
export type Element = (typeof elements)[keyof typeof elements];
export const elementSortOrder = new Map([
  ["Fire", 0],
  ["Water", 1],
  ["Earth", 2],
  ["Wind", 3],
  ["Light", 4],
  ["Dark", 5],
]);

export const weapons = {
  SABRE: "Sabre",
  DAGGER: "Dagger",
  SPEAR: "Spear",
  AXE: "Axe",
  STAFF: "Staff",
  GUN: "Gun",
  MELEE: "Melee",
  BOW: "Bow",
  HARP: "Harp",
  KATANA: "Katana",
} as const;
export type Weapon = (typeof weapons)[keyof typeof weapons];
export const weaponSortOrder = new Map([
  ["Sabre", 0],
  ["Dagger", 1],
  ["Spear", 2],
  ["Axe", 3],
  ["Staff", 4],
  ["Gun", 5],
  ["Melee", 6],
  ["Bow", 7],
  ["Harp", 8],
  ["Katana", 9],
]);

export type RawSkillInfo = {
  skill_id: number;
  skill_quality: number;
  level: number;
  name: string;
  is_max_quality: boolean;
  effect_value: string;
};

export type RawArtifact = {
  id: number;
  kind: string;
  attribute: string;
  name: string;
  is_locked: boolean;
  is_quirk: boolean;
  is_unnecessary: boolean;
  skill1_info: RawSkillInfo;
  skill2_info: RawSkillInfo;
  skill3_info: RawSkillInfo;
  skill4_info: RawSkillInfo;
};

export type SkillInfo = {
  id: number;
  quality: number;
  level: number;
  name: string;
  is_max_quality: boolean;
  value: string;
};

export type Artifact = {
  id: number;
  weapon: Weapon;
  element: Element;
  name: string;
  is_locked: boolean;
  is_quirk: boolean;
  is_scrap: boolean;
  s1: SkillInfo;
  s2: SkillInfo;
  s3: SkillInfo;
  s4: SkillInfo;
};

export type ArtifactMap = Record<number, Artifact>

// export type Artifacts = {
//   [id: number]: {
//     weapon: Weapon;
//     element: Element;
//     name: string;
//     is_locked: boolean;
//     is_quirk: boolean;
//     is_scrap: boolean;
//     s1: SkillInfo;
//     s2: SkillInfo;
//     s3: SkillInfo;
//     s4: SkillInfo;
//   };
// };

// export type Artifacts = Record<number, ArtifactItem>;
// export type Artifacts = {
//   [id:number]: ArtifactItem
// }

export interface FilterButtonData {
  name: string;
  aliases?: string[];
}

export const SK1_NAMES: FilterButtonData[] = [
  { name: "ATK" },
  { name: "HP" },
  { name: "Critical Hit Rate" },
  { name: "C.A. DMG", aliases: ["CA DMG"] },
  { name: "Skill DMG" },
  { name: "Debuff Success Rate" },
  { name: "Double Attack Rate", aliases: ["D.A., Rate", "DA Rate"] },
  { name: "Triple Attack Rate", aliases: ["T.A., Rate", "TA Rate"] },
  { name: "DEF" },
  { name: "Debuff Resistance" },
  { name: "Dodge Rate" },
  { name: "Healing" },
  { name: "Elemental ATK" },
  { name: "Superior Element Reduction" },
];

export const SK2_NAMES: FilterButtonData[] = [
  { name: "N.A. DMG Cap", aliases: ["NA DMG Cap", "NA Cap"] },
  { name: "Skill DMG Cap", aliases: ["Skill Cap", "Sk Cap"] },
  { name: "C.A. DMG Cap", aliases: ["CA DMG Cap", "CA Cap"] },
  { name: "Supplemental N.A. DMG", aliases: ["Supplemental NA DMG", "N.A. Supp", "NA Supp"] },
  { name: "Supplemental Skill DMG", aliases: ["Skill Supp"] },
  { name: "Supplemental C.A. DMG", aliases: ["Supplemental CA DMG", "C.A. Supp", "CA Supp"] },
  { name: "Special C.A. DMG Cap", aliases: ["Special CA DMG Cap", "Sp C.A.", "Sp CA"] },
  { name: "Chain DMG Amplify", aliases: ["CB Amp"] },
  { name: "Turn-Based DMG Reduction" },
  { name: "Regeneration" },
  { name: "Amplify DMG at 100% HP by" },
  {
    name: "Boost triple attack rate when at or above 50% HP by",
    aliases: ["Boost T.A. rate when at or above 50% HP by", "Boost TA rate when at or above 50% HP by"],
  },
  { name: "DMG Reduction when at or below 50% HP:" },
  { name: "Boost DMG cap for critical hits by" },
  { name: "Max HP boost for a 70% hit to DEF:" },
  {
    name: "N.A. DMG cap boost for an 80%/60% hit to skill/C.A. DMG cap:",
    aliases: [
      "NA DMG cap boost for an 80%/60% hit to skill/CA DMG cap:",
      "NA cap boost for an 80%/60% hit to skill/CA DMG cap:",
      "NA Trade",
    ],
  },
  {
    name: "Skill DMG cap boost for an 80%/60% hit to N.A./C.A. DMG cap:",
    aliases: ["Skill cap boost for an 80%/60% hit to N.A./C.A. DMG cap:", "Skill Trade"],
  },
  {
    name: "C.A. DMG cap boost for an 80%/60% hit to N.A./skill DMG cap:",
    aliases: [
      "CA DMG cap boost for an 80%/60% hit to NA/skill DMG cap:",
      "CA cap boost for an 80%/60% hit to NA/skill DMG cap:",
      "CA Trade",
    ],
  },
  { name: "Chance to cancel incoming dispels:", aliases: ["Chance for Dispel Cancel"] },
  { name: "Chance to remove 1 debuff before attacking:", aliases: ["Chance for Dispel"] },
];

export const SK3_NAMES: FilterButtonData[] = [
  { name: "Upon using a debuff skill: Amplify foe's DMG Taken (2 hits) by" },
  {
    name: "Upon using a healing skill: Ally in the next position gains a 1-time Bonus Elemental DMG effect of",
    aliases: ["Upon using a healing skill: Ally in the next position gains a 1 time echo of"],
  },
  { name: "Cut linked skill cooldowns by 1 turn after using a linked skill" },
  { name: "After using a skill with a cooldown of 10 or more turns: Amplify DMG by" },
  { name: "Boost to DMG cap (Stackable) after using skills" },
  { name: "Supplement skill DMG (Stackable) after dealing this amount of skill DMG:" },
  { name: "Upon single sttacks: Gain" },
  { name: "Plain DMG to a foe at the end of turn based on how much HP the equipper lost that turn:" },
  { name: "Gain supplemental DMG at end of turn based on amount of charge bar spent that turn:" },
  { name: "When a foe has 3 or fewer debuffs at turn start: Equipper gains an Armor effect with a strength of" },
  { name: "When a foe's HP is at 50% or lower at end of turn (1 time): Restore equipper's HP by" },
  { name: "When a sub ally (Max 1 of this skill per party): 1 random debuff to all foes every" },
  {
    name: "Gain a Bonus Elemental DMG effect (1 time) after being targeted by foes' attacks",
    aliases: ["Gain a 1 time echo after being targeted by foes' attacks"],
  },
  { name: "At end of turn if equipper didn't attack: Gain" },
  {
    name: "Upon using a green or blue potion (Max 1 of this skill per party): Boost Fated Chain bar by",
    aliases: ["Upon using a green or blue potion (Max 1 of this skill per party): Boost FC bar by "],
  },
  { name: "Gain a 3-hit Flurry effect (1 time) after hitting a foe" },
  { name: "When knocked out (1 time): All allies gain" },
  {
    name: "When switching to a main ally (1 time): Amplify DMG by",
    aliases: ["When switching to a main ally (1 time): Amp DMG by"],
  },
  { name: "At battle start: Gain" },
  { name: "At battle start: Mitigate DMG taken for 1 turn by" },
  { name: "At battle start and every 5 turns: Gain a Shield effect with a value of" },
  {
    name: "Start battle with 20% of HP consumed / After 3 turns: DMG cap is boosted by",
    aliases: ["Start battle with 20% HP cut / After 3 turns: DMG cap is boosted by"],
  },
  {
    name: "Upon casting first-slot skill: Cut first-slot skill's cooldown by 1 turn and consume this percentage of current HP (HP consumption lowers with higher lvls of this artifact skill):",
    aliases: [
      "Upon casting first slot skill: Cut first slot skill's cooldown by 1 turn and consume this percentage of current HP (HP consumption lowers with higher lvls of this artifact skill):",
    ],
  },
  { name: "Chance to gain a 6-hit Flurry effect (1 time) before attacking:" },
  {
    name: "Chance of battle turn progressing by 5 at end of turn (Max 1 of this skill per party):",
    aliases: ["Akasha"],
  },
  {
    name: "Chance to remove all buffs from a foe at end of turn:",
    aliases: ["Chance to dispel all buffs from a foe at end of turn:"],
  },
  { name: "Boost item drop rate (Even when a sub ally / Max 1 of this skill per party) by" },
  { name: "Boost EXP earned (Even when a sub ally / Max 1 of this skill per party) by" },
  {
    name: "May find a random pair of earrings at end of battle (Even when a sub ally / Max 1 of this skill per party / Chance increases with skill lvl)",
  },
];
