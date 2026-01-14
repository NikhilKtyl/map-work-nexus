import React, { useState, useMemo } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { useSubsAuth } from '@/contexts/SubsAuthContext';
import { mockProjects } from '@/data/mockData';
import { mockSubAssignments, mockSubDocuments, SubDocument } from '@/data/subsData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  ArrowLeft,
  Package,
  FileText,
  DollarSign,
  Upload,
  File,
  Download,
} from 'lucide-react';
import { format } from 'date-fns';
import { toast } from '@/hooks/use-toast';

const SubsProjectDocs: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { subCompany, user } = useSubsAuth();
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadType, setUploadType] = useState<SubDocument['type']>('work_report');
  const [uploadNotes, setUploadNotes] = useState('');

  const project = mockProjects.find((p) => p.id === id);
  const assignment = mockSubAssignments.find(
    (a) => a.projectId === id && a.subCompanyId === subCompany?.id
  );

  // Verify access
  if (!project || !subCompany || !assignment) {
    return <Navigate to="/subs/dashboard" replace />;
  }

  // Get documents for this project
  const documents = mockSubDocuments.filter(
    (doc) => doc.subCompanyId === subCompany.id && doc.projectId === id
  );

  const getDocTypeLabel = (type: SubDocument['type']) => {
    switch (type) {
      case 'work_report':
        return 'Work Report';
      case 'locate_ticket':
        return 'Locate Ticket';
      case 'safety_form':
        return 'Safety Form';
      case 'other':
        return 'Other';
      default:
        return type;
    }
  };

  const getDocTypeBadgeVariant = (type: SubDocument['type']) => {
    switch (type) {
      case 'work_report':
        return 'bg-primary/10 text-primary border-primary/20';
      case 'locate_ticket':
        return 'bg-warning/10 text-warning border-warning/20';
      case 'safety_form':
        return 'bg-secondary/10 text-secondary border-secondary/20';
      default:
        return '';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleUpload = () => {
    toast({
      title: 'Document Uploaded',
      description: 'Your document has been uploaded successfully.',
    });
    setShowUploadModal(false);
    setUploadType('work_report');
    setUploadNotes('');
  };

  const handleDownload = (fileName: string) => {
    toast({
      title: 'Download Started',
      description: `Downloading ${fileName}...`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <Link to={`/subs/projects/${id}/units`}>
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">{project.name}</h1>
            <p className="text-muted-foreground">{project.code} – Documents</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Link to={`/subs/projects/${id}/units`}>
            <Button variant="outline" size="sm">
              <Package className="mr-1 h-4 w-4" />
              Units
            </Button>
          </Link>
          <Link to={`/subs/projects/${id}/summary`}>
            <Button variant="outline" size="sm">
              <DollarSign className="mr-1 h-4 w-4" />
              Summary
            </Button>
          </Link>
        </div>
      </div>

      {/* Upload Button */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Project Documents</CardTitle>
          <Button onClick={() => setShowUploadModal(true)} className="bg-orange-500 hover:bg-orange-600">
            <Upload className="mr-1 h-4 w-4" />
            Upload Document
          </Button>
        </CardHeader>
        <CardContent>
          {documents.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="mx-auto h-12 w-12 text-muted-foreground/50" />
              <p className="mt-4 text-muted-foreground">No documents uploaded yet</p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => setShowUploadModal(true)}
              >
                <Upload className="mr-1 h-4 w-4" />
                Upload your first document
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>File Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Uploaded</TableHead>
                  <TableHead>Notes</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {documents.map((doc) => (
                  <TableRow key={doc.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <File className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{doc.fileName}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getDocTypeBadgeVariant(doc.type)}>
                        {getDocTypeLabel(doc.type)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatFileSize(doc.fileSize)}
                    </TableCell>
                    <TableCell>
                      {format(new Date(doc.uploadedAt), 'MMM d, yyyy h:mm a')}
                    </TableCell>
                    <TableCell className="max-w-xs truncate text-muted-foreground">
                      {doc.notes || '—'}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDownload(doc.fileName)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Upload Modal */}
      <Dialog open={showUploadModal} onOpenChange={setShowUploadModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Document</DialogTitle>
            <DialogDescription>
              Upload work reports, locate tickets, safety forms, or other documentation.
              Documents cannot be edited or deleted after upload.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Document Type</Label>
              <Select value={uploadType} onValueChange={(v) => setUploadType(v as SubDocument['type'])}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="work_report">Work Report</SelectItem>
                  <SelectItem value="locate_ticket">Utility Locate Ticket</SelectItem>
                  <SelectItem value="safety_form">Safety Form</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>File</Label>
              <div className="mt-1 border-2 border-dashed border-border rounded-lg p-6 text-center">
                <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
                <p className="mt-2 text-sm text-muted-foreground">
                  Click to select or drag and drop
                </p>
                <p className="text-xs text-muted-foreground">PDF, DOC, DOCX up to 10MB</p>
                <Input type="file" className="mt-3" accept=".pdf,.doc,.docx" />
              </div>
            </div>
            <div>
              <Label>Notes (optional)</Label>
              <Textarea
                placeholder="Add any notes about this document..."
                value={uploadNotes}
                onChange={(e) => setUploadNotes(e.target.value)}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowUploadModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpload} className="bg-orange-500 hover:bg-orange-600">
              <Upload className="mr-1 h-4 w-4" />
              Upload
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SubsProjectDocs;
