import React, { useState } from "react";
import { ScrollArea } from "./ui/scroll-area";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import { Plus } from "lucide-react";
import { Input } from "./ui/input";

interface Milestone {
  id: string;
  title: string;
  completed: boolean;
}

interface ChecklistProps {
  milestones?: Milestone[];
  onMilestoneToggle?: (id: string, completed: boolean) => void;
  onAddMilestone?: (title: string) => void;
}

const defaultMilestones: Milestone[] = [
  { id: "1", title: "NDA Signed", completed: false },
  { id: "2", title: "Document Requests", completed: false },
  { id: "3", title: "Qualification Determined", completed: false },
  { id: "4", title: "Pro Forma Models Completed", completed: false },
  { id: "5", title: "Partner Introductions", completed: false },
  { id: "6", title: "LOI Sent", completed: false },
  { id: "7", title: "Employment Agreement Sent", completed: false },
  { id: "8", title: "Purchase Agreement Sent", completed: false },
  { id: "9", title: "Due Diligence Sent", completed: false },
];

const Checklist = ({
  milestones = defaultMilestones,
  onMilestoneToggle = () => {},
  onAddMilestone = () => {},
}: ChecklistProps) => {
  const [newMilestone, setNewMilestone] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMilestone.trim()) {
      onAddMilestone(newMilestone);
      setNewMilestone("");
      setIsAdding(false);
    }
  };

  return (
    <div className="h-[300px] border-b bg-white">
      <div className="p-4 border-b">
        <h3 className="text-lg font-semibold">Checklist</h3>
      </div>
      <ScrollArea className="h-[calc(300px-130px)] px-4">
        <div className="space-y-3 py-4">
          {milestones.map((milestone, index) => (
            <div
              key={milestone.id}
              className="flex items-center gap-3 group relative"
            >
              <div
                className="absolute left-[11px] h-full w-0.5 bg-border -z-10"
                style={{
                  top: index === 0 ? "50%" : 0,
                  bottom: index === milestones.length - 1 ? "50%" : 0,
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
