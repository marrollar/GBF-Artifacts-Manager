type TrackedRequest = {
  requestId: string;
  tabId: number | undefined;
  fileType: string;
  timestamp: number;
};

type State = {
  requestLog: [string, Network, number | undefined][];
  /** Tracks the last loot file info */
  trackedRequest: TrackedRequest;
  /** Stores an up to date list of every debugger attached to a tab */
  activeDebuggers: chrome.debugger.TargetInfo[];
};

export const global_state: State = {
  requestLog: [],
  trackedRequest: {
    requestId: "",
    tabId: undefined,
    fileType: "",
    timestamp: 0,
  },
  activeDebuggers: [],
};
