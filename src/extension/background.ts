// Modified and derived from https://github.com/granbluetracker/Granblue-Fantasy-Tracker, with additions relevant to this project

// import browser from "webextension-polyfill";
import { DebuggerManager } from "./src/DebuggerManager.ts";
import { GetDataMessage, ApiMessage, SetDataMessage, StringResponse, ResponseMessage } from "@/api/messages.ts";
import { storageProxy } from "./src/StorageProxy.ts";

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

// chrome.runtime.onInstalled.addListener((details) => {
//   chrome.storage.local.clear(() => {
//     console.log("Cleared local storage for testing purposes");
//   });
// });

// chrome.runtime.onInstalled.addListener(() => {
//   console.log("On Installed");
//   loadTestData();
// });

/**********************************/
/* Listener and support functions */
/**********************************/

/** Handle messages from extension pages */
function handleMessage(
  request: ApiMessage,
  _: chrome.runtime.MessageSender,
  sendResponse: (response?: ResponseMessage) => void,
) {
  // console.log(request);
  // console.log("A content script sent a message: " + message);

  const action = request.action;
  const params = request.params;

  switch (action) {
    case "getData":
      if (params === undefined) {
        sendResponse({ response: "Message key was neither valid nor null" });
        return;
      }

      if (params.key === null) {
        storageProxy.get(null).then((result) => {
          sendResponse({ response: result as object });
        });
      } else {
        storageProxy.get(params.key).then((result) => {
          sendResponse({ response: result as object });
        });
      }
      break;

    case "setData":
      if (params.key === undefined) {
        sendResponse({ response: "Message was missing key" });
      }

      storageProxy.save(params);
      sendResponse({ response: "Save request received." });
      break;

    default:
      console.log("Request sent to background script was not recognized. Request received: " + request);
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
  console.log(`%c[v${currentVersion}]Service worker has started...`, "color:cyan;");
}

InitializeServiceWorker();
