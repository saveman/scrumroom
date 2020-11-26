#!/bin/bash

set -e
set -x

# Install npm packages (if needed)
npm install
pushd frontend
npm install
popd
pushd backend
npm install
popd
