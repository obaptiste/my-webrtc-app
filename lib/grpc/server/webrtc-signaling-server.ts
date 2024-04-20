import * as grpc from "@grpc/grpc-js";
import { SessionRequest, SessionResponse, OfferRequest, OfferResponse, AnswerRequest, AnswerResponse, ICECandidateRequest, ICECandidateResponse } from '../../proto/webrtc_pb';
import type { ISessionRequest, ISessionResponse, IOfferRequest, IOfferResponse, IAnswerRequest, IAnswerResponse, IICECandidateRequest, IICECandidateResponse } from '../../
import { WebRTCSignaling as WebRTCSignalingService } from "@/lib/proto/webrtc_pb_service";
import { WebRTCSession } from "./webrtc-session";
import { WebRTCSignaling } from "@/generated/proto/webrtc_pb_service";


class WebRTCSignalingServerImpl implements WebRTCSignalingService {
    private sessions: Map<string, WebRTCSession> = new Map();

    // generateSessionId(): string {
    //     const { v4: uuidv4 } = require("uuid");
    //     import { AnswerRequest } from '../../proto/webrtc_pb'; // Add the missing import
    //     return uuidv4();
    // }


    establishSession(
        call: grpc.ServerUnaryCall<ISessionRequest, ISessionResponse>,
        callback: grpc.sendUnaryData<ISessionResponse>
    ): void {
        const sessionId = this.generateSessionId();
        this.sessions.set(sessionId, new WebRTCSession());
        callback(null, { session_id: sessionId });
    }


    exchangeOffer(
        call: grpc.ServerUnaryCall<IOfferRequest, IOfferResponse>,
        callback: grpc.sendUnaryData<IOfferResponse>
    ): void {
        const { session_id, offer } = call.request;
        const session = this.sessions.get(session_id);
        if (session) {
            session.setOffer(offer);
            callback(null, { offer }); // Pass the instance of OfferResponse as the second argument
        } else {
            callback(new Error(`Session not found: ${session_id} `));
        }
    }

    exchangeAnswer(
        call: grpc.ServerUnaryCall<IAnswerRequest, IAnswerResponse>,
        callback: grpc.sendUnaryData<IAnswerResponse>
    ): void {
        const { session_id, answer } = call.request;
        const session = this.sessions.get(session_id);
        if (session) {
            session.setAnswer(answer);
            callback(null, { answer });
        } else {
            callback(new Error(`Session not found: ${session_id} `));
        }
    }

    exchangeICECandidate(
        call: grpc.ServerUnaryCall<IICECandidateRequest, IICECandidateResponse>,
        callback: grpc.sendUnaryData<IICECandidateResponse>
    ): void {
        const { session_id, candidate } = call.request;
        const session = this.sessions.get(session_id);
        if (session) {
            session.addICECandidate(candidate);
            callback(null, { candidate });
        } else {
            callback(new Error(`Session not found: ${session_id} `));
        }
    }

    private generateSessionId(): string {
        return 'session-' + Math.random().toString(36).substr(2, 9);
    }
}

export { WebRTCSignalingServerImpl };