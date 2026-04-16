
/* Returns object from chrome's local storage */
export async function getObjectFromLocalStorage(key: string | null) {
  // console.log("%c[info]Retrieving " + key + " from local storage", "color:cyan;")
  return new Promise((resolve, reject) => {
    try {
      if (key !== null) {
        chrome.storage.local.get(key, (value) => {
          resolve(value);
        });
      } else {
        chrome.storage.local.get(null, (items) => {
          resolve(items);
        });
      }
    } catch (ex) {
      console.log(ex);
      reject(ex);
    }
  });
}
/* Stores object from chrome's local storage */
export async function saveObjectInLocalStorage(obj: object) {
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
}
