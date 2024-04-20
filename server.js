//gRPC server File

const sessions = {};

server.addService(protoDescriptor.webrtc.WebRTCSignaling.service, {
  Establish(call, callback) {
    const sessionId = generateUniqueSessionId();
    sessions[sessionId] = { state: "pending" };

    callback(
      null,
      new proto_webrtc_pb.SessioinResponse().setSessionId(sessionId)
    );
  },
});
