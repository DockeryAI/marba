/**
 * BR3 Browser Logger Component
 * Captures console output, network requests, and errors.
 * Sends them to /__br_logger endpoint which writes to .buildrunner/browser.log
 */

import { useEffect, useRef } from 'react';

interface LogEntry {
  timestamp: string;
  sessionId: string;
  type: 'console' | 'network' | 'error';
  level?: string;
  method?: string;
  url?: string;
  status?: number;
  duration?: number;
  message?: string;
  stack?: string;
}

const SESSION_ID = Math.random().toString(36).substring(2, 15);
const FLUSH_INTERVAL = 2000;
const MAX_BATCH_SIZE = 50;

export function BRLogger() {
  const logBuffer = useRef<LogEntry[]>([]);
  const flushTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  const addLog = (entry: Omit<LogEntry, 'timestamp' | 'sessionId'>) => {
    logBuffer.current.push({
      ...entry,
      timestamp: new Date().toISOString(),
      sessionId: SESSION_ID,
    });
    if (logBuffer.current.length >= MAX_BATCH_SIZE) {
      flush();
    }
  };

  const flush = async () => {
    if (logBuffer.current.length === 0) return;
    const logs = [...logBuffer.current];
    logBuffer.current = [];

    try {
      const lines = logs.map(log => {
        const prefix = `[${log.timestamp}] [${log.sessionId.slice(0, 8)}]`;
        if (log.type === 'console') {
          return `${prefix} [${(log.level || 'log').toUpperCase()}] ${log.message || ''}\n`;
        }
        if (log.type === 'network') {
          const status = log.status ? ` ${log.status}` : ' ERR';
          const duration = log.duration ? ` ${log.duration}ms` : '';
          return `${prefix} [NET] ${log.method} ${log.url}${status}${duration}\n`;
        }
        if (log.type === 'error') {
          return `${prefix} [ERROR] ${log.message || 'Unknown'}\n${log.stack ? `  ${log.stack}\n` : ''}`;
        }
        return `${prefix} ${JSON.stringify(log)}\n`;
      }).join('');

      await fetch('/__br_logger', {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: lines,
      });
    } catch {
      // Silently fail - don't spam console
    }
  };

  useEffect(() => {
    // Only run in development
    if (import.meta.env.PROD) return;

    const origConsole = {
      log: console.log,
      warn: console.warn,
      error: console.error,
      info: console.info,
      debug: console.debug,
    };

    const wrap = (level: string, orig: (...args: unknown[]) => void) => (...args: unknown[]) => {
      orig.apply(console, args);
      addLog({
        type: 'console',
        level,
        message: args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' '),
      });
    };

    console.log = wrap('log', origConsole.log);
    console.warn = wrap('warn', origConsole.warn);
    console.error = wrap('error', origConsole.error);
    console.info = wrap('info', origConsole.info);
    console.debug = wrap('debug', origConsole.debug);

    const origFetch = window.fetch;
    window.fetch = async (...args) => {
      const start = Date.now();
      const url = typeof args[0] === 'string' ? args[0] : (args[0] as Request)?.url || 'unknown';
      const method = ((args[1] as RequestInit)?.method || 'GET').toUpperCase();

      // Skip logging our own requests
      if (url.includes('__br_logger')) {
        return origFetch.apply(window, args);
      }

      try {
        const res = await origFetch.apply(window, args);
        addLog({
          type: 'network',
          method,
          url,
          status: res.status,
          duration: Date.now() - start,
        });
        return res;
      } catch (e) {
        addLog({
          type: 'network',
          method,
          url,
          status: 0,
          duration: Date.now() - start,
          message: e instanceof Error ? e.message : 'Error',
        });
        throw e;
      }
    };

    const handleError = (e: ErrorEvent) => {
      addLog({ type: 'error', message: e.message, stack: e.error?.stack });
    };

    const handleRejection = (e: PromiseRejectionEvent) => {
      addLog({
        type: 'error',
        message: `Unhandled: ${e.reason?.message || e.reason}`,
        stack: e.reason?.stack,
      });
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleRejection);
    flushTimer.current = setInterval(flush, FLUSH_INTERVAL);

    addLog({
      type: 'console',
      level: 'info',
      message: `[BR3] Session: ${SESSION_ID} at ${window.location.href}`,
    });

    return () => {
      console.log = origConsole.log;
      console.warn = origConsole.warn;
      console.error = origConsole.error;
      console.info = origConsole.info;
      console.debug = origConsole.debug;
      window.fetch = origFetch;
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleRejection);
      if (flushTimer.current) clearInterval(flushTimer.current);
      flush();
    };
  }, []);

  return null;
}

export default BRLogger;
