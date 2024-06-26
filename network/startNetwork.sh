#!/bin/bash

./network.sh down
./network.sh up createChannel -c mychannel -ca
./network.sh deployCC -cci InitLedger -ccn certified -ccp ../chaincode/ -ccl typescript

#docker system prune --volumes -f