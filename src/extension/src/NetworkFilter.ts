import { urlFilter } from "../service_worker_config";
import { DataProcessor } from "./DataProcessor";
import { global_state, RequestTypes } from "./globals";
import { HighLighter } from "./Highlighter";
import { type Debuggee, type Network, type ResultInfoRaw  } from "../types/typedefs";

/** This class receives chrome.debugger network events and filters them for data that would be recorded by the extension */
export class NetworkFilter {
  /**
   * Processes chrome.debugger network events
   */
  static async NetworkListener(
    debuggeeId: Debuggee,
    message: string,
    params: Network,
  ) {
    // If the event is a requestWillBeSent and the URL is from a loot results JSON...
    if (
      message == "Network.requestWillBeSent" &&
      urlFilter.whitelist.test(params.request.url)
    ) {
      console.log("%c[Step 1] RETRIEVING DATA", "color:coral;");
      // console.log("%c[1.1]Request found that matches file URL", "color:coral;");
      let requestType: RequestTypes;
      if (urlFilter.artifactsInventoryUrlRegex.test(params.request.url)) {
        requestType = RequestTypes.ListPage;
      } else if (
        urlFilter.artifactsDecomposeUrlRegex.test(params.request.url)
      ) {
        requestType = RequestTypes.ArtifactsDestroyed;
      } else {
        console.log(
          "%c[error] Request passed global whitelist but failed to match any individual regex: " +
            params.request.url,
          "color:red;",
        );
        return;
      }

      // console.log("%c[1.2]detected requestWillBeSent from: " + params.request.url + " of type: " + fileType, "color:coral;");
      global_state.trackedRequest = {
        requestId: params.requestId,
        tabId: debuggeeId.tabId,
        requestType: requestType,
        timestamp: Date.now(),
      };
      global_state.requestLog.push([message, params, debuggeeId.tabId]);
      return;
    } else if (params.requestId != global_state.trackedRequest.requestId) {
      return;
    }

    global_state.requestLog.push([message, params, debuggeeId.tabId]);
    if (message == "Network.loadingFinished") {
      // console.log("%c[1.3]loadingFinished event matched requestId. Congrats!", "color:coral;");
      if (debuggeeId.tabId) {
        await NetworkFilter.sendCommandPromise(debuggeeId.tabId, params)
          .then((response) => {
            // console.log("%c[1.4]Succeeded in getting data!", "color: coral;");
            console.log(
              "%c[info]Message chain for retrieved file",
              "color:coral;",
              global_state.requestLog,
            );

            switch (global_state.trackedRequest.requestType) {
              case RequestTypes.ListPage:
                // TODO: Implement
                console.log("%c[info]ListPage hit", "color:coral;")
                DataProcessor.ProcessInventoryJSON(response as ResultInfoRaw) // TODO: Unsafe cast
                HighLighter.HighlightTrashArtifacts(debuggeeId.tabId, response as ResultInfoRaw);
                break;

              case RequestTypes.ArtifactsDestroyed:
                // TODO: Implement
                console.log("%c[info]ArtifactsDestroyed hit", "color:coral;")
                break;

              default:
                console.log(
                  "%c[error]requestType did not match any known values: " +
                    global_state.trackedRequest.requestType,
                  "color:red;",
                );
                break;
            }

            global_state.requestLog = [];
          })
          .catch((error) => {
            console.log(
              "%cError occured fetching loot data file: ",
              "color:red;",
              error,
            );
          });
      }
    }
  }

  /**
   * Function to return response body and handle errors that may arrise
   */
  static sendCommandPromise(tabId: number, params: Network): Promise<object> {
    return new Promise((resolve, reject) => {
      try {
        chrome.debugger.sendCommand(
          {
            tabId: tabId,
          },
          "Network.getResponseBody",
          {
            requestId: params.requestId,
          },
          function (response) {
            if (chrome.runtime.lastError) {
              reject(chrome.runtime.lastError);
            } else if (!response || !response.hasOwnProperty("body")) {
              console.error("Response was empty");
              reject(new Error("Response was empty"));
            } else {
              resolve(response);
            }
          },
        );
      } catch (ex) {
        console.log("Error fetching resource");
        reject(ex);
      }
    });
  }
}
