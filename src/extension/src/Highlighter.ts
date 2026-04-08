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

      chrome.scripting.executeScript({
        target: { tabId },
        func: (artifacts) => {
          for (const artifact of artifacts) {
            if (artifact.is_unnecessary) {
              const el = document.querySelector(`li[data-id="${artifact.id}"]`) as HTMLLIElement;

              if (el) {
                el.style.outline = "1px solid red"
              }
            }
          }
        },
        args: [artifacts],
      });
    } catch (e) {
      console.log("%c[error]Error while highlighting trash artifacts: " + e, "color:red;");
    }
  }
}
