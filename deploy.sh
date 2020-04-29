#!/bin/bash

DIST_DIR=dist/dwight

echo ""
echo "Starting deploy."
if [ -d 'dist/timr' ]; then
  echo "Clearing latest build"
  rm -r $DIST_DIR
fi

echo ""
echo "Building project:"

if [ $1 = 'live' ]; then
  echo "Using environment: $1"
  ng build --configuration=live
elif [ $1 = 'prod' ]; then
  echo "Using environment: $1"
  ng build --configuration=production
fi

echo "Done"

echo ""
echo "Copying project"
scp -r $DIST_DIR/* pi@192.168.178.100:/home/pi/dwight/frontend

terminal-notifier -title 'Done!' -message 'Finished deploy of:' $1


