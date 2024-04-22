#!/bin/bash

\set -e

# Generate TypeScript code
protoc \
    --plugin=protoc-gen-ts=/Users/macmini/Code/tutorial_two/my-webrtc-app/node_modules/.bin/protoc-gen-ts \
    --js_out=import_style=commonjs,binary:./generated \
    --ts_out=./generated \
    --proto_path=./lib/proto \ 
    ./lib/proto/video_messaging.proto 