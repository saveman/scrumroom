#!/bin/bash

set -e

BUILD_DIR="$(pwd)/build"
BUILD_STATIC_DIR="${BUILD_DIR}/static"

set -x

# Remove the old target dir
rm -rf "${BUILD_DIR}"

# Create the build dir
mkdir -p "${BUILD_DIR}"
mkdir -p "${BUILD_STATIC_DIR}"

# Build frontend (static) content
# - enter build directory
pushd frontend
# - build
npm run-script build
# - copy to target
cp -v -r build/* "${BUILD_STATIC_DIR}"
# - exit build directory
popd

# Build backend content
# - enter build directory
pushd backend
# - copy app description
cp -v package.json package-lock.json "${BUILD_DIR}/"
# - copy app sources
cp -v -r src "${BUILD_DIR}/"
# - exit build directory
popd

# Show created content
ls -lR "${BUILD_DIR}"
