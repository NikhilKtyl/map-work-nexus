import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Settings, Key, Link2, Clock, Plus, Pencil, Trash2, Check, X, RefreshCw, Shield } from 'lucide-react';
import { defaultVetroConfig, VetroMappingRule } from '@/data/vetroData';
import { format } from 'date-fns';

const VetroSettings: React.FC = () => {
  const [config, setConfig] = useState(defaultVetroConfig);
  const [showApiKey, setShowApiKey] = useState(false);
  const [editingRule, setEditingRule] = useState<VetroMappingRule | null>(null);
  const [isAddingRule, setIsAddingRule] = useState(false);
  const [newRule, setNewRule] = useState<Partial<VetroMappingRule>>({
    vetroProjectPrefix: '',
    berryTechProjectPrefix: '',
    region: '',
    active: true,
  });
  const [isTesting, setIsTesting] = useState(false);

  const handleTestConnection = async () => {
    setIsTesting(true);
    // Simulate API test
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsTesting(false);
    toast.success('Connection successful', {
      description: 'Successfully connected to VETRO API',
    });
  };

  const handleSaveConfig = () => {
    toast.success('Configuration saved', {
      description: 'VETRO settings have been updated',
    });
  };

  const handleAddRule = () => {
    if (!newRule.vetroProjectPrefix || !newRule.berryTechProjectPrefix) {
      toast.error('Please fill in required fields');
      return;
    }
    const rule: VetroMappingRule = {
      id: `rule-${Date.now()}`,
      vetroProjectPrefix: newRule.vetroProjectPrefix,
      berryTechProjectPrefix: newRule.berryTechProjectPrefix,
      region: newRule.region,
      active: newRule.active ?? true,
    };
    setConfig((prev) => ({
      ...prev,
      projectMappingRules: [...prev.projectMappingRules, rule],
    }));
    setNewRule({ vetroProjectPrefix: '', berryTechProjectPrefix: '', region: '', active: true });
    setIsAddingRule(false);
    toast.success('Mapping rule added');
  };

  const handleDeleteRule = (ruleId: string) => {
    setConfig((prev) => ({
      ...prev,
      projectMappingRules: prev.projectMappingRules.filter((r) => r.id !== ruleId),
    }));
    toast.success('Mapping rule deleted');
  };

  const handleToggleRule = (ruleId: string) => {
    setConfig((prev) => ({
      ...prev,
      projectMappingRules: prev.projectMappingRules.map((r) =>
        r.id === ruleId ? { ...r, active: !r.active } : r
      ),
    }));
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Settings className="w-6 h-6" />
            VETRO Configuration
          </h1>
          <p className="text-muted-foreground mt-1">
            Configure VETRO API connection and synchronization settings
          </p>
        </div>
        <Button onClick={handleSaveConfig}>
          <Check className="w-4 h-4 mr-2" />
          Save Changes
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* API Connection - Disabled without backend */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="w-5 h-5" />
              API Connection
            </CardTitle>
            <CardDescription>VETRO API credentials and endpoint configuration</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Security Warning */}
            <div className="p-4 rounded-lg bg-warning/10 border border-warning/30">
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-warning mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-warning">Backend Required</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    API key management requires a backend service to securely store and proxy credentials. 
                    Enable Lovable Cloud to configure VETRO integration securely.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-2 opacity-50">
              <Label htmlFor="apiBaseUrl">API Base URL</Label>
              <Input
                id="apiBaseUrl"
                value={config.apiBaseUrl}
                disabled
                placeholder="https://api.vetro.io/v2"
              />
            </div>

            <div className="space-y-2 opacity-50">
              <Label htmlFor="apiKey">API Key</Label>
              <div className="flex gap-2">
                <Input
                  id="apiKey"
                  type="password"
                  value="••••••••••••••••"
                  disabled
                  placeholder="Requires backend integration"
                />
                <Button variant="outline" size="icon" disabled>
                  <Shield className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                API keys cannot be stored client-side for security reasons.
              </p>
            </div>

            <div className="flex items-center justify-between opacity-50">
              <div className="space-y-0.5">
                <Label>OAuth Authentication</Label>
                <p className="text-sm text-muted-foreground">Use OAuth instead of API key</p>
              </div>
              <Switch
                checked={config.oauthEnabled}
                disabled
              />
            </div>

            <Button variant="outline" className="w-full" disabled>
              <Link2 className="w-4 h-4 mr-2" />
              Test Connection (Requires Backend)
            </Button>
          </CardContent>
        </Card>

        {/* Sync Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Sync Settings
            </CardTitle>
            <CardDescription>Configure synchronization behavior</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Default Sync Mode</Label>
              <Select
                value={config.defaultSyncMode}
                onValueChange={(value: 'manual' | 'scheduled') =>
                  setConfig((prev) => ({ ...prev, defaultSyncMode: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="manual">Manual</SelectItem>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {config.defaultSyncMode === 'scheduled' && (
              <div className="space-y-2">
                <Label>Sync Interval (hours)</Label>
                <Select
                  value={String(config.scheduledInterval || 24)}
                  onValueChange={(value) =>
                    setConfig((prev) => ({ ...prev, scheduledInterval: parseInt(value) }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Every hour</SelectItem>
                    <SelectItem value="6">Every 6 hours</SelectItem>
                    <SelectItem value="12">Every 12 hours</SelectItem>
                    <SelectItem value="24">Every 24 hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="pt-4 border-t space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Last Updated</span>
                <span>{format(config.lastUpdated, 'MMM d, yyyy h:mm a')}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Updated By</span>
                <span>{config.updatedBy}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Project Mapping Rules */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Project Mapping Rules</CardTitle>
              <CardDescription>
                Define how VETRO project codes map to BerryTech project codes
              </CardDescription>
            </div>
            <Dialog open={isAddingRule} onOpenChange={setIsAddingRule}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Rule
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Mapping Rule</DialogTitle>
                  <DialogDescription>Create a new project code mapping rule</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>VETRO Project Prefix</Label>
                    <Input
                      value={newRule.vetroProjectPrefix}
                      onChange={(e) => setNewRule((prev) => ({ ...prev, vetroProjectPrefix: e.target.value }))}
                      placeholder="e.g., DFE-"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>BerryTech Project Prefix</Label>
                    <Input
                      value={newRule.berryTechProjectPrefix}
                      onChange={(e) => setNewRule((prev) => ({ ...prev, berryTechProjectPrefix: e.target.value }))}
                      placeholder="e.g., PRJ-"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Region (optional)</Label>
                    <Input
                      value={newRule.region}
                      onChange={(e) => setNewRule((prev) => ({ ...prev, region: e.target.value }))}
                      placeholder="e.g., Metro East"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddingRule(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddRule}>Add Rule</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>VETRO Prefix</TableHead>
                <TableHead>BerryTech Prefix</TableHead>
                <TableHead>Region</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {config.projectMappingRules.map((rule) => (
                <TableRow key={rule.id}>
                  <TableCell className="font-mono">{rule.vetroProjectPrefix}</TableCell>
                  <TableCell className="font-mono">{rule.berryTechProjectPrefix}</TableCell>
                  <TableCell>{rule.region || '—'}</TableCell>
                  <TableCell>
                    <Badge variant={rule.active ? 'default' : 'secondary'}>
                      {rule.active ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleToggleRule(rule.id)}
                      >
                        {rule.active ? <X className="w-4 h-4" /> : <Check className="w-4 h-4" />}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteRule(rule.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default VetroSettings;
