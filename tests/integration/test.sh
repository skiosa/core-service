#!/bin/bash
path=$( cd "$(dirname "${BASH_SOURCE[0]}")" ; pwd -P )
cd "$path"

newman run ./Skiosa.postman_collection.json -e ./skiosa-local-dev.postman_environment.json