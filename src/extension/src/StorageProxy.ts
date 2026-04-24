import { getObjectFromLocalStorage, saveObjectInLocalStorage } from "@/api/chrome_local_storage.ts";
import { createMessageHandlerFn } from "@/api/messages.ts";
import { EXT_SETTINGS_KEY, global_state } from "./globals.ts";
import type { ArtifactMap } from "@/app/types.ts";

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

  async get(key: string | null): Promise<any> {
    if (key === null) {
      // If we want all data from storage...
      // Exhaust everything that is about to be written first.
      while (this.writeRequestQueue.length > 0) {
        // console.log("%c[info]Get all artifacts from local storage", "color:cyan;")
        if (!this.writeProtectFlag) {
          this.processRequest();
        }
      }
    } else {
      // Otherwise, search the writes in progress and see if there is an updated object in there.
      // Return it if so.
      const writeRequestQueueCopy = this.writeRequestQueue.slice();
      while (writeRequestQueueCopy.length > 0) {
        let object: Record<string, any> | undefined = writeRequestQueueCopy.pop();
        if (key !== null && object?.hasOwnProperty(key)) {
          // console.log("%c[info]Found " + key + " in the write queue", "color:cyan;")
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

const storageProxy = new StorageProxy();

export const SaveArtifact = createMessageHandlerFn("SET_DATA", async (payload) => {
  storageProxy.save(payload.data);
  return { ok: true };
});

export const GetArtifact = createMessageHandlerFn("GET_DATA", async (payload) => {
  return { data: (await storageProxy.get(payload.id)) as ArtifactMap };
});

export const GetAllArtifacts = createMessageHandlerFn("GET_ALL_DATA", async () => {
  return { data: (await storageProxy.get(null)) as ArtifactMap };
});

export const RemoveArtifact = createMessageHandlerFn("REMOVE_ARTIFACT", async (payload) => {
  const removed = await GetArtifact({ id: payload.id });
  try {
    await chrome.storage.local.remove(payload.id);
    return removed;
  } catch (e) {
    console.log("%c[error]Failed to remove artifact from local storage: ", payload.id, "color:red;");
  }
  return { data: false };
});

export const ClearAllArtifacts = createMessageHandlerFn("CLEAR_ALL_DATA", async () => {
  const ext_settings = await GetExtensionSettings();
  await storageProxy.processRequest();
  await chrome.storage.local.clear();
  await SetExtensionSettings(ext_settings);
  return { ok: true };
});

export const GetExtensionSettings = createMessageHandlerFn("GET_EXT_SETTINGS", async () => {
  const ret = await storageProxy.get(EXT_SETTINGS_KEY);

  if (Object.entries(ret).length > 0) {
    return { data: ret[EXT_SETTINGS_KEY] };
  } else {
    return { data: {} };
  }
});
export const SetExtensionSettings = createMessageHandlerFn("SET_EXT_SETTINGS", async (payload) => {
  storageProxy.save({ [EXT_SETTINGS_KEY]: payload.data });
  return { ok: true };
});
