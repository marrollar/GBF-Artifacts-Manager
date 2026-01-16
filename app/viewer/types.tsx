export const elements = {
    FIRE: "Fire",
    WATER: "Water",
    EARTH: "Earth",
    WIND: "Wind",
    LIGHT: "Light",
    DARK: "Dark"
    // NONE = "None"
} as const;
export type Element = typeof elements[keyof typeof elements]
export const elementSortOrder = new Map([
    ["Fire", 0],
    ["Water", 1],
    ["Earth", 2],
    ["Wind", 3],
    ["Light", 4],
    ["Dark", 5],
]) 

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
    KATANA: "Katana"
} as const;
export type Weapon = typeof weapons[keyof typeof weapons]
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
    ["Katana", 9]
])

export type SkillInfo = {
    id: number,
    name: string,
    value: string,
    quality: number
}

export type Artifacts = {
    [id: string]: {
        element: Element,
        weapon: Weapon,
        is_scrap: boolean,
        s1: SkillInfo,
        s2: SkillInfo,
        s3: SkillInfo,
        s4: SkillInfo
    }
}