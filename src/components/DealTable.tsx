import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Draggable } from "@hello-pangea/dnd";
import { cn } from "@/lib/utils";
import { GripVertical } from "lucide-react";
import type { Database } from "@/types/supabase";

type Deal = Database["public"]["Tables"]["deals"]["Row"];

interface DealTableProps {
  deals: Deal[];
  stageId: string;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
};

const DealTable = ({ deals, stageId }: DealTableProps) => {
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);

  return (
    <div className="w-full">
      <div className="border-b">
        <div className="flex px-4 py-3">
          <div className="w-[40px]"></div>
          <div className="w-[300px] font-medium">Title</div>
          <div className="w-[200px] font-medium">Company</div>
          <div className="w-[150px] text-right font-medium">Deal Value</div>
          <div className="w-[150px] font-medium">Stage</div>
          <div className="w-[200px] font-medium">Location</div>
        </div>
      </div>
      <div>
        {deals.map((deal, index) => (
          <Draggable key={deal.id} draggableId={deal.id} index={index}>
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                {...provided.draggableProps}
                className={cn(
                  "flex items-center px-4 py-3 relative transition-colors hover:bg-muted/50",
                  snapshot.isDragging && "bg-accent",
                  hoveredRow === deal.id && "bg-accent/50",
                )}
                onMouseEnter={() => setHoveredRow(deal.id)}
                onMouseLeave={() => setHoveredRow(null)}
              >
                <div className="w-[40px]">
                  <div {...provided.dragHandleProps} className="cursor-grab">
                    <GripVertical className="h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
                <div className="w-[300px] truncate">
                  <Link to={`/deals/${deal.id}`} className="hover:underline">
                    {deal.title}
                  </Link>
                </div>
                <div className="w-[200px] truncate">{deal.company_name}</div>
                <div className="w-[150px] text-right font-medium">
                  {formatCurrency(deal.deal_value)}
                </div>
                <div className="w-[150px]">
                  <div
                    className={cn(
                      "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
                      "bg-blue-100 text-blue-800",
                    )}
                  >
                    {deal.stage?.name || "No Stage"}
                  </div>
                </div>
                <div className="w-[200px] truncate">
                  {deal.city}, {deal.state}
                </div>
              </div>
            )}
          </Draggable>
        ))}
      </div>
    </div>
  );
};

export default DealTable;
