/**
 * Background Jobs Monitor - Admin dashboard for monitoring background jobs
 * Phase 15: Background Jobs and Enrichment Engine
 */

import React, { useEffect, useState } from 'react';
import { BackgroundJobScheduler } from '@/services/background/job-scheduler';
import type { BackgroundJob, JobExecution, JobLog, JobStatusResponse } from '@/types/enrichment.types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Play, Pause, RefreshCw, AlertCircle, CheckCircle, Clock } from 'lucide-react';

export const BackgroundJobsMonitor: React.FC = () => {
  const [jobs, setJobs] = useState<BackgroundJob[]>([]);
  const [selectedJob, setSelectedJob] = useState<string | null>(null);
  const [jobStatus, setJobStatus] = useState<JobStatusResponse | null>(null);
  const [executions, setExecutions] = useState<JobExecution[]>([]);
  const [logs, setLogs] = useState<JobLog[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    loadJobs();
    const interval = setInterval(loadJobs, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (selectedJob) {
      loadJobDetails(selectedJob);
    }
  }, [selectedJob]);

  const loadJobs = async () => {
    try {
      const data = await BackgroundJobScheduler.getAllJobs();
      setJobs(data);
    } catch (error) {
      console.error('Error loading jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadJobDetails = async (jobName: string) => {
    try {
      const [status, execs, jobLogs, statistics] = await Promise.all([
        BackgroundJobScheduler.getJobStatus(jobName),
        BackgroundJobScheduler.getJobExecutions(jobName, 20),
        BackgroundJobScheduler.getJobLogs(jobName, { limit: 50 }),
        BackgroundJobScheduler.getJobStats(jobName),
      ]);

      setJobStatus(status);
      setExecutions(execs);
      setLogs(jobLogs);
      setStats(statistics);
    } catch (error) {
      console.error('Error loading job details:', error);
    }
  };

  const handlePauseJob = async (jobName: string) => {
    setActionLoading(true);
    try {
      await BackgroundJobScheduler.pauseJob(jobName);
      await loadJobs();
      if (selectedJob === jobName) {
        await loadJobDetails(jobName);
      }
    } catch (error) {
      console.error('Error pausing job:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleResumeJob = async (jobName: string) => {
    setActionLoading(true);
    try {
      await BackgroundJobScheduler.resumeJob(jobName);
      await loadJobs();
      if (selectedJob === jobName) {
        await loadJobDetails(jobName);
      }
    } catch (error) {
      console.error('Error resuming job:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleTriggerJob = async (jobName: string) => {
    setActionLoading(true);
    try {
      await BackgroundJobScheduler.triggerJob(jobName);
      await loadJobs();
      setTimeout(() => {
        if (selectedJob === jobName) {
          loadJobDetails(jobName);
        }
      }, 2000);
    } catch (error) {
      console.error('Error triggering job:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'destructive' | 'outline' | 'secondary'> = {
      active: 'default',
      paused: 'secondary',
      failed: 'destructive',
    };
    return <Badge variant={variants[status] || 'outline'}>{status}</Badge>;
  };

  const getHealthBadge = (health: string) => {
    const colors: Record<string, string> = {
      healthy: 'text-green-600',
      degraded: 'text-yellow-600',
      unhealthy: 'text-red-600',
    };
    const icons: Record<string, any> = {
      healthy: CheckCircle,
      degraded: AlertCircle,
      unhealthy: AlertCircle,
    };
    const Icon = icons[health] || Clock;

    return (
      <div className={`flex items-center gap-2 ${colors[health] || ''}`}>
        <Icon className="w-4 h-4" />
        <span className="capitalize">{health}</span>
      </div>
    );
  };

  const formatDuration = (ms: number) => {
    if (ms < 1000) return `${ms}ms`;
    if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
    return `${(ms / 60000).toFixed(1)}m`;
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <RefreshCw className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Background Jobs Monitor</h1>
        <Button onClick={loadJobs} variant="outline" size="sm">
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {jobs.map((job) => (
          <Card
            key={job.name}
            className={`cursor-pointer transition-all ${
              selectedJob === job.name ? 'ring-2 ring-primary' : ''
            }`}
            onClick={() => setSelectedJob(job.name)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{job.name}</CardTitle>
                {getStatusBadge(job.status)}
              </div>
              <CardDescription className="text-xs">{job.schedule}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Last run:</span>
                  <span>
                    {job.last_run_at ? formatTimestamp(job.last_run_at) : 'Never'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Success rate:</span>
                  <span>
                    {job.success_count + job.failure_count > 0
                      ? `${((job.success_count / (job.success_count + job.failure_count)) * 100).toFixed(1)}%`
                      : 'N/A'}
                  </span>
                </div>
                <div className="flex items-center justify-between pt-2">
                  <div className="flex gap-2">
                    {job.status === 'active' ? (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePauseJob(job.name);
                        }}
                        disabled={actionLoading}
                      >
                        <Pause className="w-4 h-4" />
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleResumeJob(job.name);
                        }}
                        disabled={actionLoading}
                      >
                        <Play className="w-4 h-4" />
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleTriggerJob(job.name);
                      }}
                      disabled={actionLoading}
                    >
                      <RefreshCw className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedJob && jobStatus && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Job Details: {selectedJob}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <div className="text-sm text-muted-foreground">Status</div>
                  <div className="text-lg font-semibold">{getStatusBadge(jobStatus.status)}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Health</div>
                  <div className="text-lg font-semibold">{getHealthBadge(jobStatus.health)}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Next Run</div>
                  <div className="text-lg font-semibold">
                    {jobStatus.next_run ? formatTimestamp(jobStatus.next_run) : 'N/A'}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Last Duration</div>
                  <div className="text-lg font-semibold">
                    {jobStatus.last_run?.duration_ms
                      ? formatDuration(jobStatus.last_run.duration_ms)
                      : 'N/A'}
                  </div>
                </div>
              </div>

              {stats && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 pt-4 border-t">
                  <div>
                    <div className="text-sm text-muted-foreground">Total Executions</div>
                    <div className="text-2xl font-bold">{stats.total_executions}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Success Rate</div>
                    <div className="text-2xl font-bold">{stats.success_rate.toFixed(1)}%</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Avg Duration</div>
                    <div className="text-2xl font-bold">
                      {formatDuration(stats.avg_duration_ms)}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Last 24h</div>
                    <div className="text-2xl font-bold">{stats.last_24h_executions}</div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Executions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {executions.map((exec) => (
                    <div
                      key={exec.id}
                      className="flex items-center justify-between p-3 border rounded"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={
                              exec.status === 'success'
                                ? 'default'
                                : exec.status === 'failed'
                                ? 'destructive'
                                : 'secondary'
                            }
                          >
                            {exec.status}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            {formatTimestamp(exec.started_at)}
                          </span>
                        </div>
                        <div className="text-sm mt-1">
                          Duration: {exec.duration_ms ? formatDuration(exec.duration_ms) : 'N/A'} |
                          Brands: {exec.brands_processed}
                        </div>
                        {exec.error && (
                          <div className="text-xs text-red-600 mt-1">{exec.error}</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Logs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {logs.map((log) => (
                    <div key={log.timestamp + log.message} className="p-2 border-l-2 border-gray-300">
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={
                            log.level === 'error'
                              ? 'destructive'
                              : log.level === 'warn'
                              ? 'secondary'
                              : 'outline'
                          }
                        >
                          {log.level}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {formatTimestamp(log.timestamp)}
                        </span>
                      </div>
                      <div className="text-sm mt-1">{log.message}</div>
                      {log.metadata && (
                        <div className="text-xs text-muted-foreground mt-1 font-mono">
                          {JSON.stringify(log.metadata)}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};
