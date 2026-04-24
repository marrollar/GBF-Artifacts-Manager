import type { RawArtifact } from "@/app/types";
import { type ResultInfoRaw } from "../types/typedefs";
import type { ExtensionSettings } from "./globals";
import { GetArtifact, GetExtensionSettings } from "./StorageProxy";

export class HighLighter {
  static async HighlightTrashArtifacts(tabId: number | undefined, response: ResultInfoRaw) {
    const settingsFromStorage: ExtensionSettings = (await GetExtensionSettings()).data
    if (settingsFromStorage.do_styles === false) {
      return;
    }

    console.log("%c[Step 3] HIGHLIGHT TRASH ARTIFACTS", "color:cornflowerblue;");

    // This should never happen as tabId should already be checked above when this should be called.
    if (tabId === undefined) {
      return;
    }

    try {
      const json = JSON.parse(response.body);
      const networkArtifacts: Record<number, RawArtifact> = json.list;

      const artifactsToMark: number[] = [];
      const artifactsToUnMark: number[] = [];

      const promises = Object.entries(networkArtifacts).map(async ([_, networkArtifact]) => {
        const id = networkArtifact.id;
        const localRecord = (await GetArtifact({ id: String(id) })).data;
        const [artiData] = Object.values(localRecord);

        if (networkArtifact.is_unnecessary) {
          if (artiData.is_scrap) {
            artifactsToMark.push(id);
          } else {
            artifactsToUnMark.push(id);
          }
        } else {
          if (artiData.is_scrap) {
            artifactsToMark.push(id);
          }
        }
      });

      await Promise.all(promises);

      // Red outline for artifacts marked as scrap in the app or in game AND the app
      chrome.scripting.executeScript({
        target: { tabId },
        func: (artifactIds) => {
          for (const id of artifactIds) {
            const el = document.querySelector(`li[data-id="${id}"]`) as HTMLLIElement;
            if (el) {
              el.style.outline = "1px solid red";
            }
          }
        },
        args: [artifactsToMark],
      });

      // Green outline for artifacts marked as scrap in game but NOT the app
      chrome.scripting.executeScript({
        target: { tabId },
        func: (artifactIds) => {
          for (const id of artifactIds) {
            const el = document.querySelector(`li[data-id="${id}"]`) as HTMLLIElement;
            if (el) {
              el.style.outline = "2px solid green";
            }
          }
        },
        args: [artifactsToUnMark],
      });
    } catch (e) {
      console.log("%c[error]Error while highlighting trash artifacts: " + e, "color:red;");
    }
  }
}
