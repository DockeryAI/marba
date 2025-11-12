#!/bin/bash
# Setup MARBA Supabase Database
# Applies all migrations to the remote Supabase project

set -e

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 MARBA Database Setup${NC}"
echo -e "${BLUE}========================${NC}\n"

# Get Supabase project details from .env
source .env 2>/dev/null || true

if [ -z "$VITE_SUPABASE_URL" ]; then
  echo -e "${RED}❌ Error: VITE_SUPABASE_URL not found in .env${NC}"
  exit 1
fi

# Extract project ref from URL (e.g., eyytfnrvzfidxoonnqyt)
PROJECT_REF=$(echo $VITE_SUPABASE_URL | sed -E 's/https:\/\/([^.]+).supabase.co/\1/')
echo -e "${GREEN}✓ Project: $PROJECT_REF${NC}"

# Database connection string
DB_HOST="db.${PROJECT_REF}.supabase.co"
DB_USER="postgres"
DB_NAME="postgres"
DB_PORT="5432"

# Ask for database password
echo ""
read -sp "Enter your Supabase DB Password: " DB_PASSWORD
echo ""
echo ""

# Export for psql
export PGPASSWORD="$DB_PASSWORD"

echo -e "${BLUE}📁 Applying migrations...${NC}"
echo ""

# Count total migrations
MIGRATION_COUNT=$(ls -1 supabase/migrations/*.sql 2>/dev/null | wc -l)
echo -e "Found ${GREEN}$MIGRATION_COUNT${NC} migration files"
echo ""

# Apply each migration in order
APPLIED=0
SKIPPED=0
FAILED=0

for migration in supabase/migrations/*.sql; do
  if [ -f "$migration" ]; then
    FILENAME=$(basename "$migration")
    echo -ne "  Applying ${FILENAME}... "

    if psql "postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}?sslmode=require" \
         -f "$migration" -v ON_ERROR_STOP=1 > /dev/null 2>&1; then
      echo -e "${GREEN}✓${NC}"
      APPLIED=$((APPLIED + 1))
    else
      # Check if table already exists (not a real error)
      if psql "postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}?sslmode=require" \
           -f "$migration" 2>&1 | grep -q "already exists"; then
        echo -e "${BLUE}⊙ (already exists)${NC}"
        SKIPPED=$((SKIPPED + 1))
      else
        echo -e "${RED}✗ Failed${NC}"
        FAILED=$((FAILED + 1))
      fi
    fi
  fi
done

echo ""
echo -e "${BLUE}========================${NC}"
echo -e "${GREEN}✓ Applied: $APPLIED${NC}"
echo -e "${BLUE}⊙ Skipped: $SKIPPED${NC}"
if [ $FAILED -gt 0 ]; then
  echo -e "${RED}✗ Failed: $FAILED${NC}"
fi
echo ""

if [ $FAILED -eq 0 ]; then
  echo -e "${GREEN}✅ Database setup complete!${NC}"
  echo ""
  echo -e "${BLUE}Next steps:${NC}"
  echo "  1. Run the NAICS migration: npm run migrate:naics"
  echo "  2. Test the application: npm run dev"
else
  echo -e "${RED}❌ Some migrations failed. Check the errors above.${NC}"
  exit 1
fi
