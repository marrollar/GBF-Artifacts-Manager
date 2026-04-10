import type { Artifacts } from "@/app/types";

export interface MessageMap {
  GET_ALL_DATA: {
    payload: undefined;
    response: { data: Artifacts };
  };

  GET_DATA: {
    payload: { id: string };
    response: { data: Artifacts };
  };

  SET_DATA: {
    payload: { data: Artifacts };
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
