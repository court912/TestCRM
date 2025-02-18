import ActivityFeed from "../ActivityFeed";
import Checklist from "../Checklist";

interface DealRightSidebarProps {
  dealId: string;
}

export const DealRightSidebar = ({ dealId }: DealRightSidebarProps) => {
  return (
    <aside className="fixed right-0 top-0 bottom-0 w-[400px] border-l bg-background flex flex-col">
      {/* Checklist Section - Fixed Height */}
      <div className="flex-none">
        <Checklist dealId={dealId} />
      </div>

      {/* Activity Feed Section - Fills Remaining Space */}
      <div className="flex-1 overflow-hidden">
        <ActivityFeed dealId={dealId} />
      </div>
    </aside>
  );
};
