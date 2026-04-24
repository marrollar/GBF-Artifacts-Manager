# Granblue Fantasy Artifacts Manager

A chrome extension to help manage your artifact inventory.

![](./res/demo.gif)

## Compatibility
Tested with Vivaldi v7.9.3970.55 containing Chromium v146.0.7680.203.

This is a manifest v3 extension.

## ToS Notes
> [!WARNING]
> By default the extension WILL NOT affect anything related to the game. However there is a setting that can be toggled to draw an outline around artifacts ingame that have been marked to be disposed of from the extension. <br> <br>
> This is done by directly editing the css style of the relevant elements in game. <br> <br>
> While this is detectable in theory, I am not aware, within the code that they have provided you within your browser, that there is a system that is doing so (notably, while there is an instance of MutationObserver within the GBF browser code, it is not linked to observe any changes in css styles, or anything html related in general). <br> <br>
> This does not mean there might not be another method of detection in operation that I am not aware of, so this setting should be enabled at the user's discretion.

## Installation

## Features
- Automatically store your artifact data into the extension as you page through the inventory
- Multi-option select filters. Blacklist OK
- REGEX searching
- (Optional) Ingame outline visualizations
  - Red outline for artifacts marked trash ingame or in-extension
  - Green outline for artifacts marked trash ingame BUT NOT in-extension

> [!NOTE]
> The extension will NEVER automatically mark an artifact to be trashed in game. The outline is only there to help you see which ones you've chosen to be trashed.


## Usage
Left click on the buttons to whitelist filter. <br>
Right click to blacklist filter (only for the skill group boxes).

## Troubleshooting
- Extension data not synchronized with in game inventory
  - Try clicking the `Refresh` button at the top of the app. This should ask the app to re-fetch data from the extension's local storage. Otherwise, try re-opening or refreshing the app window.
- Extension not storing any artifact data at all
  - Check to see that the browser debugger is working
  - OR go to your extensions, locate this extension's box and click the `service worker` link within. This should open a browser console. If the console contains atleast the entry `Active debuggers Refreshed:`, then atleast one tab is being tracked by the extension. If this line does not exist, try refreshing the game's tab.
  ![alt text](./res/extension_page.png)
