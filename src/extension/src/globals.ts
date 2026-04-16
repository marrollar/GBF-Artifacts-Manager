import { type Network } from "../types/typedefs.ts";

export const RequestTypes = {
  ListPage: "ListPage",
  ArtifactsDestroyed: "ArtifactsDestroyed",
} as const;

export type RequestTypes = (typeof RequestTypes)[keyof typeof RequestTypes];

export type TrackedRequest = {
  requestId: string;
  tabId: number | undefined;
  requestType: RequestTypes | undefined;
  timestamp: number;
};

export type State = {
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
    requestType: undefined,
    timestamp: 0,
  },
  activeDebuggers: [],
};

export type ExtensionSettings = {
  do_styles:boolean
}

export const DEFAULT_EXTENSION_SETTINGS:ExtensionSettings = {
  do_styles:false
}