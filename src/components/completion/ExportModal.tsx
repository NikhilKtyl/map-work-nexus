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
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { FileSpreadsheet, Loader2 } from 'lucide-react';
import { Project } from '@/data/mockData';

interface ExportModalProps {
  open: boolean;
  onClose: () => void;
  project: Project | null;
  onExport: (config: ExportConfig) => void;
}

export interface ExportConfig {
  projectId: string;
  exportType: 'ce_upload' | 'unit_csv';
  includeFields: {
    unitId: boolean;
    project: boolean;
    customer: boolean;
    unitType: boolean;
    quantity: boolean;
    price: boolean;
    subRate: boolean;
    status: boolean;
    completionDate: boolean;
  };
  onlyVerified: boolean;
}

const ExportModal: React.FC<ExportModalProps> = ({
  open,
  onClose,
  project,
  onExport,
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const [config, setConfig] = useState<ExportConfig>({
    projectId: project?.id || '',
    exportType: 'ce_upload',
    includeFields: {
      unitId: true,
      project: true,
      customer: true,
      unitType: true,
      quantity: true,
      price: true,
      subRate: true,
      status: true,
      completionDate: true,
    },
    onlyVerified: true,
  });

  React.useEffect(() => {
    if (project) {
      setConfig((prev) => ({ ...prev, projectId: project.id }));
    }
  }, [project]);

  const handleExport = async () => {
    setIsExporting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    onExport(config);
    setIsExporting(false);
    onClose();
  };

  const toggleField = (field: keyof typeof config.includeFields) => {
    setConfig((prev) => ({
      ...prev,
      includeFields: {
        ...prev.includeFields,
        [field]: !prev.includeFields[field],
      },
    }));
  };

  const fieldLabels: Record<keyof typeof config.includeFields, string> = {
    unitId: 'Unit ID',
    project: 'Project',
    customer: 'Customer',
    unitType: 'Unit Type',
    quantity: 'Quantity/Length',
    price: 'Price',
    subRate: 'Sub-rate',
    status: 'Status',
    completionDate: 'Completion Date',
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5" />
            Export Data
          </DialogTitle>
          <DialogDescription>
            Export unit data for {project?.name}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Export Type */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Export Type</Label>
            <RadioGroup
              value={config.exportType}
              onValueChange={(value: 'ce_upload' | 'unit_csv') =>
                setConfig((prev) => ({ ...prev, exportType: value }))
              }
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="ce_upload" id="ce_upload" />
                <Label htmlFor="ce_upload" className="text-sm font-normal">
                  CE Upload File (formatted for ERP)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="unit_csv" id="unit_csv" />
                <Label htmlFor="unit_csv" className="text-sm font-normal">
                  Unit Completion CSV
                </Label>
              </div>
            </RadioGroup>
          </div>

          <Separator />

          {/* Include Fields */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Fields to Include</Label>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  const allSelected = Object.values(config.includeFields).every(Boolean);
                  setConfig((prev) => ({
                    ...prev,
                    includeFields: Object.keys(prev.includeFields).reduce(
                      (acc, key) => ({ ...acc, [key]: !allSelected }),
                      {} as typeof config.includeFields
                    ),
                  }));
                }}
              >
                Toggle All
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {(Object.keys(config.includeFields) as Array<keyof typeof config.includeFields>).map(
                (field) => (
                  <div key={field} className="flex items-center gap-2">
                    <Checkbox
                      id={field}
                      checked={config.includeFields[field]}
                      onCheckedChange={() => toggleField(field)}
                    />
                    <Label htmlFor={field} className="text-sm font-normal">
                      {fieldLabels[field]}
                    </Label>
                  </div>
                )
              )}
            </div>
          </div>

          <Separator />

          {/* Filters */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Filters</Label>
            <div className="flex items-center gap-2">
              <Checkbox
                id="verified"
                checked={config.onlyVerified}
                onCheckedChange={(checked) =>
                  setConfig((prev) => ({ ...prev, onlyVerified: !!checked }))
                }
              />
              <Label htmlFor="verified" className="text-sm font-normal">
                Only include verified units
              </Label>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleExport} disabled={isExporting}>
            {isExporting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Exporting...
              </>
            ) : (
              <>
                <FileSpreadsheet className="w-4 h-4 mr-2" />
                Generate Export
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ExportModal;
