import type { Element, RawArtifact, Weapon } from "@/app/types";
import type { ResultInfoRaw } from "../types/typedefs";
import { GetArtifact, SaveArtifact } from "./StorageProxy";

// @ts-expect-error
const NAME_TO_WEAPON_GROUP: { [key: string]: string } = {
  "Ominous Amulet": "Sabre",
  "Couronne Sainte": "Sabre",
  "Jinyao Yushi": "Sabre",

  "Ominous Ring": "Dagger",
  "Jaseron Saint": "Dagger",
  "Jinyao Mianju": "Dagger",

  "Ominous Goblet": "Spear",
  "Casque Saint": "Spear",
  "Jinyao Qizhi": "Spear",

  "Ominous Horn": "Axe",
  "Armure Sainte": "Axe",
  "Jinyao Yaodai": "Axe",

  "Ominous Totem": "Staff",
  "Robe Sainte": "Staff",
  "Jinyao Mingjing": "Staff",

  "Ominous Pendant": "Gun",
  "Lunettes Saintes": "Gun",
  "Jinyao Wangjing": "Gun",

  "Ominous Bangle": "Melee",
  "Bottes Saintes": "Melee",
  "Jinyao Mianzhao": "Melee",

  "Ominous Pheon": "Bow",
  "Chapeau Saint": "Bow",
  "Jinyao Xiongjia": "Bow",

  "Ominous Whistle": "Harp",
  "Boite a Musique Sainte": "Harp",
  "Jinyao Tongluo": "Harp",

  "Ominous Stone": "Katana",
  "Capuchon Saint": "Katana",
  "Jinyao Xianglu": "Katana",
};

const ATTRIBUTE_TO_ELEMENT: { [key: string]: Element } = {
  "1": "Fire",
  "2": "Water",
  "3": "Earth",
  "4": "Wind",
  "5": "Light",
  "6": "Dark",
};

const KIND_TO_WEAPON: { [key: string]: Weapon } = {
  "1": "Sabre",
  "2": "Dagger",
  "3": "Spear",
  "4": "Axe",
  "5": "Staff",
  "6": "Gun",
  "7": "Melee",
  "8": "Bow",
  "9": "Harp",
  "10": "Katana",
};

/** Handles the processing of raw data into a format that can be stored for later */
export class DataProcessor {
  static async ProcessInventoryJSON(response: ResultInfoRaw) {
    console.log("%c[Step 2] PROCESSING INVENTORY DATA", "color:cornflowerblue;");

    try {
      const json = JSON.parse(response.body);
      const networkArtifacts: Record<number, RawArtifact> = json.list;

      Object.entries(networkArtifacts).forEach(async ([_, networkArtifact]) => {
        const artiAlreadyExists = (await GetArtifact({ id: String(networkArtifact.id) })).data;
        if (Object.keys(artiAlreadyExists).length === 0) {
          const {
            id: id,
            kind: kind,
            attribute: attribute,
            name: name,
            is_locked: is_locked,
            is_quirk: is_quirk,
            is_unnecessary: is_scrap,
            skill1_info: s1,
            skill2_info: s2,
            skill3_info: s3,
            skill4_info: s4,
          }: RawArtifact = networkArtifact;

          const weapon_group = KIND_TO_WEAPON[kind];
          const element = ATTRIBUTE_TO_ELEMENT[attribute];

          if (weapon_group === undefined) {
            console.log("%c[warn]weapon_group did not parse properly: " + name + "(" + kind + ")", "color:yellow;");
          }
          if (element === undefined) {
            console.log("%c[warn]element did not parse properly: " + attribute, "color:yellow;");
          }

          await SaveArtifact({
            data: {
              [id]: {
                weapon: weapon_group,
                element: element,
                name: name,
                is_locked: is_locked,
                is_quirk: is_quirk,
                is_scrap: is_scrap,
                s1: {
                  id: s1.skill_id,
                  quality: s1.skill_quality,
                  level: s1.level,
                  name: s1.name,
                  is_max_quality: s1.is_max_quality,
                  value: s1.effect_value,
                },
                s2: {
                  id: s2.skill_id,
                  quality: s2.skill_quality,
                  level: s2.level,
                  name: s2.name,
                  is_max_quality: s2.is_max_quality,
                  value: s2.effect_value,
                },
                s3: {
                  id: s3.skill_id,
                  quality: s3.skill_quality,
                  level: s3.level,
                  name: s3.name,
                  is_max_quality: s3.is_max_quality,
                  value: s3.effect_value,
                },
                s4: {
                  id: s4.skill_id,
                  quality: s4.skill_quality,
                  level: s4.level,
                  name: s4.name,
                  is_max_quality: s4.is_max_quality,
                  value: s4.effect_value,
                },
              },
            },
          });
        } else {
          // console.log("%c[info]Artifact already exists: " + artifact.id, "color:coral;");
        }
      });
    } catch (error) {
      console.log("%c[error]A problem occured while processing inventory data...", "color:red;", error);
    }
  }
}
