#!/usr/bin/env bash

docker build --no-cache -f Dockerfile.test -t api-tests .

docker run api-tests