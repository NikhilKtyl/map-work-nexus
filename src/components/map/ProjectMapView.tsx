import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import { MapSource, Unit, UnitType, mockUnitTypes } from '@/data/mockData';
import {
  Map,
  Layers,
  MousePointer2,
  Minus,
  Circle,
  MapPin,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Satellite,
  MapIcon,
  X,
  Pencil,
  RotateCcw,
  Grid3X3,
  Crosshair,
  Move,
} from 'lucide-react';

interface ProjectMapViewProps {
  mapSources: MapSource[];
  units: Unit[];
  onCreateUnit: (geometryType: 'Line' | 'Marker') => void;
  onSelectUnit: (unit: Unit) => void;
}

type DrawingTool = 'select' | 'pan' | 'line' | 'marker' | null;
type BaseMapStyle = 'satellite' | 'streets';

interface MapPosition {
  x: number;
  y: number;
  scale: number;
}

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
  const [showGrid, setShowGrid] = useState(true);
  const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null);
  const [mapPosition, setMapPosition] = useState<MapPosition>({ x: 0, y: 0, scale: 1 });
  const [isDragging, setIsDragging] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawStart, setDrawStart] = useState<{ x: number; y: number } | null>(null);
  const [drawEnd, setDrawEnd] = useState<{ x: number; y: number } | null>(null);
  const [cursorPosition, setCursorPosition] = useState<{ x: number; y: number } | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const dragStartRef = useRef<{ x: number; y: number; mapX: number; mapY: number } | null>(null);

  const toggleLayer = (id: string) => {
    setLayerVisibility((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleUnitClick = (unit: Unit, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedUnit(unit);
    onSelectUnit(unit);
  };

  const getUnitType = (unitTypeId: string): UnitType | undefined => {
    return mockUnitTypes.find((ut) => ut.id === unitTypeId);
  };

  const statusColors: Record<string, string> = {
    not_started: 'bg-gray-400',
    in_progress: 'bg-warning',
    completed: 'bg-success',
    needs_verification: 'bg-secondary',
    verified: 'bg-primary',
  };

  const handleZoom = (direction: 'in' | 'out') => {
    setMapPosition((prev) => ({
      ...prev,
      scale: Math.max(0.5, Math.min(3, prev.scale + (direction === 'in' ? 0.25 : -0.25))),
    }));
  };

  const handleReset = () => {
    setMapPosition({ x: 0, y: 0, scale: 1 });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!mapRef.current) return;
    const rect = mapRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (activeTool === 'pan') {
      setIsDragging(true);
      dragStartRef.current = { x: e.clientX, y: e.clientY, mapX: mapPosition.x, mapY: mapPosition.y };
    } else if (activeTool === 'line' || activeTool === 'marker') {
      setIsDrawing(true);
      setDrawStart({ x, y });
      setDrawEnd({ x, y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!mapRef.current) return;
    const rect = mapRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setCursorPosition({ x, y });

    if (isDragging && dragStartRef.current) {
      const dx = e.clientX - dragStartRef.current.x;
      const dy = e.clientY - dragStartRef.current.y;
      setMapPosition((prev) => ({
        ...prev,
        x: dragStartRef.current!.mapX + dx,
        y: dragStartRef.current!.mapY + dy,
      }));
    } else if (isDrawing && drawStart) {
      setDrawEnd({ x, y });
    }
  };

  const handleMouseUp = () => {
    if (isDrawing && drawStart && drawEnd) {
      const distance = Math.sqrt(
        Math.pow(drawEnd.x - drawStart.x, 2) + Math.pow(drawEnd.y - drawStart.y, 2)
      );

      if (activeTool === 'marker' || (activeTool === 'line' && distance > 20)) {
        onCreateUnit(activeTool === 'line' ? 'Line' : 'Marker');
      }
    }

    setIsDragging(false);
    setIsDrawing(false);
    setDrawStart(null);
    setDrawEnd(null);
    dragStartRef.current = null;
  };

  const handleMouseLeave = () => {
    setCursorPosition(null);
    if (isDragging || isDrawing) {
      handleMouseUp();
    }
  };

  const getCursor = () => {
    if (activeTool === 'pan') return isDragging ? 'grabbing' : 'grab';
    if (activeTool === 'select') return 'default';
    if (activeTool === 'line') return 'crosshair';
    if (activeTool === 'marker') return 'crosshair';
    return 'default';
  };

  // Mock unit positions spread across the map
  const getUnitPosition = (index: number, total: number) => {
    const cols = Math.ceil(Math.sqrt(total));
    const row = Math.floor(index / cols);
    const col = index % cols;
    const spacing = 80;
    const offsetX = 100;
    const offsetY = 80;
    return {
      x: offsetX + col * spacing + (row % 2) * 40,
      y: offsetY + row * spacing,
    };
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

            {/* Map Settings */}
            <div>
              <Label className="text-xs text-muted-foreground uppercase tracking-wide mb-2 block">
                Display Options
              </Label>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 rounded-md bg-card border border-border">
                  <div className="flex items-center gap-2">
                    <Grid3X3 className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-card-foreground">Show Grid</span>
                  </div>
                  <Switch checked={showGrid} onCheckedChange={setShowGrid} className="scale-75" />
                </div>
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

            <Separator />

            {/* Zoom Level */}
            <div>
              <Label className="text-xs text-muted-foreground uppercase tracking-wide mb-2 block">
                Zoom: {Math.round(mapPosition.scale * 100)}%
              </Label>
              <Slider
                value={[mapPosition.scale * 100]}
                min={50}
                max={300}
                step={25}
                onValueChange={([val]) => setMapPosition((p) => ({ ...p, scale: val / 100 }))}
                className="mt-2"
              />
            </div>
          </div>
        </ScrollArea>
      </div>

      {/* Main Map Canvas */}
      <div className="flex-1 relative overflow-hidden">
        {/* Map Container */}
        <div
          ref={mapRef}
          className="absolute inset-0 overflow-hidden"
          style={{ cursor: getCursor() }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
        >
          {/* Base Map Background */}
          <div
            className={`absolute inset-0 transition-colors ${
              baseMapStyle === 'satellite'
                ? 'bg-gradient-to-br from-emerald-800/60 via-green-700/40 to-emerald-900/60'
                : 'bg-gradient-to-br from-slate-100 via-slate-200 to-slate-100'
            }`}
            style={{
              transform: `translate(${mapPosition.x}px, ${mapPosition.y}px) scale(${mapPosition.scale})`,
              transformOrigin: 'center',
            }}
          >
            {/* Grid Pattern */}
            {showGrid && (
              <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
                    <path
                      d="M 50 0 L 0 0 0 50"
                      fill="none"
                      stroke={baseMapStyle === 'satellite' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}
                      strokeWidth="1"
                    />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
              </svg>
            )}

            {/* Mock Roads/Paths for visual interest */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M 50 200 Q 200 150 400 200 T 700 180"
                fill="none"
                stroke={baseMapStyle === 'satellite' ? 'rgba(255,255,255,0.3)' : 'rgba(100,100,100,0.3)'}
                strokeWidth="4"
                strokeDasharray="10,5"
              />
              <path
                d="M 100 350 L 600 320"
                fill="none"
                stroke={baseMapStyle === 'satellite' ? 'rgba(200,200,200,0.25)' : 'rgba(80,80,80,0.2)'}
                strokeWidth="6"
              />
              <path
                d="M 300 50 Q 350 250 280 450"
                fill="none"
                stroke={baseMapStyle === 'satellite' ? 'rgba(255,255,255,0.2)' : 'rgba(100,100,100,0.25)'}
                strokeWidth="3"
              />
            </svg>

            {/* Mock terrain/parcels for satellite view */}
            {baseMapStyle === 'satellite' && (
              <>
                <div className="absolute top-20 left-40 w-32 h-24 bg-green-600/30 rounded-sm" />
                <div className="absolute top-60 left-80 w-48 h-32 bg-green-500/25 rounded-sm" />
                <div className="absolute top-32 right-60 w-40 h-36 bg-emerald-700/20 rounded-sm" />
                <div className="absolute bottom-40 left-60 w-36 h-28 bg-green-800/30 rounded-sm" />
              </>
            )}

            {/* Units on map */}
            {showUnits &&
              units.map((unit, i) => {
                const pos = getUnitPosition(i, units.length);
                const unitType = getUnitType(unit.unitTypeId);
                const isSelected = selectedUnit?.id === unit.id;

                return (
                  <div
                    key={unit.id}
                    className={`absolute cursor-pointer transition-all duration-150 ${
                      isSelected ? 'z-20 scale-125' : 'z-10 hover:scale-110'
                    }`}
                    style={{ left: pos.x, top: pos.y }}
                    onClick={(e) => handleUnitClick(unit, e)}
                  >
                    {unit.geometryType === 'Marker' ? (
                      <div
                        className={`w-7 h-7 rounded-full ${statusColors[unit.status]} border-2 ${
                          isSelected ? 'border-primary ring-2 ring-primary/50' : 'border-white'
                        } shadow-lg flex items-center justify-center`}
                      >
                        <MapPin className="w-3.5 h-3.5 text-white" />
                      </div>
                    ) : (
                      <div className="relative">
                        <div
                          className={`h-2.5 rounded-full ${statusColors[unit.status]} ${
                            isSelected ? 'ring-2 ring-primary/50' : ''
                          } shadow-md`}
                          style={{ width: Math.max(30, (unit.length || 50) / 3) }}
                        />
                        {isSelected && (
                          <div className="absolute -top-1 -left-1 w-2 h-2 bg-primary rounded-full border border-white" />
                        )}
                      </div>
                    )}
                    {/* Unit label on hover/select */}
                    {isSelected && (
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-card text-card-foreground text-xs px-2 py-1 rounded shadow-md whitespace-nowrap border border-border">
                        {unit.code}
                      </div>
                    )}
                  </div>
                );
              })}

            {/* Drawing preview */}
            {isDrawing && drawStart && drawEnd && (
              <>
                {activeTool === 'line' ? (
                  <svg
                    className="absolute inset-0 w-full h-full pointer-events-none z-30"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <line
                      x1={drawStart.x}
                      y1={drawStart.y}
                      x2={drawEnd.x}
                      y2={drawEnd.y}
                      stroke="hsl(var(--primary))"
                      strokeWidth="3"
                      strokeDasharray="6,4"
                    />
                    <circle cx={drawStart.x} cy={drawStart.y} r="5" fill="hsl(var(--primary))" />
                    <circle cx={drawEnd.x} cy={drawEnd.y} r="5" fill="hsl(var(--primary))" />
                  </svg>
                ) : (
                  <div
                    className="absolute w-8 h-8 -ml-4 -mt-4 rounded-full bg-primary/50 border-2 border-primary animate-pulse z-30"
                    style={{ left: drawStart.x, top: drawStart.y }}
                  />
                )}
              </>
            )}
          </div>

          {/* Coordinate display */}
          {cursorPosition && (
            <div className="absolute bottom-4 left-4 bg-card/90 backdrop-blur-sm text-card-foreground text-xs px-3 py-2 rounded-md shadow border border-border flex items-center gap-3">
              <Crosshair className="w-3 h-3 text-muted-foreground" />
              <span>
                X: {Math.round(cursorPosition.x)} | Y: {Math.round(cursorPosition.y)}
              </span>
            </div>
          )}
        </div>

        {/* Drawing Toolbar */}
        <div className="absolute top-4 left-4 bg-card rounded-lg shadow-lg border border-border p-1.5 flex flex-col gap-1">
          <Button
            variant={activeTool === 'select' ? 'default' : 'ghost'}
            size="icon"
            className="w-9 h-9"
            onClick={() => setActiveTool('select')}
            title="Select"
          >
            <MousePointer2 className="w-4 h-4" />
          </Button>
          <Button
            variant={activeTool === 'pan' ? 'default' : 'ghost'}
            size="icon"
            className="w-9 h-9"
            onClick={() => setActiveTool('pan')}
            title="Pan"
          >
            <Move className="w-4 h-4" />
          </Button>
          <Separator className="my-1" />
          <Button
            variant={activeTool === 'line' ? 'default' : 'ghost'}
            size="icon"
            className="w-9 h-9"
            onClick={() => setActiveTool('line')}
            title="Draw Line"
          >
            <Minus className="w-4 h-4" />
          </Button>
          <Button
            variant={activeTool === 'marker' ? 'default' : 'ghost'}
            size="icon"
            className="w-9 h-9"
            onClick={() => setActiveTool('marker')}
            title="Draw Marker"
          >
            <Circle className="w-4 h-4" />
          </Button>
        </div>

        {/* Drawing instruction */}
        {(activeTool === 'line' || activeTool === 'marker') && (
          <div className="absolute top-4 left-20 bg-primary text-primary-foreground text-sm px-4 py-2 rounded-lg shadow-lg">
            {activeTool === 'line' ? 'Click and drag to draw a line' : 'Click to place a marker'}
          </div>
        )}

        {/* Zoom Controls */}
        <div className="absolute top-4 right-4 bg-card rounded-lg shadow-lg border border-border p-1 flex flex-col gap-1">
          <Button variant="ghost" size="icon" className="w-8 h-8" onClick={() => handleZoom('in')}>
            <ZoomIn className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" className="w-8 h-8" onClick={() => handleZoom('out')}>
            <ZoomOut className="w-4 h-4" />
          </Button>
          <Separator className="my-0.5" />
          <Button variant="ghost" size="icon" className="w-8 h-8" onClick={handleReset}>
            <RotateCcw className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" className="w-8 h-8">
            <Maximize2 className="w-4 h-4" />
          </Button>
        </div>

        {/* Scale indicator */}
        <div className="absolute bottom-4 right-4 bg-card/90 backdrop-blur-sm text-card-foreground text-xs px-3 py-2 rounded-md shadow border border-border">
          <div className="flex items-center gap-2">
            <div className="w-12 h-0.5 bg-foreground" />
            <span>100 ft</span>
          </div>
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
              <div className="p-3 rounded-lg bg-card border border-border">
                <p className="text-xs text-muted-foreground mb-1">Unit Code</p>
                <p className="font-semibold text-card-foreground">{selectedUnit.code}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg bg-card border border-border">
                  <p className="text-xs text-muted-foreground mb-1">Type</p>
                  <p className="font-medium text-card-foreground text-sm">
                    {getUnitType(selectedUnit.unitTypeId)?.name || 'Unknown'}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-card border border-border">
                  <p className="text-xs text-muted-foreground mb-1">Geometry</p>
                  <p className="font-medium text-card-foreground text-sm">{selectedUnit.geometryType}</p>
                </div>
              </div>

              <div>
                <p className="text-xs text-muted-foreground mb-1">Status</p>
                <Badge className={`${statusColors[selectedUnit.status]} text-white text-xs capitalize`}>
                  {selectedUnit.status.replace('_', ' ')}
                </Badge>
              </div>

              {selectedUnit.length && (
                <div className="p-3 rounded-lg bg-card border border-border">
                  <p className="text-xs text-muted-foreground mb-1">Length</p>
                  <p className="font-semibold text-card-foreground">{selectedUnit.length} ft</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg bg-card border border-border">
                  <p className="text-xs text-muted-foreground mb-1">Price</p>
                  <p className="font-medium text-success">${selectedUnit.price.toFixed(2)}</p>
                </div>
                <div className="p-3 rounded-lg bg-card border border-border">
                  <p className="text-xs text-muted-foreground mb-1">Sub Rate</p>
                  <p className="font-medium text-card-foreground">${selectedUnit.subRate.toFixed(2)}</p>
                </div>
              </div>

              {selectedUnit.notes && (
                <div className="p-3 rounded-lg bg-card border border-border">
                  <p className="text-xs text-muted-foreground mb-1">Notes</p>
                  <p className="text-card-foreground text-sm">{selectedUnit.notes}</p>
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
