#!/bin/bash
# Convenient runner script using the local virtual environment
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
"$SCRIPT_DIR/.venv/bin/python" "$SCRIPT_DIR/run_db.py" "$@"
