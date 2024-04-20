#!/bin/bash

protoc --plugin=protoc-gen-ts=./node_modules/.bin/protoc-gen-ts \
       --plugin=protoc-gen-grpc-web=./node_modules/.bin/protoc-gen-grpc-web \
       --js_out=import_style=commonjs,binary:lib/grpc \
       --grpc-web_out=import_style=typescript,mode=grpcwebtext:lib/grpc \
       lib/grpc/video_call.proto