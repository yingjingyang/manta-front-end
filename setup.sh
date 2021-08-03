#!/bin/bash

# Patch assertion in polkadot.js that disallows some of our types for being too long
rm  ./node_modules/@polkadot/types/create/getTypeDef.mjs
cp ./setup/getTypeDef.mjs ./node_modules/@polkadot/types/create/getTypeDef.mjs

RECLAIM_PK=./public/reclaim_pk.bin
TRANSFER_PK=./public/reclaim_pk.bin

if [[ ! -f "$RECLAIM_PK" || ! -f "$TRANSFER_PK" ]]; then
    echo "Generating proving keys; this may take a few minutes"
fi