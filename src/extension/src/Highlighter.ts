import { GetArtifact } from "./StorageProxy";
import { type ResultInfoRaw } from "../types/typedefs";
import type { RawArtifact } from "@/app/types";

export class HighLighter {
  static async HighlightTrashArtifacts(tabId: number | undefined, response: ResultInfoRaw) {
    // This should never happen as tabId should already be checked above when this should be called.
    if (tabId === undefined) {
      return;
    }

    try {
      const json = JSON.parse(response.body);
      const networkArtifacts: Record<number, RawArtifact> = json.list;

      const artifactsToMark: number[] = [];

      Object.entries(networkArtifacts).forEach(async ([_, networkArtifact]) => {
        const id = networkArtifact.id;
        
        if (networkArtifact.is_unnecessary) {
          artifactsToMark.push(id);
        } else {
          const localRecord = (await GetArtifact({ id: String(id) })).data;
          Object.entries(localRecord).forEach(([id, artifact]) => {
            if (artifact.is_scrap) {
              artifactsToMark.push(Number(id));
            }
          });
        }
      });

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
    } catch (e) {
      console.log("%c[error]Error while highlighting trash artifacts: " + e, "color:red;");
    }
  }
}
