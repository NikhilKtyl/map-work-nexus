import React, { useMemo } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { useSubsAuth } from '@/contexts/SubsAuthContext';
import { mockProjects, mockUnits, mockUnitTypes } from '@/data/mockData';
import { mockSubAssignments, mockSubDailyLogs } from '@/data/subsData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
  ArrowLeft,
  Package,
  FileText,
  DollarSign,
  TrendingUp,
  CheckCircle2,
  Clock,
  Info,
} from 'lucide-react';
import { format } from 'date-fns';

const SubsProjectSummary: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { subCompany } = useSubsAuth();

  const project = mockProjects.find((p) => p.id === id);
  const assignment = mockSubAssignments.find(
    (a) => a.projectId === id && a.subCompanyId === subCompany?.id
  );

  // Verify access
  if (!project || !subCompany || !assignment) {
    return <Navigate to="/subs/dashboard" replace />;
  }

  // Get assigned units
  const assignedUnits = mockUnits.filter((u) => assignment.unitIds.includes(u.id));

  // Get daily logs
  const dailyLogs = mockSubDailyLogs.filter(
    (log) => log.subCompanyId === subCompany.id && log.projectId === id
  );

  // Calculate approved quantities by unit type
  const invoiceData = useMemo(() => {
    const data: Record<string, { 
      type: typeof mockUnitTypes[0];
      approvedQty: number;
      rate: number;
      amount: number;
    }> = {};

    // Get approved logs only
    const approvedLogs = dailyLogs.filter((log) => log.status === 'approved');

    approvedLogs.forEach((log) => {
      log.entries.forEach((entry) => {
        const unit = assignedUnits.find((u) => u.id === entry.unitId);
        if (!unit) return;

        const unitType = mockUnitTypes.find((ut) => ut.id === unit.unitTypeId);
        if (!unitType) return;

        const rate = subCompany.rates[unitType.id] || unitType.defaultSubRate;

        if (!data[unitType.id]) {
          data[unitType.id] = {
            type: unitType,
            approvedQty: 0,
            rate,
            amount: 0,
          };
        }

        data[unitType.id].approvedQty += entry.completedQty;
        data[unitType.id].amount = data[unitType.id].approvedQty * rate;
      });
    });

    return Object.values(data);
  }, [dailyLogs, assignedUnits, subCompany]);

  const totalAmount = invoiceData.reduce((sum, item) => sum + item.amount, 0);
  const pendingApprovalCount = dailyLogs.filter((l) => l.status === 'submitted').length;

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
            <p className="text-muted-foreground">{project.code} – Invoice Preview</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Link to={`/subs/projects/${id}/units`}>
            <Button variant="outline" size="sm">
              <Package className="mr-1 h-4 w-4" />
              Units
            </Button>
          </Link>
          <Link to={`/subs/projects/${id}/docs`}>
            <Button variant="outline" size="sm">
              <FileText className="mr-1 h-4 w-4" />
              Documents
            </Button>
          </Link>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary/10">
                <CheckCircle2 className="h-5 w-5 text-secondary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{invoiceData.length}</p>
                <p className="text-sm text-muted-foreground">Unit Types Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning/10">
                <Clock className="h-5 w-5 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold">{pendingApprovalCount}</p>
                <p className="text-sm text-muted-foreground">Pending Approval</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-orange-500/5 border-orange-500/20">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500/10">
                <DollarSign className="h-5 w-5 text-orange-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">${totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                <p className="text-sm text-muted-foreground">Approved Total</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Info Banner */}
      <div className="flex items-start gap-3 rounded-lg border border-border bg-muted/50 p-4">
        <Info className="h-5 w-5 text-muted-foreground mt-0.5" />
        <div className="text-sm">
          <p className="font-medium">Invoice Preview</p>
          <p className="text-muted-foreground">
            This is an informational preview of approved work. Actual invoicing is handled separately 
            through your agreement with the contractor. Only approved submissions are included.
          </p>
        </div>
      </div>

      {/* Invoice Table */}
      <Card>
        <CardHeader>
          <CardTitle>Approved Production Summary</CardTitle>
        </CardHeader>
        <CardContent>
          {invoiceData.length === 0 ? (
            <div className="text-center py-12">
              <TrendingUp className="mx-auto h-12 w-12 text-muted-foreground/50" />
              <p className="mt-4 text-muted-foreground">No approved production yet</p>
              <p className="text-sm text-muted-foreground">
                Submit daily production and wait for office approval
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Unit Type</TableHead>
                  <TableHead className="text-right">Approved Qty</TableHead>
                  <TableHead className="text-right">Rate</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoiceData.map((item) => (
                  <TableRow key={item.type.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{item.type.name}</p>
                        <p className="text-xs text-muted-foreground">{item.type.code}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      {item.type.category === 'Line'
                        ? `${item.approvedQty.toLocaleString()} ft`
                        : `${item.approvedQty} ea`}
                    </TableCell>
                    <TableCell className="text-right">
                      ${item.rate.toFixed(2)}
                      <span className="text-muted-foreground text-xs">
                        /{item.type.category === 'Line' ? 'ft' : 'ea'}
                      </span>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      ${item.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={3} className="text-right font-semibold">
                    Total Approved
                  </TableCell>
                  <TableCell className="text-right font-bold text-lg">
                    ${totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Rates Reference */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Your Agreed Rates</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 md:grid-cols-3">
            {Object.entries(subCompany.rates).map(([unitTypeId, rate]) => {
              const unitType = mockUnitTypes.find((ut) => ut.id === unitTypeId);
              if (!unitType) return null;
              return (
                <div key={unitTypeId} className="flex items-center justify-between rounded-lg border p-3">
                  <div>
                    <p className="font-medium text-sm">{unitType.name}</p>
                    <p className="text-xs text-muted-foreground">{unitType.code}</p>
                  </div>
                  <Badge variant="outline">
                    ${rate.toFixed(2)}/{unitType.category === 'Line' ? 'ft' : 'ea'}
                  </Badge>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SubsProjectSummary;
