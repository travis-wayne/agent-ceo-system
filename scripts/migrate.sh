#!/bin/bash
set -e

# Run backend DB migrations (Flask/SQLAlchemy)
echo "[Migrate] Running backend migrations..."
cd backend
# Add your migration command here (e.g., flask db upgrade or alembic upgrade head)
# Example placeholder:
echo "[Migrate] (Placeholder) No migration tool configured."
cd ..

# Run frontend DB migrations (Prisma)
echo "[Migrate] Running frontend (Prisma) migrations..."
cd frontend
if [ -d prisma ]; then
  npx prisma migrate deploy
else
  echo "[Migrate] No prisma directory found."
fi
cd ..

echo "[Migrate] Done!" 