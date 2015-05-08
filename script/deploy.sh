#!/bin/bash
./script/build.sh
aws s3 cp dist s3://echochamberjs/dist --recursive --acl public-read
