#!/bin/bash

set -e
set -x

# Path to the directory containing the .proto files
PROTO_DIR="./lib/proto"
OUT_DIR="./generated/proto"

echo "PROTO_DIR is set to $PROTO_DIR"

# Assuming OUT_DIR is defined earlier in your script. If not, define it.
echo "OUT_DIR is set to $OUT_DIR"

protoc \
    --proto_path=$PROTO_DIR \
    --plugin=protoc-gen-ts_proto=./node_modules/.bin/protoc-gen-ts  \
    --ts_proto_out=$OUT_DIR \ 
    ./lib/proto/*.proto
    echo "protoc command executed with input from $PROTO_DIR"