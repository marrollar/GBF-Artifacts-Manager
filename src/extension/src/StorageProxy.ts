import { global_state } from "./globals.ts";
import {
  getObjectFromLocalStorage,
  saveObjectInLocalStorage,
} from "@/api/chrome_local_storage.ts";

/**
 * Synchronizes read/write events to prevent race conditions
 */
class StorageProxy {
  writeRequestQueue: object[];
  writeProtectFlag: boolean;

  constructor() {
    /** A queue of objects waiting to be written to local storage */
    this.writeRequestQueue = [];
    /** Set to true when an object in the writeRequestQueue is being processed by processRequest() */
    this.writeProtectFlag = false;
    return this;
  }

  async processRequest() {
    this.writeProtectFlag = true;
    while (this.writeRequestQueue.length > 0) {
      const obj = this.writeRequestQueue.shift();
      // console.log("SAVING NEW OBJECT: ", obj);
      if (obj) {
        await saveObjectInLocalStorage(obj);
      } else {
        // console.log("FAILED TO SAVE NEW OBJECT")
      }
    }
    this.writeProtectFlag = false;
  }

  async get(key: string | null) {
    if (key === null) {
      // If we want all data from storage...
      // Exhaust everything that is about to be written first.
      while (this.writeRequestQueue.length > 0) {
        if (!this.writeProtectFlag) {
          this.processRequest();
        }
      }
    } else {
      // Otherwise, search the writes in progress and see if there is an updated object in there.
      // Return it if so.
      const writeRequestQueueCopy = this.writeRequestQueue.slice();
      while (writeRequestQueueCopy.length > 0) {
        let object: Record<string, any> | undefined =
          writeRequestQueueCopy.pop();
        if (key !== null && object?.hasOwnProperty(key)) {
          return object[key];
        }
      }
    }

    // Fallback, read the object from "cold" storage and/or return all objects.
    return getObjectFromLocalStorage(key);
  }

  async save(obj: object) {
    // TODO: Reimplement this comment block?
    /** Updates local values if the values in perminent storage change */
    // if (obj?.Settings?.timerStart) {
    //     timerStart = obj.Settings.timerStart;
    // }
    // else if (obj?.eventList) {
    //     eventList = obj.eventList;
    // }

    this.writeRequestQueue.push(obj);
    if (!this.writeProtectFlag) {
      this.processRequest();
    }
  }

  async getVar(varName: string) {
    switch (varName) {
      case "activeDebuggers":
        return global_state.activeDebuggers;
      case "Settings":
        let settings = await storageProxy.get("Settings");
        return settings;
      default:
        return "Error: data did not exist or access is not allowed";
    }
  }
}

export const storageProxy = new StorageProxy();
