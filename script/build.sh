#!/bin/bash
browserify entry.js | uglifyjs > dist/main.js
cp src/main.css dist/main.css
