import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { supabase } from "@/lib/supabase";

export function NewDealDialog() {
  const navigate = useNavigate();
  const [officeName, setOfficeName] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [stages, setStages] = useState<Array<{ id: string; name: string }>>([]);
  const [selectedStageId, setSelectedStageId] = useState<string>("");

  useEffect(() => {
    const fetchStages = async () => {
      const { data, error } = await supabase
        .from("deal_stages")
        .select("id, name")
        .order("display_order");

      if (error) {
        console.error("Error fetching stages:", error);
        return;
      }

      setStages(data || []);
      // Set default stage to "Awareness"
      const awarenessStage = data?.find((stage) => stage.name === "Awareness");
      if (awarenessStage) {
        setSelectedStageId(awarenessStage.id);
      }
    };

    fetchStages();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!officeName.trim()) return;

    setIsLoading(true);

    try {
      const { data, error } = await supabase
        .from("deals")
        .insert({
          company_name: officeName,
          office_name: officeName,
          title: `${officeName} Deal`,
          deal_value: 0,
          due_date: new Date().toISOString(),
          stage_id: selectedStageId,
        })
        .select()
        .single();

      if (error) throw error;
      if (!data) throw new Error("No data returned");

      // Close dialog and navigate to new deal
      setIsOpen(false);
      navigate(`/deals/${data.id}`);
    } catch (error) {
      console.error("Error creating deal:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="w-4 h-4 mr-2" /> Add Deal
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Deal</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="officeName">Office Name</Label>
            <Input
              id="officeName"
              placeholder="Enter office name"
              value={officeName}
              onChange={(e) => setOfficeName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="stage">Stage</Label>
            <Select value={selectedStageId} onValueChange={setSelectedStageId}>
              <SelectTrigger>
                <SelectValue placeholder="Select Stage" />
              </SelectTrigger>
              <SelectContent>
                {stages.map((stage) => (
                  <SelectItem key={stage.id} value={stage.id}>
                    {stage.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !officeName.trim() || !selectedStageId}
            >
              {isLoading ? "Creating..." : "Create Deal"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
