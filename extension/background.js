
// import browser from "webextension-polyfill";
import "./types/typedefs.js"
import {changeIconOnId, iconChangeDuration, dataPeriodLengths, defaultStageHeadRow, tokensToDificulty, StageSignature, urlFilter} from './service_worker_config.js'


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

// browser.action.onClicked.addListener(() => {
//   browser.windows.create({
//     url: browser.runtime.getURL("index.html"),
//     type: "popup",
//     width: 1000,
//     height: 800,
//   });
// });

// /*********************/
// /* Testing functions */
// /*********************/

// async function loadTestData() {
//   try {
//     const response = await fetch(browser.runtime.getURL("artifacts_data.json"));
//     const data = await response.json();

//     console.log("Seeding storage with:", data);

//     await browser.storage.local.set({ artifactsData: data });
//   } catch (err) {
//     console.error("Failed to seed test data: ", err);
//   }
// }

// browser.runtime.onInstalled.addListener(() => {
//   console.log("On Installed");
//   loadTestData();
// });

/**********************************/
/* Listener and support functions */
/**********************************/

/** This class receives chrome.debugger network events and filters them for data that would be recorded by the extension */
class NetworkFilter {
    /**
     * Processes chrome.debugger network events
     * @param {Debuggee} debuggeeId 
     * @param {string} message Name of the event
     * @param {Network} params Information about the event, such as the source URL, requestId
     */
    static async NetworkListener(debuggeeId, message, params) {
        // If the event is a requestWillBeSent and the URL is from a loot results JSON...
        if (message == "Network.requestWillBeSent" && urlFilter.whitelist.test(params.request.url)) {
            console.log("%c[Step 1] RETRIEVING DATA", "color:coral;");
            // console.log("%c[1.1]Request found that matches file URL", "color:coral;");
            let fileType = "";
            // Decides what type of file this is
            if (urlFilter.rewardUrlRegex.test(params.request.url)) { fileType = "Battle Data" }
            else if (urlFilter.sephiraOpenRegex.test(params.request.url)) { fileType = "Sephira Results" }
            else if (urlFilter.xenoboxUrlRegex.test(params.request.url)) { fileType = "Xenobox" }
            else if (urlFilter.eventLandingRegex.test(params.request.url)) {fileType = "EventLanding"}
            // console.log("%c[1.2]detected requestWillBeSent from: " + params.request.url + " of type: " + fileType, "color:coral;");
            trackedRequest = {
                "requestId": params.requestId,
                "tabId": debuggeeId.tabId,
                "fileType": fileType,
                "timestamp": Date.now(),
            };
            requestLog.push([message, params, debuggeeId.tabId]);
            return;
        }
        else if (params.requestId != trackedRequest.requestId) { return; }
        requestLog.push([message, params, debuggeeId.tabId]);
        if (message == "Network.loadingFinished") {
            // console.log("%c[1.3]loadingFinished event matched requestId. Congrats!", "color:coral;");
            await NetworkFilter.sendCommandPromise(debuggeeId.tabId, params).then((response) => {
                // console.log("%c[1.4]Succeeded in getting data!", "color: coral;");
                console.log("%c[info]Message chain for retrieved file", "color:coral;", requestLog);
                switch (trackedRequest.fileType) {
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
                        console.log("%c[error]fileType did not match any known values: " + trackedRequest.fileType, "color:red;");
                        break;
                }

                requestLog = [];
            }).catch((error) => {
                console.log("%cError occured fetching loot data file: ", "color:red;", error);
            });
        }
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
                        "tabId": tabId
                    }, "Network.getResponseBody", {
                    "requestId": params.requestId
                }, function (response) {
                    if (chrome.runtime.lastError) {
                        reject(chrome.runtime.lastError);
                    }
                    else if (!response || !response.body) {
                        console.error("Response was empty");
                        reject(new Error("Response was empty"));
                    }
                    else { resolve(response); }
                });
            }
            catch (ex) {
                console.log("Error fetching resource");
                reject(ex)
            }
        });
    }
}

/**
 * This class manages all debuggers by dynamically attaching and detaching them when needed.
 */
class DebuggerManager {
    /**
     * Starts the following event listeners:
     * - chrome.debugger.onEvent
     * - chrome.tabs.onUpdated
     */
    static EnableEventListeners() {
        // Adds listeners for network events and tab changes
        if (!chrome.debugger.onEvent.hasListener(NetworkFilter.NetworkListener)) {
            console.log("%c[+]Activating listener on NetworkListener", "color:lime;")
            chrome.debugger.onEvent.addListener(NetworkFilter.NetworkListener);
            let networkListenerStatus = chrome.debugger.onEvent.hasListener(NetworkFilter.NetworkListener)
            console.log("%c[info]false --> " + networkListenerStatus, "color:aqua;");
        }
        if (!chrome.tabs.onUpdated.hasListener(DebuggerManager.TabListener)) {
            console.log("%c[+]Activating listener on TabListener", "color:lime;")
            chrome.tabs.onUpdated.addListener(DebuggerManager.TabListener);
            let TabListenerStatus = chrome.tabs.onUpdated.hasListener(DebuggerManager.TabListener);
            console.log("%c[info]false --> " + TabListenerStatus, "color:aqua;");
        }
    }

    /**
     * Dynamically adds a debugger when a tab loads a URL from Granblue Fantasy, and removes it when the tab views a non Granblue Fantasy URL
     * - Receives events from chrome.tabs.onUpdated
     * @param {number} tabId 
     * @param {object} changeInfo
     * @param {Tab} tab
     * @returns {void}
     */
    static TabListener(tabId, changeInfo, tab) {
        if (urlFilter.extensionUrlRegex.test(tab.url) && (changeInfo.status === "loading")) { DebuggerManager.RefreshActiveDebuggers(); return; }
        // Excludes tabs that aren't loading or are chrome extension pages
        if (!(changeInfo.status === "loading")) { return; }
        let isOnGame = urlFilter.gameUrlRegex.test(tab.url);
        let hasDebuggerAttached = activeDebuggers.some(item => item.tabId == tabId);
        if (isOnGame && !hasDebuggerAttached) {
            DebuggerManager.AddDebugger(tabId);
        }
        else if (!isOnGame && hasDebuggerAttached) {
            DebuggerManager.RemoveDebugger({ "tabId": tabId });
        }
    }

    /**
     * Attaches a debugger to the tab matching the tabId
     * @param {number} tabId 
     */
    static AddDebugger(tabId) {
        try {
            chrome.debugger.attach({
                tabId: tabId
            }, "1.0", DebuggerManager.onAttach.bind(null, tabId));
        }
        catch (error) {
            console.log("%c[error]Results tab already has a debugger attached...", "color:red;", error);
            DebuggerManager.RefreshActiveDebuggers();
        }
    }

    /**
     * Removes a debugger from the tab matching the tabId
     * @param {Debuggee} debuggeeId
     */
    static async RemoveDebugger(debuggeeId) {
        try {
            // Creates bool that shows if the debuggeeId has a debugger attached
            let hasDebugger = activeDebuggers.filter(function (e) { return e.tabId == debuggeeId.tabId }).length > 0;
            if (hasDebugger) {
                console.log("%c[-]Removing debugger from tab: ", "color:red;", debuggeeId);
                requestLog = [];
                requestLogAll = [];
                await chrome.debugger.detach(debuggeeId);
                await DebuggerManager.RefreshActiveDebuggers();
            }
            else { console.log("%c[-]Debugger wasn't attached: ", "color:red;", debuggeeId); }
        }
        catch (error) {
            console.log("%c[error]Debugger was already detatched... ", "color:red;", error)
            DebuggerManager.RefreshActiveDebuggers();
        }
    }

    /**
     * Refreshes the array of active debuggers
     */
    static async RefreshActiveDebuggers() {
        chrome.debugger.getTargets(async function (result) {
            activeDebuggers = result.filter(function (e) { return e.attached == true })
            console.log("%c[info]Active debuggers Refreshed: ", "color:aqua;", activeDebuggers);
        })
    }

    /**
     * Enables network events on debugged tab by sending a Network.enable command to the target debugee. 
     * These events are listened to by the NetworkFilter.NetworkListener() method
     * @param {number} tabId The tabId for the new debugee
     */
    static onAttach(tabId) {
        try {
            console.log("%c[+]New debugger added to: " + tabId, "color:lime;");
            chrome.debugger.sendCommand({
                "tabId": tabId
            }, "Network.enable");
            console.log("%c[+]Network Enabled. Waiting for response", "color:lime;");
            DebuggerManager.RefreshActiveDebuggers();
        }
        catch (error) {
            console.log("An error occured at onAttach...", error);
            DebuggerManager.RefreshActiveDebuggers();
        }
    }
}

/**
 * Synchronizes read/write events to prevent race conditions
 */
class StorageProxy{
    constructor(){
        /** A queue of objects waiting to be written to local storage @type {object[]} */
        this.writeRequestQueue = [];
        /** Set to true when an object in the writeRequestQueue is being processed by processRequest() @type {boolean} */
        this.writeProtectFlag = false;
        return this;
    }

    async processRequest(){
        this.writeProtectFlag = true;
        while (this.writeRequestQueue.length > 0){
            const obj = this.writeRequestQueue.shift();
            // console.log("SAVING NEW OBJECT: ", obj);
            await this.saveObjectInLocalStorage(obj);
        }
        this.writeProtectFlag = false;
    }

    async get(key){
        const writeRequestQueueCopy = this.writeRequestQueue.slice();
        while(writeRequestQueueCopy.length > 0){
            let object = writeRequestQueueCopy.pop()
            if (object.hasOwnProperty(key)){
                return object[key];
            }
        };
        return this.getObjectFromLocalStorage(key);
    }

    async save(obj){
        /** Updates local values if the values in perminent storage change */
        if (obj?.Settings?.timerStart){timerStart = obj.Settings.timerStart;}
        else if (obj?.eventList){eventList = obj.eventList;}
        this.writeRequestQueue.push(obj);
        if (!this.writeProtectFlag){this.processRequest();}
    }

    async getVar(varName){
        switch (varName){
            case "StageSignature":
                return StageSignature;
            case "activeDebuggers":
                return activeDebuggers;
            case "eventList":
                return eventList;
            case "Settings":
                let settings = await storageProxy.get("Settings");
                return settings;
            default:
                return "Error: data did not exist or access is not allowed"
        }
    }

    /* Returns object from chrome's local storage */
    async getObjectFromLocalStorage(key) {
        return new Promise((resolve, reject) => {
            try {
                chrome.storage.local.get(key, function (value) {
                    resolve(value[key]);
                });
            } catch (ex) {
                console.log(ex);
                reject(ex);
            }
        });
    };
    
    /* Stores object from chrome's local storage */
    async saveObjectInLocalStorage(obj) {
        return new Promise((resolve, reject) => {
            try {
                chrome.storage.local.set(obj, function () {
                    resolve("Saved new object");
                });
            } catch (ex) {
                console.log(ex);
                reject(ex);
            }
        });
    };
}