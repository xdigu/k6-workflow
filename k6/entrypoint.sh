#!/bin/sh

rm -rf /$REPORTS_PATH/**.json
rm -rf /$REPORTS_PATH/**.html

k6 run ./default.k6.js
