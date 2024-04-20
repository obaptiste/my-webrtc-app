import * as grpc from 'grpc-web';
import * as protoLoader from '@grpc/proto-loader';
import { WebRTCSignalingService, WebRTCSignalingServer, WebRTCSignalingClient } from './generated/proto/webrtc_pb_service';
import { SessionRequest, SessionResponse, OfferRequest, OfferResponse, AnswerRequest, AnswerResponse } from './generated/proto/webrtc_pb';
