import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Layers } from 'lucide-react';
import { Unit, UnitStatus } from '@/data/mockData';

interface FieldMapViewProps {
  units: Unit[];
  onSelectUnit: (unit: Unit) => void;
  selectedUnitId?: string;
}

const statusColors: Record<UnitStatus, string> = {
  not_started: 'bg-muted-foreground',
  in_progress: 'bg-primary',
  completed: 'bg-secondary',
  needs_verification: 'bg-warning',
  verified: 'bg-secondary',
};

const FieldMapView: React.FC<FieldMapViewProps> = ({ units, onSelectUnit, selectedUnitId }) => {
  // Generate random positions for mock display
  const getPosition = (index: number, total: number) => {
    const angle = (index / total) * 2 * Math.PI;
    const radius = 25 + Math.random() * 15;
    return {
      left: `${50 + radius * Math.cos(angle)}%`,
      top: `${50 + radius * Math.sin(angle)}%`,
    };
  };

  return (
    <div className="relative h-[calc(100vh-20rem)] rounded-lg border border-border overflow-hidden">
      {/* Map placeholder */}
      <div className="absolute inset-0 bg-gradient-to-br from-muted via-muted/80 to-muted">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(to right, hsl(var(--border)) 1px, transparent 1px),
              linear-gradient(to bottom, hsl(var(--border)) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
          }}
        />

        {/* Unit markers */}
        {units.map((unit, index) => {
          const position = getPosition(index, units.length);
          const isSelected = selectedUnitId === unit.id;
          const colorClass = statusColors[unit.status];

          return (
            <div
              key={unit.id}
              className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all ${
                isSelected ? 'scale-125 z-10' : 'hover:scale-110'
              }`}
              style={{ left: position.left, top: position.top }}
              onClick={() => onSelectUnit(unit)}
            >
              {unit.geometryType === 'Line' ? (
                <div
                  className={`w-12 h-2 rounded-full ${colorClass} ${
                    isSelected ? 'ring-2 ring-primary ring-offset-2' : ''
                  }`}
                  style={{ transform: `rotate(${index * 30}deg)` }}
                />
              ) : (
                <div
                  className={`w-6 h-6 rounded-full ${colorClass} flex items-center justify-center text-primary-foreground text-xs font-bold ${
                    isSelected ? 'ring-2 ring-primary ring-offset-2' : ''
                  }`}
                >
                  {index + 1}
                </div>
              )}
            </div>
          );
        })}

        {/* Center message if no units */}
        {units.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Card className="bg-card/90 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <Layers className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
                <p className="text-lg font-medium text-foreground">No Assigned Units</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Units assigned to you will appear here
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-card/90 backdrop-blur-sm rounded-lg p-3 border border-border">
        <p className="text-xs font-medium text-foreground mb-2">Status Legend</p>
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs">
            <div className="w-3 h-3 rounded-full bg-muted-foreground" />
            <span className="text-muted-foreground">Not Started</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <div className="w-3 h-3 rounded-full bg-primary" />
            <span className="text-muted-foreground">In Progress</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <div className="w-3 h-3 rounded-full bg-secondary" />
            <span className="text-muted-foreground">Completed</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FieldMapView;
