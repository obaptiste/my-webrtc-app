import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import * as path from 'path';
import { WebRTCSignalingServerImpl } from './webrtc-signaling-server';
import { GrpcObject } from '@grpc/grpc-js';

const PROTO_PATH = path.join(__dirname, '../../proto/webrtc.proto');

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
});

const WebRTCSignalingProto = grpc.loadPackageDefinition(packageDefinition).webrtc;

function startServer(): void {
    const server = new grpc.Server();
    server.addService(WebRTCSignalingProto.WebRTCSignaling.service, new WebRTCSignalingServerImpl());
}

