#!/bin/bash

set -e

# echo "▶️ Testing fallback route..."
# curl -s http://localhost:9090/ping || echo "Fallback route working"


# NB: The script reports a clear success when v1 is down
# and a failure when v1 is available.
response="$(curl -fsS http://localhost:9090/ping)"

if [ "$response" != "pong v2" ]; then
  echo "Fallback failed: expected 'pong v2', got '$response'" >&2
  exit 1
fi

echo "Fallback route working: $response"