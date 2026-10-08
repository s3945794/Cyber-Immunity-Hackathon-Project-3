#!/bin/sh
set -eu
# Existing exports are imported; startup never clears data.
set -- emulators:start --only firestore --project demo-soc-incident-protection --config docker/firebase.container.json --export-on-exit=/demo-data/firestore
if [ -f /demo-data/firestore/firebase-export-metadata.json ]; then
  set -- "$@" --import=/demo-data/firestore
fi
exec firebase "$@"
