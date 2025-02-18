import React, { useEffect, useState } from "react";
import { ScrollArea } from "./ui/scroll-area";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { MessageSquare } from "lucide-react";
import { supabase } from "@/lib/supabase";
import type { Database } from "@/types/supabase";

interface ActivityFeedProps {
  dealId: string;
}

type Activity = Database["public"]["Tables"]["activities"]["Row"];

const ActivityFeed = ({ dealId }: ActivityFeedProps) => {
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    const fetchActivities = async () => {
      const { data, error } = await supabase
        .from("activities")
        .select("*")
        .eq("deal_id", dealId)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching activities:", error);
        return;
      }

      setActivities(data || []);
    };

    fetchActivities();

    // Set up realtime subscription
    const channel = supabase
      .channel("activities_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "activities",
          filter: `deal_id=eq.${dealId}`,
        },
        (payload) => {
          console.log("Change received!", payload);
          fetchActivities();
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [dealId]);
  const [newComment, setNewComment] = React.useState("");
  const [activityType, setActivityType] = React.useState("comment");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const { error } = await supabase.from("activities").insert({
      deal_id: dealId,
      content: newComment,
      type: activityType,
      user_id: "3f189192-0a5f-4d7f-9495-753d63ad6659", // Hardcoded for now
    });

    if (error) {
      console.error("Error adding comment:", error);
      return;
    }

    // Refresh activities
    const { data: newActivities } = await supabase
      .from("activities")
      .select("*")
      .eq("deal_id", dealId)
      .order("created_at", { ascending: false });

    setActivities(newActivities || []);
    setNewComment("");
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor(diff / (1000 * 60));

    if (hours >= 24) {
      return date.toLocaleDateString();
    } else if (hours >= 1) {
      return `${hours}h ago`;
    } else if (minutes >= 1) {
      return `${minutes}m ago`;
    } else {
      return "just now";
    }
  };

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="p-4 border-b flex-none">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <MessageSquare className="w-5 h-5" /> Activity Feed
        </h3>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex gap-3">
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${activity.user_id}`}
                />
                <AvatarFallback>
                  {activity.user_id?.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">
                    User {activity.user_id?.slice(0, 6)}
                  </p>
                  <span className="text-xs text-muted-foreground">
                    {formatTimestamp(activity.created_at || "")}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {activity.content}
                </p>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      <form onSubmit={handleSubmit} className="flex-none p-4 border-t bg-white">
        <div className="space-y-2">
          <Input
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <div className="flex gap-2">
            <select
              className="h-9 flex-1 rounded-md border bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              value={activityType}
              onChange={(e) => setActivityType(e.target.value)}
            >
              <option value="comment">Comment</option>
              <option value="milestone">Milestone</option>
              <option value="deal_update">Deal Update</option>
              <option value="document">Document</option>
              <option value="meeting">Meeting</option>
              <option value="review">Review</option>
              <option value="phone_call">Phone Call</option>
            </select>
            <Button type="submit" disabled={!newComment.trim()}>
              Send
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ActivityFeed;
