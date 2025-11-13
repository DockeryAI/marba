#!/bin/bash

# Open Supabase SQL Editor with migration instructions
PROJECT_ID="eyytfnrvzfidxoonnqyt"
URL="https://supabase.com/dashboard/project/${PROJECT_ID}/sql/new"

echo "🌐 Opening Supabase SQL Editor..."
echo ""
echo "📋 Instructions:"
echo "1. Copy the contents of: supabase/migrations/20251113000020_create_buyer_journey.sql"
echo "2. Paste into the SQL Editor that's about to open"
echo "3. Click 'Run' button"
echo "4. Come back here and run: node scripts/check-buyer-journey-table.mjs"
echo ""
echo "Opening browser in 3 seconds..."
sleep 3

# Open the browser
open "$URL"

echo ""
echo "✅ Browser opened. Please complete the steps above."
echo ""

# Copy the migration file content to clipboard if pbcopy is available
if command -v pbcopy &> /dev/null; then
    cat supabase/migrations/20251113000020_create_buyer_journey.sql | pbcopy
    echo "📋 Migration SQL copied to clipboard! Just paste it in the SQL Editor."
else
    echo "💡 Tip: Copy the SQL from supabase/migrations/20251113000020_create_buyer_journey.sql"
fi
