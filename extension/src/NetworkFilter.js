import { urlFilter } from "../service_worker_config.js";

/** This class receives chrome.debugger network events and filters them for data that would be recorded by the extension */
export class NetworkFilter {
  /**
   * Processes chrome.debugger network events
   * @param {Debuggee} debuggeeId
   * @param {string} message Name of the event
   * @param {Network} params Information about the event, such as the source URL, requestId
   */
  static async NetworkListener(debuggeeId, message, params) {
    console.log(debuggeeId, message, params)
    // // If the event is a requestWillBeSent and the URL is from a loot results JSON...
    // if (
    //   message == "Network.requestWillBeSent" &&
    //   urlFilter.whitelist.test(params.request.url)
    // ) {
    //   console.log("%c[Step 1] RETRIEVING DATA", "color:coral;");
    //   // console.log("%c[1.1]Request found that matches file URL", "color:coral;");
    //   let fileType = "";
    //   // Decides what type of file this is
    //   if (urlFilter.rewardUrlRegex.test(params.request.url)) {
    //     fileType = "Battle Data";
    //   } else if (urlFilter.sephiraOpenRegex.test(params.request.url)) {
    //     fileType = "Sephira Results";
    //   } else if (urlFilter.xenoboxUrlRegex.test(params.request.url)) {
    //     fileType = "Xenobox";
    //   } else if (urlFilter.eventLandingRegex.test(params.request.url)) {
    //     fileType = "EventLanding";
    //   }
    //   // console.log("%c[1.2]detected requestWillBeSent from: " + params.request.url + " of type: " + fileType, "color:coral;");
    //   trackedRequest = {
    //     requestId: params.requestId,
    //     tabId: debuggeeId.tabId,
    //     fileType: fileType,
    //     timestamp: Date.now(),
    //   };
    //   requestLog.push([message, params, debuggeeId.tabId]);
    //   return;
    // } else if (params.requestId != trackedRequest.requestId) {
    //   return;
    // }
    // requestLog.push([message, params, debuggeeId.tabId]);
    // if (message == "Network.loadingFinished") {
    //   // console.log("%c[1.3]loadingFinished event matched requestId. Congrats!", "color:coral;");
    //   await NetworkFilter.sendCommandPromise(debuggeeId.tabId, params)
    //     .then((response) => {
    //       // console.log("%c[1.4]Succeeded in getting data!", "color: coral;");
    //       console.log(
    //         "%c[info]Message chain for retrieved file",
    //         "color:coral;",
    //         requestLog,
    //       );
    //       switch (trackedRequest.fileType) {
    //         case "Battle Data":
    //           DataProcessor.ProcessRewardJSON(response);
    //           break;
    //         case "Sephira Results":
    //           DataProcessor.ProcessSephiraJSON(response);
    //           break;
    //         case "Xenobox":
    //           DataProcessor.ProcessXenoboxJSON(response);
    //           break;
    //         case "EventLanding":
    //           DataProcessor.ProcessEventLanding(response);
    //           break;
    //         default:
    //           console.log(
    //             "%c[error]fileType did not match any known values: " +
    //               trackedRequest.fileType,
    //             "color:red;",
    //           );
    //           break;
    //       }

    //       requestLog = [];
    //     })
    //     .catch((error) => {
    //       console.log(
    //         "%cError occured fetching loot data file: ",
    //         "color:red;",
    //         error,
    //       );
    //     });
    // }
  }

  /**
   * Function to return response body and handle errors that may arrise
   * @param {number} tabId
   * @param {Network} params
   * @returns {Promise<string>} json in string format
   */
  static sendCommandPromise(tabId, params) {
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
