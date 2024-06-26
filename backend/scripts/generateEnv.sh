#!/usr/bin/env bash

#
# SPDX-License-Identifier: Apache-2.0
#

${AS_LOCAL_HOST:=true}

: "${TEST_NETWORK_HOME:=../../network}"
: "${CONNECTION_PROFILE_FILE_ORG1:=${TEST_NETWORK_HOME}/organizations/peerOrganizations/org1.example.com/connection-org1.json}"
: "${CERTIFICATE_FILE_ORG1:=${TEST_NETWORK_HOME}/organizations/peerOrganizations/org1.example.com/users/User1@org1.example.com/msp/signcerts/cert.pem}"
: "${PRIVATE_KEY_FILE_ORG1:=${TEST_NETWORK_HOME}/organizations/peerOrganizations/org1.example.com/users/User1@org1.example.com/msp/keystore/*_sk}"

: "${CONNECTION_PROFILE_FILE_ORG2:=${TEST_NETWORK_HOME}/organizations/peerOrganizations/org2.example.com/connection-org2.json}"
: "${CERTIFICATE_FILE_ORG2:=${TEST_NETWORK_HOME}/organizations/peerOrganizations/org2.example.com/users/User1@org2.example.com/msp/signcerts/cert.pem}"
: "${PRIVATE_KEY_FILE_ORG2:=${TEST_NETWORK_HOME}/organizations/peerOrganizations/org2.example.com/users/User1@org2.example.com/msp/keystore/*_sk}"


cat << ENV_END > .env
# Generated .env file
# See src/config.ts for details of all the available configuration variables
#

LOG_LEVEL=info

PORT=5000

HLF_CERTIFICATE_ORG1="$(cat ${CERTIFICATE_FILE_ORG1} | sed -e 's/$/\\n/' | tr -d '\r\n')"

HLF_PRIVATE_KEY_ORG1="$(cat ${PRIVATE_KEY_FILE_ORG1} | sed -e 's/$/\\n/' | tr -d '\r\n')"

HLF_CERTIFICATE_ORG2="$(cat ${CERTIFICATE_FILE_ORG2} | sed -e 's/$/\\n/' | tr -d '\r\n')"

HLF_PRIVATE_KEY_ORG2="$(cat ${PRIVATE_KEY_FILE_ORG2} | sed -e 's/$/\\n/' | tr -d '\r\n')"

REDIS_PORT=6379

ORG1_APIKEY=$(uuidgen)

ORG2_APIKEY=$(uuidgen)

PRIVATE_KEY_ORG1=8f9fdabefa3edc0eaf1e014616b7bcc2b35ebf55115e1b1f0789f3e88ca5e870
PUBLIC_KEY_ORG1=043d1234c3fd53a812e9c9535be7d5e1557872f2fbbe0a9de28d927069f5a28bd6732bce1959e934ceeba2a204b67c5588595c585d594481e534e62cede021bb46

PRIVATE_KEY_ORG2=b05b3fec8ba7eca65afbcebd0ab2e98fed6d7690eedf834e6e1c1a97c509a55a
PUBLIC_KEY_ORG2=04e95721df3075bd3af61e168dd6401d23e72d24530f8857a20c63fe9eb2b0bc435673fbcca9f002dd297dcf98a98c2a3ba5be8d316755dfeb125bba09d579bf13

HLF_CHAINCODE_NAME=certified

ENV_END
 
if [ "${AS_LOCAL_HOST}" = "true" ]; then

cat << LOCAL_HOST_END >> .env
AS_LOCAL_HOST=true

HLF_CONNECTION_PROFILE_ORG1=$(cat ${CONNECTION_PROFILE_FILE_ORG1} | jq -c .)

HLF_CONNECTION_PROFILE_ORG2=$(cat ${CONNECTION_PROFILE_FILE_ORG2} | jq -c .)

REDIS_HOST=localhost

LOCAL_HOST_END

elif [ "${AS_LOCAL_HOST}" = "false" ]; then

cat << WITH_HOSTNAME_END >> .env
AS_LOCAL_HOST=false

HLF_CONNECTION_PROFILE_ORG1=$(cat ${CONNECTION_PROFILE_FILE_ORG1} | jq -c '.peers["peer0.org1.example.com"].url = "grpcs://peer0.org1.example.com:7051" | .certificateAuthorities["ca.org1.example.com"].url = "https://ca.org1.example.com:7054"')

HLF_CONNECTION_PROFILE_ORG2=$(cat ${CONNECTION_PROFILE_FILE_ORG2} | jq -c '.peers["peer0.org2.example.com"].url = "grpcs://peer0.org2.example.com:9051" | .certificateAuthorities["ca.org2.example.com"].url = "https://ca.org2.example.com:8054"')

REDIS_HOST=redis

WITH_HOSTNAME_END

fi
