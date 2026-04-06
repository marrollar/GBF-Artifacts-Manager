// Modified and derived from https://github.com/granbluetracker/Granblue-Fantasy-Tracker, with additions relevant to this project

// import browser from "webextension-polyfill";
import { DebuggerManager } from "./src/DebuggerManager.ts";

// /*******************************/
// /* App communication functions */
// /*******************************/

// // @ts-ignore
// browser.runtime.onMessage.addListener((msg) => {
//   if (msg.action === "getData") {
//     const result = browser.storage.local.get("artifactsData");
//     return result || {};
//   }
// });

chrome.action.onClicked.addListener(() => {
  chrome.windows.create({
    url: chrome.runtime.getURL("index.html"),
    type: "popup",
    width: 1000,
    height: 800,
  });
});

// /*********************/
// /* Testing functions */
// /*********************/

// TODO: REMOVE after testing finishes
async function loadTestData() {
  try {
    const response = await fetch(chrome.runtime.getURL("artifacts_data.json"));
    const data = await response.json();

    console.log("Seeding storage with:", data);

    await chrome.storage.local.set({ artifactsData: data });
  } catch (err) {
    console.error("Failed to seed test data: ", err);
  }
}

chrome.runtime.onInstalled.addListener((details) => {
    chrome.storage.local.clear(() => {
        console.log("Cleared local storage for testing purposes")
    })
})

// chrome.runtime.onInstalled.addListener(() => {
//   console.log("On Installed");
//   loadTestData();
// });

/**********************************/
/* Listener and support functions */
/**********************************/

// Handle messages from extension pages
/**
 *
 * @param {any} request
 * @param {chrome.runtime.MessageSender} sender
 * @param {(response?:any) => void} sendResponse
 */
function handleMessage(request, sender, sendResponse) {
  // console.log(request);
  let message = request.message;
  let action = message.action;
  let params = message.params;
  // console.log("A content script sent a message: " + message);
  switch (action) {
    case "setData":
      // if (params.data == undefined) {
      //     // console.log(message);
      //     sendResponse({ response: "Message was missing either location or data" });
      //     return;
      // }
      // /** If settings were changed, updates the time the last tracker timer was set. This is used for balancing stage data */
      // storageProxy.save(params.data);
      // sendResponse({ response: "Added data to write queue" });
      console.log("setData CALLED");
      break;
    case "getData":
      // if (params.storageKey == undefined) {
      //     sendResponse({ response: "Message was missing location" });
      // }
      // // console.log("Getting data for: " + params.storageKey);
      // storageProxy.get(params.storageKey).then((result) => {
      //     if (params.isStageData){
      //         result = DataProcessor.BalanceStageData(result);
      //     }
      //     sendResponse({ response: result });
      // });
      console.log("getData CALLED");
      break;
    case "getVar":
      // if (params.data == undefined){
      //     sendResponse({ response: "Message was missing data" });
      // }
      // storageProxy.getVar(params.data).then((result) =>{
      //     sendResponse({ response: result });
      // });
      console.log("getVar CALLED");
      break;
    case "recalculateData":
      // if (params.data == undefined){
      //     sendResponse({ response: "Message was missing data" });
      // }
      // DataProcessor.RecalculateStageDataAll(params.data).then((result) =>{
      //     sendResponse({ response: result });
      // });
      console.log("recalculateData CALLED");
      break;

    default:
      console.log(
        "Request sent to background script was not recognized. Request received: " +
          action,
      );
  }
  return true;
}

async function InitializeServiceWorker() {
  // var Settings = await storageProxy.get("Settings");
  // var EventList = await storageProxy.get("eventList");
  // if (Settings == undefined || !Settings?.timerStart){console.log("ERROR: settings did not have timerStart property set");}
  // else {timerStart = Settings.timerStart;}
  // if (EventList == undefined){console.log("ERROR: eventList did not exist in local storage");}
  // else {eventList = EventList;}
  // CheckForUpdate();
  DebuggerManager.EnableEventListeners();
  chrome.runtime.onMessage.addListener(handleMessage);
  var manifest = chrome.runtime.getManifest();
  var currentVersion = manifest.version;
  console.log(
    `%c[v${currentVersion}]Service worker has started...`,
    "color:cyan;",
  );
}

InitializeServiceWorker();
