#!/bin/bash

if [ "$1" == "-f" ]; then
  FORCE=true
fi

PORT=3001
PWD=`pwd`
APP=`basename $PWD`
GIT=`git pull`
echo $GIT
if [ "$FORCE" != "true" -a "$GIT" == "Already up to date." ]; then
  exit 0
fi

npm run build
echo "cp -R dist/* /var/www/html/$APP"
if [ -f "src/server.js" ]; then
  SERVER=`ps -ef | grep server.js | grep $PORT | awk {'print $2'}`
  if [ "$SERVER" != "" ]; then
    kill -9 $SERVER
  fi
  node src/server.js $PORT &
fi
