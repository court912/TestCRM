import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import DealTable from "./DealTable";
import Sidebar from "./Sidebar";
import { NewDealDialog } from "./NewDealDialog";
import type { Database } from "@/types/supabase";
import { cn } from "@/lib/utils";
import { DragDropContext, Droppable } from "@hello-pangea/dnd";

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
    const fetchDeals = async () => {
      const { data, error } = await supabase
        .from("deals")
        .select(
          `
          *,
          stage:deal_stages(*)
        `,
        )
        .order("sort_order", { ascending: true });

      if (error) {
        console.error("Error fetching deals:", error);
        return;
      }

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

  const updateDealOrder = async (
    dealId: string,
    newSortOrder: number,
    newStageId?: string,
  ) => {
    const updates: any = { sort_order: newSortOrder };
    if (newStageId) updates.stage_id = newStageId;

    const { error } = await supabase
      .from("deals")
      .update(updates)
      .eq("id", dealId);

    if (error) {
      console.error("Error updating deal order:", error);
      return false;
    }
    return true;
  };

  const handleDragEnd = async (result: any) => {
    if (!result.destination) return;

    const sourceStageId = result.source.droppableId;
    const destinationStageId = result.destination.droppableId;
    const dealId = result.draggableId;
    const destinationIndex = result.destination.index;

    // Get all deals in the destination stage, sorted by sort_order
    const destinationDeals = deals
      .filter(
        (deal) => deal.stage_id === destinationStageId && deal.id !== dealId,
      )
      .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));

    // Calculate the new sort_order value
    let newSortOrder: number;
    if (destinationDeals.length === 0) {
      // If no other deals in destination stage, start at 1000
      newSortOrder = 1000;
    } else if (destinationIndex === 0) {
      // If moving to start, use half of first item's sort_order
      newSortOrder = (destinationDeals[0].sort_order || 1000) / 2;
    } else if (destinationIndex >= destinationDeals.length) {
      // If moving to end, add 1000 to last item's sort_order
      newSortOrder =
        (destinationDeals[destinationDeals.length - 1].sort_order || 0) + 1000;
    } else {
      // If moving between items, use average of surrounding items' sort_orders
      const prevOrder = destinationDeals[destinationIndex - 1].sort_order || 0;
      const nextOrder =
        destinationDeals[destinationIndex].sort_order || prevOrder + 1000;
      newSortOrder = prevOrder + (nextOrder - prevOrder) / 2;
    }

    // Update the database
    await updateDealOrder(dealId, newSortOrder, destinationStageId);

    // Update local state
    const newDeals = deals.map((deal) =>
      deal.id === dealId
        ? { ...deal, sort_order: newSortOrder, stage_id: destinationStageId }
        : deal,
    );
    setDeals(newDeals);
  };

  const dealsByStage = stages.reduce(
    (acc, stage) => {
      acc[stage.id] = deals
        .filter((deal) => deal.stage_id === stage.id)
        .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
      return acc;
    },
    {} as Record<string, Deal[]>,
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Fixed Header */}
      <header className="w-full h-16 border-b bg-background flex items-center justify-between px-4 fixed top-0 left-0 right-0 z-50">
        <h1 className="text-xl font-semibold">Deals</h1>
        <NewDealDialog />
      </header>

      {/* Sidebar */}
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        onCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />

      {/* Main Content */}
      <div
        className={cn(
          "pt-16 transition-all duration-300",
          isSidebarCollapsed ? "ml-[60px]" : "ml-[200px]",
        )}
      >
        <main className="p-8">
          <div className="max-w-[1040px] mx-auto space-y-8">
            <DragDropContext onDragEnd={handleDragEnd}>
              {stages.map((stage) => (
                <div
                  key={stage.id}
                  className="rounded-md border bg-white overflow-hidden"
                >
                  <div className="p-4 border-b bg-muted/30">
                    <h2 className="text-lg font-semibold">{stage.name}</h2>
                  </div>
                  <Droppable droppableId={stage.id}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className="min-h-[50px]"
                      >
                        {dealsByStage[stage.id]?.length > 0 ? (
                          <DealTable
                            deals={dealsByStage[stage.id]}
                            stageId={stage.id}
                          />
                        ) : (
                          <div className="p-4 text-center text-muted-foreground">
                            No deals in this stage
                          </div>
                        )}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </div>
              ))}
            </DragDropContext>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Home;
