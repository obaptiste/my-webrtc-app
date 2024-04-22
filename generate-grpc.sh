#!/bin/bash

# Path to the directory containing the .proto files
PROTO_DIR="./lib/proto"

protoc \
    --proto_path="./lib/proto" \
    --plugin=protoc-gen-ts_proto=./node_modules/.bin/protoc-gen-ts_proto  \
    --ts_proto_out=$OUT_DIR \ 
    --ts_proto_opt=esModuleInterop=true \
    ./lib/proto/*.proto