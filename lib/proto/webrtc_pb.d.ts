// package: webrtc
// file: proto/webrtc.proto

import * as jspb from "google-protobuf";

export class SessionRequest extends jspb.Message {
  getSessionId(): string;
  setSessionId(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SessionRequest.AsObject;
  static toObject(includeInstance: boolean, msg: SessionRequest): SessionRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: SessionRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SessionRequest;
  static deserializeBinaryFromReader(message: SessionRequest, reader: jspb.BinaryReader): SessionRequest;
}

export namespace SessionRequest {
  export type AsObject = {
    sessionId: string,
  }
}

export class SessionResponse extends jspb.Message {
  getSessionId(): string;
  setSessionId(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SessionResponse.AsObject;
  static toObject(includeInstance: boolean, msg: SessionResponse): SessionResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: SessionResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SessionResponse;
  static deserializeBinaryFromReader(message: SessionResponse, reader: jspb.BinaryReader): SessionResponse;
}

export namespace SessionResponse {
  export type AsObject = {
    sessionId: string,
  }
}

export class OfferRequest extends jspb.Message {
  getSessionId(): string;
  setSessionId(value: string): void;

  getOffer(): string;
  setOffer(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): OfferRequest.AsObject;
  static toObject(includeInstance: boolean, msg: OfferRequest): OfferRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: OfferRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): OfferRequest;
  static deserializeBinaryFromReader(message: OfferRequest, reader: jspb.BinaryReader): OfferRequest;
}

export namespace OfferRequest {
  export type AsObject = {
    sessionId: string,
    offer: string,
  }
}

export class OfferResponse extends jspb.Message {
  getOffer(): string;
  setOffer(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): OfferResponse.AsObject;
  static toObject(includeInstance: boolean, msg: OfferResponse): OfferResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: OfferResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): OfferResponse;
  static deserializeBinaryFromReader(message: OfferResponse, reader: jspb.BinaryReader): OfferResponse;
}

export namespace OfferResponse {
  export type AsObject = {
    offer: string,
  }
}

export class AnswerRequest extends jspb.Message {
  getSessionId(): string;
  setSessionId(value: string): void;

  getAnswer(): string;
  setAnswer(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): AnswerRequest.AsObject;
  static toObject(includeInstance: boolean, msg: AnswerRequest): AnswerRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: AnswerRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): AnswerRequest;
  static deserializeBinaryFromReader(message: AnswerRequest, reader: jspb.BinaryReader): AnswerRequest;
}

export namespace AnswerRequest {
  export type AsObject = {
    sessionId: string,
    answer: string,
  }
}

export class AnswerResponse extends jspb.Message {
  getAnswer(): string;
  setAnswer(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): AnswerResponse.AsObject;
  static toObject(includeInstance: boolean, msg: AnswerResponse): AnswerResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: AnswerResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): AnswerResponse;
  static deserializeBinaryFromReader(message: AnswerResponse, reader: jspb.BinaryReader): AnswerResponse;
}

export namespace AnswerResponse {
  export type AsObject = {
    answer: string,
  }
}

export class ICECandidateRequest extends jspb.Message {
  getSessionId(): string;
  setSessionId(value: string): void;

  getCandidate(): string;
  setCandidate(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ICECandidateRequest.AsObject;
  static toObject(includeInstance: boolean, msg: ICECandidateRequest): ICECandidateRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ICECandidateRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ICECandidateRequest;
  static deserializeBinaryFromReader(message: ICECandidateRequest, reader: jspb.BinaryReader): ICECandidateRequest;
}

export namespace ICECandidateRequest {
  export type AsObject = {
    sessionId: string,
    candidate: string,
  }
}

export class ICECandidateResponse extends jspb.Message {
  getCandidate(): string;
  setCandidate(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ICECandidateResponse.AsObject;
  static toObject(includeInstance: boolean, msg: ICECandidateResponse): ICECandidateResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ICECandidateResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ICECandidateResponse;
  static deserializeBinaryFromReader(message: ICECandidateResponse, reader: jspb.BinaryReader): ICECandidateResponse;
}

export namespace ICECandidateResponse {
  export type AsObject = {
    candidate: string,
  }
}

