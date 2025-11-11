// Deno edge function for Marbs AI Assistant
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    const { message, context, brandId } = await req.json();

    // TODO: Implement Marbs conversation logic with Claude AI
    // Context-aware responses based on section/page user is on

    const response = {
      message: 'Marbs stub response - will be implemented with full context awareness',
      context,
      actions: [],
      timestamp: new Date().toISOString(),
    };

    // Store conversation in database
    const { data: user } = await supabase.auth.getUser();
    if (user?.user) {
      await supabase.from('marbs_conversations').insert({
        brand_id: brandId,
        user_id: user.user.id,
        role: 'user',
        message,
        context,
      });

      await supabase.from('marbs_conversations').insert({
        brand_id: brandId,
        user_id: user.user.id,
        role: 'assistant',
        message: response.message,
        context,
      });
    }

    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
