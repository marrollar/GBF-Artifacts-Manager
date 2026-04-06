type TrackedRequest = {
  requestId: string;
  tabId: number | undefined;
  fileType: string;
  timestamp: number;
};

type State = {
  requestLog: [string, Network, number | undefined][];
  trackedRequest: TrackedRequest;
  activeDebuggers: chrome.debugger.TargetInfo[];
};

export const global_state: State = {
  requestLog: [],
  /** - Tracks the last loot file info */
  trackedRequest: {
    requestId: "",
    tabId: undefined,
    fileType: "",
    timestamp: 0,
  },
  /** - Stores an up to date list of every debugger attached to a tab */
  activeDebuggers: [],
};
