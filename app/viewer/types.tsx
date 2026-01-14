export enum Element {
    FIRE = "Fire",
    WATER = "Water",
    EARTH = "Earth",
    WIND = "Wind",
    LIGHT = "Light",
    DARK = "Dark",
    // NONE = "None"
}

export enum Weapon {
    SABRE = "Sabre",
    DAGGER = "Dagger",
    SPEAR = "Spear",
    AXE = "Axe",
    STAFF = "Staff",
    GUN = "Gun",
    MELEE = "Melee",
    BOW = "Bow",
    HARP = "Harp",
    KATANA = "Katana"
}

export type SkillInfo = {
    id: number,
    name: string,
    value: string,
    quality: number
}

export type Artifacts = {
    [id: number]: {
        element: string,
        is_scrap: boolean,
        s1: SkillInfo,
        s2: SkillInfo,
        s3: SkillInfo,
        s4: SkillInfo
    }
}