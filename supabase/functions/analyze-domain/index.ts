import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface DomainAnalysisRequest {
  domain: string
  naicsCode: string
  userId?: string
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { domain, naicsCode, userId }: DomainAnalysisRequest = await req.json()

    if (!domain || !naicsCode) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: domain, naicsCode' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Get industry profile data
    const { data: industryProfile, error: industryError } = await supabase
      .from('industry_profiles')
      .select('*')
      .eq('naics_code', naicsCode)
      .single()

    if (industryError || !industryProfile) {
      return new Response(
        JSON.stringify({ error: 'Industry profile not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Create or get brand
    const { data: brand, error: brandError } = await supabase
      .from('brands')
      .upsert({
        name: domain,
        domain: domain,
        industry: industryProfile.title,
        naics_code: naicsCode,
        user_id: userId || null
      }, {
        onConflict: 'domain'
      })
      .select()
      .single()

    if (brandError) {
      throw new Error(`Brand creation failed: ${brandError.message}`)
    }

    // Generate MIRROR sections using industry data
    const mirrorSections = generateMirrorSections(domain, industryProfile)

    // Store MIRROR sections
    for (const section of mirrorSections) {
      const { error: sectionError } = await supabase
        .from('mirror_sections')
        .upsert({
          brand_id: brand.id,
          section: section.section,
          content: section.content,
          insights: section.insights,
          action_items: section.action_items
        }, {
          onConflict: 'brand_id,section'
        })

      if (sectionError) {
        console.error(`Error storing ${section.section}:`, sectionError)
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        brand: brand,
        sections: mirrorSections
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

function generateMirrorSections(domain: string, industryProfile: any) {
  const fullProfile = industryProfile.full_profile_data || {}

  return [
    {
      section: 'measure',
      content: generateMeasureContent(domain, industryProfile, fullProfile),
      insights: generateMeasureInsights(industryProfile, fullProfile),
      action_items: generateMeasureActions(industryProfile)
    },
    {
      section: 'intend',
      content: generateIntendContent(domain, industryProfile, fullProfile),
      insights: generateIntendInsights(industryProfile, fullProfile),
      action_items: generateIntendActions(industryProfile, fullProfile)
    },
    {
      section: 'reimagine',
      content: generateReimagineContent(domain, industryProfile, fullProfile),
      insights: generateReimagineInsights(industryProfile, fullProfile),
      action_items: generateReimagineActions(industryProfile, fullProfile)
    },
    {
      section: 'reach',
      content: generateReachContent(domain, industryProfile, fullProfile),
      insights: generateReachInsights(industryProfile, fullProfile),
      action_items: generateReachActions(industryProfile, fullProfile)
    },
    {
      section: 'optimize',
      content: generateOptimizeContent(domain, industryProfile, fullProfile),
      insights: generateOptimizeInsights(industryProfile, fullProfile),
      action_items: generateOptimizeActions(industryProfile, fullProfile)
    },
    {
      section: 'reflect',
      content: generateReflectContent(domain, industryProfile, fullProfile),
      insights: generateReflectInsights(industryProfile, fullProfile),
      action_items: generateReflectActions(industryProfile)
    }
  ]
}

// MEASURE Section
function generateMeasureContent(domain: string, profile: any, fullProfile: any): string {
  const metrics = fullProfile.success_metrics || []
  const triggers = fullProfile.customer_triggers || []

  return `# Current Market Position for ${domain}

## Industry: ${profile.title}

### Key Performance Indicators
${metrics.slice(0, 5).map((m: any, i: number) =>
  `${i + 1}. **${m.metric || m}** - ${m.timeframe || 'Ongoing tracking'}`
).join('\n')}

### Market Triggers to Monitor
${triggers.slice(0, 5).map((t: any, i: number) =>
  `${i + 1}. ${t.trigger} (Urgency: ${t.urgency}/10, Frequency: ${t.frequency})`
).join('\n')}

### Competitive Landscape
${profile.competitive_landscape || 'Analyzing competitive positioning...'}

### Current Customer Segments
${(profile.customer_segments || []).slice(0, 5).map((seg: string, i: number) =>
  `${i + 1}. ${seg}`
).join('\n') || 'Segment analysis in progress...'}
`
}

function generateMeasureInsights(profile: any, fullProfile: any): any[] {
  const insights = []

  if (fullProfile.seasonal_patterns) {
    const currentMonth = new Date().toLocaleString('default', { month: 'long' })
    const seasonalInfo = fullProfile.seasonal_patterns.find((p: any) => p.month === currentMonth)
    if (seasonalInfo) {
      insights.push({
        type: 'seasonal',
        title: `Current Month: ${currentMonth}`,
        description: `${seasonalInfo.reason}. Variation: ${seasonalInfo.variation}%`,
        impact: seasonalInfo.variation
      })
    }
  }

  if (profile.key_trends) {
    insights.push({
      type: 'trends',
      title: 'Key Industry Trends',
      description: profile.key_trends.slice(0, 3).join(', '),
      impact: 'high'
    })
  }

  return insights
}

function generateMeasureActions(profile: any): string[] {
  return [
    'Set up tracking for key performance indicators',
    'Establish baseline metrics for all major KPIs',
    'Install analytics tools (Google Analytics, heatmaps)',
    'Create monthly reporting dashboard',
    'Conduct competitor analysis'
  ]
}

// INTEND Section
function generateIntendContent(domain: string, profile: any, fullProfile: any): string {
  const transformations = fullProfile.transformations || []

  return `# Strategic Objectives for ${domain}

## Primary Transformation Goals

${transformations.slice(0, 5).map((t: any, i: number) =>
  `### Goal ${i + 1}: ${t.from || t.transformation?.split('→')[0] || 'Initial State'} → ${t.to || t.transformation?.split('→')[1] || 'Target State'}
**Emotional Value:** ${t.emotional_value}
**Premium Justified:** ${t.worth_premium ? 'Yes' : 'No'}
`
).join('\n')}

## Success Metrics
${(fullProfile.success_metrics || []).slice(0, 5).map((m: any, i: number) =>
  `${i + 1}. ${m.metric || m} - Target timeframe: ${m.timeframe || 'TBD'}`
).join('\n')}
`
}

function generateIntendInsights(profile: any, fullProfile: any): any[] {
  const insights = []

  if (fullProfile.urgency_drivers) {
    insights.push({
      type: 'urgency',
      title: 'Urgency Drivers',
      description: fullProfile.urgency_drivers.slice(0, 3).join('; '),
      impact: 'high'
    })
  }

  return insights
}

function generateIntendActions(profile: any, fullProfile: any): string[] {
  return [
    'Define 3-month, 6-month, and 12-month objectives',
    'Set specific, measurable targets for each goal',
    'Identify key transformation milestones',
    'Align team around strategic priorities',
    'Create accountability framework'
  ]
}

// REIMAGINE Section
function generateReimagineContent(domain: string, profile: any, fullProfile: any): string {
  const valueProps = fullProfile.value_propositions || []
  const competitive = fullProfile.competitive_advantages || profile.competitive_landscape

  return `# Strategic Positioning for ${domain}

## Core Value Propositions

${valueProps.slice(0, 5).map((vp: any, i: number) =>
  `### ${i + 1}. ${vp.prop || vp}
${vp.differentiator ? `**Differentiator:** ${vp.differentiator}` : ''}
${vp.rank ? `**Priority Rank:** ${vp.rank}/10` : ''}
`
).join('\n')}

## Competitive Advantages
${Array.isArray(competitive)
  ? competitive.slice(0, 5).map((ca: string, i: number) => `${i + 1}. ${ca}`).join('\n')
  : competitive || 'Building unique positioning...'}

## Messaging Framework
${fullProfile.messaging_frameworks ?
  `**Premium:** ${fullProfile.messaging_frameworks.premium_messaging}

**Value-Conscious:** ${fullProfile.messaging_frameworks.budget_conscious}

**Enterprise:** ${fullProfile.messaging_frameworks.enterprise}`
  : 'Developing messaging strategy...'}
`
}

function generateReimagineInsights(profile: any, fullProfile: any): any[] {
  const insights = []

  if (fullProfile.customer_language_dictionary) {
    insights.push({
      type: 'language',
      title: 'Customer Language',
      description: `Use these problem words: ${fullProfile.customer_language_dictionary.problem_words?.slice(0, 5).join(', ')}`,
      impact: 'medium'
    })
  }

  return insights
}

function generateReimagineActions(profile: any, fullProfile: any): string[] {
  return [
    'Refine unique value propositions',
    'Develop differentiation strategy',
    'Create positioning statement',
    'Define brand personality and voice',
    'Map competitive positioning matrix'
  ]
}

// REACH Section
function generateReachContent(domain: string, profile: any, fullProfile: any): string {
  const headlines = fullProfile.headline_templates || []
  const ctas = fullProfile.cta_templates || []
  const socialPosts = fullProfile.social_post_templates || []

  return `# Marketing Tactics for ${domain}

## High-Converting Headlines
${headlines.slice(0, 5).map((h: any, i: number) =>
  `${i + 1}. "${h.template}" (Expected CTR: ${h.expected_ctr}%)
   *Use case: ${h.use_case}*`
).join('\n\n')}

## Call-to-Action Templates
${ctas.slice(0, 5).map((cta: any, i: number) =>
  `${i + 1}. "${cta.template}" (Conversion: ${cta.conversion_rate}%)
   *Best for: ${cta.placement}*`
).join('\n\n')}

## Social Media Strategy
${socialPosts.slice(0, 3).map((post: any) =>
  `**${post.platform}:** ${post.template}
   *Engagement rate: ${post.engagement_rate}%*`
).join('\n\n')}

## Power Words to Use
${(fullProfile.power_words || []).slice(0, 20).join(', ')}
`
}

function generateReachInsights(profile: any, fullProfile: any): any[] {
  const insights = []

  if (fullProfile.objection_handlers) {
    insights.push({
      type: 'objections',
      title: 'Common Objections',
      description: fullProfile.objection_handlers.slice(0, 3).map((o: any) => o.objection).join('; '),
      impact: 'high'
    })
  }

  return insights
}

function generateReachActions(profile: any, fullProfile: any): string[] {
  return [
    'Launch test campaigns using headline templates',
    'Implement A/B testing for CTAs',
    'Create social media content calendar',
    'Set up retargeting campaigns',
    'Build email nurture sequences'
  ]
}

// OPTIMIZE Section
function generateOptimizeContent(domain: string, profile: any, fullProfile: any): string {
  const pricing = fullProfile.pricing_psychology || {}
  const tiers = fullProfile.tiered_service_models || []

  return `# Optimization Strategy for ${domain}

## Pricing Psychology
${pricing.sweet_spots ?
  `**Sweet Spots:** ${pricing.sweet_spots.join(', ')}

**Anchoring Strategy:** ${pricing.anchoring}

**Sensitivity Point:** ${pricing.sensitivity}

**Decoy Pricing:** ${pricing.decoy_pricing}`
  : 'Developing pricing strategy...'}

## Service Tiers
${tiers.map((tier: any, i: number) =>
  `### ${tier.tier}
- **Price Range:** ${tier.price_range}
- **Target Customer:** ${tier.target_customer}
- **Margin:** ${tier.margin}%`
).join('\n\n')}

## Conversion Optimization
- Test headline variations
- Optimize landing page elements
- Improve trust signals
- Streamline checkout process
- Enhance mobile experience
`
}

function generateOptimizeInsights(profile: any, fullProfile: any): any[] {
  const insights = []

  if (fullProfile.trust_signals) {
    insights.push({
      type: 'trust',
      title: 'Key Trust Signals',
      description: fullProfile.trust_signals.slice(0, 3).map((t: any) => t.signal).join(', '),
      impact: 'high'
    })
  }

  return insights
}

function generateOptimizeActions(profile: any, fullProfile: any): string[] {
  return [
    'Implement pricing tiers',
    'Set up conversion tracking',
    'Create A/B test roadmap',
    'Optimize checkout flow',
    'Enhance mobile experience'
  ]
}

// REFLECT Section
function generateReflectContent(domain: string, profile: any, fullProfile: any): string {
  const retention = fullProfile.retention_hooks || []
  const referral = fullProfile.referral_strategies || []

  return `# Continuous Improvement for ${domain}

## Retention Strategies
${retention.slice(0, 5).map((hook: any, i: number) =>
  `${i + 1}. ${hook}`
).join('\n')}

## Referral Programs
${referral.slice(0, 3).map((ref: any, i: number) =>
  `### ${ref.strategy || ref}
${ref.timing ? `**Best Timing:** ${ref.timing}` : ''}
${ref.incentive ? `**Incentive:** ${ref.incentive}` : ''}
${ref.conversion_rate ? `**Conversion:** ${ref.conversion_rate}%` : ''}`
).join('\n\n')}

## Measurement & Reporting
- Weekly KPI reviews
- Monthly performance analysis
- Quarterly strategic planning
- Annual goal setting
`
}

function generateReflectInsights(profile: any, fullProfile: any): any[] {
  const insights = []

  if (fullProfile.testimonial_capture_timing) {
    insights.push({
      type: 'testimonials',
      title: 'Testimonial Capture',
      description: `Best time: Day ${fullProfile.testimonial_capture_timing.optimal_day}, after ${fullProfile.testimonial_capture_timing.trigger_event}`,
      impact: 'medium'
    })
  }

  return insights
}

function generateReflectActions(profile: any): string[] {
  return [
    'Establish weekly reporting cadence',
    'Create feedback collection system',
    'Schedule monthly strategy reviews',
    'Build testimonial collection process',
    'Implement continuous improvement framework'
  ]
}
