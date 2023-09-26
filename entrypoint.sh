#!/bin/bash

set -e


if [[ "$1" == "seed" ]]
then
    node dist/cli.js create:user || true
elif [[ "$1" == "roleback" ]]
then
    node dist/cli.js remove:user || true
fi

node dist/main.js

