import { urlFilter } from "../service_worker_config";
import { global_state } from "./globals";

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
      let fileType = "";
      // Decides what type of file this is
      //   if (urlFilter.rewardUrlRegex.test(params.request.url)) {
      //     fileType = "Battle Data";
      //   } else if (urlFilter.sephiraOpenRegex.test(params.request.url)) {
      //     fileType = "Sephira Results";
      //   } else if (urlFilter.xenoboxUrlRegex.test(params.request.url)) {
      //     fileType = "Xenobox";
      //   } else if (urlFilter.eventLandingRegex.test(params.request.url)) {
      //     fileType = "EventLanding";
      //   }

      if (urlFilter.artifactsInventoryUrlRegex.test(params.request.url)) {
        
      }

      // console.log("%c[1.2]detected requestWillBeSent from: " + params.request.url + " of type: " + fileType, "color:coral;");
      global_state.trackedRequest = {
        requestId: params.requestId,
        tabId: debuggeeId.tabId,
        fileType: fileType,
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
            switch (global_state.trackedRequest.fileType) {
              case "Battle Data":
                DataProcessor.ProcessRewardJSON(response);
                break;
              case "Sephira Results":
                DataProcessor.ProcessSephiraJSON(response);
                break;
              case "Xenobox":
                DataProcessor.ProcessXenoboxJSON(response);
                break;
              case "EventLanding":
                DataProcessor.ProcessEventLanding(response);
                break;
              default:
                console.log(
                  "%c[error]fileType did not match any known values: " +
                    global_state.trackedRequest.fileType,
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
  static sendCommandPromise(tabId: number, params: Network): Promise<string> {
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
              // @ts-expect-error
            } else if (!response || !response.body) {
              console.error("Response was empty");
              reject(new Error("Response was empty"));
            } else {
              // @ts-expect-error
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
