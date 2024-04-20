// package: webrtc
// file: proto/webrtc.proto

import * as proto_webrtc_pb from "../proto/webrtc_pb";
import {grpc} from "@improbable-eng/grpc-web";

type WebRTCSignalingEstablishSession = {
  readonly methodName: string;
  readonly service: typeof WebRTCSignaling;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof proto_webrtc_pb.SessionRequest;
  readonly responseType: typeof proto_webrtc_pb.SessionResponse;
};

type WebRTCSignalingExchangeOffer = {
  readonly methodName: string;
  readonly service: typeof WebRTCSignaling;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof proto_webrtc_pb.OfferRequest;
  readonly responseType: typeof proto_webrtc_pb.OfferResponse;
};

type WebRTCSignalingExchangeAnswer = {
  readonly methodName: string;
  readonly service: typeof WebRTCSignaling;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof proto_webrtc_pb.AnswerRequest;
  readonly responseType: typeof proto_webrtc_pb.AnswerResponse;
};

type WebRTCSignalingExchangeICECandidate = {
  readonly methodName: string;
  readonly service: typeof WebRTCSignaling;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof proto_webrtc_pb.ICECandidateRequest;
  readonly responseType: typeof proto_webrtc_pb.ICECandidateResponse;
};

export class WebRTCSignaling {
  static readonly serviceName: string;
  static readonly EstablishSession: WebRTCSignalingEstablishSession;
  static readonly ExchangeOffer: WebRTCSignalingExchangeOffer;
  static readonly ExchangeAnswer: WebRTCSignalingExchangeAnswer;
  static readonly ExchangeICECandidate: WebRTCSignalingExchangeICECandidate;
}

export type ServiceError = { message: string, code: number; metadata: grpc.Metadata }
export type Status = { details: string, code: number; metadata: grpc.Metadata }

interface UnaryResponse {
  cancel(): void;
}
interface ResponseStream<T> {
  cancel(): void;
  on(type: 'data', handler: (message: T) => void): ResponseStream<T>;
  on(type: 'end', handler: (status?: Status) => void): ResponseStream<T>;
  on(type: 'status', handler: (status: Status) => void): ResponseStream<T>;
}
interface RequestStream<T> {
  write(message: T): RequestStream<T>;
  end(): void;
  cancel(): void;
  on(type: 'end', handler: (status?: Status) => void): RequestStream<T>;
  on(type: 'status', handler: (status: Status) => void): RequestStream<T>;
}
interface BidirectionalStream<ReqT, ResT> {
  write(message: ReqT): BidirectionalStream<ReqT, ResT>;
  end(): void;
  cancel(): void;
  on(type: 'data', handler: (message: ResT) => void): BidirectionalStream<ReqT, ResT>;
  on(type: 'end', handler: (status?: Status) => void): BidirectionalStream<ReqT, ResT>;
  on(type: 'status', handler: (status: Status) => void): BidirectionalStream<ReqT, ResT>;
}

export class WebRTCSignalingClient {
  readonly serviceHost: string;

  constructor(serviceHost: string, options?: grpc.RpcOptions);
  establishSession(
    requestMessage: proto_webrtc_pb.SessionRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: proto_webrtc_pb.SessionResponse|null) => void
  ): UnaryResponse;
  establishSession(
    requestMessage: proto_webrtc_pb.SessionRequest,
    callback: (error: ServiceError|null, responseMessage: proto_webrtc_pb.SessionResponse|null) => void
  ): UnaryResponse;
  exchangeOffer(
    requestMessage: proto_webrtc_pb.OfferRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: proto_webrtc_pb.OfferResponse|null) => void
  ): UnaryResponse;
  exchangeOffer(
    requestMessage: proto_webrtc_pb.OfferRequest,
    callback: (error: ServiceError|null, responseMessage: proto_webrtc_pb.OfferResponse|null) => void
  ): UnaryResponse;
  exchangeAnswer(
    requestMessage: proto_webrtc_pb.AnswerRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: proto_webrtc_pb.AnswerResponse|null) => void
  ): UnaryResponse;
  exchangeAnswer(
    requestMessage: proto_webrtc_pb.AnswerRequest,
    callback: (error: ServiceError|null, responseMessage: proto_webrtc_pb.AnswerResponse|null) => void
  ): UnaryResponse;
  exchangeICECandidate(
    requestMessage: proto_webrtc_pb.ICECandidateRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: proto_webrtc_pb.ICECandidateResponse|null) => void
  ): UnaryResponse;
  exchangeICECandidate(
    requestMessage: proto_webrtc_pb.ICECandidateRequest,
    callback: (error: ServiceError|null, responseMessage: proto_webrtc_pb.ICECandidateResponse|null) => void
  ): UnaryResponse;
}

