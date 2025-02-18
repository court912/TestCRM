import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Home, ChevronLeft, ChevronRight } from "lucide-react";

interface SidebarProps {
  isCollapsed: boolean;
  onCollapse: () => void;
}

const Sidebar = ({ isCollapsed, onCollapse }: SidebarProps) => {
  return (
    <div
      className={cn(
        "fixed left-0 top-0 bottom-0 z-20 flex flex-col border-r bg-background transition-all duration-300",
        isCollapsed ? "w-[60px]" : "w-[200px]",
      )}
    >
      <div className="flex h-16 items-center border-b px-4">
        <Link to="/" className="flex items-center gap-2">
          <Home className="h-5 w-5" />
          {!isCollapsed && <span className="font-semibold">Dashboard</span>}
        </Link>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="absolute -right-4 top-20 h-8 w-8 rounded-full border bg-background"
        onClick={onCollapse}
      >
        {isCollapsed ? (
          <ChevronRight className="h-4 w-4" />
        ) : (
          <ChevronLeft className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
};

export default Sidebar;
