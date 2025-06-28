#!/bin/bash
set -e

# Bootstrap script for local development

echo "[Bootstrap] Installing backend dependencies..."
cd backend
python -m pip install --upgrade pip
pip install -r requirements.txt
cd ..

echo "[Bootstrap] Installing frontend dependencies..."
cd frontend
if [ -f pnpm-lock.yaml ]; then
  npm install -g pnpm
  pnpm install
elif [ -f yarn.lock ]; then
  yarn install
else
  npm install
fi
cd ..

echo "[Bootstrap] Done!" 