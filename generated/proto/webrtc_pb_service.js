// package: webrtc
// file: proto/webrtc.proto

var proto_webrtc_pb = require("../proto/webrtc_pb");
var grpc = require("@improbable-eng/grpc-web").grpc;

var WebRTCSignaling = (function () {
  function WebRTCSignaling() {}
  WebRTCSignaling.serviceName = "webrtc.WebRTCSignaling";
  return WebRTCSignaling;
}());

WebRTCSignaling.EstablishSession = {
  methodName: "EstablishSession",
  service: WebRTCSignaling,
  requestStream: false,
  responseStream: false,
  requestType: proto_webrtc_pb.SessionRequest,
  responseType: proto_webrtc_pb.SessionResponse
};

WebRTCSignaling.ExchangeOffer = {
  methodName: "ExchangeOffer",
  service: WebRTCSignaling,
  requestStream: false,
  responseStream: false,
  requestType: proto_webrtc_pb.OfferRequest,
  responseType: proto_webrtc_pb.OfferResponse
};

WebRTCSignaling.ExchangeAnswer = {
  methodName: "ExchangeAnswer",
  service: WebRTCSignaling,
  requestStream: false,
  responseStream: false,
  requestType: proto_webrtc_pb.AnswerRequest,
  responseType: proto_webrtc_pb.AnswerResponse
};

WebRTCSignaling.ExchangeICECandidate = {
  methodName: "ExchangeICECandidate",
  service: WebRTCSignaling,
  requestStream: false,
  responseStream: false,
  requestType: proto_webrtc_pb.ICECandidateRequest,
  responseType: proto_webrtc_pb.ICECandidateResponse
};

exports.WebRTCSignaling = WebRTCSignaling;

function WebRTCSignalingClient(serviceHost, options) {
  this.serviceHost = serviceHost;
  this.options = options || {};
}

WebRTCSignalingClient.prototype.establishSession = function establishSession(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(WebRTCSignaling.EstablishSession, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

WebRTCSignalingClient.prototype.exchangeOffer = function exchangeOffer(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(WebRTCSignaling.ExchangeOffer, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

WebRTCSignalingClient.prototype.exchangeAnswer = function exchangeAnswer(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(WebRTCSignaling.ExchangeAnswer, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

WebRTCSignalingClient.prototype.exchangeICECandidate = function exchangeICECandidate(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(WebRTCSignaling.ExchangeICECandidate, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

exports.WebRTCSignalingClient = WebRTCSignalingClient;

