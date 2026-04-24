// Modified and derived from https://github.com/granbluetracker/Granblue-Fantasy-Tracker, with additions relevant to this project

// import browser from "webextension-polyfill";
import { DebuggerManager } from "./src/DebuggerManager.ts";
import { DEFAULT_EXTENSION_SETTINGS } from "./src/globals.ts";
import { GetExtensionSettings, SetExtensionSettings } from "./src/StorageProxy.ts";

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
// async function loadTestData() {
//   try {
//     const response = await fetch(chrome.runtime.getURL("artifacts_data.json"));
//     const data = await response.json();

//     console.log("Seeding storage with:", data);

//     await chrome.storage.local.set({ artifactsData: data });
//   } catch (err) {
//     console.error("Failed to seed test data: ", err);
//   }
// }

// chrome.runtime.onInstalled.addListener(() => {
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

chrome.runtime.onInstalled.addListener(() => {
  GetExtensionSettings().then((fromStorage) => {
    if (Object.entries(fromStorage.data).length > 0) {
      console.log("%c[info]Previous extension settings found.", "color:coral;");
    } else {
      console.log("%c[info]Previous extension settings NOT found. Saving defaults.", "color:coral;");
      try {
        SetExtensionSettings({ data: DEFAULT_EXTENSION_SETTINGS });
      } catch (e) {
        console.log("%c[error]Failed to save default extension settings to local storage.", "color:red;");
      }
    }
  });
});

/** Handle messages from extension pages */
// function handleMessage(msg: any, _: chrome.runtime.MessageSender, __: (response?: any) => any) {
//   switch (msg.type) {
//     case COMMS.REFETCH:
//       triggerReFetch();
//       break;
//   }
// }

async function InitializeServiceWorker() {
  // var Settings = await storageProxy.get("Settings");
  // var EventList = await storageProxy.get("eventList");
  // if (Settings == undefined || !Settings?.timerStart){console.log("ERROR: settings did not have timerStart property set");}
  // else {timerStart = Settings.timerStart;}
  // if (EventList == undefined){console.log("ERROR: eventList did not exist in local storage");}
  // else {eventList = EventList;}
  // CheckForUpdate();
  DebuggerManager.EnableEventListeners();
  // chrome.runtime.onMessage.addListener(handleMessage);
  var manifest = chrome.runtime.getManifest();
  var currentVersion = manifest.version;
  console.log(`%c[v${currentVersion}]Service worker has started...`, "color:cyan;");
}

InitializeServiceWorker();
