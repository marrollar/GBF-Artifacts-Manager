import { urlFilter } from "../service_worker_config.js";
import { NetworkFilter } from "./NetworkFilter.ts";
import { global_state } from "./globals.ts";
import { type Debuggee, type Tab } from "../types/typedefs.ts";

/**
 * This class manages all debuggers by dynamically attaching and detaching them when needed.
 */
export class DebuggerManager {
  /**
   * Starts the following event listeners:
   * - chrome.debugger.onEvent
   * - chrome.tabs.onUpdated
   */
  static EnableEventListeners() {
    // Adds listeners for network events and tab changes
    // @ts-expect-error
    if (!chrome.debugger.onEvent.hasListener(NetworkFilter.NetworkListener)) {
      console.log("%c[+]Activating listener on NetworkListener", "color:lime;");
      // @ts-expect-error
      chrome.debugger.onEvent.addListener(NetworkFilter.NetworkListener);
      let networkListenerStatus = chrome.debugger.onEvent.hasListener(
        // @ts-expect-error
        NetworkFilter.NetworkListener,
      );
      console.log("%c[info]false --> " + networkListenerStatus, "color:aqua;");
    }
    // @ts-expect-error
    if (!chrome.tabs.onUpdated.hasListener(DebuggerManager.TabListener)) {
      console.log("%c[+]Activating listener on TabListener", "color:lime;");
      // @ts-expect-error
      chrome.tabs.onUpdated.addListener(DebuggerManager.TabListener);
      let TabListenerStatus = chrome.tabs.onUpdated.hasListener(
        // @ts-expect-error
        DebuggerManager.TabListener,
      );
      console.log("%c[info]false --> " + TabListenerStatus, "color:aqua;");
    }
  }

  /**
   * Dynamically adds a debugger when a tab loads a URL from Granblue Fantasy, and removes it when the tab views a non Granblue Fantasy URL
   * - Receives events from chrome.tabs.onUpdated
   */
  static TabListener(tabId:number, changeInfo:object, tab:Tab)  {
    if (
      urlFilter.extensionUrlRegex.test(tab.url) &&
      // @ts-expect-error
      changeInfo.status === "loading"
    ) {
      DebuggerManager.RefreshActiveDebuggers();
      return;
    }
    // Excludes tabs that aren't loading or are chrome extension pages
    // @ts-expect-error
    if (!(changeInfo.status === "loading")) {
      return;
    }

    let isOnGame = urlFilter.gameUrlRegex.test(tab.url);
    let hasDebuggerAttached = global_state.activeDebuggers.some(
      (item) => item.tabId == tabId,
    );
    if (isOnGame && !hasDebuggerAttached) {
      DebuggerManager.AddDebugger(tabId);
    } else if (!isOnGame && hasDebuggerAttached) {
      DebuggerManager.RemoveDebugger({ tabId: tabId });
    }
  }

  /**
   * Attaches a debugger to the tab matching the tabId
   */
  static AddDebugger(tabId:number) {
    try {
      chrome.debugger.attach(
        {
          tabId: tabId,
        },
        "1.0",
        DebuggerManager.onAttach.bind(null, tabId),
      );
    } catch (error) {
      console.log(
        "%c[error]Results tab already has a debugger attached...",
        "color:red;",
        error,
      );
      DebuggerManager.RefreshActiveDebuggers();
    }
  }

  /**
   * Removes a debugger from the tab matching the tabId
   */
  static async RemoveDebugger(debuggeeId:Debuggee) {
    try {
      // Creates bool that shows if the debuggeeId has a debugger attached
      let hasDebugger =
        global_state.activeDebuggers.filter(function (e) {
          return e.tabId == debuggeeId.tabId;
        }).length > 0;
      if (hasDebugger) {
        console.log(
          "%c[-]Removing debugger from tab: ",
          "color:red;",
          debuggeeId,
        );
        global_state.requestLog = [];
        await chrome.debugger.detach(debuggeeId);
        await DebuggerManager.RefreshActiveDebuggers();
      } else {
        console.log(
          "%c[-]Debugger wasn't attached: ",
          "color:red;",
          debuggeeId,
        );
      }
    } catch (error) {
      console.log(
        "%c[error]Debugger was already detatched... ",
        "color:red;",
        error,
      );
      DebuggerManager.RefreshActiveDebuggers();
    }
  }

  /**
   * Refreshes the array of active debuggers
   */
  static async RefreshActiveDebuggers() {
    chrome.debugger.getTargets(async function (result) {
      global_state.activeDebuggers = result.filter(function (e) {
        return e.attached == true;
      });
      console.log(
        "%c[info]Active debuggers Refreshed: ",
        "color:aqua;",
        global_state.activeDebuggers,
      );
    });
  }

  /**
   * Enables network events on debugged tab by sending a Network.enable command to the target debugee.
   * These events are listened to by the NetworkFilter.NetworkListener() method
   * @param tabId The tabId for the new debugee
   */
  static onAttach(tabId:number) {
    try {
      console.log("%c[+]New debugger added to: " + tabId, "color:lime;");
      chrome.debugger.sendCommand(
        {
          tabId: tabId,
        },
        "Network.enable",
      );
      console.log("%c[+]Network Enabled. Waiting for response", "color:lime;");
      DebuggerManager.RefreshActiveDebuggers();
    } catch (error) {
      console.log("An error occured at onAttach...", error);
      DebuggerManager.RefreshActiveDebuggers();
    }
  }
}
