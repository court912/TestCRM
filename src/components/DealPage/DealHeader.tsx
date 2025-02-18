import { Building2 } from "lucide-react";
import { Card } from "../ui/card";
import type { Database } from "@/types/supabase";

type Deal = Database["public"]["Tables"]["deals"]["Row"];

interface DealHeaderProps {
  deal: Deal;
  stages: Array<{ id: string; name: string; color_scheme: any }>;
  onStageChange: (value: string) => void;
}

export const DealHeader = ({
  deal,
  stages,
  onStageChange,
}: DealHeaderProps) => {
  return (
    <Card className="p-6">
      <div className="flex justify-between items-start mb-6">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold">{deal.title}</h2>
          <div className="flex items-center text-muted-foreground">
            <Building2 className="w-4 h-4 mr-2" />
            {deal.company_name}
          </div>
        </div>
        <div className="relative">
          <select
            className="h-9 rounded-md w-full pl-3 pr-8 text-sm border bg-background hover:bg-accent transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring appearance-none"
            value={deal.stage_id || ""}
            onChange={(e) => onStageChange(e.target.value)}
          >
            <option value="">Select Stage</option>
            {stages.map((stage) => (
              <option key={stage.id} value={stage.id}>
                {stage.name}
              </option>
            ))}
          </select>
          <div className="absolute right-2 top-2.5 pointer-events-none">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-muted-foreground"
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </div>
        </div>
      </div>
    </Card>
  );
};
