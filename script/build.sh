#!/bin/bash
PATH=$(npm bin):$PATH
if [[ ! -e dist ]]; then
    mkdir dist
fi
browserify entry.js > dist/main.js
uglify -s dist/main.js -o dist/main.js
minify src/main.css > dist/main.css