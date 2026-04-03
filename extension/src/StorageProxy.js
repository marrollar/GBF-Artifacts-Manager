import { activeDebuggers } from "./DebuggerManager";

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
            if (obj) {
                await this.saveObjectInLocalStorage(obj);
            } else {
                // console.log("FAILED TO SAVE NEW OBJECT")
            }
            
        }
        this.writeProtectFlag = false;
    }

    /**
     * @param {string} key 
     */
    async get(key){
        const writeRequestQueueCopy = this.writeRequestQueue.slice();
        while(writeRequestQueueCopy.length > 0){
            /** @type {{ [key: string]: any } | undefined } */
            let object = writeRequestQueueCopy.pop()
            if (object?.hasOwnProperty(key)){
                return object[key];
            }
        };
        return this.getObjectFromLocalStorage(key);
    }

    /**
     * @param {object} obj 
     */
    async save(obj){
        /** Updates local values if the values in perminent storage change */
        if (obj?.Settings?.timerStart) {
            timerStart = obj.Settings.timerStart;
        }
        else if (obj?.eventList) {
            eventList = obj.eventList;
        }

        this.writeRequestQueue.push(obj);
        if (!this.writeProtectFlag){this.processRequest();}
    }

    /**
     * @param {string} varName 
     */
    async getVar(varName){
        switch (varName){
            case "activeDebuggers":
                return activeDebuggers;
            case "Settings":
                let settings = await storageProxy.get("Settings");
                return settings;
            default:
                return "Error: data did not exist or access is not allowed"
        }
    }

    /* Returns object from chrome's local storage */
    /**
     * @param {string} key 
     */
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
    /**
     * @param {object} obj 
     */
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

export const storageProxy = new StorageProxy();