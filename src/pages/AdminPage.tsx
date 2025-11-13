/**
 * Admin Page - Platform Administration
 * Provides access to API Management, Background Jobs, and other admin functions
 */

import * as React from 'react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ArrowLeft, Settings, Database, Cog, FolderOpen, PlayCircle, Clock, CheckCircle, RefreshCw, Trash2, Link as LinkIcon } from 'lucide-react'
import { ApiAdminSection } from '@/components/admin/api'
import { BackgroundJobsMonitor } from '@/components/admin/BackgroundJobsMonitor'
import { useBrand } from '@/contexts/BrandContext'
import { SessionService, BrandSession } from '@/services/session/session.service'
import { supabase } from '@/lib/supabase'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { formatDistanceToNow } from 'date-fns'

export const AdminPage: React.FC = () => {
  const navigate = useNavigate()
  const { currentBrand, setCurrentBrand } = useBrand()
  // Mock brand ID - in production this would come from auth/context
  const brandId = 'demo-brand-001'
  const [activeTab, setActiveTab] = useState('sessions')

  // Sessions state
  const [sessions, setSessions] = React.useState<BrandSession[]>([])
  const [isLoadingSessions, setIsLoadingSessions] = React.useState(false)
  const [isDeleting, setIsDeleting] = React.useState<string | null>(null)

  // Load sessions
  const loadSessions = React.useCallback(async () => {
    setIsLoadingSessions(true)
    try {
      const loadedSessions = await SessionService.getRecentSessions(50)
      setSessions(loadedSessions)
    } catch (error) {
      console.error('Failed to load sessions:', error)
    } finally {
      setIsLoadingSessions(false)
    }
  }, [])

  React.useEffect(() => {
    if (activeTab === 'sessions') {
      loadSessions()
    }
  }, [activeTab, loadSessions])

  const handleResumeSession = async (session: BrandSession) => {
    try {
      // First load the brand for this session
      const { data: brand, error: brandError } = await supabase
        .from('brands')
        .select('*')
        .eq('id', session.brand_id)
        .maybeSingle()

      if (brandError || !brand) {
        console.error('Failed to load brand for session:', brandError)
        alert('Unable to resume session: Brand not found')
        return
      }

      // Set the brand in context
      setCurrentBrand(brand)

      // Update session timestamp
      await SessionService.setActiveSession(session.id)

      // Navigate to mirror page
      navigate('/mirror')
    } catch (error) {
      console.error('Failed to resume session:', error)
      alert('Failed to resume session. Please try again.')
    }
  }

  const handleDeleteSession = async (sessionId: string) => {
    setIsDeleting(sessionId)
    try {
      await SessionService.deleteSession(sessionId)
      await loadSessions()
    } catch (error) {
      console.error('Failed to delete session:', error)
    } finally {
      setIsDeleting(null)
    }
  }

  const getCompletionVariant = (percentage: number) => {
    if (percentage >= 80) return 'default'
    if (percentage >= 50) return 'secondary'
    return 'outline'
  }

  // TODO: Add proper authentication and role-based access control
  // - Check if user is authenticated
  // - Verify user has admin role/permissions
  // - Redirect to login if not authenticated
  // - Show "Access Denied" if authenticated but not admin

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <Settings className="h-6 w-6 text-primary" />
              <h1 className="text-2xl font-bold">Administration</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-3xl grid-cols-3 mb-6">
            <TabsTrigger value="sessions" className="gap-2">
              <FolderOpen className="h-4 w-4" />
              My Sessions
            </TabsTrigger>
            <TabsTrigger value="apis" className="gap-2">
              <Database className="h-4 w-4" />
              API Management
            </TabsTrigger>
            <TabsTrigger value="jobs" className="gap-2">
              <Cog className="h-4 w-4" />
              Background Jobs
            </TabsTrigger>
          </TabsList>

          <TabsContent value="sessions" className="mt-0">
            <div className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Total Sessions</p>
                      <p className="text-3xl font-bold">{sessions.length}</p>
                    </div>
                    <Database className="h-10 w-10 text-muted-foreground opacity-50" />
                  </div>
                </Card>
                <Card className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Completed</p>
                      <p className="text-3xl font-bold">
                        {sessions.filter((s) => s.completion_percentage >= 80).length}
                      </p>
                    </div>
                    <CheckCircle className="h-10 w-10 text-green-600 opacity-50" />
                  </div>
                </Card>
                <Card className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">In Progress</p>
                      <p className="text-3xl font-bold">
                        {sessions.filter((s) => s.completion_percentage < 80).length}
                      </p>
                    </div>
                    <Clock className="h-10 w-10 text-blue-600 opacity-50" />
                  </div>
                </Card>
              </div>

              {/* Sessions Table */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-lg font-semibold">Saved Sessions</h2>
                    <p className="text-sm text-muted-foreground">
                      Resume or delete your saved MARBA and UVP sessions
                    </p>
                  </div>
                  <Button onClick={loadSessions} variant="outline" size="sm">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh
                  </Button>
                </div>

                {isLoadingSessions ? (
                  <div className="text-center py-12">
                    <RefreshCw className="h-8 w-8 mx-auto mb-3 animate-spin opacity-50" />
                    <p className="text-sm text-muted-foreground">Loading sessions...</p>
                  </div>
                ) : sessions.length === 0 ? (
                  <div className="text-center py-12">
                    <Database className="h-12 w-12 mx-auto mb-3 opacity-20" />
                    <p className="text-sm text-muted-foreground mb-2">No saved sessions yet</p>
                    <p className="text-xs text-muted-foreground">
                      Sessions will appear here as you work on the MARBA dashboard and UVP wizard
                    </p>
                  </div>
                ) : (
                  <div className="border rounded-lg overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Session Name</TableHead>
                          <TableHead>URL Slug</TableHead>
                          <TableHead>Progress</TableHead>
                          <TableHead>Last Saved</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {sessions.map((session) => (
                          <TableRow key={session.id}>
                            <TableCell className="font-medium">{session.session_name}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <LinkIcon className="h-3 w-3 text-muted-foreground" />
                                <code className="text-xs bg-muted px-2 py-1 rounded">
                                  {session.url_slug}
                                </code>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Badge
                                  variant={getCompletionVariant(session.completion_percentage)}
                                  className="w-16 justify-center"
                                >
                                  {session.completion_percentage}%
                                </Badge>
                                <div className="flex-1 bg-muted rounded-full h-2 w-24">
                                  <div
                                    className={`h-2 rounded-full transition-all ${
                                      session.completion_percentage >= 80
                                        ? 'bg-green-600'
                                        : session.completion_percentage >= 50
                                        ? 'bg-blue-600'
                                        : 'bg-yellow-600'
                                    }`}
                                    style={{ width: `${session.completion_percentage}%` }}
                                  />
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Clock className="h-3 w-3" />
                                {formatDistanceToNow(new Date(session.last_saved_at), {
                                  addSuffix: true,
                                })}
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-2">
                                <Button
                                  size="sm"
                                  variant="default"
                                  onClick={() => handleResumeSession(session)}
                                >
                                  <PlayCircle className="h-4 w-4 mr-2" />
                                  Resume
                                </Button>
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button
                                      size="sm"
                                      variant="destructive"
                                      disabled={isDeleting === session.id}
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent>
                                    <DialogHeader>
                                      <DialogTitle>Delete Session?</DialogTitle>
                                      <DialogDescription>
                                        Are you sure you want to delete "{session.session_name}"? This
                                        action cannot be undone.
                                      </DialogDescription>
                                    </DialogHeader>
                                    <DialogFooter>
                                      <Button variant="outline">Cancel</Button>
                                      <Button
                                        onClick={() => handleDeleteSession(session.id)}
                                        variant="destructive"
                                      >
                                        Delete
                                      </Button>
                                    </DialogFooter>
                                  </DialogContent>
                                </Dialog>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="apis" className="mt-0">
            <ApiAdminSection brandId={brandId} />
          </TabsContent>

          <TabsContent value="jobs" className="mt-0">
            <BackgroundJobsMonitor />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
