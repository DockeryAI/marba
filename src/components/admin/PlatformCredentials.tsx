/**
 * Platform Credentials Component
 * Manages platform connections and credentials
 * Task 3.5 - Platform Integration Framework
 */

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  CheckCircle,
  XCircle,
  RefreshCw,
  Link as LinkIcon,
  AlertCircle,
  Settings,
} from 'lucide-react';
import { testPlatformConnection } from '@/lib/platform-apis';
import type { ContentPlatform } from '@/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

/**
 * Platform connection status
 */
interface PlatformConnection {
  platform: ContentPlatform;
  connected: boolean;
  lastSync?: string;
  error?: string;
  credentials?: {
    accountName?: string;
    accountId?: string;
  };
}

/**
 * Platform display info
 */
interface PlatformInfo {
  platform: ContentPlatform;
  name: string;
  icon: string;
  color: string;
  description: string;
}

const PLATFORMS: PlatformInfo[] = [
  {
    platform: 'facebook',
    name: 'Facebook',
    icon: '👥',
    color: '#1877F2',
    description: 'Pages and Groups',
  },
  {
    platform: 'instagram',
    name: 'Instagram',
    icon: '📷',
    color: '#E1306C',
    description: 'Business Account',
  },
  {
    platform: 'linkedin',
    name: 'LinkedIn',
    icon: '💼',
    color: '#0A66C2',
    description: 'Company Page',
  },
  {
    platform: 'twitter',
    name: 'Twitter / X',
    icon: '🐦',
    color: '#1DA1F2',
    description: 'Business Account',
  },
  {
    platform: 'tiktok',
    name: 'TikTok',
    icon: '🎵',
    color: '#000000',
    description: 'Business Account',
  },
  {
    platform: 'google_business',
    name: 'Google Business',
    icon: '🌐',
    color: '#4285F4',
    description: 'Business Profile',
  },
  {
    platform: 'email',
    name: 'Email Marketing',
    icon: '📧',
    color: '#EA4335',
    description: 'SMTP / Service',
  },
  {
    platform: 'blog',
    name: 'Blog / CMS',
    icon: '📝',
    color: '#34A853',
    description: 'WordPress / Custom',
  },
];

const STORAGE_KEY = 'marba_platform_connections';

/**
 * Load connections from localStorage
 */
function loadConnections(): PlatformConnection[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Failed to load connections:', error);
  }

  // Return default connections (all disconnected)
  return PLATFORMS.map(p => ({
    platform: p.platform,
    connected: false,
  }));
}

/**
 * Save connections to localStorage
 */
function saveConnections(connections: PlatformConnection[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(connections));
  } catch (error) {
    console.error('Failed to save connections:', error);
  }
}

export function PlatformCredentials() {
  const [connections, setConnections] = useState<PlatformConnection[]>(loadConnections());
  const [testing, setTesting] = useState<Set<ContentPlatform>>(new Set());
  const [showConnectDialog, setShowConnectDialog] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<PlatformInfo | null>(null);
  const [accountName, setAccountName] = useState('');

  /**
   * Update connections in state and localStorage
   */
  const updateConnections = (newConnections: PlatformConnection[]) => {
    setConnections(newConnections);
    saveConnections(newConnections);
  };

  /**
   * Get connection status for a platform
   */
  const getConnection = (platform: ContentPlatform): PlatformConnection => {
    return (
      connections.find(c => c.platform === platform) || {
        platform,
        connected: false,
      }
    );
  };

  /**
   * Test platform connection
   */
  const handleTestConnection = async (platform: ContentPlatform) => {
    setTesting(prev => new Set(prev).add(platform));

    try {
      const result = await testPlatformConnection(platform);

      const updatedConnections = connections.map(conn => {
        if (conn.platform === platform) {
          return {
            ...conn,
            connected: result.connected,
            error: result.error,
            lastSync: new Date().toISOString(),
          };
        }
        return conn;
      });

      updateConnections(updatedConnections);
    } catch (error: any) {
      console.error('Connection test failed:', error);

      const updatedConnections = connections.map(conn => {
        if (conn.platform === platform) {
          return {
            ...conn,
            connected: false,
            error: error.message,
            lastSync: new Date().toISOString(),
          };
        }
        return conn;
      });

      updateConnections(updatedConnections);
    } finally {
      setTesting(prev => {
        const next = new Set(prev);
        next.delete(platform);
        return next;
      });
    }
  };

  /**
   * Open connect dialog
   */
  const handleConnectClick = (platformInfo: PlatformInfo) => {
    setSelectedPlatform(platformInfo);
    setAccountName('');
    setShowConnectDialog(true);
  };

  /**
   * Handle connect submit (mock)
   */
  const handleConnectSubmit = async () => {
    if (!selectedPlatform) return;

    const updatedConnections = connections.map(conn => {
      if (conn.platform === selectedPlatform.platform) {
        return {
          ...conn,
          connected: true,
          lastSync: new Date().toISOString(),
          credentials: {
            accountName: accountName || `Mock ${selectedPlatform.name} Account`,
            accountId: `mock_${Date.now()}`,
          },
        };
      }
      return conn;
    });

    updateConnections(updatedConnections);
    setShowConnectDialog(false);
  };

  /**
   * Disconnect platform
   */
  const handleDisconnect = (platform: ContentPlatform) => {
    const updatedConnections = connections.map(conn => {
      if (conn.platform === platform) {
        return {
          platform,
          connected: false,
        };
      }
      return conn;
    });

    updateConnections(updatedConnections);
  };

  /**
   * Format last sync time
   */
  const formatLastSync = (lastSync?: string): string => {
    if (!lastSync) return 'Never';

    const date = new Date(lastSync);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;

    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;

    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  };

  /**
   * Get connection stats
   */
  const connectedCount = connections.filter(c => c.connected).length;
  const totalCount = PLATFORMS.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold">Platform Connections</h2>
        <p className="text-muted-foreground">
          Connect your social media accounts to enable publishing and analytics
        </p>
        <div className="mt-2">
          <Badge variant="outline" className="text-lg">
            {connectedCount} / {totalCount} Connected
          </Badge>
        </div>
      </div>

      {/* Platform Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {PLATFORMS.map(platformInfo => {
          const connection = getConnection(platformInfo.platform);
          const isTesting = testing.has(platformInfo.platform);

          return (
            <Card key={platformInfo.platform} className="p-4">
              {/* Platform Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div
                    className="text-3xl p-2 rounded-lg"
                    style={{ backgroundColor: `${platformInfo.color}20` }}
                  >
                    {platformInfo.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold">{platformInfo.name}</h3>
                    <p className="text-xs text-muted-foreground">
                      {platformInfo.description}
                    </p>
                  </div>
                </div>

                {/* Status Badge */}
                {connection.connected ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                ) : (
                  <XCircle className="w-5 h-5 text-gray-400" />
                )}
              </div>

              {/* Connection Info */}
              {connection.connected && connection.credentials && (
                <div className="mb-3 p-2 bg-gray-50 rounded text-sm">
                  <p className="font-medium">{connection.credentials.accountName}</p>
                  <p className="text-xs text-muted-foreground">
                    Last sync: {formatLastSync(connection.lastSync)}
                  </p>
                </div>
              )}

              {/* Error Display */}
              {connection.error && (
                <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-red-700">{connection.error}</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2">
                {connection.connected ? (
                  <>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleTestConnection(platformInfo.platform)}
                      disabled={isTesting}
                      className="flex-1"
                    >
                      {isTesting ? (
                        <>
                          <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
                          Testing...
                        </>
                      ) : (
                        <>
                          <RefreshCw className="w-3 h-3 mr-1" />
                          Test
                        </>
                      )}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDisconnect(platformInfo.platform)}
                    >
                      <Settings className="w-3 h-3" />
                    </Button>
                  </>
                ) : (
                  <Button
                    size="sm"
                    onClick={() => handleConnectClick(platformInfo)}
                    className="flex-1"
                    style={{ backgroundColor: platformInfo.color }}
                  >
                    <LinkIcon className="w-3 h-3 mr-1" />
                    Connect
                  </Button>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      {/* Connect Dialog */}
      <Dialog open={showConnectDialog} onOpenChange={setShowConnectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Connect {selectedPlatform?.name}
            </DialogTitle>
            <DialogDescription>
              Connect your {selectedPlatform?.name} account to enable publishing.
              This is a mock connection for development.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label>Account Name (Optional)</Label>
              <Input
                placeholder={`My ${selectedPlatform?.name} Account`}
                value={accountName}
                onChange={e => setAccountName(e.target.value)}
              />
              <p className="text-xs text-muted-foreground mt-1">
                A display name for this connection
              </p>
            </div>

            <div className="p-3 bg-blue-50 border border-blue-200 rounded">
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> This is a mock connection for development purposes.
                In production, this would use OAuth to securely connect your account.
              </p>
            </div>

            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setShowConnectDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleConnectSubmit}>
                Connect Account
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Info Card */}
      <Card className="p-4 bg-yellow-50 border-yellow-200">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-yellow-800">
            <p className="font-semibold mb-1">Development Mode</p>
            <p>
              These are mock connections for development and testing. Real platform integrations
              require OAuth authentication and API credentials. Publishing will simulate success/failure
              without actually posting to platforms.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
