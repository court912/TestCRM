import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import type { Database } from "@/types/supabase";
import { DealPageLayout } from "./DealPageLayout";
import { DealHeader } from "./DealHeader";
import { DealRightSidebar } from "./DealRightSidebar";
import { LoadingState } from "./LoadingState";
import { NotFoundState } from "./NotFoundState";

type Deal = Database["public"]["Tables"]["deals"]["Row"];

const DealPage = () => {
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

  const { id } = useParams();
  const [deal, setDeal] = useState<Deal | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [stages, setStages] = useState<
    Array<{ id: string; name: string; color_scheme: any }>
  >([]);

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
    const fetchDeal = async () => {
      if (!id) {
        setError(new Error("No deal ID provided"));
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const { data, error } = await supabase
          .from("deals")
          .select("*")
          .eq("id", id)
          .single();

        if (error) throw error;
        if (!data) throw new Error("Deal not found");

        setDeal(data);
      } catch (err) {
        console.error("Error fetching deal:", err);
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDeal();
  }, [id]);

  if (isLoading) {
    return <LoadingState />;
  }

  if (error || !deal) {
    return <NotFoundState />;
  }

  const handleInputChange = async (
    field: string,
    value: string | number | boolean,
  ) => {
    if (!deal) return;

    // Update local state
    setDeal((prev) => {
      if (!prev) return prev;
      return { ...prev, [field]: value };
    });

    // Update in Supabase
    const { error } = await supabase
      .from("deals")
      .update({ [field]: value })
      .eq("id", deal.id);

    if (error) {
      console.error("Error updating deal:", error);
    }
  };

  return (
    <DealPageLayout
      title={deal.title}
      isSidebarCollapsed={isSidebarCollapsed}
      onSidebarCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      rightSidebar={<DealRightSidebar dealId={id || ""} />}
    >
      <DealHeader
        deal={deal}
        stages={stages}
        onStageChange={(value) => handleInputChange("stage_id", value)}
      />
    </DealPageLayout>
  );
};

export default DealPage;
