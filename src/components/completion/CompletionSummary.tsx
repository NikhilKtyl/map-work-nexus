import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, Clock, AlertCircle, TrendingUp } from 'lucide-react';
import { Unit } from '@/data/mockData';

interface CompletionSummaryProps {
  units: Unit[];
  projectName: string;
}

const CompletionSummary: React.FC<CompletionSummaryProps> = ({ units, projectName }) => {
  const totalUnits = units.length;
  const verifiedUnits = units.filter((u) => u.status === 'verified').length;
  const completedUnits = units.filter((u) => u.status === 'completed' || u.status === 'verified').length;
  const inProgressUnits = units.filter((u) => u.status === 'in_progress').length;
  const notStartedUnits = units.filter((u) => u.status === 'not_started').length;

  const completionPercent = totalUnits > 0 ? Math.round((verifiedUnits / totalUnits) * 100) : 0;

  // Calculate total length for line units
  const totalLength = units.reduce((sum, u) => sum + (u.length || 0), 0);
  const completedLength = units
    .filter((u) => u.status === 'verified' || u.status === 'completed')
    .reduce((sum, u) => sum + (u.length || 0), 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Overall Progress */}
      <Card className="md:col-span-2">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Overall Completion
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-2">
            <span className="text-3xl font-bold">{completionPercent}%</span>
            <TrendingUp className="w-8 h-8 text-secondary" />
          </div>
          <Progress value={completionPercent} className="h-3 mb-2" />
          <p className="text-sm text-muted-foreground">
            {verifiedUnits} of {totalUnits} units verified
          </p>
        </CardContent>
      </Card>

      {/* Verified */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Verified
          </CardTitle>
          <CheckCircle2 className="w-4 h-4 text-secondary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{verifiedUnits}</div>
          <p className="text-xs text-muted-foreground">Ready for as-built</p>
        </CardContent>
      </Card>

      {/* Pending Verification */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Pending
          </CardTitle>
          <Clock className="w-4 h-4 text-warning" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{completedUnits - verifiedUnits}</div>
          <p className="text-xs text-muted-foreground">Awaiting verification</p>
        </CardContent>
      </Card>

      {/* In Progress */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            In Progress
          </CardTitle>
          <Clock className="w-4 h-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{inProgressUnits}</div>
          <p className="text-xs text-muted-foreground">Currently active</p>
        </CardContent>
      </Card>

      {/* Not Started */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Not Started
          </CardTitle>
          <AlertCircle className="w-4 h-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{notStartedUnits}</div>
          <p className="text-xs text-muted-foreground">Pending assignment</p>
        </CardContent>
      </Card>

      {/* Total Length */}
      <Card className="md:col-span-2">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Linear Footage
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-2">
            <span className="text-2xl font-bold">
              {completedLength.toLocaleString()} / {totalLength.toLocaleString()} ft
            </span>
          </div>
          <Progress
            value={totalLength > 0 ? (completedLength / totalLength) * 100 : 0}
            className="h-2"
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default CompletionSummary;
