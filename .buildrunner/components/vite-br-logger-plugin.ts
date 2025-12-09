/**
 * BR3 Browser Logger - Vite Plugin
 * Handles the /__br_logger endpoint to receive and write browser logs.
 */

import type { Plugin } from 'vite';
import fs from 'fs';
import path from 'path';

export function brLoggerPlugin(): Plugin {
  const projectRoot = process.cwd();
  const logDir = path.join(projectRoot, '.buildrunner');
  const logFile = path.join(logDir, 'browser.log');
  const maxLogSize = 500 * 1024; // 500KB max before rotation

  // Ensure .buildrunner directory exists
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }

  return {
    name: 'br-logger',
    configureServer(server) {
      server.middlewares.use('/__br_logger', (req, res) => {
        if (req.method === 'POST') {
          let body = '';
          req.on('data', (chunk: Buffer) => {
            body += chunk.toString();
          });
          req.on('end', () => {
            try {
              // Rotate log if too large
              if (fs.existsSync(logFile)) {
                const stats = fs.statSync(logFile);
                if (stats.size > maxLogSize) {
                  const backup = logFile.replace('.log', '.old.log');
                  if (fs.existsSync(backup)) {
                    fs.unlinkSync(backup);
                  }
                  fs.renameSync(logFile, backup);
                }
              }

              // Append to log file
              fs.appendFileSync(logFile, body);
              res.statusCode = 200;
              res.end('ok');
            } catch (e) {
              console.error('[br-logger] Write error:', e);
              res.statusCode = 500;
              res.end('error');
            }
          });
        } else {
          res.statusCode = 405;
          res.end('Method not allowed');
        }
      });
    },
  };
}

export default brLoggerPlugin;
