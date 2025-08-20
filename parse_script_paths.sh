#!/bin/bash
OUTPUT=""

if [ $SHOULD_RUN_DEFAULT == "true" ]; then
  OUTPUT="$DEFAULT_PATH $SCRIPTS"
else
  OUTPUT="$SCRIPTS"
fi

echo "path=$my_value" >> "$GITHUB_OUTPUT"
