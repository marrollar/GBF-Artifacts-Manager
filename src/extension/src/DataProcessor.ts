import { storageProxy } from "./StorageProxy";

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

const ATTRIBUTE_TO_ELEMENT: { [key: string]: string } = {
  "1": "Fire",
  "2": "Water",
  "3": "Earth",
  "4": "Wind",
  "5": "Light",
  "6": "Dark",
};

const KIND_TO_WEAPON: { [key: string]: string } = {
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

export type RawArtifact = {
  id: number;
  kind: string;
  attribute: string;
  name: string;
  is_unnecessary: boolean;
  skill1_info: object;
  skill2_info: object;
  skill3_info: object;
  skill4_info: object;
};

/** Handles the processing of raw data into a format that can be stored for later */
export class DataProcessor {
  static async ProcessInventoryJSON(response: ResultInfoRaw) {
    console.log(
      "%c[Step 2] PROCESSING INVENTORY DATA",
      "color:cornflowerblue;",
    );

    try {
      const json = JSON.parse(response.body);
      const artifacts = json.list;

      for (const artifact of artifacts) {

        const artiAlreadyExists = await storageProxy.get(String(artifact.id))
        if(artiAlreadyExists !== undefined) {
          continue
        } 

        const {
          id: id,
          kind: kind,
          attribute: attribute,
          name: name,
          is_unnecessary: is_scrap,
          skill1_info: s1,
          skill2_info: s2,
          skill3_info: s3,
          skill4_info: s4,
        }: RawArtifact = artifact;

        const weapon_group = KIND_TO_WEAPON[kind];
        const element = ATTRIBUTE_TO_ELEMENT[attribute];

        if (weapon_group === undefined) {
          console.log(
            "%c[warn]weapon_group did not parse properly: " +
              name +
              "(" +
              kind +
              ")",
            "color:yellow;",
          );
        }
        if (element === undefined) {
          console.log(
            "%c[warn]element did not parse properly: " + attribute,
            "color:yellow;",
          );
        }

        await storageProxy.save({
          [id]: JSON.stringify({
            weapon_group: weapon_group,
            element: element,
            is_scrap: is_scrap,
            s1: s1,
            s2: s2,
            s3: s3,
            s4: s4,
            name: name,
          }),
        });
      }
    } catch (error) {
      console.log(
        "%c[error]A problem occured while processing inventory data...",
        "color:red;",
        error,
      );
    }
  }
}
