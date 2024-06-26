#!/bin/bash

# Remove the Redis container
docker rm -f fabric-sample-redis

# Install dependencies
npm install

# Build the project
npm run build

# Set environment variables and start Redis
TEST_NETWORK_HOME=$PWD/../network npm run generateEnv
export REDIS_PASSWORD=$(uuidgen)
npm run start:redis

# Start the development server
npm run start:dev
