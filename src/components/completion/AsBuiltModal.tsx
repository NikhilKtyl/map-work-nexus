import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { FileText, Loader2 } from 'lucide-react';
import { Project, mockUnitTypes } from '@/data/mockData';

interface AsBuiltModalProps {
  open: boolean;
  onClose: () => void;
  project: Project | null;
  onGenerate: (config: AsBuiltConfig) => void;
}

export interface AsBuiltConfig {
  projectId: string;
  layers: {
    base: boolean;
    design: boolean;
    reference: boolean;
    asBuilt: boolean;
  };
  unitTypes: string[];
  includeSequentials: boolean;
  includePhotos: boolean;
  photosAsAppendix: boolean;
  headerInfo: {
    projectName: string;
    customer: string;
    dateRange: string;
    contact: string;
  };
}

const AsBuiltModal: React.FC<AsBuiltModalProps> = ({
  open,
  onClose,
  project,
  onGenerate,
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [config, setConfig] = useState<AsBuiltConfig>({
    projectId: project?.id || '',
    layers: {
      base: true,
      design: true,
      reference: false,
      asBuilt: true,
    },
    unitTypes: mockUnitTypes.map((ut) => ut.id),
    includeSequentials: true,
    includePhotos: true,
    photosAsAppendix: true,
    headerInfo: {
      projectName: project?.name || '',
      customer: project?.customer || '',
      dateRange: '',
      contact: '',
    },
  });

  React.useEffect(() => {
    if (project) {
      setConfig((prev) => ({
        ...prev,
        projectId: project.id,
        headerInfo: {
          ...prev.headerInfo,
          projectName: project.name,
          customer: project.customer,
        },
      }));
    }
  }, [project]);

  const handleGenerate = async () => {
    setIsGenerating(true);
    // Simulate PDF generation
    await new Promise((resolve) => setTimeout(resolve, 2000));
    onGenerate(config);
    setIsGenerating(false);
    onClose();
  };

  const toggleUnitType = (utId: string) => {
    setConfig((prev) => ({
      ...prev,
      unitTypes: prev.unitTypes.includes(utId)
        ? prev.unitTypes.filter((id) => id !== utId)
        : [...prev.unitTypes, utId],
    }));
  };

  const toggleLayer = (layer: keyof typeof config.layers) => {
    setConfig((prev) => ({
      ...prev,
      layers: { ...prev.layers, [layer]: !prev.layers[layer] },
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Generate As-Built PDF
          </DialogTitle>
          <DialogDescription>
            Configure the as-built document for {project?.name}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Map Layers */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Map Layers to Include</Label>
            <div className="space-y-2">
              {[
                { key: 'base', label: 'Base Map' },
                { key: 'design', label: 'Design Layer' },
                { key: 'reference', label: 'Reference Layer' },
                { key: 'asBuilt', label: 'As-Built Layer' },
              ].map((layer) => (
                <div key={layer.key} className="flex items-center gap-2">
                  <Checkbox
                    id={layer.key}
                    checked={config.layers[layer.key as keyof typeof config.layers]}
                    onCheckedChange={() => toggleLayer(layer.key as keyof typeof config.layers)}
                  />
                  <Label htmlFor={layer.key} className="text-sm font-normal">
                    {layer.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Unit Types */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Unit Types to Include</Label>
              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  setConfig((prev) => ({
                    ...prev,
                    unitTypes:
                      prev.unitTypes.length === mockUnitTypes.length
                        ? []
                        : mockUnitTypes.map((ut) => ut.id),
                  }))
                }
              >
                {config.unitTypes.length === mockUnitTypes.length ? 'Deselect All' : 'Select All'}
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {mockUnitTypes.map((ut) => (
                <div key={ut.id} className="flex items-center gap-2">
                  <Checkbox
                    id={ut.id}
                    checked={config.unitTypes.includes(ut.id)}
                    onCheckedChange={() => toggleUnitType(ut.id)}
                  />
                  <Label htmlFor={ut.id} className="text-sm font-normal truncate">
                    {ut.name}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Include Options */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Additional Content</Label>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="sequentials"
                  checked={config.includeSequentials}
                  onCheckedChange={(checked) =>
                    setConfig((prev) => ({ ...prev, includeSequentials: !!checked }))
                  }
                />
                <Label htmlFor="sequentials" className="text-sm font-normal">
                  Include sequentials overlay on map
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="photos"
                  checked={config.includePhotos}
                  onCheckedChange={(checked) =>
                    setConfig((prev) => ({ ...prev, includePhotos: !!checked }))
                  }
                />
                <Label htmlFor="photos" className="text-sm font-normal">
                  Include sample photos
                </Label>
              </div>
              {config.includePhotos && (
                <div className="flex items-center gap-2 ml-6">
                  <Checkbox
                    id="appendix"
                    checked={config.photosAsAppendix}
                    onCheckedChange={(checked) =>
                      setConfig((prev) => ({ ...prev, photosAsAppendix: !!checked }))
                    }
                  />
                  <Label htmlFor="appendix" className="text-sm font-normal">
                    Photos as separate appendix
                  </Label>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Header Info */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Header Information</Label>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="projectName" className="text-xs text-muted-foreground">
                  Project Name
                </Label>
                <Input
                  id="projectName"
                  value={config.headerInfo.projectName}
                  onChange={(e) =>
                    setConfig((prev) => ({
                      ...prev,
                      headerInfo: { ...prev.headerInfo, projectName: e.target.value },
                    }))
                  }
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="customer" className="text-xs text-muted-foreground">
                  Customer
                </Label>
                <Input
                  id="customer"
                  value={config.headerInfo.customer}
                  onChange={(e) =>
                    setConfig((prev) => ({
                      ...prev,
                      headerInfo: { ...prev.headerInfo, customer: e.target.value },
                    }))
                  }
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="dateRange" className="text-xs text-muted-foreground">
                  Date Range
                </Label>
                <Input
                  id="dateRange"
                  value={config.headerInfo.dateRange}
                  onChange={(e) =>
                    setConfig((prev) => ({
                      ...prev,
                      headerInfo: { ...prev.headerInfo, dateRange: e.target.value },
                    }))
                  }
                  placeholder="e.g., Jan - Jun 2024"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="contact" className="text-xs text-muted-foreground">
                  Contact
                </Label>
                <Input
                  id="contact"
                  value={config.headerInfo.contact}
                  onChange={(e) =>
                    setConfig((prev) => ({
                      ...prev,
                      headerInfo: { ...prev.headerInfo, contact: e.target.value },
                    }))
                  }
                  placeholder="Name or email"
                />
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleGenerate} disabled={isGenerating}>
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <FileText className="w-4 h-4 mr-2" />
                Generate PDF
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AsBuiltModal;
