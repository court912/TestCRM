import React from "react";
import { ScrollArea } from "./ui/scroll-area";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { MessageSquare } from "lucide-react";

interface Comment {
  id: string;
  user: {
    name: string;
    avatar?: string;
  };
  content: string;
  timestamp: string;
}

interface ActivityFeedProps {
  comments?: Comment[];
  onAddComment?: (content: string) => void;
}

const defaultComments: Comment[] = [
  {
    id: "1",
    user: {
      name: "John Doe",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=john",
    },
    content: "Updated deal value to $2.5M based on latest valuation",
    timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
  },
  {
    id: "2",
    user: {
      name: "Sarah Smith",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah",
    },
    content: "Scheduled meeting with stakeholders for next week",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
  {
    id: "3",
    user: {
      name: "Mike Johnson",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=mike",
    },
    content:
      "Completed initial due diligence review. All documents look good, proceeding with next steps.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
  },
  {
    id: "4",
    user: {
      name: "Emily Chen",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=emily",
    },
    content:
      "Financial models updated with Q2 projections. EBITDA margins showing improvement.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
  },
  {
    id: "5",
    user: {
      name: "Alex Turner",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=alex",
    },
    content:
      "Legal team review completed - all documents approved. Ready for final signatures.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 96).toISOString(),
  },
  {
    id: "6",
    user: {
      name: "Rachel Green",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=rachel",
    },
    content:
      "Partner meeting scheduled for next month. Key stakeholders confirmed attendance.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 120).toISOString(),
  },
  {
    id: "7",
    user: {
      name: "David Kim",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=david",
    },
    content:
      "Market analysis report submitted. Shows strong growth potential in target segments.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 144).toISOString(),
  },
  {
    id: "8",
    user: {
      name: "Lisa Wong",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=lisa",
    },
    content:
      "Updated compliance documentation. All regulatory requirements met.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 168).toISOString(),
  },
];

const ActivityFeed = ({
  comments = defaultComments,
  onAddComment = () => {},
}: ActivityFeedProps) => {
  const [newComment, setNewComment] = React.useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    onAddComment(newComment);
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
          {comments
            .sort(
              (a, b) =>
                new Date(b.timestamp).getTime() -
                new Date(a.timestamp).getTime(),
            )
            .map((comment) => (
              <div key={comment.id} className="flex gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={comment.user.avatar} />
                  <AvatarFallback>
                    {comment.user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">{comment.user.name}</p>
                    <span className="text-xs text-muted-foreground">
                      {formatTimestamp(comment.timestamp)}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {comment.content}
                  </p>
                </div>
              </div>
            ))}
        </div>
      </ScrollArea>

      <form onSubmit={handleSubmit} className="p-4 border-t flex-none bg-white">
        <div className="flex gap-2">
          <Input
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" disabled={!newComment.trim()}>
            Send
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ActivityFeed;
