import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { MapSource } from '@/data/mockData';
import { Upload, FileUp, X, Loader2 } from 'lucide-react';

interface MapUploadModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: Partial<MapSource> & { file?: File }) => void;
}

const acceptedTypes = '.shp,.shx,.dbf,.prj,.kmz,.kml,.dwg,.dxf,.pdf,.png,.jpg,.jpeg,.tiff';

const MapUploadModal: React.FC<MapUploadModalProps> = ({ open, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    layerCategory: 'Reference' as MapSource['layerCategory'],
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      setSelectedFile(file);
      if (!formData.name) {
        setFormData({ ...formData, name: file.name.replace(/\.[^/.]+$/, '') });
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      if (!formData.name) {
        setFormData({ ...formData, name: file.name.replace(/\.[^/.]+$/, '') });
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    setIsUploading(true);
    
    // Simulate upload delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const fileExt = selectedFile.name.split('.').pop()?.toUpperCase();
    let fileType: MapSource['fileType'] = 'IMAGE';
    if (fileExt === 'SHP' || fileExt === 'SHX' || fileExt === 'DBF') fileType = 'SHP';
    else if (fileExt === 'KMZ' || fileExt === 'KML') fileType = 'KMZ';
    else if (fileExt === 'DWG' || fileExt === 'DXF') fileType = 'CAD';
    else if (fileExt === 'PDF') fileType = 'PDF';

    onSave({
      name: formData.name,
      fileName: selectedFile.name,
      fileType,
      fileSize: selectedFile.size,
      layerCategory: formData.layerCategory,
      status: 'processing',
      file: selectedFile,
    });

    setIsUploading(false);
    setFormData({ name: '', description: '', layerCategory: 'Reference' });
    setSelectedFile(null);
    onClose();
  };

  const handleClose = () => {
    setFormData({ name: '', description: '', layerCategory: 'Reference' });
    setSelectedFile(null);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="bg-card border-border max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-card-foreground">Upload Map Source</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* File Drop Zone */}
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              isDragging
                ? 'border-primary bg-primary/5'
                : selectedFile
                ? 'border-success bg-success/5'
                : 'border-border hover:border-primary/50'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {selectedFile ? (
              <div className="flex items-center justify-center gap-3">
                <FileUp className="w-8 h-8 text-success" />
                <div className="text-left">
                  <p className="font-medium text-card-foreground">{selectedFile.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => setSelectedFile(null)}
                  className="ml-2"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <>
                <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-card-foreground font-medium mb-1">
                  Drag and drop your file here
                </p>
                <p className="text-sm text-muted-foreground mb-3">
                  or click to browse
                </p>
                <input
                  type="file"
                  accept={acceptedTypes}
                  onChange={handleFileSelect}
                  className="hidden"
                  id="map-file-input"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById('map-file-input')?.click()}
                >
                  Browse Files
                </Button>
                <p className="text-xs text-muted-foreground mt-3">
                  Supported: SHP, KMZ, CAD (DWG/DXF), PDF, Images
                </p>
              </>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="name" className="text-card-foreground">Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="bg-muted border-border"
              placeholder="Enter a name for this map source"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-card-foreground">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="bg-muted border-border min-h-[60px]"
              placeholder="Optional description..."
            />
          </div>

          <div className="space-y-2">
            <Label className="text-card-foreground">Layer Category</Label>
            <Select
              value={formData.layerCategory}
              onValueChange={(value) =>
                setFormData({ ...formData, layerCategory: value as MapSource['layerCategory'] })
              }
            >
              <SelectTrigger className="bg-muted border-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                <SelectItem value="Base">Base</SelectItem>
                <SelectItem value="Design">Design</SelectItem>
                <SelectItem value="Reference">Reference</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter className="gap-2 pt-4">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              className="gradient-primary"
              disabled={!selectedFile || !formData.name || isUploading}
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Upload
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default MapUploadModal;
