import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { MapSource } from '@/data/mockData';
import { format } from 'date-fns';
import {
  Upload,
  FileImage,
  FileText,
  MapPin,
  Star,
  Trash2,
  RefreshCw,
  Loader2,
  CheckCircle,
  XCircle,
} from 'lucide-react';

interface MapSourcesListProps {
  sources: MapSource[];
  onUpload: () => void;
  onSetPrimary: (id: string) => void;
  onReplace: (id: string) => void;
  onRemove: (id: string) => void;
}

const fileTypeIcons: Record<MapSource['fileType'], React.ReactNode> = {
  SHP: <MapPin className="w-4 h-4 text-primary" />,
  KMZ: <MapPin className="w-4 h-4 text-success" />,
  CAD: <FileText className="w-4 h-4 text-warning" />,
  PDF: <FileText className="w-4 h-4 text-destructive" />,
  IMAGE: <FileImage className="w-4 h-4 text-secondary" />,
};

const statusConfig: Record<MapSource['status'], { label: string; icon: React.ReactNode; className: string }> = {
  processing: { label: 'Processing', icon: <Loader2 className="w-3 h-3 animate-spin" />, className: 'bg-warning/10 text-warning border-warning/20' },
  processed: { label: 'Processed', icon: <CheckCircle className="w-3 h-3" />, className: 'status-active' },
  error: { label: 'Error', icon: <XCircle className="w-3 h-3" />, className: 'bg-destructive/10 text-destructive border-destructive/20' },
};

const layerCategoryColors: Record<MapSource['layerCategory'], string> = {
  Base: 'bg-primary/10 text-primary border-primary/20',
  Design: 'bg-success/10 text-success border-success/20',
  Reference: 'bg-muted text-muted-foreground border-border',
};

const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const MapSourcesList: React.FC<MapSourcesListProps> = ({
  sources,
  onUpload,
  onSetPrimary,
  onReplace,
  onRemove,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-card-foreground">Map Sources</h3>
          <p className="text-sm text-muted-foreground">
            Uploaded map files for this project
          </p>
        </div>
        <Button onClick={onUpload} className="gradient-primary">
          <Upload className="w-4 h-4 mr-2" />
          Upload Map
        </Button>
      </div>

      {sources.length === 0 ? (
        <div className="p-8 text-center border border-dashed border-border rounded-lg">
          <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">No map sources uploaded yet</p>
          <Button onClick={onUpload} variant="outline" className="mt-4">
            Upload your first map
          </Button>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="text-muted-foreground font-medium">File</TableHead>
              <TableHead className="text-muted-foreground font-medium">Type</TableHead>
              <TableHead className="text-muted-foreground font-medium">Layer</TableHead>
              <TableHead className="text-muted-foreground font-medium">Size</TableHead>
              <TableHead className="text-muted-foreground font-medium">Status</TableHead>
              <TableHead className="text-muted-foreground font-medium">Uploaded</TableHead>
              <TableHead className="text-muted-foreground font-medium text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sources.map((source) => {
              const status = statusConfig[source.status];
              return (
                <TableRow key={source.id} className="border-border hover:bg-muted/50">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {fileTypeIcons[source.fileType]}
                      <div>
                        <div className="font-medium text-card-foreground flex items-center gap-2">
                          {source.name}
                          {source.isPrimary && (
                            <Star className="w-4 h-4 text-warning fill-warning" />
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground">{source.fileName}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs">
                      {source.fileType}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={`text-xs ${layerCategoryColors[source.layerCategory]}`}>
                      {source.layerCategory}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatFileSize(source.fileSize)}
                  </TableCell>
                  <TableCell>
                    <Badge className={`text-xs ${status.className} flex items-center gap-1 w-fit`}>
                      {status.icon}
                      {status.label}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {format(new Date(source.uploadDate), 'MMM d, yyyy')}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      {!source.isPrimary && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => onSetPrimary(source.id)}
                          title="Set as Primary"
                        >
                          <Star className="w-4 h-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => onReplace(source.id)}
                        title="Replace"
                      >
                        <RefreshCw className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => onRemove(source.id)}
                        title="Remove"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default MapSourcesList;
