import { RawArtifact } from "@/extension/src/DataProcessor";

export type GetDataMessage = {
  action: "getData";
  params: {
    key: string | null;
  };
};

export type SetDataMessage = {
  action: "setData";
  params: {
    key: string;
    data: object;
  };
};

export type StringResponse = {
  response: string;
};

export type ObjectResponse = {
  response: object;
};

export type ApiMessage = GetDataMessage | SetDataMessage;
export type ResponseMessage = StringResponse | ObjectResponse;


export type RawArtifactMessage = {
  key: string;
  data: RawArtifact
}