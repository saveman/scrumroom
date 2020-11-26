#!/bin/bash

set -e

USAGE="$0 <HOST> <USER>"

HOST=$1
shift || (echo -e "ERROR: Host missing\nUsage: ${USAGE}" && exit 1)
USER=$1
shift || (echo -e "ERROR: User missing\nUsage: ${USAGE}" && exit 1)

APP_NAME=scrumroom

BUILD_DIR="$(pwd)/build"

SSH_COMMAND=ssh
SCP_COMMAND=scp
REMOTE_USERHOST=${USER}@${HOST}

REMOTE_ROOT_DIR="/home/${USER}/pm2apps"
REMOTE_APP_DIR="${REMOTE_ROOT_DIR}/${APP_NAME}"

set -x

echo "------------"
echo "Building the application: ${APP_NAME}"
echo "------------"
./build.sh

echo "------------"
echo "Stopping the application: ${APP_NAME}"
echo "------------"
set +e
if ${SSH_COMMAND} ${REMOTE_USERHOST} pm2 describe ${APP_NAME} ; then
	set -e
	${SSH_COMMAND} ${REMOTE_USERHOST} pm2 stop ${APP_NAME}
	${SSH_COMMAND} ${REMOTE_USERHOST} pm2 delete ${APP_NAME}
else
	set -e
	echo "Application ${APP_NAME} not present, skipping stop"
fi

echo "------------"
echo "Copying new contents for application: ${APP_NAME}"
echo "------------"
${SSH_COMMAND} ${REMOTE_USERHOST} rm -rf ${REMOTE_APP_DIR}
${SSH_COMMAND} ${REMOTE_USERHOST} mkdir -p ${REMOTE_APP_DIR}
${SCP_COMMAND} -r ${BUILD_DIR}/* ${REMOTE_USERHOST}:/${REMOTE_APP_DIR}

echo "------------"
echo "Preparing application: ${APP_NAME}"
echo "------------"
${SSH_COMMAND} ${REMOTE_USERHOST} "cd ${REMOTE_APP_DIR} && npm install --production"

echo "------------"
echo "Starting application: ${APP_NAME}"
echo "------------"
${SSH_COMMAND} ${REMOTE_USERHOST} "cd ${REMOTE_APP_DIR} && pm2 start -n ${APP_NAME} \"npm run-script production-start\""
sleep 3
${SSH_COMMAND} ${REMOTE_USERHOST} pm2 ls
${SSH_COMMAND} ${REMOTE_USERHOST} pm2 save
