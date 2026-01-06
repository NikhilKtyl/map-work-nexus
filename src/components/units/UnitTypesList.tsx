import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { UnitType, customers } from '@/data/mockData';
import {
  Plus,
  Search,
  MoreHorizontal,
  Pencil,
  Archive,
  Minus,
  MapPin,
  Camera,
  Navigation,
  Hash,
} from 'lucide-react';

interface UnitTypesListProps {
  unitTypes: UnitType[];
  onCreateType: () => void;
  onEditType: (type: UnitType) => void;
  onToggleActive: (id: string) => void;
}

const UnitTypesList: React.FC<UnitTypesListProps> = ({
  unitTypes,
  onCreateType,
  onEditType,
  onToggleActive,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [customerFilter, setCustomerFilter] = useState<string>('all');

  const filteredTypes = unitTypes.filter((type) => {
    const matchesSearch =
      type.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      type.code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || type.category === categoryFilter;
    const matchesCustomer =
      customerFilter === 'all' ||
      !type.customerId ||
      type.customerId === customerFilter;
    return matchesSearch && matchesCategory && matchesCustomer;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Unit Catalog</h1>
          <p className="text-muted-foreground mt-1">
            Define unit types and their pricing for projects
          </p>
        </div>
        <Button className="gradient-primary" onClick={onCreateType}>
          <Plus className="w-4 h-4 mr-2" />
          Create Unit Type
        </Button>
      </div>

      {/* Filters */}
      <div className="content-panel p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search unit types..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-muted border-border"
            />
          </div>

          <div className="flex gap-3">
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[140px] bg-muted border-border">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="Line">Line</SelectItem>
                <SelectItem value="Marker">Marker</SelectItem>
              </SelectContent>
            </Select>

            <Select value={customerFilter} onValueChange={setCustomerFilter}>
              <SelectTrigger className="w-[160px] bg-muted border-border">
                <SelectValue placeholder="Customer" />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                <SelectItem value="all">All Customers</SelectItem>
                {customers.map((customer) => (
                  <SelectItem key={customer} value={customer}>
                    {customer}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Unit Types Table */}
      <div className="content-panel overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="text-muted-foreground font-medium">Unit Type</TableHead>
              <TableHead className="text-muted-foreground font-medium">Category</TableHead>
              <TableHead className="text-muted-foreground font-medium">Price</TableHead>
              <TableHead className="text-muted-foreground font-medium">Sub Rate</TableHead>
              <TableHead className="text-muted-foreground font-medium">Requirements</TableHead>
              <TableHead className="text-muted-foreground font-medium">Status</TableHead>
              <TableHead className="text-muted-foreground font-medium w-10"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTypes.map((type) => (
              <TableRow
                key={type.id}
                className="border-border hover:bg-muted/50 cursor-pointer"
                onClick={() => onEditType(type)}
              >
                <TableCell>
                  <div>
                    <div className="font-medium text-card-foreground">{type.name}</div>
                    <div className="text-xs text-muted-foreground">{type.code}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={`text-xs ${
                      type.category === 'Line'
                        ? 'border-primary/30 text-primary bg-primary/5'
                        : 'border-secondary/30 text-secondary bg-secondary/5'
                    }`}
                  >
                    {type.category === 'Line' ? (
                      <Minus className="w-3 h-3 mr-1" />
                    ) : (
                      <MapPin className="w-3 h-3 mr-1" />
                    )}
                    {type.category}
                  </Badge>
                </TableCell>
                <TableCell className="font-medium text-card-foreground">
                  ${type.defaultPrice.toFixed(2)}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  ${type.defaultSubRate.toFixed(2)}
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    {type.requiresGps && (
                      <Badge variant="outline" className="text-xs px-1.5">
                        <Navigation className="w-3 h-3" />
                      </Badge>
                    )}
                    {type.requiresSequential && (
                      <Badge variant="outline" className="text-xs px-1.5">
                        <Hash className="w-3 h-3" />
                      </Badge>
                    )}
                    {type.requiresPhotos && (
                      <Badge variant="outline" className="text-xs px-1.5">
                        <Camera className="w-3 h-3" />
                        {type.minPhotoCount > 0 && (
                          <span className="ml-0.5">{type.minPhotoCount}</span>
                        )}
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={type.isActive ? 'status-active' : 'bg-muted text-muted-foreground'}>
                    {type.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </TableCell>
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-card border-border">
                      <DropdownMenuItem onClick={() => onEditType(type)}>
                        <Pencil className="w-4 h-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onToggleActive(type.id)}>
                        <Archive className="w-4 h-4 mr-2" />
                        {type.isActive ? 'Deactivate' : 'Activate'}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {filteredTypes.length === 0 && (
          <div className="p-8 text-center text-muted-foreground">
            No unit types found matching your filters.
          </div>
        )}
      </div>
    </div>
  );
};

export default UnitTypesList;
