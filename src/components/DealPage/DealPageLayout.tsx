import { cn } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";
import { Button } from "../ui/button";
import Sidebar from "../Sidebar";
import { useNavigate } from "react-router-dom";

interface DealPageLayoutProps {
  children: React.ReactNode;
  title: string;
  isSidebarCollapsed: boolean;
  onSidebarCollapse: () => void;
  rightSidebar: React.ReactNode;
}

export const DealPageLayout = ({
  children,
  title,
  isSidebarCollapsed,
  onSidebarCollapse,
  rightSidebar,
}: DealPageLayoutProps) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        onCollapse={onSidebarCollapse}
      />
      <div
        className={cn(
          "flex-1 transition-all duration-300",
          isSidebarCollapsed ? "ml-[60px]" : "ml-[200px]",
        )}
      >
        <div className="flex-1 relative">
          {/* Right Sidebar */}
          {rightSidebar}

          <div className="mr-[400px]">
            <header className="w-full h-16 border-b bg-background flex items-center px-4 fixed top-0 z-50">
              <Button
                variant="ghost"
                onClick={() => navigate(-1)}
                className="mr-4"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <h1 className="text-xl font-semibold">{title}</h1>
            </header>

            <main className="pt-20 pb-8 px-4">
              <div className="space-y-8">{children}</div>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
};
