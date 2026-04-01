import "./lib/browser-polyfill.min.js"

browser.runtime.onMessage.addListener(async (msg) => {
  if (msg.action === "getData") {
    const result = await browser.storage.local.get("artifactsData");
    return result.artifactsData || {};
  }
})

browser.action.onClicked.addListener(() => {
  browser.windows.create({
    url: browser.runtime.getURL("index.html"),
    type: "popup",
    width: 1000,
    height: 800
  });
});