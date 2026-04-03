/// <reference types="chrome" />

import browser from "webextension-polyfill";


/*******************************/
/* App communication functions */
/*******************************/

// @ts-ignore
browser.runtime.onMessage.addListener((msg) => {
  if (msg.action === "getData") {
    const result = browser.storage.local.get("artifactsData");
    return result || {};
  }
});

browser.action.onClicked.addListener(() => {
  browser.windows.create({
    url: browser.runtime.getURL("index.html"),
    type: "popup",
    width: 1000,
    height: 800,
  });
});

/*********************/
/* Testing functions */
/*********************/

async function loadTestData() {
  try {
    const response = await fetch(browser.runtime.getURL("artifacts_data.json"));
    const data = await response.json();

    console.log("Seeding storage with:", data);

    await browser.storage.local.set({ artifactsData: data });
  } catch (err) {
    console.error("Failed to seed test data: ", err);
  }
}

browser.runtime.onInstalled.addListener(() => {
  console.log("On Installed");
  loadTestData();
});

