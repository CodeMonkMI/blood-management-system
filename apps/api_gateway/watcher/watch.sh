#!/bin/bash

echo "[INFO] Starting Kong config watcher..."
WATCHED_FILE="/watched/kong.yaml"
KONG_CONTAINER="${KONG_CONTAINER_NAME:-kong-gateway}"

if [ ! -f "$WATCHED_FILE" ]; then
  echo "[ERROR] Config file not found: $WATCHED_FILE"
  exit 1
fi

while true; do
  echo "[INFO] Watching $WATCHED_FILE for changes..."
  inotifywait -e modify,close_write,move,create,delete "$WATCHED_FILE" >/dev/null 2>&1
  echo "[INFO] Change detected in $WATCHED_FILE. Reloading Kong..."
  docker exec "$KONG_CONTAINER" kong reload
done
