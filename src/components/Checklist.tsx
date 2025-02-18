import React, { useState, useEffect } from "react";
import { ScrollArea } from "./ui/scroll-area";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import { Plus } from "lucide-react";
import { Input } from "./ui/input";
import { supabase } from "@/lib/supabase";

interface Milestone {
  id: string;
  title: string;
  completed: boolean;
  isCustom?: boolean;
}

interface ChecklistProps {
  milestones?: Milestone[];
  onMilestoneToggle?: (id: string, completed: boolean) => void;
  onAddMilestone?: (title: string) => void;
  dealId: string;
}

const defaultMilestonesLeft: Milestone[] = [
  { id: "1", title: "NDA Signed", completed: false },
  { id: "2", title: "Document Requests", completed: false },
  { id: "3", title: "Qualification Determined", completed: false },
  { id: "4", title: "Pro Forma Models Completed", completed: false },
];

const defaultMilestonesRight: Milestone[] = [
  { id: "5", title: "Partner Introductions", completed: false },
  { id: "6", title: "LOI Sent", completed: false },
  { id: "7", title: "Employment Agreement Sent", completed: false },
  { id: "8", title: "Purchase Agreement Sent", completed: false },
  { id: "9", title: "Due Diligence Sent", completed: false },
];

const defaultMilestones: Milestone[] = [
  ...defaultMilestonesLeft,
  ...defaultMilestonesRight,
];

const Checklist = ({
  onMilestoneToggle = () => {},
  onAddMilestone = () => {},
  dealId,
}: ChecklistProps) => {
  const [milestones, setMilestones] = useState(defaultMilestones);

  useEffect(() => {
    const fetchChecklist = async () => {
      try {
        const { data, error } = await supabase
          .from("deal_checklist")
          .select("*")
          .eq("deal_id", dealId)
          .order("display_order");

        if (error) throw error;

        if (data) {
          const customItems = data.map((item) => ({
            id: item.id,
            title: item.title,
            completed: item.completed || false,
            isCustom: item.is_custom,
          }));

          setMilestones([...defaultMilestones, ...customItems]);
        }
      } catch (error) {
        console.error("Error fetching checklist:", error);
      }
    };

    if (dealId) {
      fetchChecklist();
    }
  }, [dealId]);
  const [newMilestone, setNewMilestone] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newMilestone.trim()) {
      try {
        const { data, error } = await supabase
          .from("deal_checklist")
          .insert({
            deal_id: dealId,
            title: newMilestone.trim(),
            is_custom: true,
            display_order: milestones.length + 1,
            completed: false,
          })
          .select()
          .single();

        if (error) throw error;

        if (data) {
          onAddMilestone(newMilestone);
          milestones.push({
            id: data.id,
            title: data.title,
            completed: false,
            isCustom: true,
          });
        }

        setNewMilestone("");
        setIsAdding(false);
      } catch (error) {
        console.error("Error adding checklist item:", error);
      }
    }
  };

  return (
    <div className="h-[300px] border-b bg-white">
      <div className="p-4 border-b">
        <h3 className="text-lg font-semibold">Checklist</h3>
      </div>
      <ScrollArea className="h-[calc(300px-130px)] px-4">
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-3">
              {defaultMilestonesLeft.map((milestone, index) => (
                <div
                  key={milestone.id}
                  className="flex items-center gap-3 group relative"
                >
                  <div
                    className="absolute left-[11px] h-full w-0.5 bg-border -z-10"
                    style={{
                      top: index === 0 ? "50%" : 0,
                      bottom:
                        index === defaultMilestonesLeft.length - 1 ? "50%" : 0,
                    }}
                  />
                  <Checkbox
                    id={milestone.id}
                    checked={milestone.completed}
                    onCheckedChange={(checked) =>
                      onMilestoneToggle(milestone.id, checked as boolean)
                    }
                  />
                  <label
                    htmlFor={milestone.id}
                    className={`text-sm ${milestone.completed ? "line-through text-muted-foreground" : ""}`}
                  >
                    {milestone.title}
                  </label>
                </div>
              ))}
            </div>
            <div className="space-y-3">
              {defaultMilestonesRight.map((milestone, index) => (
                <div
                  key={milestone.id}
                  className="flex items-center gap-3 group relative"
                >
                  <div
                    className="absolute left-[11px] h-full w-0.5 bg-border -z-10"
                    style={{
                      top: index === 0 ? "50%" : 0,
                      bottom:
                        index === defaultMilestonesRight.length - 1 ? "50%" : 0,
                    }}
                  />
                  <Checkbox
                    id={milestone.id}
                    checked={milestone.completed}
                    onCheckedChange={(checked) =>
                      onMilestoneToggle(milestone.id, checked as boolean)
                    }
                  />
                  <label
                    htmlFor={milestone.id}
                    className={`text-sm ${milestone.completed ? "line-through text-muted-foreground" : ""}`}
                  >
                    {milestone.title}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {milestones.some((m) => m.isCustom) && (
            <div className="pt-4 border-t">
              <h4 className="text-sm font-medium text-muted-foreground mb-3">
                Custom Items
              </h4>
              <div className="space-y-3">
                {milestones
                  .filter((m) => m.isCustom)
                  .map((milestone, index) => (
                    <div
                      key={milestone.id}
                      className="flex items-center gap-3 group relative"
                    >
                      <div
                        className="absolute left-[11px] h-full w-0.5 bg-border -z-10"
                        style={{
                          top: index === 0 ? "50%" : 0,
                          bottom:
                            index ===
                            milestones.filter((m) => m.isCustom).length - 1
                              ? "50%"
                              : 0,
                        }}
                      />
                      <Checkbox
                        id={milestone.id}
                        checked={milestone.completed}
                        onCheckedChange={(checked) =>
                          onMilestoneToggle(milestone.id, checked as boolean)
                        }
                      />
                      <label
                        htmlFor={milestone.id}
                        className={`text-sm ${milestone.completed ? "line-through text-muted-foreground" : ""}`}
                      >
                        {milestone.title}
                      </label>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
      <div className="p-4 border-t">
        {isAdding ? (
          <form onSubmit={handleAddSubmit} className="flex gap-2">
            <Input
              value={newMilestone}
              onChange={(e) => setNewMilestone(e.target.value)}
              placeholder="Enter milestone title"
              className="flex-1"
            />
            <Button type="submit" disabled={!newMilestone.trim()}>
              Add
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsAdding(false)}
            >
              Cancel
            </Button>
          </form>
        ) : (
          <Button
            variant="outline"
            className="w-full"
            onClick={() => setIsAdding(true)}
          >
            <Plus className="w-4 h-4 mr-2" /> Add Item
          </Button>
        )}
      </div>
    </div>
  );
};

export default Checklist;
