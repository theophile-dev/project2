#!/bin/sh

bun ".\bun.build.js"

# Define variables
REMOTE_USER="debian"
REMOTE_HOST="51.75.141.135"
REMOTE_PATH="/home/debian/project2"
LOCAL_PATH="./serverbuild"

# Copy the dist directory
scp -r $LOCAL_PATH $REMOTE_USER@$REMOTE_HOST:$REMOTE_PATH

# Notify the user
echo "Files have been copied to $REMOTE_USER@$REMOTE_HOST:$REMOTE_PATH"