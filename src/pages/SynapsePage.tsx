/**
 * Synapse Content Engine Page
 *
 * Generate breakthrough content using AI-powered insights
 * from real business intelligence data.
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2, Sparkles, AlertCircle, CheckCircle, Copy, Brain, Zap, Target, Globe, TrendingUp, Cloud, Newspaper } from 'lucide-react';
import { Link } from 'react-router-dom';
import { generateSynapses, type SynapseInput, type SynapseResult } from '@/services/synapse/SynapseGenerator';
import { SynapseContentGenerator } from '@/services/synapse/generation/SynapseContentGenerator';
import { HumorOptimizer } from '@/services/synapse/generation/HumorOptimizer';
import { EdginessSlider } from '@/components/synapse/EdginessSlider';
import { ProvenanceViewer } from '@/components/synapse/ProvenanceViewer';
import type { SynapseInsight } from '@/types/synapse/synapse.types';
import type { SynapseContent, EdginessLevel, HumorEnhancementResult } from '@/types/synapse/synapseContent.types';

// Import real intelligence services
import { WeatherAPI } from '@/services/intelligence/weather-api';
import { BuzzSumoAPI } from '@/services/intelligence/buzzsumo-api';
import { NewsAPI } from '@/services/intelligence/news-api';
import { SerperAPI } from '@/services/intelligence/serper-api';

type GenerationStep = 'idle' | 'collecting' | 'connecting' | 'generating' | 'complete' | 'error';

interface IntelligenceStatus {
  weather: 'pending' | 'loading' | 'success' | 'error';
  trending: 'pending' | 'loading' | 'success' | 'error';
  news: 'pending' | 'loading' | 'success' | 'error';
  search: 'pending' | 'loading' | 'success' | 'error';
}

export function SynapsePage() {
  // Form state
  const [businessName, setBusinessName] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [industry, setIndustry] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');

  // Generation state
  const [step, setStep] = useState<GenerationStep>('idle');
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<SynapseResult | null>(null);
  const [selectedInsight, setSelectedInsight] = useState<SynapseInsight | null>(null);
  const [generatedContent, setGeneratedContent] = useState<SynapseContent | null>(null);

  // Intelligence status tracking
  const [intelligenceStatus, setIntelligenceStatus] = useState<IntelligenceStatus>({
    weather: 'pending',
    trending: 'pending',
    news: 'pending',
    search: 'pending',
  });

  // Enhancement state
  const [edginess, setEdginess] = useState<EdginessLevel>(25);
  const [enhancedContent, setEnhancedContent] = useState<HumorEnhancementResult | null>(null);
  const [isEnhancing, setIsEnhancing] = useState(false);

  const handleGenerate = async () => {
    if (!businessName || !industry || !city || !state) {
      setError('Please fill in all required fields');
      return;
    }

    setStep('collecting');
    setError(null);
    setResult(null);
    setSelectedInsight(null);
    setGeneratedContent(null);
    setEnhancedContent(null);
    setIntelligenceStatus({
      weather: 'loading',
      trending: 'loading',
      news: 'loading',
      search: 'loading',
    });

    try {
      const location = `${city}, ${state}`;

      // Parallel API calls for real intelligence data
      const [weatherResult, trendingResult, newsResult, searchResult] = await Promise.allSettled([
        // Weather data
        (async () => {
          setIntelligenceStatus(s => ({ ...s, weather: 'loading' }));
          const data = await WeatherAPI.getCurrentWeather(location);
          const opportunities = await WeatherAPI.detectWeatherOpportunities(location, industry);
          setIntelligenceStatus(s => ({ ...s, weather: 'success' }));
          return { data, opportunities };
        })(),

        // Trending content from BuzzSumo
        (async () => {
          setIntelligenceStatus(s => ({ ...s, trending: 'loading' }));
          const data = await BuzzSumoAPI.getTrendingForIndustry(industry, [businessName]);
          const themes = await BuzzSumoAPI.analyzeTrendingThemes(industry);
          setIntelligenceStatus(s => ({ ...s, trending: 'success' }));
          return { data, themes };
        })(),

        // Industry news
        (async () => {
          setIntelligenceStatus(s => ({ ...s, news: 'loading' }));
          const industryNews = await NewsAPI.getIndustryNews(industry, [businessName, city]);
          const localNews = await NewsAPI.getLocalNews(location);
          setIntelligenceStatus(s => ({ ...s, news: 'success' }));
          return { industryNews, localNews };
        })(),

        // Search data (keywords, trends)
        (async () => {
          setIntelligenceStatus(s => ({ ...s, search: 'loading' }));
          const results = await SerperAPI.searchGoogle(`${industry} ${city}`);
          const relatedSearches = await SerperAPI.getAutocomplete(`${industry} tips`);
          setIntelligenceStatus(s => ({ ...s, search: 'success' }));
          return { results, relatedSearches };
        })(),
      ]);

      // Build intelligence object from real data
      const intelligence = buildIntelligenceFromResults(
        weatherResult,
        trendingResult,
        newsResult,
        searchResult,
        { industry, city, state }
      );

      const input: SynapseInput = {
        business: {
          name: businessName,
          industry,
          location: { city, state },
          website: websiteUrl || undefined,
        },
        intelligence,
      };

      setStep('connecting');

      // Generate synapses
      const synapseResult = await generateSynapses(input);

      setStep('complete');
      setResult(synapseResult);

      if (synapseResult.synapses.length > 0) {
        setSelectedInsight(synapseResult.synapses[0]);
      }
    } catch (err) {
      console.error('Synapse generation failed:', err);
      setError(err instanceof Error ? err.message : 'Generation failed');
      setStep('error');
    }
  };

  const handleGenerateContent = async (insight: SynapseInsight) => {
    setSelectedInsight(insight);
    setGeneratedContent(null);
    setEnhancedContent(null);

    try {
      const generator = new SynapseContentGenerator();

      // Convert SynapseInsight to BreakthroughInsight format
      const breakthroughInsight = {
        id: insight.id || crypto.randomUUID(),
        type: insight.type || 'counter_intuitive',
        insight: insight.insight,
        whyProfound: insight.whyProfound || '',
        contentAngle: insight.contentAngle || '',
        expectedReaction: insight.expectedReaction || '',
        evidence: insight.evidence || [],
        confidence: insight.confidence || 0.8,
        callToAction: insight.callToAction || '',
        psychologyPrinciple: insight.psychologyPrinciple || '',
        dataUsed: insight.dataUsed || [],
        deepProvenance: insight.deepProvenance
      };

      // Create minimal business profile
      const businessProfile = {
        name: businessName,
        industry,
        location: { city, state },
        website: websiteUrl || businessName
      };

      const result = await generator.generate(
        [breakthroughInsight as any],
        businessProfile as any,
        { maxContent: 1, formats: ['hook-post'] }
      );

      if (result.content && result.content.length > 0) {
        setGeneratedContent(result.content[0]);
      } else {
        setError('No content generated');
      }
    } catch (err) {
      console.error('Content generation failed:', err);
      setError(err instanceof Error ? err.message : 'Content generation failed');
    }
  };

  const handleEnhanceHumor = async () => {
    if (!generatedContent) return;

    setIsEnhancing(true);
    try {
      const optimizer = new HumorOptimizer();
      const enhanced = await optimizer.enhance(
        generatedContent.content.body || generatedContent.content.hook || '',
        edginess
      );
      setEnhancedContent(enhanced);
    } catch (err) {
      console.error('Enhancement failed:', err);
    } finally {
      setIsEnhancing(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const getStatusIcon = (status: 'pending' | 'loading' | 'success' | 'error') => {
    switch (status) {
      case 'loading': return <Loader2 className="w-4 h-4 animate-spin text-purple-400" />;
      case 'success': return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'error': return <AlertCircle className="w-4 h-4 text-red-400" />;
      default: return <div className="w-4 h-4 rounded-full bg-white/20" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="border-b border-white/10 bg-black/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Synapse Engine</h1>
              <p className="text-xs text-purple-300">AI-Powered Content Generation</p>
            </div>
          </div>
          <Link
            to="/"
            className="text-sm text-purple-300 hover:text-white transition-colors"
          >
            ← Back to Home
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Input Panel */}
          <div className="lg:col-span-1">
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-purple-400" />
                Business Details
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-purple-200 mb-1">Business Name *</label>
                  <input
                    type="text"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="Acme Corp"
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm text-purple-200 mb-1">
                    <Globe className="w-4 h-4 inline mr-1" />
                    Website URL (optional)
                  </label>
                  <input
                    type="url"
                    value={websiteUrl}
                    onChange={(e) => setWebsiteUrl(e.target.value)}
                    placeholder="https://example.com"
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm text-purple-200 mb-1">Industry *</label>
                  <input
                    type="text"
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    placeholder="Plumbing, HVAC, Legal, etc."
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm text-purple-200 mb-1">City *</label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="Austin"
                      className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-purple-200 mb-1">State *</label>
                    <input
                      type="text"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      placeholder="TX"
                      className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>

                <button
                  onClick={handleGenerate}
                  disabled={step === 'collecting' || step === 'connecting' || step === 'generating'}
                  className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 disabled:from-gray-600 disabled:to-gray-600 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  {step === 'idle' || step === 'complete' || step === 'error' ? (
                    <>
                      <Sparkles className="w-5 h-5" />
                      Generate Insights
                    </>
                  ) : (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      {step === 'collecting' && 'Gathering Intelligence...'}
                      {step === 'connecting' && 'Finding Connections...'}
                      {step === 'generating' && 'Generating...'}
                    </>
                  )}
                </button>

                {error && (
                  <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-200">{error}</p>
                  </div>
                )}
              </div>

              {/* Intelligence Status */}
              {step !== 'idle' && (
                <div className="mt-6 pt-6 border-t border-white/10">
                  <h3 className="text-sm font-medium text-purple-200 mb-3">Data Sources</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs">
                      {getStatusIcon(intelligenceStatus.weather)}
                      <Cloud className="w-4 h-4 text-blue-400" />
                      <span className="text-white/70">Weather & Opportunities</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      {getStatusIcon(intelligenceStatus.trending)}
                      <TrendingUp className="w-4 h-4 text-pink-400" />
                      <span className="text-white/70">Trending Content (BuzzSumo)</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      {getStatusIcon(intelligenceStatus.news)}
                      <Newspaper className="w-4 h-4 text-yellow-400" />
                      <span className="text-white/70">Industry & Local News</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      {getStatusIcon(intelligenceStatus.search)}
                      <Globe className="w-4 h-4 text-green-400" />
                      <span className="text-white/70">Search Intelligence</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Generation Stats */}
              {result && (
                <div className="mt-6 pt-6 border-t border-white/10">
                  <h3 className="text-sm font-medium text-purple-200 mb-3">Generation Stats</h3>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="bg-white/5 rounded-lg p-3">
                      <div className="text-purple-300">Time</div>
                      <div className="text-white font-mono">{result.metadata.generationTimeMs}ms</div>
                    </div>
                    <div className="bg-white/5 rounded-lg p-3">
                      <div className="text-purple-300">Cost</div>
                      <div className="text-white font-mono">${result.metadata.totalCost.toFixed(4)}</div>
                    </div>
                    <div className="bg-white/5 rounded-lg p-3">
                      <div className="text-purple-300">Connections</div>
                      <div className="text-white font-mono">{result.metadata.connectionHintsUsed}</div>
                    </div>
                    <div className="bg-white/5 rounded-lg p-3">
                      <div className="text-purple-300">Insights</div>
                      <div className="text-white font-mono">{result.synapses.length}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Results Panel */}
          <div className="lg:col-span-2 space-y-6">
            {/* Insights */}
            {result && result.synapses.length > 0 && (
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
                <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-yellow-400" />
                  Breakthrough Insights
                </h2>

                <div className="space-y-4">
                  {result.synapses.map((synapse, idx) => (
                    <motion.div
                      key={synapse.id || idx}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      onClick={() => handleGenerateContent(synapse)}
                      className={`p-4 rounded-xl border cursor-pointer transition-all ${
                        selectedInsight?.id === synapse.id
                          ? 'bg-purple-500/20 border-purple-500/50'
                          : 'bg-white/5 border-white/10 hover:bg-white/10'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="px-2 py-0.5 bg-purple-500/30 text-purple-200 rounded text-xs font-medium">
                              {synapse.type || 'insight'}
                            </span>
                            {synapse.confidence && (
                              <span className="px-2 py-0.5 bg-green-500/30 text-green-200 rounded text-xs">
                                {Math.round(synapse.confidence * 100)}% confidence
                              </span>
                            )}
                          </div>
                          <h3 className="text-white font-medium mb-1">{synapse.insight}</h3>
                          <p className="text-sm text-purple-200">{synapse.contentAngle}</p>
                        </div>
                        <CheckCircle className={`w-5 h-5 flex-shrink-0 ${
                          selectedInsight?.id === synapse.id ? 'text-purple-400' : 'text-white/20'
                        }`} />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Generated Content */}
            {generatedContent && (
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-pink-400" />
                    Generated Content
                  </h2>
                  <button
                    onClick={() => copyToClipboard(generatedContent.content.body || generatedContent.content.hook || '')}
                    className="p-2 text-purple-300 hover:text-white transition-colors"
                  >
                    <Copy className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  {generatedContent.content.headline && (
                    <div>
                      <div className="text-xs text-purple-400 mb-1">Headline</div>
                      <div className="text-white font-semibold">{generatedContent.content.headline}</div>
                    </div>
                  )}

                  {generatedContent.content.hook && (
                    <div>
                      <div className="text-xs text-purple-400 mb-1">Hook</div>
                      <div className="text-purple-100">{generatedContent.content.hook}</div>
                    </div>
                  )}

                  {generatedContent.content.body && (
                    <div>
                      <div className="text-xs text-purple-400 mb-1">Body</div>
                      <div className="text-purple-100 whitespace-pre-wrap">{generatedContent.content.body}</div>
                    </div>
                  )}

                  {generatedContent.content.cta && (
                    <div>
                      <div className="text-xs text-purple-400 mb-1">Call to Action</div>
                      <div className="text-pink-300 font-medium">{generatedContent.content.cta}</div>
                    </div>
                  )}

                  {/* Enhancement Section */}
                  <div className="pt-4 border-t border-white/10">
                    <h3 className="text-sm font-medium text-white mb-4">Enhance Content</h3>

                    <div className="bg-white/5 rounded-xl p-4">
                      <EdginessSlider
                        value={edginess}
                        onChange={setEdginess}
                      />

                      <button
                        onClick={handleEnhanceHumor}
                        disabled={isEnhancing}
                        className="mt-4 w-full py-2 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 disabled:from-gray-600 disabled:to-gray-600 text-white font-medium rounded-lg transition-all flex items-center justify-center gap-2"
                      >
                        {isEnhancing ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Enhancing...
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-4 h-4" />
                            Apply Humor Enhancement
                          </>
                        )}
                      </button>
                    </div>

                    {enhancedContent && (
                      <div className="mt-4 p-4 bg-green-500/10 border border-green-500/30 rounded-xl">
                        <div className="flex items-center justify-between mb-2">
                          <div className="text-xs text-green-400">Enhanced Version</div>
                          <button
                            onClick={() => copyToClipboard(enhancedContent.enhancedText)}
                            className="p-1 text-green-400 hover:text-green-300"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="text-green-100 whitespace-pre-wrap">{enhancedContent.enhancedText}</div>
                        {enhancedContent.humorTechniques && enhancedContent.humorTechniques.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-2">
                            {enhancedContent.humorTechniques.map((tech, i) => (
                              <span key={i} className="px-2 py-0.5 bg-green-500/20 text-green-300 rounded text-xs">
                                {tech}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Provenance */}
                  {generatedContent.provenance && (
                    <ProvenanceViewer provenance={generatedContent.provenance} />
                  )}
                </div>
              </div>
            )}

            {/* Empty State */}
            {!result && step === 'idle' && (
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-12 text-center">
                <Brain className="w-16 h-16 text-purple-400/50 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">Ready to Generate</h3>
                <p className="text-purple-200 max-w-md mx-auto">
                  Enter your business details and click "Generate Insights" to discover breakthrough content opportunities powered by real-time intelligence.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Build intelligence object from API results
 */
function buildIntelligenceFromResults(
  weatherResult: PromiseSettledResult<any>,
  trendingResult: PromiseSettledResult<any>,
  newsResult: PromiseSettledResult<any>,
  searchResult: PromiseSettledResult<any>,
  context: { industry: string; city: string; state: string }
) {
  const intelligence: any = {
    realTimeSignals: { weather: { triggers: [] } },
    localIntelligence: { localEvents: [] },
    reviewData: { painPoints: [] },
    culturalSnapshot: { trendingTopics: [] },
    searchData: { opportunityKeywords: [] },
  };

  // Weather data
  if (weatherResult.status === 'fulfilled' && weatherResult.value) {
    const { data, opportunities } = weatherResult.value;
    if (data) {
      intelligence.realTimeSignals.weather = {
        current: {
          temperature: data.temperature,
          condition: data.condition,
          description: data.description,
        },
        triggers: opportunities?.map((opp: any) => ({
          type: opp.type,
          description: opp.title + ': ' + opp.description,
          urgency: opp.urgency,
          actions: opp.suggested_actions,
        })) || [],
      };
    }
  }

  // Trending content
  if (trendingResult.status === 'fulfilled' && trendingResult.value) {
    const { data, themes } = trendingResult.value;
    if (data?.articles) {
      intelligence.culturalSnapshot.trendingTopics = data.articles.slice(0, 5).map((article: any) => ({
        term: article.title,
        volume: `${article.totalShares.toLocaleString()} shares`,
        source: article.domain,
        url: article.url,
      }));
    }
    if (themes) {
      intelligence.culturalSnapshot.topContentTypes = themes.contentTypes;
      intelligence.culturalSnapshot.avgEngagement = themes.avgShares;
    }
  }

  // News data
  if (newsResult.status === 'fulfilled' && newsResult.value) {
    const { industryNews, localNews } = newsResult.value;
    if (industryNews?.length > 0) {
      intelligence.localIntelligence.industryNews = industryNews.slice(0, 3).map((article: any) => ({
        title: article.title,
        source: article.source,
        relevance: article.relevanceScore,
      }));
    }
    if (localNews?.length > 0) {
      intelligence.localIntelligence.localEvents = localNews.slice(0, 3).map((article: any) => ({
        title: article.title,
        date: article.publishedAt,
        relevance: 'Local news',
      }));
    }
  }

  // Search data
  if (searchResult.status === 'fulfilled' && searchResult.value) {
    const { results, relatedSearches } = searchResult.value;
    if (results?.length > 0) {
      intelligence.searchData.topResults = results.slice(0, 5).map((r: any) => ({
        title: r.title,
        position: r.position,
        snippet: r.snippet,
      }));
    }
    if (relatedSearches?.length > 0) {
      intelligence.searchData.opportunityKeywords = relatedSearches.slice(0, 5).map((query: string) => ({
        keyword: query,
        position: 'Related',
      }));
    }
  }

  return intelligence;
}

export default SynapsePage;
