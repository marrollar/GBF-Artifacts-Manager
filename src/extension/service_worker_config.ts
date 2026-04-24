// Modified and derived from https://github.com/granbluetracker/Granblue-Fantasy-Tracker

import './types/typedefs.ts';

// @ts-expect-error
function DeepFreeze(object){
    Object.keys(object).forEach((property) => {
        if (object[property] != null && typeof object[property] == "object" && !Object.isFrozen(object[property])){
            DeepFreeze(object[property]);
        }
    })
    return Object.freeze(object);
}

const game_url = "^https:\/\/game.granbluefantasy.jp\/"
const extension_url = "^chrome:\/\/extensions\/|^chrome-extension:\/\/"
const artifact_inventory_url = "rest\/artifact\/list\/"
const artifact_decompose_url = "rest\/artifact\/execute_decompose"

export const urlFilter = {
    gameUrl: game_url,
    gameUrlRegex: new RegExp(game_url),
    extensionUrlRegex: new RegExp(extension_url),

    // Artifacts inventory request url
    artiInventoryUrl: artifact_inventory_url,
    artifactsInventoryUrlRegex: RegExp(artifact_inventory_url),

    // Artifacts execute decompose request url
    artiDecomposeUrl: artifact_decompose_url,
    artifactsDecomposeUrlRegex: RegExp(artifact_decompose_url),

    // Network listener whitelist
    whitelistUrl: "",
    whitelist: new RegExp(""),
};

urlFilter.whitelistUrl = urlFilter.artiInventoryUrl + "|" + urlFilter.artiDecomposeUrl;
urlFilter.whitelist = new RegExp(urlFilter.gameUrl + "(" + urlFilter.whitelistUrl + ")");
DeepFreeze(urlFilter);