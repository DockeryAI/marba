/**
 * Deno Edge Function: API Billing Webhook
 *
 * Handles incoming billing events from external APIs and services.
 * Records detailed usage and cost information for:
 * - OpenRouter API calls
 * - Other third-party API services
 * - Custom billing events
 *
 * This webhook can be called by:
 * 1. Internal edge functions after making API calls
 * 2. External webhook integrations from API providers
 * 3. Scheduled jobs for batch processing
 *
 * @module api-billing-webhook
 */

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-webhook-signature',
};

interface BillingWebhookEvent {
  // Required fields
  brandId: string;
  provider: string; // 'openrouter', 'anthropic', 'openai', etc.
  apiName: string;
  featureName: string; // 'content_generation', 'synapse_enrichment', etc.
  costTotal: number;

  // Optional fields
  apiConfigId?: string;
  useCase?: string;
  requestType?: string; // 'completion', 'embedding', 'image_generation', etc.
  modelUsed?: string;
  tokensInput?: number;
  tokensOutput?: number;
  tokensTotal?: number;
  costInput?: number;
  costOutput?: number;
  costFixed?: number;
  currency?: string;
  userId?: string;
  sessionId?: string;
  requestMetadata?: Record<string, any>;
  responseTimeMs?: number;
  status?: string; // 'success', 'error', 'timeout', 'rate_limited'
  errorMessage?: string;
}

interface WebhookResponse {
  success: boolean;
  eventId?: string;
  error?: string;
  message?: string;
}

/**
 * Main request handler
 */
serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  const startTime = Date.now();

  try {
    // Only allow POST requests
    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ success: false, error: 'Method not allowed. Use POST.' }),
        { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Verify webhook signature (optional but recommended for production)
    const signature = req.headers.get('x-webhook-signature');
    if (signature) {
      const isValid = await verifyWebhookSignature(req, signature);
      if (!isValid) {
        return new Response(
          JSON.stringify({ success: false, error: 'Invalid webhook signature' }),
          { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    // Parse the webhook payload
    const event = await req.json() as BillingWebhookEvent;

    // Validate required fields
    const validationError = validateBillingEvent(event);
    if (validationError) {
      return new Response(
        JSON.stringify({ success: false, error: validationError }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Insert billing event into database
    const { data, error } = await supabase
      .from('api_billing_events')
      .insert({
        brand_id: event.brandId,
        api_config_id: event.apiConfigId,
        provider: event.provider,
        api_name: event.apiName,
        feature_name: event.featureName,
        use_case: event.useCase,
        request_type: event.requestType,
        model_used: event.modelUsed,
        tokens_input: event.tokensInput,
        tokens_output: event.tokensOutput,
        tokens_total: event.tokensTotal,
        request_count: 1,
        cost_input: event.costInput,
        cost_output: event.costOutput,
        cost_fixed: event.costFixed,
        cost_total: event.costTotal,
        currency: event.currency || 'USD',
        user_id: event.userId,
        session_id: event.sessionId,
        request_metadata: event.requestMetadata || {},
        response_time_ms: event.responseTimeMs,
        status: event.status || 'success',
        error_message: event.errorMessage,
      })
      .select('id')
      .single();

    if (error) {
      console.error('Error inserting billing event:', error);
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Failed to record billing event',
          details: error.message
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if brand has exceeded budget threshold
    await checkBudgetThreshold(supabase, event.brandId);

    const responseTime = Date.now() - startTime;

    const response: WebhookResponse = {
      success: true,
      eventId: data.id,
      message: 'Billing event recorded successfully',
    };

    return new Response(
      JSON.stringify(response),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
          'X-Response-Time': `${responseTime}ms`,
        },
      }
    );
  } catch (error) {
    console.error('Webhook processing error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Internal server error',
        message: error.message
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

/**
 * Validate billing event has required fields
 */
function validateBillingEvent(event: BillingWebhookEvent): string | null {
  if (!event.brandId) {
    return 'Missing required field: brandId';
  }
  if (!event.provider) {
    return 'Missing required field: provider';
  }
  if (!event.apiName) {
    return 'Missing required field: apiName';
  }
  if (!event.featureName) {
    return 'Missing required field: featureName';
  }
  if (event.costTotal === undefined || event.costTotal === null) {
    return 'Missing required field: costTotal';
  }
  if (typeof event.costTotal !== 'number' || event.costTotal < 0) {
    return 'Invalid costTotal: must be a non-negative number';
  }

  return null;
}

/**
 * Verify webhook signature (implement your signature verification logic)
 */
async function verifyWebhookSignature(req: Request, signature: string): Promise<boolean> {
  // This is a placeholder implementation
  // In production, you would verify the signature against a secret key

  const webhookSecret = Deno.env.get('WEBHOOK_SECRET');
  if (!webhookSecret) {
    // If no secret is configured, skip verification
    console.warn('WEBHOOK_SECRET not configured, skipping signature verification');
    return true;
  }

  try {
    // Get the raw body
    const body = await req.clone().text();

    // Create expected signature (example using HMAC-SHA256)
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(webhookSecret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );

    const signatureBuffer = await crypto.subtle.sign(
      'HMAC',
      key,
      encoder.encode(body)
    );

    const expectedSignature = Array.from(new Uint8Array(signatureBuffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');

    return signature === expectedSignature;
  } catch (e) {
    console.error('Error verifying webhook signature:', e);
    return false;
  }
}

/**
 * Check if brand has exceeded budget threshold and send alerts
 */
async function checkBudgetThreshold(supabase: any, brandId: string) {
  try {
    // Get brand's budget settings
    const { data: brand } = await supabase
      .from('brands')
      .select('name, settings')
      .eq('id', brandId)
      .single();

    if (!brand || !brand.settings?.monthlyBudget) {
      return; // No budget configured
    }

    const monthlyBudget = brand.settings.monthlyBudget;
    const alertThreshold = brand.settings.budgetAlertThreshold || 0.8; // 80% default

    // Calculate current month's spending
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const { data: events } = await supabase
      .from('api_billing_events')
      .select('cost_total')
      .eq('brand_id', brandId)
      .gte('created_at', startOfMonth.toISOString());

    if (!events || events.length === 0) {
      return;
    }

    const totalSpent = events.reduce((sum: number, event: any) => sum + (event.cost_total || 0), 0);
    const percentageUsed = totalSpent / monthlyBudget;

    // Send alert if threshold exceeded
    if (percentageUsed >= alertThreshold) {
      console.log(`Budget alert: Brand ${brandId} has used ${(percentageUsed * 100).toFixed(1)}% of monthly budget`);

      // Store alert in analytics_events
      await supabase
        .from('analytics_events')
        .insert({
          brand_id: brandId,
          event_type: 'budget_alert',
          event_data: {
            totalSpent,
            monthlyBudget,
            percentageUsed,
            alertThreshold,
          },
          source: 'api_billing_webhook',
        });
    }
  } catch (e) {
    console.error('Error checking budget threshold:', e);
  }
}
