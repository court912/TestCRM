import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowUpDown, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Database } from "@/types/supabase";

type Deal = Database["public"]["Tables"]["deals"]["Row"];

interface DealTableProps {
  deals: Deal[];
  onReorder?: (deals: Deal[]) => void;
}

type SortConfig = {
  key: keyof Deal;
  direction: "asc" | "desc";
};

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
};

const DealTable = ({ deals: initialDeals, onReorder }: DealTableProps) => {
  const [deals, setDeals] = useState(initialDeals);
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);

  const sortedDeals = useMemo(() => {
    if (!sortConfig) return deals;

    return [...deals].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (aValue === null) return sortConfig.direction === "asc" ? -1 : 1;
      if (bValue === null) return sortConfig.direction === "asc" ? 1 : -1;

      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortConfig.direction === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      return sortConfig.direction === "asc"
        ? (aValue as number) - (bValue as number)
        : (bValue as number) - (aValue as number);
    });
  }, [deals, sortConfig]);

  const handleSort = (key: keyof Deal) => {
    setSortConfig((current) => {
      if (!current || current.key !== key) {
        return { key, direction: "asc" };
      }
      if (current.direction === "asc") {
        return { key, direction: "desc" };
      }
      return null;
    });
  };

  const onDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(deals);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setDeals(items);
    onReorder?.(items);
  };

  const SortButton = ({ column }: { column: keyof Deal }) => (
    <Button
      variant="ghost"
      size="sm"
      className="-ml-3 h-8 data-[state=open]:bg-accent"
      onClick={() => handleSort(column)}
    >
      <ArrowUpDown className="h-4 w-4" />
    </Button>
  );

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[40px]"></TableHead>
            <TableHead>
              Title <SortButton column="title" />
            </TableHead>
            <TableHead>
              Company <SortButton column="company_name" />
            </TableHead>
            <TableHead className="text-right">
              Deal Value <SortButton column="deal_value" />
            </TableHead>
            <TableHead>
              Stage <SortButton column="stage_id" />
            </TableHead>
            <TableHead>
              Location <SortButton column="city" />
            </TableHead>
          </TableRow>
        </TableHeader>
        <Droppable droppableId="deals">
          {(provided) => (
            <TableBody ref={provided.innerRef} {...provided.droppableProps}>
              {sortedDeals.map((deal, index) => (
                <Draggable key={deal.id} draggableId={deal.id} index={index}>
                  {(provided, snapshot) => (
                    <TableRow
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className={cn(
                        "relative transition-colors hover:bg-muted/50",
                        snapshot.isDragging && "bg-accent",
                        hoveredRow === deal.id && "bg-accent/50",
                      )}
                      onMouseEnter={() => setHoveredRow(deal.id)}
                      onMouseLeave={() => setHoveredRow(null)}
                    >
                      <TableCell>
                        <div
                          {...provided.dragHandleProps}
                          className="cursor-grab"
                        >
                          <GripVertical className="h-4 w-4 text-muted-foreground" />
                        </div>
                      </TableCell>
                      <TableCell>
                        <Link
                          to={`/deals/${deal.id}`}
                          className="hover:underline"
                        >
                          {deal.title}
                        </Link>
                      </TableCell>
                      <TableCell>{deal.company_name}</TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(deal.deal_value)}
                      </TableCell>
                      <TableCell>
                        <div
                          className={cn(
                            "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
                            "bg-blue-100 text-blue-800",
                          )}
                        >
                          {deal.stage?.name || "No Stage"}
                        </div>
                      </TableCell>
                      <TableCell>
                        {deal.city}, {deal.state}
                      </TableCell>
                    </TableRow>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </TableBody>
          )}
        </Droppable>
      </Table>
    </DragDropContext>
  );
};

export default DealTable;
