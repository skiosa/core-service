#!/bin/bash

newman run ./Skiosa.postman_collection.json -e skiosa-$1-dev.postman_environment.json