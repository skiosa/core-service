#!/bin/bash

newman run /core-service/tests/integration/Skiosa.postman_collection.json -e /core-service/tests/integration/skiosa-local-dev.postman_environment.json