#!/bin/bash

# RUN ALL MICRO-BATCHES
# Orchestrates 28 micro-batches of 5 profiles each = 140 total profiles
# Features: Progress tracking, auto-retry, incremental saving

set +e  # Don't exit on error - we want to retry

API_KEY="${VITE_OPENROUTER_API_KEY}"
TOTAL_INDUSTRIES=141
BATCH_SIZE=2
TOTAL_BATCHES=$(((TOTAL_INDUSTRIES + BATCH_SIZE - 1) / BATCH_SIZE))
MAX_RETRIES_PER_BATCH=3
OUTPUT_DIR="opus-generated/micro-batches"

# Count already completed batches
EXISTING_BATCHES=$(ls -1 $OUTPUT_DIR/batch-*.json 2>/dev/null | wc -l | tr -d ' ')
EXISTING_PROFILES=$((EXISTING_BATCHES * BATCH_SIZE))

echo "🚀 OPUS MICRO-BATCH ORCHESTRATION"
echo "════════════════════════════════════════════════════════"
echo "Total Industries: ${TOTAL_INDUSTRIES}"
echo "Batch Size: ${BATCH_SIZE} profiles"
echo "Total Batches: ${TOTAL_BATCHES}"
echo "Max Retries per Batch: ${MAX_RETRIES_PER_BATCH}"
echo ""
echo "📊 RESUME STATUS:"
echo "   Already Complete: ${EXISTING_BATCHES} batches (${EXISTING_PROFILES} profiles)"
echo "   Remaining: $((TOTAL_BATCHES - EXISTING_BATCHES)) batches"
echo ""
echo "Estimated Time: 20-30 minutes"
echo "Estimated Cost: ~$42-47"
echo ""

COMPLETED_BATCHES=$EXISTING_BATCHES
FAILED_BATCHES=0
START_TIME=$(date +%s)

# Function to run a single micro-batch with retries
run_batch() {
  local start_idx=$1
  local end_idx=$2
  local batch_num=$3
  local retry_count=0
  local success=false

  while [ $retry_count -lt $MAX_RETRIES_PER_BATCH ] && [ "$success" = false ]; do
    if [ $retry_count -gt 0 ]; then
      echo "   🔄 Retry ${retry_count}/${MAX_RETRIES_PER_BATCH}..."
    fi

    export VITE_OPENROUTER_API_KEY="$API_KEY"
    tsx opus-micro-batch-generator.ts $start_idx $end_idx

    if [ $? -eq 0 ]; then
      # Verify file exists
      if [ -f "opus-generated/micro-batches/batch-${start_idx}-${end_idx}.json" ]; then
        success=true
        COMPLETED_BATCHES=$((COMPLETED_BATCHES + 1))

        # Calculate progress
        local completed_profiles=$((end_idx))
        local progress=$((completed_profiles * 100 / TOTAL_INDUSTRIES))
        local elapsed=$(($(date +%s) - START_TIME))
        local mins=$((elapsed / 60))
        local secs=$((elapsed % 60))

        echo "   ✅ Batch ${batch_num}/${TOTAL_BATCHES} complete"
        echo "   📊 Progress: ${completed_profiles}/${TOTAL_INDUSTRIES} profiles (${progress}%)"
        echo "   ⏱️  Elapsed: ${mins}m ${secs}s"
        echo ""
        return 0
      else
        echo "   ⚠️  File not created, retrying..."
        retry_count=$((retry_count + 1))
        sleep 3
      fi
    else
      echo "   ❌ Batch failed"
      retry_count=$((retry_count + 1))
      if [ $retry_count -lt $MAX_RETRIES_PER_BATCH ]; then
        sleep 5
      fi
    fi
  done

  # Failed after all retries
  FAILED_BATCHES=$((FAILED_BATCHES + 1))
  echo "   ❌ Batch ${batch_num} FAILED after ${MAX_RETRIES_PER_BATCH} attempts"
  echo "   ⚠️  Continuing with next batch..."
  echo ""
  return 1
}

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "STARTING MICRO-BATCH GENERATION"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Run all micro-batches (handle final partial batch)
current_idx=0
batch_num=1
while [ $current_idx -lt $TOTAL_INDUSTRIES ]; do
  start_idx=$current_idx
  end_idx=$((current_idx + BATCH_SIZE))
  if [ $end_idx -gt $TOTAL_INDUSTRIES ]; then
    end_idx=$TOTAL_INDUSTRIES
  fi

  # Check if this batch is already complete
  if [ -f "$OUTPUT_DIR/batch-${start_idx}-${end_idx}.json" ]; then
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "✅ Batch ${batch_num}/${TOTAL_BATCHES}: Industries ${start_idx}-${end_idx} [ALREADY COMPLETE]"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    batch_num=$((batch_num + 1))
    current_idx=$end_idx
    continue
  fi

  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "📦 Batch ${batch_num}/${TOTAL_BATCHES}: Industries ${start_idx}-${end_idx}"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

  run_batch $start_idx $end_idx $batch_num

  batch_num=$((batch_num + 1))
  current_idx=$end_idx
done

TOTAL_TIME=$(($(date +%s) - START_TIME))
TOTAL_MINS=$((TOTAL_TIME / 60))
TOTAL_SECS=$((TOTAL_TIME % 60))

echo ""
echo "════════════════════════════════════════════════════════"
echo "✅ MICRO-BATCH GENERATION COMPLETE"
echo "════════════════════════════════════════════════════════"
echo ""
echo "Completed Batches: ${COMPLETED_BATCHES}/${TOTAL_BATCHES}"
echo "Failed Batches: ${FAILED_BATCHES}"
echo "Total Profiles: $((COMPLETED_BATCHES * BATCH_SIZE))"
echo "Total Time: ${TOTAL_MINS}m ${TOTAL_SECS}s"
echo ""

if [ $FAILED_BATCHES -gt 0 ]; then
  echo "⚠️  WARNING: ${FAILED_BATCHES} batches failed"
  echo "   You may want to manually retry failed batches"
  echo ""
  exit 1
fi

# All batches complete - now populate Supabase automatically
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "💾 AUTO-POPULATING SUPABASE DATABASE"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Loading all ${COMPLETED_BATCHES} batches into industry_profiles table..."
echo ""

tsx populate-supabase.ts

if [ $? -eq 0 ]; then
  echo ""
  echo "════════════════════════════════════════════════════════"
  echo "🎉 COMPLETE PIPELINE FINISHED!"
  echo "════════════════════════════════════════════════════════"
  echo ""
  echo "✓ All 71 micro-batches generated (141 profiles)"
  echo "✓ Database populated automatically"
  echo "✓ Data ready for frontend queries"
  echo ""
  echo "Total Time: ${TOTAL_MINS}m ${TOTAL_SECS}s"
  echo ""
  exit 0
else
  echo ""
  echo "❌ Database population failed"
  echo "   You can manually run: ./populate-db.sh"
  echo ""
  exit 1
fi
