#!/bin/bash
PATH=$(npm bin):$PATH
watchify entry.js -o bundle.js -v
