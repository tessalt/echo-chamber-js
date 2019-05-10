#!/bin/bash
PATH=$(npm bin):$PATH
if [[ ! -e dist ]]; then
    mkdir dist
fi
browserify entry.js | uglify > dist/main.js
cp src/main.css dist/main.css
