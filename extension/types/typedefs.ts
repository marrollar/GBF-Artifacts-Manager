// Modified and derived from https://github.com/granbluetracker/Granblue-Fantasy-Tracker

/** TYPE DEFINITIONS */

/**
 * The JSON object that contains information about the game before being tokenized
 */
type ResultInfoRaw = {
  /** If the response body is encoded in base64
   * - This should be set to false usually
   */
  base64Encoded: boolean;
  /** The content of the file */
  body: object;
};

// /**
//  * - The JSON object that contains information about the webpage after being tokenized.
//  * - This object comes from executing JSON.parse() on the body property of a ResultInfoRaw object.
//  * @typedef ResultInfo
//  * @property {string} data - A string containing the HTML for the current page. This string has been escaped so any special characters are replaced with their percent encoding
//  * @property {object} display_list - A JSON containing the items the player has favorited and are populating the UI at the bottom of the screen
//  * @property {object} option - Contains aditional info that may be used by the game webpage to populate itself
//  * @property {ResultData} option.result_data - A JSON object that contains extra info that is used to populate a results page after clearing a stage in the game
//  */

// /**
//  * - A JSON object that contains extra info that is used to populate a results page after clearing a stage in the game
//  * @typedef ResultData
//  * @property {number} quest_type - Contains information about what kind of quest the results page is for.
//  * - 1 => raid,
//  * - 25 => sandbox,
//  * - ext...
//  * @property {object | Array} replicard - Contains extra information specific to replicard stage.
//  * - object is only populated if the results are for a replicard stage.
//  * @property {object} rewards - Contains info about the rewards earned from the stage
//  * @property {object} rewards.reward_list A JSON containing information about any items that were dropped by the stage. This JSON has the following entries that contain JSONs when populated and an empty array when not:
//  * - "1" => wooden chest drops
//  * - "2" => silver chest drops
//  * - "3" => gold chest drops
//  * - "4" => MVP/Host/Red chest drops
//  * - "11" => blue chest drops
//  * - "13" => (maybe purple?) chest drops
//  * - "15" => (maybe purple?) chest drops
//  * - "16" => Conditional/Extra/Light Blue chest drops
//  * @property {string} url - The return url that clicking the continue button will bring you to
//  */

/**
 * - A JSON containing information about any items that were dropped by the stage
 */
type TableEntry = {
  /** Time in ms (from Jan 1, 1970) when the entry was created */
  epochTime: number;
  /** Number of blue chests dropped in this entry */
  blueChest: number;
  /** Number of blue chests dropped in this entry */
  redChest: number;
  /** Number of purple/sky blue chests dropped in this entry */
  extraChest: number;
  /** JSON containing information about items that were dropped for this entry
   * - An item's ID {string} is the key and it's count {string} is the value
   */
  itemList: object;
};

/**
 * An array of TableEntry objects representing the data recorded for a tracked stage
 */
type TableData = TableEntry[];

/**
 * Unique request identifier.
 */
type Network = {
  /** HTTP request data */
  request: {
    /** Request URL */
    url: string;
  };
  requestId: string;
};

/**
 * Debuggee identifier. Either tabId, extensionId or targetId must be specified.
 */
type Debuggee = {
  /** The id of the extension which this debugger is attached to. */
  extensionId?: string;
  /** The id of the tab this debugger is attached to. */
  tabId?: number;
  /** The opaque id of the target this debugger is attached to. */
  targetId?: string;
};

/**
 * A chrome extension object containing information about a browser tab.
 */
type Tab = {
  /** The last committed URL of the main frame of the tab.  */
  url: string;
  /** The ID of the tab. Tab IDs are unique within a browser session.  */
  id: number;
};

/**
 * Contains the Regex to check if URLs match certain conditions.
 */
type UrlRegexJson = {
  /** - Granblue Fantasy URL */
  gameUrlRegex: RegExp;
  /** - Extension page URL */
  extensionUrlRegex: RegExp;
  /** - Solo fight results landing page URL */
  soloResultUrlRegex: RegExp;
  /** - Raid results landing page URL */
  raidResultUrlRegex: RegExp;
  /** - Any fight results landing page */
  resultUrlRegex: RegExp;
  /** - Solo battle results JSON file URL */
  soloRewardUrlRegex: RegExp;
  /** - Raid results JSON file URL */
  raidRewardUrlRegex: RegExp;
  /** - Any fight results JSON file URL */
  rewardUrlRegex: RegExp;
  /** - Sandbox zone E-H URL */
  sandboxStavesRegex: RegExp;
  /** - Sandbox zone I-L URL */
  sandboxSwordsRegex: RegExp;
  /** - Sandbox zone M URL */
  sandboxGenesisRegex: RegExp;
  /** - Current sephira sandbox chest stock JSON file URL */
  sephiraStockRegex: RegExp;
  /** - Sephira chest opening rewards JSON file URL */
  sephiraOpenRegex: RegExp;
  /** - Sephira Sandbox chest stock JSON file URL */
  sephiraUrlRegex: RegExp;
  /** - URLs that may contain xeno box drops */
  xenoboxUrlRegex: RegExp;
  /** - URLs that will pass the network listener */
  whitelist: RegExp;
};

type ControllerElements = {
  controllerHead: HTMLElement;
  addTrackerButton: HTMLElement;
  removeTrackerButton: HTMLElement;
  clearTrackersButton: HTMLElement;
  controllerBody: HTMLElement;
  backgroundShadow: HTMLElement;
  stageSelectMenu: HTMLElement;
  stageSelectGroups: HTMLElement;
  dataPeriodButton: HTMLElement;
  dataPeriodText: HTMLElement;
  dataPeriodSelector: HTMLElement;
  timerText: HTMLElement;
  resetTimerButton: HTMLElement;
  lastDrop: HTMLElement;
  lastDropName: HTMLElement;
  lastDropItemsContainer: HTMLElement;
  lastDropItems: HTMLElement;
};

/**
 * A collection of HTML elements containing different pieces of the tracker instance
 */
type TrackerElements = {
  /** Root element for tracker */
  tracker: HTMLDivElement;
  /** Title of tracker */
  stageTitleText: HTMLDivElement;
  /** Div holding image for the stage */
  trackerInfoPortrait: HTMLDivElement | undefined;
  /** Div containing kill info (part of stats block) */
  killsRow: HTMLDivElement | undefined;
  /** Div containing kill count text (part of stats block) */
  killsText: HTMLDivElement | undefined;
  /** Div containing red chest info (part of stats block) */
  redChestRow: HTMLDivElement | undefined;
  /** Div containing red chest count text (part of stats block) */
  redChestText: HTMLDivElement | undefined;
  /** Div containing blue chest info (part of stats block) */
  blueChestRow: HTMLDivElement | undefined;
  /** Div containing blue chest count text (part of stats block) */
  blueChestText: HTMLDivElement | undefined;
  /** Div containing extra chest info (part of stats block) */
  extraChestRow: HTMLDivElement | undefined;
  /** Div containing extra chest count text (part of stats block) */
  extraChestText: HTMLDivElement | undefined;
  /** Div holding all pieces of the loot tracker */
  lootContainer: HTMLDivElement;
  /** Div holding Xeno Boxes. Only exists on trackers of type "2" */
  xenoBoxes: HTMLDivElement;
  /** Div holding lucky loot title and info about lucky loot */
  luckyLoot: HTMLDivElement;
  /** Div holding info about lucky loot */
  luckyLootDrops: HTMLDivElement;
  /** Div holding common loot title and info about common loot */
  commonLoot: HTMLDivElement;
  /** Div holding info about common loot */
  commonLootDrops: HTMLDivElement;
  /** Collection of all text elements for the sephira box tracker (stageType = 1) */
  sephiraBoxes: NodeList | undefined;
  /** Div element that when active, covers the entire tracker and deletes it when clicked */
  trackerRemoveClickbox: HTMLDivElement;
};

/**
 * Stores settings for the tracker instance
 */
type TrackerSettings = {
  /** ID for the type of data being tracked */
  stageType: string;
  /** The name of the stage being tracked */
  selectedStage: string;
  /** Other stages besides "selectedStage" that may be recorded by the tracker. Unused for now */
  otherStages: string[];
};

type ExtensionSettings = {
  /** Bool if darkmode background is used */
  darkmode: boolean;
  /** String representing what the current period being tracked is.
   * - "0" => All data
   * - "1" => Data within the month
   * - "2" => Data within the week
   * - "3" => Data within the day
   * - "4" => Data since a custom timer was started */
  dataPeriod: string;
  /** A string storing the last known latest version taken from the extension's github page */
  latestVersion: string;
  /** An array storing the currently tracked bosses. This array is read when the tracker controller is opened and determines which trackers are built at initialization */
  selectedBoss: SelectedBoss[];
  /** The datetime in ms representing the last time that the extension checked github for the latest version */
  timeCheckedLastVersion: number;
  /** The datetime that the timer was started. This timer is the one used for dataPeriod = 4 */
  timerStart: number;
  /** Setting that determines if the latest drop is displayed in the tracker controller header */
  useLastDrop: boolean;
  /** Setting that determines if the extension will use an unlocked stage at the end of the tracker controller that always updates to any untracked stage */
  useUnlockedStage: boolean;
};

/**
 * The format that the currently tracked bosses are stored in the extension settings
 */
type SelectedBoss = {
  /** A redundant flag set to true. Would determine if a stage can be swapped for another if an untracked stage drop is detected.
   *
   * Since untracked stages aren't stored in localstorage, this will always be true. */
  isLocked: boolean;
  /** The name of the stage. */
  stage: string;
  /** The type of stage being tracked... */
  type: string;
};
