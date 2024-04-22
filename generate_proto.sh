#!/bin/bash

PROTO_DIR=./proto
OUT_DIR=/Users/macmini/Code/tutorial_two/my-webrtc-app/generated/proto 


# Generate TypeScript code
protoc \
    --plugin=protoc-gen-ts=/Users/macmini/Code/tutorial_two/my-webrtc-app/node_modules/.bin/protoc-gen-ts \
    --js_out=import_style=commonjs,binary:./generated \
    --ts_out=./generated \
    --proto_path=/proto \ 
    "$PROTO_DIR"/video_messaging.proto  \