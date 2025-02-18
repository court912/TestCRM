import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import DealTable from "./DealTable";
import Sidebar from "./Sidebar";
import type { Database } from "@/types/supabase";
import { cn } from "@/lib/utils";

type Deal = Database["public"]["Tables"]["deals"]["Row"];
type Stage = Database["public"]["Tables"]["deal_stages"]["Row"];

function Home() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [stages, setStages] = useState<Stage[]>([]);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    const saved = localStorage.getItem("sidebarCollapsed");
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    localStorage.setItem(
      "sidebarCollapsed",
      JSON.stringify(isSidebarCollapsed),
    );
  }, [isSidebarCollapsed]);

  useEffect(() => {
    const fetchStages = async () => {
      const { data, error } = await supabase
        .from("deal_stages")
        .select("*")
        .order("display_order");

      if (error) {
        console.error("Error fetching stages:", error);
        return;
      }

      setStages(data || []);
    };

    fetchStages();
  }, []);

  useEffect(() => {
    console.log("Fetching deals...");
    const fetchDeals = async () => {
      const { data, error } = await supabase
        .from("deals")
        .select(
          `
          *,
          stage:deal_stages(*)
        `,
        )
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching deals:", error);
        return;
      }
      console.log("Deals fetched:", data);

      setDeals(data || []);
    };

    fetchDeals();

    // Set up realtime subscription
    const channel = supabase
      .channel("deals_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "deals",
        },
        () => {
          fetchDeals();
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleReorder = async (reorderedDeals: Deal[]) => {
    setDeals(reorderedDeals);
  };

  const dealsByStage = stages.reduce(
    (acc, stage) => {
      acc[stage.id] = deals.filter((deal) => deal.stage_id === stage.id);
      return acc;
    },
    {} as Record<string, Deal[]>,
  );

  return (
    <div className="min-h-screen bg-background">
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        onCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />
      <div
        className={cn(
          "flex-1 transition-all duration-300",
          isSidebarCollapsed ? "ml-[60px]" : "ml-[200px]",
        )}
      >
        <header className="w-full h-16 border-b bg-background flex items-center px-4 fixed top-0 z-50">
          <h1 className="text-xl font-semibold">Deals</h1>
        </header>

        <main className="pt-20 pb-8 px-4">
          <div className="max-w-[1040px] mx-auto space-y-8">
            {stages.map((stage) => (
              <div
                key={stage.id}
                className="rounded-md border bg-white overflow-hidden"
              >
                <div className="p-4 border-b bg-muted/30">
                  <h2 className="text-lg font-semibold">{stage.name}</h2>
                </div>
                {dealsByStage[stage.id]?.length > 0 ? (
                  <DealTable
                    deals={dealsByStage[stage.id]}
                    onReorder={handleReorder}
                  />
                ) : (
                  <div className="p-4 text-center text-muted-foreground">
                    No deals in this stage
                  </div>
                )}
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}

export default Home;
