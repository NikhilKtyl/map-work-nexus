import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { MapSource, Unit, UnitType, mockUnitTypes } from '@/data/mockData';
import {
  Map,
  Layers,
  MousePointer2,
  Minus,
  Circle,
  MapPin,
  Eye,
  EyeOff,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Satellite,
  MapIcon,
  X,
  Pencil,
} from 'lucide-react';

interface ProjectMapViewProps {
  mapSources: MapSource[];
  units: Unit[];
  onCreateUnit: (geometryType: 'Line' | 'Marker') => void;
  onSelectUnit: (unit: Unit) => void;
}

type DrawingTool = 'select' | 'line' | 'marker' | null;
type BaseMapStyle = 'satellite' | 'streets';

const ProjectMapView: React.FC<ProjectMapViewProps> = ({
  mapSources,
  units,
  onCreateUnit,
  onSelectUnit,
}) => {
  const [activeTool, setActiveTool] = useState<DrawingTool>('select');
  const [baseMapStyle, setBaseMapStyle] = useState<BaseMapStyle>('satellite');
  const [layerVisibility, setLayerVisibility] = useState<Record<string, boolean>>(
    mapSources.reduce((acc, src) => ({ ...acc, [src.id]: true }), {})
  );
  const [showUnits, setShowUnits] = useState(true);
  const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null);

  const toggleLayer = (id: string) => {
    setLayerVisibility((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleUnitClick = (unit: Unit) => {
    setSelectedUnit(unit);
    onSelectUnit(unit);
  };

  const getUnitType = (unitTypeId: string): UnitType | undefined => {
    return mockUnitTypes.find((ut) => ut.id === unitTypeId);
  };

  const statusColors: Record<string, string> = {
    not_started: 'bg-muted-foreground',
    in_progress: 'bg-warning',
    completed: 'bg-success',
    needs_verification: 'bg-secondary',
    verified: 'bg-primary',
  };

  return (
    <div className="flex h-[calc(100vh-280px)] min-h-[500px] rounded-lg overflow-hidden border border-border bg-card">
      {/* Left Panel - Layers */}
      <div className="w-64 border-r border-border bg-muted/30 flex flex-col">
        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-2 mb-1">
            <Layers className="w-4 h-4 text-primary" />
            <h3 className="font-semibold text-card-foreground">Layers</h3>
          </div>
          <p className="text-xs text-muted-foreground">Toggle map layers visibility</p>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-4 space-y-4">
            {/* Base Map Toggle */}
            <div>
              <Label className="text-xs text-muted-foreground uppercase tracking-wide mb-2 block">
                Base Map
              </Label>
              <div className="flex gap-2">
                <Button
                  variant={baseMapStyle === 'satellite' ? 'default' : 'outline'}
                  size="sm"
                  className="flex-1"
                  onClick={() => setBaseMapStyle('satellite')}
                >
                  <Satellite className="w-3 h-3 mr-1" />
                  Satellite
                </Button>
                <Button
                  variant={baseMapStyle === 'streets' ? 'default' : 'outline'}
                  size="sm"
                  className="flex-1"
                  onClick={() => setBaseMapStyle('streets')}
                >
                  <MapIcon className="w-3 h-3 mr-1" />
                  Streets
                </Button>
              </div>
            </div>

            <Separator />

            {/* Map Sources */}
            <div>
              <Label className="text-xs text-muted-foreground uppercase tracking-wide mb-2 block">
                Uploaded Layers
              </Label>
              <div className="space-y-2">
                {mapSources.map((source) => (
                  <div
                    key={source.id}
                    className="flex items-center justify-between p-2 rounded-md bg-card border border-border"
                  >
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <Switch
                        checked={layerVisibility[source.id]}
                        onCheckedChange={() => toggleLayer(source.id)}
                        className="scale-75"
                      />
                      <div className="truncate">
                        <p className="text-sm font-medium text-card-foreground truncate">
                          {source.name}
                        </p>
                        <p className="text-xs text-muted-foreground">{source.layerCategory}</p>
                      </div>
                    </div>
                  </div>
                ))}
                {mapSources.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No layers uploaded
                  </p>
                )}
              </div>
            </div>

            <Separator />

            {/* Units Layer */}
            <div>
              <Label className="text-xs text-muted-foreground uppercase tracking-wide mb-2 block">
                Data Layers
              </Label>
              <div className="flex items-center justify-between p-2 rounded-md bg-card border border-border">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={showUnits}
                    onCheckedChange={setShowUnits}
                    className="scale-75"
                  />
                  <div>
                    <p className="text-sm font-medium text-card-foreground">Units</p>
                    <p className="text-xs text-muted-foreground">{units.length} items</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
      </div>

      {/* Main Map Canvas */}
      <div className="flex-1 relative">
        {/* Map Placeholder */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-green-100 flex items-center justify-center">
          <div className="text-center">
            <Map className="w-24 h-24 text-primary/30 mx-auto mb-4" />
            <p className="text-muted-foreground font-medium mb-2">Interactive Map View</p>
            <p className="text-sm text-muted-foreground max-w-xs">
              Connect Mapbox to enable the interactive map with drawing tools
            </p>
          </div>

          {/* Mock Units on Map */}
          {showUnits && units.slice(0, 5).map((unit, i) => (
            <div
              key={unit.id}
              className={`absolute cursor-pointer transition-transform hover:scale-110 ${
                selectedUnit?.id === unit.id ? 'scale-125 z-10' : ''
              }`}
              style={{
                left: `${20 + i * 15}%`,
                top: `${30 + (i % 3) * 20}%`,
              }}
              onClick={() => handleUnitClick(unit)}
            >
              {unit.geometryType === 'Marker' ? (
                <div className={`w-6 h-6 rounded-full ${statusColors[unit.status]} border-2 border-white shadow-lg flex items-center justify-center`}>
                  <MapPin className="w-3 h-3 text-white" />
                </div>
              ) : (
                <div className={`w-8 h-2 rounded ${statusColors[unit.status]} border border-white shadow-lg`} />
              )}
            </div>
          ))}
        </div>

        {/* Drawing Toolbar */}
        <div className="absolute top-4 left-4 bg-card rounded-lg shadow-lg border border-border p-2 space-y-1">
          <Button
            variant={activeTool === 'select' ? 'secondary' : 'ghost'}
            size="icon"
            className="w-9 h-9"
            onClick={() => setActiveTool('select')}
            title="Select"
          >
            <MousePointer2 className="w-4 h-4" />
          </Button>
          <Button
            variant={activeTool === 'line' ? 'secondary' : 'ghost'}
            size="icon"
            className="w-9 h-9"
            onClick={() => {
              setActiveTool('line');
              onCreateUnit('Line');
            }}
            title="Draw Line"
          >
            <Minus className="w-4 h-4" />
          </Button>
          <Button
            variant={activeTool === 'marker' ? 'secondary' : 'ghost'}
            size="icon"
            className="w-9 h-9"
            onClick={() => {
              setActiveTool('marker');
              onCreateUnit('Marker');
            }}
            title="Draw Marker"
          >
            <Circle className="w-4 h-4" />
          </Button>
        </div>

        {/* Zoom Controls */}
        <div className="absolute top-4 right-4 bg-card rounded-lg shadow-lg border border-border p-1 space-y-1">
          <Button variant="ghost" size="icon" className="w-8 h-8">
            <ZoomIn className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" className="w-8 h-8">
            <ZoomOut className="w-4 h-4" />
          </Button>
          <Separator className="my-1" />
          <Button variant="ghost" size="icon" className="w-8 h-8">
            <Maximize2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Right Panel - Context/Details */}
      {selectedUnit && (
        <div className="w-80 border-l border-border bg-muted/30 flex flex-col">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <h3 className="font-semibold text-card-foreground">Unit Details</h3>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setSelectedUnit(null)}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          <ScrollArea className="flex-1">
            <div className="p-4 space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Unit Code</p>
                <p className="font-medium text-card-foreground">{selectedUnit.code}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Type</p>
                <p className="font-medium text-card-foreground">
                  {getUnitType(selectedUnit.unitTypeId)?.name || 'Unknown'}
                </p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <Badge className={`${statusColors[selectedUnit.status]} text-white text-xs capitalize`}>
                  {selectedUnit.status.replace('_', ' ')}
                </Badge>
              </div>

              {selectedUnit.length && (
                <div>
                  <p className="text-sm text-muted-foreground">Length</p>
                  <p className="font-medium text-card-foreground">{selectedUnit.length} ft</p>
                </div>
              )}

              <div>
                <p className="text-sm text-muted-foreground">Price / Sub Rate</p>
                <p className="font-medium text-card-foreground">
                  ${selectedUnit.price.toFixed(2)} / ${selectedUnit.subRate.toFixed(2)}
                </p>
              </div>

              {selectedUnit.notes && (
                <div>
                  <p className="text-sm text-muted-foreground">Notes</p>
                  <p className="text-card-foreground">{selectedUnit.notes}</p>
                </div>
              )}

              <Separator />

              <Button variant="outline" className="w-full" onClick={() => onSelectUnit(selectedUnit)}>
                <Pencil className="w-4 h-4 mr-2" />
                View Full Details
              </Button>
            </div>
          </ScrollArea>
        </div>
      )}
    </div>
  );
};

export default ProjectMapView;
