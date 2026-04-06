/* Returns object from chrome's local storage */
async function getObjectFromLocalStorage(key: string) {
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
}
/* Stores object from chrome's local storage */
async function saveObjectInLocalStorage(obj: object) {
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
