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
  body: any;
};

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
