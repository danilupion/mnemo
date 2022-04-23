#!/bin/bash

yarn;

yarn common:build;
yarn client:build;
yarn server:build;

SERVER_PUBLIC="./packages/server/dist/public";
CLIENT_BUILD="../../client/build";

[ -e "$SERVER_PUBLIC" ] && rm "$SERVER_PUBLIC"

ln -s "$CLIENT_BUILD" "$SERVER_PUBLIC";