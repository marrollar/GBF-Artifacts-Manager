export enum Element {
    FIRE = "Fire",
    WATER = "Water",
    EARTH = "Earth",
    WIND = "Wind",
    LIGHT = "Light",
    DARK = "Dark",
    NONE = "None"
}

export enum Weapon {
    Sabre = "Sabre",
    Dagger = "Dagger",
    Spear = "Spear",
    Axe = "Axe",
    Staff = "Staff",
    Gun = "Gun",
    Melee = "Melee",
    Bow = "Bow",
    Harp = "Harp",
    Katana = "Katana"
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