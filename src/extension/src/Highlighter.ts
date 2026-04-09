import { RawArtifact } from "./DataProcessor";
import { storageProxy } from "./StorageProxy";

export class HighLighter {
  static async HighlightTrashArtifacts(tabId: number | undefined, response: ResultInfoRaw) {
    // This should never happen as tabId should already be checked above when this should be called.
    if (tabId === undefined) {
      return;
    }

    try {
      const json = JSON.parse(response.body);
      const artifacts = json.list;

      const artifactsToMark = [];
      for (const artifact of artifacts) {
        const id = artifact.id;
        const localRecord = await storageProxy.get(id);

        if (artifact.is_unnecessary || localRecord.is_scrap) {
          artifactsToMark.push(id);
        }
      }

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
