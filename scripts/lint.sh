#!/bin/bash
set -e

# Lint and format backend
cd backend
if [ -f requirements.txt ]; then
  pip install flake8 black isort
  echo "[Lint] Running flake8..."
  flake8 src/
  echo "[Lint] Running black..."
  black src/
  echo "[Lint] Running isort..."
  isort src/
fi
cd ..

# Lint and format frontend
cd frontend
if [ -f package.json ]; then
  if [ -f pnpm-lock.yaml ]; then
    npm install -g pnpm
    pnpm install
    pnpm run lint
    pnpm run format || true
  elif [ -f yarn.lock ]; then
    yarn install
    yarn lint
    yarn format || true
  else
    npm install
    npm run lint
    npm run format || true
  fi
fi
cd ..

echo "[Lint] Done!" 