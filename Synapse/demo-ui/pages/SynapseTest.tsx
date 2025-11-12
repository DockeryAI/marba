/**
 * BREAKTHROUGH CONTENT ENGINE TEST PAGE
 *
 * Isolated testing environment for the V6 Synapse Content Discovery system.
 * This page allows testing the synapse engine separately from the main Mirror dashboard.
 *
 * Components:
 * - Connection Discovery Engine (Layer 1)
 * - Multi-Model Orchestra (Layer 2)
 * - Holy Shit Scoring (Layer 3)
 *
 * Created: 2025-11-10
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2, Sparkles, AlertCircle, CheckCircle, Copy } from 'lucide-react';
import { Link } from 'react-router-dom';
import { generateSynapses, type SynapseResult } from '@/services/synapse/SynapseGenerator';
import { dataAdapter } from '@/services/contentIntelligence/dataAdapter';
import type { BusinessIntelligence } from '@/types/contentIntelligence';
import type { SynapseInsight } from '@/types/synapse.types';
import type { SynapseContent } from '@/types/synapseContent.types';
import { IndustrySelector } from '@/components/onboarding-v5/IndustrySelector';
import { SynapseContentGenerator } from '@/services/synapse/generation/SynapseContentGenerator';
import { ProvenanceViewer } from '@/components/synapse/ProvenanceViewer';
import { EdginessSlider } from '@/components/synapse/EdginessSlider';
import { HumorOptimizer } from '@/services/synapse/generation/HumorOptimizer';
import { ContentEnhancements } from '@/components/synapse/ContentEnhancements';
import type { HumorEnhancementResult, EdginessLevel } from '@/types/synapseContent.types';

export function SynapseTest() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<SynapseInsight[] | null>(null);
  const [generatedContent, setGeneratedContent] = useState<SynapseContent[] | null>(null);
  const [testUrl, setTestUrl] = useState('https://www.example.com');
  const [testName, setTestName] = useState('');
  const [testCity, setTestCity] = useState('');
  const [testState, setTestState] = useState('');
  const [testIndustry, setTestIndustry] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState<any>(null);

  // Humor enhancement state
  const [humorEnhancements, setHumorEnhancements] = useState<Record<string, HumorEnhancementResult>>({});
  const [edginessLevels, setEdginessLevels] = useState<Record<string, EdginessLevel>>({});
  const [enhancingContent, setEnhancingContent] = useState<string | null>(null);

  const runSynapseTest = async () => {
    setLoading(true);
    setError(null);
    setResults(null);
    setGeneratedContent(null);

    try {
      console.log('[SynapseTest] Starting synapse discovery test...');
      console.log('[SynapseTest] URL:', testUrl);
      console.log('[SynapseTest] Industry:', testIndustry);
      console.log('[SynapseTest] Selected Industry Object:', selectedIndustry);

      if (!selectedIndustry) {
        throw new Error('Please select an industry first');
      }

      // Step 1: Collect REAL business intelligence
      console.log('[SynapseTest] Collecting real business data...');
      const businessIntel = await dataAdapter.collectAndTransform(
        testUrl,
        selectedIndustry.naicsCode
      );

      console.log('[SynapseTest] Business intelligence collected:', businessIntel);

      // Step 2: Run synapse discovery with REAL data
      const result = await generateSynapses({
        business: {
          name: testName || businessIntel.business.name,
          industry: testIndustry || businessIntel.business.industry,
          location: {
            city: testCity,
            state: testState
          }
        },
        intelligence: businessIntel
      });

      console.log('[SynapseTest] Synapse Results:', result);
      setResults(result.synapses);

      // Step 3: Generate content from synapses
      if (result.synapses.length > 0) {
        console.log('[SynapseTest] Generating content from synapses...');
        const contentGenerator = new SynapseContentGenerator();

        // Build proper target audience from actual business intelligence
        const actualIndustry = testIndustry || selectedIndustry?.name || businessIntel.business.industry;
        const actualCity = testCity || businessIntel.business.location.city;
        const actualState = testState || businessIntel.business.location.state;

        // Get target audience from website analysis or construct from industry
        const targetAudience = businessIntel.websiteAnalysis?.targetAudience ||
                              `${actualIndustry} customers in ${actualCity}, ${actualState}`;

        const businessProfile = {
          name: testName || businessIntel.business.name,
          industry: actualIndustry,
          targetAudience,
          brandVoice: 'professional' as const,
          contentGoals: ['engagement', 'lead-generation', 'thought-leadership'] as const
        };

        const contentResult = await contentGenerator.generate(
          result.synapses,
          businessProfile,
          {
            maxContent: 15,
            multiFormat: false,  // Only generate best format per insight to avoid repetition
            minImpactScore: 0.6,
            channel: 'all', // Generate all content types
            useFrameworks: true
          }
        );

        console.log('[SynapseTest] Content Generated:', contentResult);
        setGeneratedContent(contentResult.content);
      }

      setLoading(false);

    } catch (err) {
      console.error('[SynapseTest] Error:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
      setLoading(false);
    }
  };

  // Add humor to content
  const handleAddHumor = async (content: SynapseContent) => {
    try {
      setEnhancingContent(content.id);

      const edginess = edginessLevels[content.id] || 50; // Default to Approachable (50)
      const optimizer = new HumorOptimizer();

      const businessProfile = {
        name: testName || 'Test Business',
        industry: testIndustry || selectedIndustry?.name || 'General',
        targetAudience: `${testIndustry} customers`,
        brandVoice: 'professional' as const,
        contentGoals: ['engagement'] as const
      };

      const result = await optimizer.enhance(content, businessProfile, edginess);

      setHumorEnhancements(prev => ({
        ...prev,
        [content.id]: result
      }));

      console.log('[SynapseTest] Humor enhancement complete:', result);
    } catch (err) {
      console.error('[SynapseTest] Humor enhancement error:', err);
      alert(`Failed to add humor: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setEnhancingContent(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-violet-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-900 py-8 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <Link
            to="/mirror"
            className="inline-block text-sm text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-slate-200 mb-4"
          >
            ← Back to Mirror Dashboard
          </Link>

          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-2"
          >
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              🧪 Synapse Content Engine
            </h1>
            <p className="text-lg text-gray-600 dark:text-slate-400">
              Test the V6 Multi-Model Orchestra for synapse content discovery
            </p>
          </motion.div>
        </div>

        {/* Test Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg space-y-4"
        >
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Test Configuration
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                Business Name
              </label>
              <input
                type="text"
                value={testName}
                onChange={(e) => setTestName(e.target.value)}
                placeholder="e.g., WR Coffee"
                className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-slate-700 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                Industry
              </label>
              <IndustrySelector
                websiteUrl={testUrl}
                onIndustrySelected={(industry) => {
                  console.log('[SynapseTest] Industry selected:', industry);
                  setSelectedIndustry(industry);
                  setTestIndustry(industry.display_name);
                }}
                className="w-full"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                  City
                </label>
                <input
                  type="text"
                  value={testCity}
                  onChange={(e) => setTestCity(e.target.value)}
                  placeholder="e.g., Austin"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-slate-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                  State
                </label>
                <input
                  type="text"
                  value={testState}
                  onChange={(e) => setTestState(e.target.value)}
                  placeholder="TX"
                  maxLength={2}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-slate-700 dark:text-white uppercase"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                Website URL (optional)
              </label>
              <input
                type="text"
                value={testUrl}
                onChange={(e) => setTestUrl(e.target.value)}
                placeholder="https://www.example.com"
                className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-slate-700 dark:text-white"
              />
            </div>

            <button
              onClick={runSynapseTest}
              disabled={loading || !testName || !selectedIndustry || !testCity || !testState}
              className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Running Synapse Discovery...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Run Synapse Test
                </>
              )}
            </button>
          </div>
        </motion.div>

        {/* Error Display */}
        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6"
          >
            <div className="flex items-start gap-3">
              <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-lg font-semibold text-red-900 dark:text-red-200 mb-2">
                  Discovery Failed
                </h3>
                <p className="text-red-700 dark:text-red-300">{error}</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Results Display */}
        {results && results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-3 mb-4">
              <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Synapse Insights ({results.length})
              </h2>
            </div>

            <div className="grid gap-4">
              {results.map((result, index) => (
                <motion.div
                  key={result.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border-2 border-purple-200 dark:border-purple-800"
                >
                  <div className="space-y-4">
                    {/* Confidence Badge */}
                    <div className="flex items-center justify-between">
                      <span className="px-3 py-1 rounded-full text-sm font-semibold bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300">
                        {result.thinkingStyle.toUpperCase()}
                      </span>
                      <span className="text-2xl font-bold text-gray-900 dark:text-white">
                        {Math.round(result.confidence * 100)}%
                      </span>
                    </div>

                    {/* Insight Content */}
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                        {result.insight}
                      </h3>
                      <p className="text-gray-600 dark:text-slate-400">
                        {result.whyProfound}
                      </p>
                    </div>

                    {/* Why Now */}
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 dark:text-slate-300 mb-1">
                        Why Now
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-slate-400">
                        {result.whyNow}
                      </p>
                    </div>

                    {/* Content Angle */}
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 dark:text-slate-300 mb-1">
                        Content Angle
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-slate-400">
                        {result.contentAngle}
                      </p>
                    </div>

                    {/* Expected Reaction */}
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 dark:text-slate-300 mb-1">
                        Expected Reaction
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-slate-400">
                        {result.expectedReaction}
                      </p>
                    </div>

                    {/* Evidence */}
                    {result.evidence && result.evidence.length > 0 && (
                      <div className="pt-4 border-t border-gray-200 dark:border-slate-700">
                        <h4 className="text-sm font-semibold text-gray-700 dark:text-slate-300 mb-2">
                          Evidence
                        </h4>
                        <ul className="list-disc list-inside space-y-1">
                          {result.evidence.map((ev, idx) => (
                            <li key={idx} className="text-xs text-gray-600 dark:text-slate-400">
                              {ev}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Generated Content Display */}
        {generatedContent && generatedContent.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-3 mb-4">
              <Sparkles className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Generated Content ({generatedContent.length} pieces)
              </h2>
            </div>

            <div className="grid gap-6">
              {generatedContent.map((content) => (
                <motion.div
                  key={content.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border-2 border-blue-200 dark:border-blue-800"
                >
                  <div className="space-y-4">
                    {/* Header: Format and Scores */}
                    <div className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-slate-700">
                      <div className="flex items-center gap-3">
                        <span className="px-3 py-1 rounded-full text-sm font-semibold bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                          {content.format.toUpperCase()}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-slate-400">
                          {content.meta.tone}
                        </span>
                      </div>
                      <div className="flex gap-4 text-sm">
                        <div className="text-center">
                          <div className="text-xs text-gray-500 dark:text-slate-400">Engagement</div>
                          <div className="font-bold text-green-600 dark:text-green-400">
                            {Math.round(content.prediction.engagementScore * 100)}%
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-xs text-gray-500 dark:text-slate-400">Viral</div>
                          <div className="font-bold text-purple-600 dark:text-purple-400">
                            {Math.round(content.prediction.viralPotential * 100)}%
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-xs text-gray-500 dark:text-slate-400">Lead Gen</div>
                          <div className="font-bold text-blue-600 dark:text-blue-400">
                            {Math.round(content.prediction.leadGeneration * 100)}%
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Content Body */}
                    <div className="space-y-3">
                      <div>
                        <h4 className="text-sm font-semibold text-gray-500 dark:text-slate-400 mb-1">
                          Headline
                        </h4>
                        <p className="text-lg font-bold text-gray-900 dark:text-white">
                          {content.content.headline}
                        </p>
                      </div>

                      <div>
                        <h4 className="text-sm font-semibold text-gray-500 dark:text-slate-400 mb-1">
                          Hook
                        </h4>
                        <p className="text-gray-700 dark:text-slate-300">
                          {content.content.hook}
                        </p>
                      </div>

                      <div>
                        <h4 className="text-sm font-semibold text-gray-500 dark:text-slate-400 mb-1">
                          Body
                        </h4>
                        <p className="text-gray-600 dark:text-slate-400 whitespace-pre-wrap">
                          {content.content.body}
                        </p>
                      </div>

                      <div>
                        <h4 className="text-sm font-semibold text-gray-500 dark:text-slate-400 mb-1">
                          Call to Action
                        </h4>
                        <p className="text-gray-700 dark:text-slate-300 font-semibold">
                          {content.content.cta}
                        </p>
                      </div>

                      {content.content.hashtags && content.content.hashtags.length > 0 && (
                        <div className="flex gap-2 flex-wrap">
                          {content.content.hashtags.map((tag, idx) => (
                            <span
                              key={idx}
                              className="text-sm text-blue-600 dark:text-blue-400"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Psychology Section */}
                    <div className="pt-4 border-t border-gray-200 dark:border-slate-700">
                      <h4 className="text-sm font-semibold text-gray-700 dark:text-slate-300 mb-2">
                        🧠 Psychology & Strategy
                      </h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-semibold text-gray-600 dark:text-slate-400">
                            Principle:
                          </span>
                          <span className="ml-2 text-gray-800 dark:text-slate-200">
                            {content.psychology.principle}
                          </span>
                        </div>
                        <div>
                          <span className="font-semibold text-gray-600 dark:text-slate-400">
                            Trigger:
                          </span>
                          <span className="ml-2 text-gray-800 dark:text-slate-200">
                            {content.psychology.trigger.type} ({Math.round(content.psychology.trigger.strength * 100)}%)
                          </span>
                        </div>
                        <div>
                          <span className="font-semibold text-gray-600 dark:text-slate-400">
                            Technique:
                          </span>
                          <span className="ml-2 text-gray-800 dark:text-slate-200">
                            {content.psychology.persuasionTechnique}
                          </span>
                        </div>
                        <div>
                          <span className="font-semibold text-gray-600 dark:text-slate-400">
                            Pacing:
                          </span>
                          <span className="ml-2 text-gray-800 dark:text-slate-200">
                            {content.optimization.pacing}
                          </span>
                        </div>
                      </div>
                      <div className="mt-2">
                        <span className="font-semibold text-gray-600 dark:text-slate-400">
                          Expected Reaction:
                        </span>
                        <p className="text-gray-700 dark:text-slate-300 mt-1">
                          {content.psychology.expectedReaction}
                        </p>
                      </div>
                    </div>

                    {/* Provenance Tracking */}
                    {content.provenance && (
                      <div className="pt-4 border-t border-gray-200 dark:border-slate-700">
                        <ProvenanceViewer provenance={content.provenance} />
                      </div>
                    )}

                    {/* Content Enhancements: Character Counts, Regeneration, A/B Variants */}
                    {results && (
                      <div className="pt-4 border-t border-gray-200 dark:border-slate-700">
                        <h4 className="text-sm font-semibold text-gray-700 dark:text-slate-300 mb-3">
                          🎯 Content Enhancements
                        </h4>
                        <ContentEnhancements
                          content={content}
                          business={{
                            name: testName || 'Test Business',
                            industry: testIndustry || selectedIndustry?.name || 'General',
                            targetAudience: `${testIndustry} customers`,
                            brandVoice: 'professional' as const,
                            contentGoals: ['engagement'] as const
                          }}
                          insight={results.find(r => r.id === content.insightId) || results[0]}
                          onContentUpdate={(updated) => {
                            setGeneratedContent(prev =>
                              prev ? prev.map(c => c.id === updated.id ? updated : c) : null
                            );
                          }}
                        />
                      </div>
                    )}

                    {/* Humor Enhancement Section */}
                    <div className="pt-4 border-t border-gray-200 dark:border-slate-700">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-semibold text-gray-700 dark:text-slate-300">
                            😄 Add Professional Humor
                          </h4>
                          {humorEnhancements[content.id] && (
                            <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                              ✓ Enhanced
                            </span>
                          )}
                        </div>

                        {/* Edginess Slider */}
                        <EdginessSlider
                          value={edginessLevels[content.id] || 50}
                          onChange={(value) => setEdginessLevels(prev => ({ ...prev, [content.id]: value }))}
                        />

                        {/* Add Humor Button */}
                        <button
                          onClick={() => handleAddHumor(content)}
                          disabled={enhancingContent === content.id}
                          className="w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg
                                   hover:from-purple-700 hover:to-blue-700 transition-all font-medium
                                   disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                          {enhancingContent === content.id ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              Adding Humor...
                            </>
                          ) : (
                            <>
                              😄 {humorEnhancements[content.id] ? 'Refresh' : 'Add'} Humor
                            </>
                          )}
                        </button>

                        {/* Show Enhanced Content */}
                        {humorEnhancements[content.id] && (
                          <div className="mt-4 p-4 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg border-2 border-purple-200 dark:border-purple-800">
                            <div className="flex items-center gap-2 mb-3">
                              <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                              <h5 className="font-bold text-purple-900 dark:text-purple-100">
                                Humor-Enhanced Version
                              </h5>
                            </div>

                            <div className="space-y-3 text-sm">
                              <div>
                                <div className="font-semibold text-purple-800 dark:text-purple-300 mb-1">
                                  Headline
                                </div>
                                <div className="text-purple-900 dark:text-purple-100">
                                  {humorEnhancements[content.id].enhanced.headline}
                                </div>
                              </div>

                              <div>
                                <div className="font-semibold text-purple-800 dark:text-purple-300 mb-1">
                                  Hook
                                </div>
                                <div className="text-purple-900 dark:text-purple-100">
                                  {humorEnhancements[content.id].enhanced.hook}
                                </div>
                              </div>

                              <div>
                                <div className="font-semibold text-purple-800 dark:text-purple-300 mb-1">
                                  Body
                                </div>
                                <div className="text-purple-900 dark:text-purple-100 whitespace-pre-wrap">
                                  {humorEnhancements[content.id].enhanced.body}
                                </div>
                              </div>

                              <div>
                                <div className="font-semibold text-purple-800 dark:text-purple-300 mb-1">
                                  CTA
                                </div>
                                <div className="text-purple-900 dark:text-purple-100 font-semibold">
                                  {humorEnhancements[content.id].enhanced.cta}
                                </div>
                              </div>

                              <div className="pt-2 border-t border-purple-200 dark:border-purple-700">
                                <div className="text-xs text-purple-700 dark:text-purple-300">
                                  <strong>Enhancements Applied:</strong>
                                  <ul className="list-disc list-inside mt-1">
                                    {humorEnhancements[content.id].enhancementsApplied.map((enhancement, idx) => (
                                      <li key={idx}>{enhancement}</li>
                                    ))}
                                  </ul>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Copy Button */}
                    <button
                      onClick={() => {
                        const fullText = `${content.content.headline}\n\n${content.content.hook}\n\n${content.content.body}\n\n${content.content.cta}${content.content.hashtags ? '\n\n' + content.content.hashtags.map(t => '#' + t).join(' ') : ''}`;
                        navigator.clipboard.writeText(fullText);
                      }}
                      className="w-full px-4 py-2 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-slate-300 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors flex items-center justify-center gap-2"
                    >
                      <Copy className="w-4 h-4" />
                      Copy Full Content
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Empty State */}
        {!loading && !error && !results && (
          <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-xl shadow-lg">
            <Sparkles className="w-16 h-16 text-purple-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Ready to Test
            </h3>
            <p className="text-gray-600 dark:text-slate-400">
              Configure the test parameters above and click "Run Synapse Test" to begin
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
