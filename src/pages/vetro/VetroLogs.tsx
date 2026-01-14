import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  History,
  Search,
  Download,
  Upload,
  Check,
  AlertTriangle,
  X,
  Eye,
  RefreshCw,
  Filter,
} from 'lucide-react';
import { mockSyncLogs, VetroSyncLog } from '@/data/vetroData';
import { format } from 'date-fns';

const VetroLogs: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [directionFilter, setDirectionFilter] = useState<'all' | 'import' | 'export'>('all');
  const [resultFilter, setResultFilter] = useState<'all' | 'success' | 'partial' | 'failed'>('all');
  const [selectedLog, setSelectedLog] = useState<VetroSyncLog | null>(null);

  const filteredLogs = mockSyncLogs.filter((log) => {
    const matchesSearch =
      log.scope.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase())) ||
      log.userName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDirection = directionFilter === 'all' || log.direction === directionFilter;
    const matchesResult = resultFilter === 'all' || log.result === resultFilter;
    return matchesSearch && matchesDirection && matchesResult;
  });

  const getResultBadge = (result: VetroSyncLog['result']) => {
    switch (result) {
      case 'success':
        return (
          <Badge className="bg-green-500/10 text-green-500 border-green-500/20">
            <Check className="w-3 h-3 mr-1" />
            Success
          </Badge>
        );
      case 'partial':
        return (
          <Badge className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">
            <AlertTriangle className="w-3 h-3 mr-1" />
            Partial
          </Badge>
        );
      case 'failed':
        return (
          <Badge variant="destructive">
            <X className="w-3 h-3 mr-1" />
            Failed
          </Badge>
        );
    }
  };

  const getDirectionBadge = (direction: VetroSyncLog['direction']) => {
    return direction === 'import' ? (
      <Badge variant="outline" className="gap-1">
        <Download className="w-3 h-3" />
        Import
      </Badge>
    ) : (
      <Badge variant="outline" className="gap-1">
        <Upload className="w-3 h-3" />
        Export
      </Badge>
    );
  };

  const getDuration = (log: VetroSyncLog) => {
    if (!log.endTime) return 'In progress';
    const durationMs = log.endTime.getTime() - log.startTime.getTime();
    const seconds = Math.floor(durationMs / 1000);
    const minutes = Math.floor(seconds / 60);
    if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    }
    return `${seconds}s`;
  };

  // Stats
  const totalLogs = mockSyncLogs.length;
  const successCount = mockSyncLogs.filter((l) => l.result === 'success').length;
  const failedCount = mockSyncLogs.filter((l) => l.result === 'failed').length;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <History className="w-6 h-6" />
            VETRO Sync Logs
          </h1>
          <p className="text-muted-foreground mt-1">
            Monitor and debug VETRO synchronization operations
          </p>
        </div>
        <Button variant="outline">
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{totalLogs}</div>
            <div className="text-sm text-muted-foreground">Total Syncs</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-500">{successCount}</div>
            <div className="text-sm text-muted-foreground">Successful</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-destructive">{failedCount}</div>
            <div className="text-sm text-muted-foreground">Failed</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">
              {Math.round((successCount / totalLogs) * 100)}%
            </div>
            <div className="text-sm text-muted-foreground">Success Rate</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Sync History</CardTitle>
          <CardDescription>View all VETRO import and export operations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search by project code or user..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={directionFilter} onValueChange={(v) => setDirectionFilter(v as any)}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Direction" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Directions</SelectItem>
                <SelectItem value="import">Import</SelectItem>
                <SelectItem value="export">Export</SelectItem>
              </SelectContent>
            </Select>
            <Select value={resultFilter} onValueChange={(v) => setResultFilter(v as any)}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Result" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Results</SelectItem>
                <SelectItem value="success">Success</SelectItem>
                <SelectItem value="partial">Partial</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date/Time</TableHead>
                <TableHead>Direction</TableHead>
                <TableHead>Scope</TableHead>
                <TableHead>User</TableHead>
                <TableHead className="text-center">Items</TableHead>
                <TableHead className="text-center">Duration</TableHead>
                <TableHead>Result</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell>
                    <div>{format(log.startTime, 'MMM d, yyyy')}</div>
                    <div className="text-sm text-muted-foreground">
                      {format(log.startTime, 'h:mm a')}
                    </div>
                  </TableCell>
                  <TableCell>{getDirectionBadge(log.direction)}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {log.scope.slice(0, 2).map((s) => (
                        <Badge key={s} variant="secondary" className="font-mono text-xs">
                          {s}
                        </Badge>
                      ))}
                      {log.scope.length > 2 && (
                        <Badge variant="secondary" className="text-xs">
                          +{log.scope.length - 2}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{log.userName}</TableCell>
                  <TableCell className="text-center">
                    <span className="text-green-500">{log.itemsProcessed}</span>
                    {log.itemsFailed > 0 && (
                      <>
                        {' / '}
                        <span className="text-destructive">{log.itemsFailed} failed</span>
                      </>
                    )}
                  </TableCell>
                  <TableCell className="text-center text-muted-foreground">
                    {getDuration(log)}
                  </TableCell>
                  <TableCell>{getResultBadge(log.result)}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => setSelectedLog(log)}>
                      <Eye className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredLogs.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No sync logs found matching your filters
            </div>
          )}
        </CardContent>
      </Card>

      {/* Log Detail Modal */}
      <Dialog open={!!selectedLog} onOpenChange={() => setSelectedLog(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              Sync Log Details
              {selectedLog && getResultBadge(selectedLog.result)}
            </DialogTitle>
            <DialogDescription>
              {selectedLog && format(selectedLog.startTime, 'MMMM d, yyyy h:mm:ss a')}
            </DialogDescription>
          </DialogHeader>
          {selectedLog && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">Direction</div>
                  <div>{getDirectionBadge(selectedLog.direction)}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">Duration</div>
                  <div>{getDuration(selectedLog)}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">Initiated By</div>
                  <div>{selectedLog.userName}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">Items Processed</div>
                  <div>
                    {selectedLog.itemsProcessed} success, {selectedLog.itemsFailed} failed
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <div className="text-sm text-muted-foreground">Project Scope</div>
                <div className="flex flex-wrap gap-1">
                  {selectedLog.scope.map((s) => (
                    <Badge key={s} variant="secondary" className="font-mono">
                      {s}
                    </Badge>
                  ))}
                </div>
              </div>

              {selectedLog.errorSummary && (
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">Error Summary</div>
                  <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive">
                    {selectedLog.errorSummary}
                  </div>
                </div>
              )}

              {selectedLog.details && (
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">Details</div>
                  <div className="p-3 bg-muted rounded-lg text-sm font-mono whitespace-pre-wrap">
                    {selectedLog.details}
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setSelectedLog(null)}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VetroLogs;
