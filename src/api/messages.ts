import type { ArtifactMap } from "@/app/types";
import type { ExtensionSettings } from "@/extension/src/globals";

// TODO: All of the non-Getters blind return an ok-true. Maybe change this.
export interface MessageMap {
  GET_ALL_DATA: {
    payload: undefined;
    response: { data: ArtifactMap };
  };
  GET_DATA: {
    payload: { id: string };
    response: { data: ArtifactMap };
  };
  SET_DATA: {
    payload: { data: ArtifactMap };
    response: { ok: true };
  };
  REMOVE_ARTIFACT: {
    payload: { id: string };
    response: { data: ArtifactMap | false };
  };
  CLEAR_ALL_DATA: {
    payload: undefined;
    response: { ok: true };
  };
  GET_EXT_SETTINGS: {
    payload: undefined;
    response: { data: ExtensionSettings };
  };
  SET_EXT_SETTINGS: {
    payload: { data: ExtensionSettings };
    response: { ok: true };
  };
}

export type MessageType = keyof MessageMap;

// export type Message<T extends MessageType> = MessageMap[T]["payload"] extends undefined
//   ? { type: T }
//   : { type: T; payload: MessageMap[T]["payload"] };

// export type MessageResponse<T extends MessageType> = MessageMap[T]["response"];

// export type MessageHandler<T extends MessageType> = (
//   msg: Message<T>,
// ) => Promise<MessageResponse<T>> | MessageResponse<T>;

export type MessageHandlerFn<T extends MessageType> = MessageMap[T]["payload"] extends undefined
  ? () => Promise<MessageMap[T]["response"]>
  : (payload: MessageMap[T]["payload"]) => Promise<MessageMap[T]["response"]>;

export function createMessageHandlerFn<T extends MessageType>(_: T, fn: MessageHandlerFn<T>) {
  return fn;
}
