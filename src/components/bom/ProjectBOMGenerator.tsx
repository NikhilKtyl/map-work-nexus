import React, { useState, useMemo } from 'react';
import { mockBOMTemplates, mockProjectBOMs, BOMTemplate, ProjectBOMLine } from '@/data/bomData';
import { mockProjects, mockUnits, mockUnitTypes } from '@/data/mockData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Calculator,
  Package,
  Wrench,
  Truck,
  FileSpreadsheet,
  Check,
  Edit2,
  RefreshCw,
  Download,
  Info,
  Sparkles,
} from 'lucide-react';
import { format } from 'date-fns';
import { toast } from '@/hooks/use-toast';

interface ProjectBOMGeneratorProps {
  projectId: string;
  onClose?: () => void;
}

const ProjectBOMGenerator: React.FC<ProjectBOMGeneratorProps> = ({ projectId, onClose }) => {
  const [activeTab, setActiveTab] = useState('generate');
  const [selectedSoilType, setSelectedSoilType] = useState<string>('soft');
  const [generatedLines, setGeneratedLines] = useState<ProjectBOMLine[]>([]);
  const [editedQtys, setEditedQtys] = useState<Record<string, number>>({});
  const [isGenerating, setIsGenerating] = useState(false);

  const project = mockProjects.find((p) => p.id === projectId);
  const projectUnits = mockUnits.filter((u) => u.projectId === projectId);
  const existingBOM = mockProjectBOMs.find((b) => b.projectId === projectId);

  // Group units by type with totals
  const unitsByType = useMemo(() => {
    const grouped: Record<string, { type: typeof mockUnitTypes[0]; totalLength: number; count: number }> = {};
    
    projectUnits.forEach((unit) => {
      const unitType = mockUnitTypes.find((ut) => ut.id === unit.unitTypeId);
      if (!unitType) return;
      
      if (!grouped[unitType.id]) {
        grouped[unitType.id] = { type: unitType, totalLength: 0, count: 0 };
      }
      grouped[unitType.id].count += 1;
      grouped[unitType.id].totalLength += unit.length || 1;
    });
    
    return Object.values(grouped);
  }, [projectUnits]);

  const handleGenerate = () => {
    setIsGenerating(true);
    
    // Simulate generation delay
    setTimeout(() => {
      const lines: ProjectBOMLine[] = [];
      let lineId = 1;

      unitsByType.forEach(({ type, totalLength, count }) => {
        // Find best matching template
        const templates = mockBOMTemplates.filter((t) => 
          t.appliesToUnitTypeIds.includes(type.id) && t.isActive
        );
        
        // Pick template based on conditions (simplified: prefer matching soil type)
        let template = templates.find((t) => t.conditions.soilType === selectedSoilType);
        if (!template) template = templates[0];
        if (!template) return;

        template.lines.forEach((bomLine) => {
          let qty = 0;
          if (bomLine.quantityFormula === 'per_foot') {
            qty = totalLength * bomLine.quantityMultiplier;
          } else if (bomLine.quantityFormula === 'per_unit') {
            qty = count * bomLine.quantityMultiplier;
          } else {
            qty = bomLine.quantityMultiplier;
          }
          qty = Math.ceil(qty);

          lines.push({
            id: `gen-${lineId++}`,
            bomTemplateId: template!.id,
            itemCode: bomLine.itemCode,
            description: bomLine.description,
            uom: bomLine.uom,
            category: bomLine.category,
            suggestedQty: qty,
            unitCost: bomLine.unitCost,
            totalCost: qty * bomLine.unitCost,
            sourceUnitTypeIds: [type.id],
          });
        });
      });

      // Consolidate duplicate items
      const consolidated: Record<string, ProjectBOMLine> = {};
      lines.forEach((line) => {
        if (consolidated[line.itemCode]) {
          consolidated[line.itemCode].suggestedQty += line.suggestedQty;
          consolidated[line.itemCode].totalCost = consolidated[line.itemCode].suggestedQty * line.unitCost;
          if (!consolidated[line.itemCode].sourceUnitTypeIds.includes(line.sourceUnitTypeIds[0])) {
            consolidated[line.itemCode].sourceUnitTypeIds.push(...line.sourceUnitTypeIds);
          }
        } else {
          consolidated[line.itemCode] = { ...line };
        }
      });

      setGeneratedLines(Object.values(consolidated));
      setIsGenerating(false);
      setActiveTab('review');
      
      toast({
        title: 'BOM Generated',
        description: `${Object.values(consolidated).length} line items generated from ${unitsByType.length} unit types.`,
      });
    }, 800);
  };

  const handleQtyChange = (lineId: string, qty: number) => {
    setEditedQtys((prev) => ({ ...prev, [lineId]: qty }));
  };

  const handleApprove = () => {
    toast({
      title: 'BOM Approved',
      description: 'BOM v1 has been saved and approved for this project.',
    });
    onClose?.();
  };

  const handleExport = () => {
    toast({
      title: 'Export Started',
      description: 'BOM export is being generated...',
    });
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'material':
        return <Package className="h-4 w-4" />;
      case 'labor':
        return <Wrench className="h-4 w-4" />;
      case 'equipment':
        return <Truck className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case 'material':
        return <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">Material</Badge>;
      case 'labor':
        return <Badge variant="outline" className="bg-secondary/10 text-secondary border-secondary/20">Labor</Badge>;
      case 'equipment':
        return <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20">Equipment</Badge>;
      default:
        return <Badge variant="outline">{category}</Badge>;
    }
  };

  const displayLines = generatedLines.length > 0 ? generatedLines : existingBOM?.lines || [];
  
  const totalCost = displayLines.reduce((sum, line) => {
    const qty = editedQtys[line.id] ?? line.editedQty ?? line.suggestedQty;
    return sum + qty * line.unitCost;
  }, 0);

  const categoryCosts = useMemo(() => {
    const costs = { material: 0, labor: 0, equipment: 0 };
    displayLines.forEach((line) => {
      const qty = editedQtys[line.id] ?? line.editedQty ?? line.suggestedQty;
      costs[line.category] += qty * line.unitCost;
    });
    return costs;
  }, [displayLines, editedQtys]);

  if (!project) return null;

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="generate">Generate BOM</TabsTrigger>
          <TabsTrigger value="review" disabled={displayLines.length === 0}>
            Review & Edit
          </TabsTrigger>
          {existingBOM && <TabsTrigger value="history">History</TabsTrigger>}
        </TabsList>

        {/* Generate Tab */}
        <TabsContent value="generate" className="mt-6 space-y-6">
          {/* Project Units Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Project Units Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 md:grid-cols-3">
                {unitsByType.map(({ type, totalLength, count }) => (
                  <div key={type.id} className="flex items-center justify-between rounded-lg border p-3">
                    <div>
                      <p className="font-medium text-sm">{type.name}</p>
                      <p className="text-xs text-muted-foreground">{type.code}</p>
                    </div>
                    <Badge variant="outline">
                      {type.category === 'Line' ? `${totalLength.toLocaleString()} ft` : `${count} ea`}
                    </Badge>
                  </div>
                ))}
              </div>
              {unitsByType.length === 0 && (
                <p className="text-muted-foreground text-center py-4">No units in this project yet</p>
              )}
            </CardContent>
          </Card>

          {/* Generation Options */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Generation Options</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label>Soil Condition</Label>
                  <Select value={selectedSoilType} onValueChange={setSelectedSoilType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="soft">Soft Soil</SelectItem>
                      <SelectItem value="mixed">Mixed Soil</SelectItem>
                      <SelectItem value="rock">Rock</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-lg border border-border bg-muted/50 p-4">
                <Info className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium">How BOM Generation Works</p>
                  <p className="text-muted-foreground">
                    The system matches each unit type to the best available BOM template based on conditions 
                    (soil type, surface, region). Quantities are calculated using template formulas and 
                    consolidated across all units.
                  </p>
                </div>
              </div>

              <Button 
                onClick={handleGenerate} 
                disabled={unitsByType.length === 0 || isGenerating}
                className="w-full"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate BOM
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Review Tab */}
        <TabsContent value="review" className="mt-6 space-y-6">
          {/* Cost Summary */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Package className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-lg font-bold">${categoryCosts.material.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                    <p className="text-sm text-muted-foreground">Materials</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary/10">
                    <Wrench className="h-5 w-5 text-secondary" />
                  </div>
                  <div>
                    <p className="text-lg font-bold">${categoryCosts.labor.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                    <p className="text-sm text-muted-foreground">Labor</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning/10">
                    <Truck className="h-5 w-5 text-warning" />
                  </div>
                  <div>
                    <p className="text-lg font-bold">${categoryCosts.equipment.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                    <p className="text-sm text-muted-foreground">Equipment</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Calculator className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-lg font-bold">${totalCost.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                    <p className="text-sm text-muted-foreground">Total BOM</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* BOM Table */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>BOM Line Items</CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleExport}>
                  <Download className="mr-1 h-4 w-4" />
                  Export CSV
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item Code</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead className="text-right">Suggested</TableHead>
                    <TableHead className="text-right w-28">Qty</TableHead>
                    <TableHead className="text-right">Unit Cost</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {displayLines.map((line) => {
                    const currentQty = editedQtys[line.id] ?? line.editedQty ?? line.suggestedQty;
                    const isEdited = editedQtys[line.id] !== undefined || line.editedQty !== undefined;
                    
                    return (
                      <TableRow key={line.id}>
                        <TableCell className="font-mono text-sm">{line.itemCode}</TableCell>
                        <TableCell>{line.description}</TableCell>
                        <TableCell>{getCategoryBadge(line.category)}</TableCell>
                        <TableCell className="text-right text-muted-foreground">
                          {line.suggestedQty} {line.uom}
                        </TableCell>
                        <TableCell className="text-right">
                          <Input
                            type="number"
                            value={currentQty}
                            onChange={(e) => handleQtyChange(line.id, Number(e.target.value))}
                            className={`w-20 text-right ${isEdited ? 'border-primary' : ''}`}
                          />
                        </TableCell>
                        <TableCell className="text-right">${line.unitCost.toFixed(2)}</TableCell>
                        <TableCell className="text-right font-medium">
                          ${(currentQty * line.unitCost).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TableCell colSpan={6} className="text-right font-semibold">
                      Total
                    </TableCell>
                    <TableCell className="text-right font-bold text-lg">
                      ${totalCost.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </TableCell>
                  </TableRow>
                </TableFooter>
              </Table>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setActiveTab('generate')}>
              <RefreshCw className="mr-1 h-4 w-4" />
              Regenerate
            </Button>
            <Button onClick={handleApprove}>
              <Check className="mr-1 h-4 w-4" />
              Approve BOM v1
            </Button>
          </div>
        </TabsContent>

        {/* History Tab */}
        {existingBOM && (
          <TabsContent value="history" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>BOM Versions</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Version</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Generated</TableHead>
                      <TableHead>Approved</TableHead>
                      <TableHead>Notes</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>v{existingBOM.version}</TableCell>
                      <TableCell>
                        <Badge className="bg-secondary/10 text-secondary border-secondary/20">
                          {existingBOM.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{format(new Date(existingBOM.generatedAt), 'MMM d, yyyy')}</TableCell>
                      <TableCell>
                        {existingBOM.approvedAt
                          ? format(new Date(existingBOM.approvedAt), 'MMM d, yyyy')
                          : '—'}
                      </TableCell>
                      <TableCell className="text-muted-foreground">{existingBOM.notes || '—'}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default ProjectBOMGenerator;
