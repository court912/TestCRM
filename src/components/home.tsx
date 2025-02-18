import { Link } from "react-router-dom";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

function Home() {
  const [deals, setDeals] = useState<any[]>([]);

  useEffect(() => {
    const fetchDeals = async () => {
      const { data, error } = await supabase
        .from("deals")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching deals:", error);
        return;
      }

      setDeals(data || []);
    };

    fetchDeals();
  }, []);

  return (
    <div className="w-screen h-screen bg-background p-8">
      <h1 className="text-2xl font-bold mb-4">Deals</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {deals.map((deal) => (
          <Link
            key={deal.id}
            to={`/deals/${deal.id}`}
            className="block p-6 bg-white rounded-lg border shadow-sm hover:shadow-md transition-shadow"
          >
            <h2 className="text-lg font-semibold mb-2">{deal.title}</h2>
            <p className="text-muted-foreground mb-2">{deal.company_name}</p>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">
                ${deal.deal_value?.toLocaleString()}
              </span>
              <span className="text-sm bg-primary/10 text-primary px-2 py-1 rounded">
                {deal.status || "Active"}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Home;
