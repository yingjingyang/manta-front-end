#!/bin/bash

# Patch assertion in polkadot.js that disallows some of our types for being too long
rm  ./node_modules/@polkadot/types/create/getTypeDef.mjs
cp ./setup/getTypeDef.mjs ./node_modules/@polkadot/types/create/getTypeDef.mjs
