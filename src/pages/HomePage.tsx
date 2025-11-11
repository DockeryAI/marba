import * as React from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Target, Users, FileText, TrendingUp, Sparkles, ArrowRight } from 'lucide-react'

export const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold">MARBA.ai</h1>
          </div>
          <Link to="/mirror">
            <Button>
              Launch Mirror
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="container mx-auto px-6 py-20 text-center">
        <Badge className="mb-4">Marketing Intelligence Platform</Badge>
        <h2 className="text-5xl font-bold mb-6">
          Strategic Marketing,
          <br />
          <span className="text-primary">Powered by AI</span>
        </h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
          Transform your marketing with MIRROR-based strategy, AI-powered insights,
          and actionable tactics that drive real results.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link to="/mirror">
            <Button size="lg">
              Get Started
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <Button size="lg" variant="outline">
            Learn More
          </Button>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-6 py-20">
        <h3 className="text-3xl font-bold text-center mb-12">
          Complete Marketing Intelligence Suite
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* MIRROR Framework */}
          <Card>
            <CardHeader>
              <Target className="h-8 w-8 text-primary mb-2" />
              <CardTitle>MIRROR Framework</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Comprehensive strategic framework covering Market analysis, Intent setting,
                Reach strategy, Resonance tactics, Optimization actions, and Results tracking.
              </p>
              <ul className="mt-4 space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  Brand health analysis
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  SMART goal setting
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  Strategic planning
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* UVP Builder */}
          <Card>
            <CardHeader>
              <Sparkles className="h-8 w-8 text-primary mb-2" />
              <CardTitle>UVP Builder</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Create compelling value propositions using proven formulas and
                AI-powered psychology scoring.
              </p>
              <ul className="mt-4 space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  5 proven formulas
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  Synapse scoring
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  A/B testing
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Intelligence */}
          <Card>
            <CardHeader>
              <TrendingUp className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Intelligence</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Multi-signal opportunity detection powered by AI analyzing weather,
                trends, competitors, and more.
              </p>
              <ul className="mt-4 space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  Real-time alerts
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  Industry triggers
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  Benchmarking
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Marbs AI */}
          <Card>
            <CardHeader>
              <Users className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Marbs AI</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Context-aware AI assistant that understands where you are and
                provides relevant insights and actions.
              </p>
              <ul className="mt-4 space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  Smart suggestions
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  Quick actions
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  Auto-analysis
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Status */}
      <section className="container mx-auto px-6 py-20">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-center">Development Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Foundation & Design System</span>
                <Badge className="bg-green-500">Complete</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Marbs AI Assistant</span>
                <Badge className="bg-green-500">Complete</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Intelligence Showcase</span>
                <Badge className="bg-green-500">Complete</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Mirror: Situation & Objectives</span>
                <Badge className="bg-green-500">Complete</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Mirror: Strategy & Tactics</span>
                <Badge className="bg-green-500">Complete</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">UVP Builder</span>
                <Badge className="bg-green-500">Complete</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Mirror: Action & Control</span>
                <Badge variant="secondary">Planned</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Content Calendar</span>
                <Badge variant="secondary">Planned</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/50 py-8">
        <div className="container mx-auto px-6 text-center text-sm text-muted-foreground">
          <p>MARBA.ai - Marketing Intelligence Platform</p>
          <p className="mt-2">Built with React, TypeScript, Vite, and Supabase</p>
        </div>
      </footer>
    </div>
  )
}
