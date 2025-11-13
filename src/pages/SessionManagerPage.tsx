/**
 * Session Manager Page
 * Admin interface for viewing, resuming, and deleting saved sessions
 */

import * as React from 'react'
import { useBrand } from '@/contexts/BrandContext'
import { SessionService, BrandSession } from '@/services/session/session.service'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
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
import {
  Database,
  Trash2,
  PlayCircle,
  Clock,
  CheckCircle,
  RefreshCw,
  ArrowLeft,
  Link as LinkIcon,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { formatDistanceToNow } from 'date-fns'

export const SessionManagerPage: React.FC = () => {
  const navigate = useNavigate()
  const { currentBrand } = useBrand()
  const [sessions, setSessions] = React.useState<BrandSession[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [isDeleting, setIsDeleting] = React.useState<string | null>(null)

  const loadSessions = React.useCallback(async () => {
    if (!currentBrand?.id) return

    setIsLoading(true)
    const loadedSessions = await SessionService.listSessions(currentBrand.id)
    setSessions(loadedSessions)
    setIsLoading(false)
  }, [currentBrand?.id])

  React.useEffect(() => {
    loadSessions()
  }, [loadSessions])

  const handleResumeSession = async (session: BrandSession) => {
    // Store session data in sessionStorage for restoration
    sessionStorage.setItem('resumeSession', JSON.stringify(session))
    // Navigate to MARBA page
    navigate('/marba')
  }

  const handleDeleteSession = async (sessionId: string) => {
    setIsDeleting(sessionId)
    await SessionService.deleteSession(sessionId)
    await loadSessions()
    setIsDeleting(null)
  }

  const getCompletionColor = (percentage: number) => {
    if (percentage >= 80) return 'text-green-600 dark:text-green-400'
    if (percentage >= 50) return 'text-blue-600 dark:text-blue-400'
    if (percentage >= 20) return 'text-yellow-600 dark:text-yellow-400'
    return 'text-gray-600 dark:text-gray-400'
  }

  const getCompletionVariant = (percentage: number) => {
    if (percentage >= 80) return 'default'
    if (percentage >= 50) return 'secondary'
    return 'outline'
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={() => navigate('/marba')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to MARBA
              </Button>
              <div className="h-6 w-px bg-border" />
              <div className="flex items-center gap-3">
                <Database className="h-6 w-6 text-primary" />
                <div>
                  <h1 className="text-2xl font-bold">Session Manager</h1>
                  <p className="text-sm text-muted-foreground">
                    View, resume, and manage your saved sessions
                  </p>
                </div>
              </div>
            </div>
            <Button onClick={loadSessions} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
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
          <div className="mb-4">
            <h2 className="text-lg font-semibold">Saved Sessions</h2>
            <p className="text-sm text-muted-foreground">
              Resume or delete your saved MARBA and UVP sessions
            </p>
          </div>

          {isLoading ? (
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
    </div>
  )
}
