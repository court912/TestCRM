import React, { useState, useEffect, useMemo } from "react";
import Checklist from "./Checklist";
import ActivityFeed from "./ActivityFeed";
import { cn } from "@/lib/utils";
import Sidebar from "./Sidebar";
import { useParams, useNavigate } from "react-router-dom";
import {
  Building2,
  DollarSign,
  Calendar,
  Users,
  Link,
  FileText,
  ArrowLeft,
  MapPin,
  Building,
  User,
  Percent,
  Home,
  Activity,
  Stethoscope,
  Users2,
  Calculator,
  LineChart,
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";
import { Badge } from "./ui/badge";
import { Card } from "./ui/card";
import { supabase } from "@/lib/supabase";
import type { Database } from "@/types/supabase";

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
  const navigate = useNavigate();
  const [deal, setDeal] = useState<Deal | null>(null);
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
      if (!id) return;
      const { data, error } = await supabase
        .from("deals")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error fetching deal:", error);
        return;
      }

      setDeal(data);
    };

    fetchDeal();
  }, [id]);

  if (!deal) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold">Deal not found</h2>
          <Button onClick={() => navigate(-1)}>Go Back</Button>
        </div>
      </div>
    );
  }

  const statusColors = {
    active: "bg-green-100 text-green-800",
    pending: "bg-yellow-100 text-yellow-800",
    completed: "bg-blue-100 text-blue-800",
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(value);
  };

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
    <div className="min-h-screen bg-background">
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        onCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />
      <div
        className={cn(
          "flex-1 flex transition-all duration-300",
          isSidebarCollapsed ? "ml-[60px]" : "ml-[200px]",
        )}
      >
        <div className="flex-1 flex flex-col">
          <header className="w-full h-16 border-b bg-background flex items-center px-4 fixed top-0 z-50">
            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
              className="mr-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <h1 className="text-xl font-semibold">{deal.title}</h1>
          </header>

          <main className="pt-20 pb-8 px-4 max-w-6xl mr-[400px]">
            <div className="space-y-8">
              {/* Header Section */}
              <Card className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div className="space-y-1">
                    <h2 className="text-2xl font-bold">{deal.title}</h2>
                    <div className="flex items-center text-muted-foreground">
                      <Building2 className="w-4 h-4 mr-2" />
                      {deal.company_name}
                    </div>
                  </div>
                  <div className="relative">
                    <select
                      className="h-9 rounded-md w-full pl-3 pr-8 text-sm border bg-background hover:bg-accent transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring appearance-none"
                      value={deal.stage_id || ""}
                      onChange={(e) =>
                        handleInputChange("stage_id", e.target.value)
                      }
                    >
                      <option value="">Select Stage</option>
                      {stages.map((stage) => (
                        <option key={stage.id} value={stage.id}>
                          {stage.name}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-2 top-2.5 pointer-events-none">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-muted-foreground"
                      >
                        <path d="m6 9 6 6 6-6" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    {/* Location Details */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold flex items-center gap-2">
                        <MapPin className="w-5 h-5" /> Location
                      </h3>
                      <div className="space-y-4">
                        <div className="grid grid-cols-4 gap-4">
                          <div className="col-span-2 space-y-2">
                            <Label>Office Name</Label>
                            <Input
                              value={deal.office_name || ""}
                              onChange={(e) =>
                                handleInputChange("office_name", e.target.value)
                              }
                              className="bg-muted"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>State</Label>
                            <Input
                              value={deal.state || ""}
                              onChange={(e) =>
                                handleInputChange("state", e.target.value)
                              }
                              className="bg-muted"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>City</Label>
                            <Input
                              value={deal.city || ""}
                              onChange={(e) =>
                                handleInputChange("city", e.target.value)
                              }
                              className="bg-muted"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-1 gap-4">
                          <div className="space-y-2">
                            <Label>Address</Label>
                            <Input
                              value={deal.address || ""}
                              onChange={(e) =>
                                handleInputChange("address", e.target.value)
                              }
                              className="bg-muted"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Map Embed */}
                    <div>
                      <div className="w-full h-[200px] bg-muted rounded-lg flex items-center justify-center border">
                        <div className="text-muted-foreground flex flex-col items-center gap-2">
                          <MapPin className="w-8 h-8" />
                          <span>Map view coming soon</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Practice Overview */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <Building className="w-5 h-5" /> Practice Overview
                    </h3>
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="grid grid-cols-4 gap-4">
                          <div className="space-y-2">
                            <Label>Doctor Status</Label>
                            <Input
                              value={deal.doctor_exiting || ""}
                              onChange={(e) =>
                                handleInputChange(
                                  "doctor_exiting",
                                  e.target.value,
                                )
                              }
                              className="bg-muted"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label># of Operatories</Label>
                            <Input
                              value={`${deal.num_ops || 0} (${deal.num_ops_details || ""})`}
                              onChange={(e) =>
                                handleInputChange(
                                  "num_ops",
                                  parseInt(e.target.value) || 0,
                                )
                              }
                              className="bg-muted"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Future Hygiene</Label>
                            <Input
                              value={deal.future_hygiene || ""}
                              onChange={(e) =>
                                handleInputChange(
                                  "future_hygiene",
                                  e.target.value,
                                )
                              }
                              className="bg-muted"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Review Score</Label>
                            <Input
                              value={deal.review_score || ""}
                              onChange={(e) =>
                                handleInputChange(
                                  "review_score",
                                  e.target.value,
                                )
                              }
                              className="bg-muted"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="grid grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <Label>Seller Name</Label>
                            <Input
                              value={deal.seller_name || ""}
                              onChange={(e) =>
                                handleInputChange("seller_name", e.target.value)
                              }
                              className="bg-muted"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Seller Email</Label>
                            <Input
                              value={deal.seller_email || ""}
                              onChange={(e) =>
                                handleInputChange(
                                  "seller_email",
                                  e.target.value,
                                )
                              }
                              className="bg-muted"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Seller Phone</Label>
                            <Input
                              value={deal.seller_phone || ""}
                              onChange={(e) =>
                                handleInputChange(
                                  "seller_phone",
                                  e.target.value,
                                )
                              }
                              className="bg-muted"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <Label>Contact Name</Label>
                            <Input
                              value={deal.contact_name || ""}
                              onChange={(e) =>
                                handleInputChange(
                                  "contact_name",
                                  e.target.value,
                                )
                              }
                              className="bg-muted"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Contact Email</Label>
                            <Input
                              value={deal.contact_email || ""}
                              onChange={(e) =>
                                handleInputChange(
                                  "contact_email",
                                  e.target.value,
                                )
                              }
                              className="bg-muted"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Contact Phone</Label>
                            <Input
                              value={deal.contact_phone || ""}
                              onChange={(e) =>
                                handleInputChange(
                                  "contact_phone",
                                  e.target.value,
                                )
                              }
                              className="bg-muted"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Source Links */}
                <div className="mt-6 pt-6 border-t">
                  <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
                    <Link className="w-5 h-5" /> Source Links
                  </h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Data Room URL</Label>
                      <Input
                        placeholder="Enter Data Room URL"
                        className="bg-muted"
                        value={deal.data_room_url || ""}
                        onChange={(e) =>
                          handleInputChange("data_room_url", e.target.value)
                        }
                      />
                      {deal.data_room_url && (
                        <a
                          href={deal.data_room_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:underline block truncate"
                        >
                          Open Data Room
                        </a>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label>M&A Workbook URL</Label>
                      <Input
                        placeholder="Enter M&A Workbook URL"
                        className="bg-muted"
                        value={deal.workbook_url || ""}
                        onChange={(e) =>
                          handleInputChange("workbook_url", e.target.value)
                        }
                      />
                      {deal.workbook_url && (
                        <a
                          href={deal.workbook_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:underline block truncate"
                        >
                          Open M&A Workbook
                        </a>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label>Prospectus URL</Label>
                      <Input
                        placeholder="Enter Prospectus URL"
                        className="bg-muted"
                        value={deal.prospectus_url || ""}
                        onChange={(e) =>
                          handleInputChange("prospectus_url", e.target.value)
                        }
                      />
                      {deal.prospectus_url && (
                        <a
                          href={deal.prospectus_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:underline block truncate"
                        >
                          Open Prospectus
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </Card>

              {/* Financial Details */}
              <Card className="p-6 space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <DollarSign className="w-5 h-5" /> Financial Details
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>EBITDA Pre</Label>
                      <Input
                        value={formatCurrency(deal.ebitda_pre || 0)}
                        onChange={(e) =>
                          handleInputChange(
                            "ebitda_pre",
                            parseFloat(
                              e.target.value.replace(/[^0-9.-]+/g, ""),
                            ) || 0,
                          )
                        }
                        className="bg-muted"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>EBITDA Post</Label>
                      <Input
                        value={formatCurrency(deal.ebitda_post || 0)}
                        onChange={(e) =>
                          handleInputChange(
                            "ebitda_post",
                            parseFloat(
                              e.target.value.replace(/[^0-9.-]+/g, ""),
                            ) || 0,
                          )
                        }
                        className="bg-muted"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Cash at Close</Label>
                        <Input
                          value={formatCurrency(deal.cash_at_close || 0)}
                          onChange={(e) =>
                            handleInputChange(
                              "cash_at_close",
                              parseFloat(
                                e.target.value.replace(/[^0-9.-]+/g, ""),
                              ) || 0,
                            )
                          }
                          className="bg-muted"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Equity Rollover</Label>
                        <Input
                          value={`${deal.equity_rollover || 0}%`}
                          onChange={(e) =>
                            handleInputChange(
                              "equity_rollover",
                              parseInt(e.target.value) || 0,
                            )
                          }
                          className="bg-muted"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>EBITDA Multiple</Label>
                        <Input
                          value={`${((deal.enterprise_value || 0) / (deal.ebitda_pre || 1)).toFixed(1)}x`}
                          readOnly
                          className="bg-muted"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Implied Leverage</Label>
                        <Input
                          value={`${(((deal.enterprise_value || 0) * 0.7) / (deal.ebitda_post || 1)).toFixed(1)}x`}
                          readOnly
                          className="bg-muted"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Asking Price</Label>
                      <Input
                        value={formatCurrency(deal.asking_price || 0)}
                        onChange={(e) =>
                          handleInputChange(
                            "asking_price",
                            parseFloat(
                              e.target.value.replace(/[^0-9.-]+/g, ""),
                            ) || 0,
                          )
                        }
                        className="bg-muted"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Enterprise Value</Label>
                      <Input
                        value={formatCurrency(deal.enterprise_value || 0)}
                        onChange={(e) =>
                          handleInputChange(
                            "enterprise_value",
                            parseFloat(
                              e.target.value.replace(/[^0-9.-]+/g, ""),
                            ) || 0,
                          )
                        }
                        className="bg-muted"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Revenue/Collections</Label>
                      <Input
                        value={formatCurrency(deal.revenue || 0)}
                        onChange={(e) =>
                          handleInputChange(
                            "revenue",
                            parseFloat(
                              e.target.value.replace(/[^0-9.-]+/g, ""),
                            ) || 0,
                          )
                        }
                        className="bg-muted"
                      />
                    </div>
                  </div>
                </div>

                {/* Insurance & Production */}
                <div className="pt-6 mt-6 border-t space-y-4">
                  <h4 className="text-lg font-semibold flex items-center gap-2">
                    <Activity className="w-5 h-5" /> Insurance & Production
                  </h4>
                  <div className="grid grid-cols-6 gap-4">
                    <div className="space-y-2">
                      <Label>GP Production</Label>
                      <Input
                        value={formatCurrency(deal.gp_production || 0)}
                        onChange={(e) =>
                          handleInputChange(
                            "gp_production",
                            parseFloat(
                              e.target.value.replace(/[^0-9.-]+/g, ""),
                            ) || 0,
                          )
                        }
                        className="bg-muted"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Specialty Production</Label>
                      <Input
                        value={formatCurrency(deal.specialty_production || 0)}
                        onChange={(e) =>
                          handleInputChange(
                            "specialty_production",
                            parseFloat(
                              e.target.value.replace(/[^0-9.-]+/g, ""),
                            ) || 0,
                          )
                        }
                        className="bg-muted"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Hygiene Production</Label>
                      <Input
                        value={formatCurrency(deal.hygiene_production || 0)}
                        onChange={(e) =>
                          handleInputChange(
                            "hygiene_production",
                            parseFloat(
                              e.target.value.replace(/[^0-9.-]+/g, ""),
                            ) || 0,
                          )
                        }
                        className="bg-muted"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Cash/Check/Card</Label>
                      <Input
                        value={`${deal.cash_check_card_percent || 0}%`}
                        onChange={(e) =>
                          handleInputChange(
                            "cash_check_card_percent",
                            parseInt(e.target.value) || 0,
                          )
                        }
                        className="bg-muted"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Insurance</Label>
                      <Input
                        value={`${deal.insurance_percent || 0}%`}
                        onChange={(e) =>
                          handleInputChange(
                            "insurance_percent",
                            parseInt(e.target.value) || 0,
                          )
                        }
                        className="bg-muted"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Care Credit</Label>
                      <Input
                        value={`${deal.care_credit_percent || 0}%`}
                        onChange={(e) =>
                          handleInputChange(
                            "care_credit_percent",
                            parseInt(e.target.value) || 0,
                          )
                        }
                        className="bg-muted"
                      />
                    </div>
                  </div>
                </div>
              </Card>

              {/* Practice Additional Details */}
              <Card className="p-6 space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Building className="w-5 h-5" /> Additional Practice Details
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Practice Type</Label>
                      <Input
                        value={deal.practice_type || ""}
                        onChange={(e) =>
                          handleInputChange("practice_type", e.target.value)
                        }
                        className="bg-muted"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Specialty Referrals</Label>
                      <Input
                        value={deal.specialty_referrals || ""}
                        onChange={(e) =>
                          handleInputChange(
                            "specialty_referrals",
                            e.target.value,
                          )
                        }
                        className="bg-muted"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>NP Count</Label>
                        <Input
                          value={deal.np_count || 0}
                          onChange={(e) =>
                            handleInputChange(
                              "np_count",
                              parseInt(e.target.value) || 0,
                            )
                          }
                          className="bg-muted"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Patient Count</Label>
                        <Input
                          value={(deal.patient_count || 0).toLocaleString()}
                          onChange={(e) =>
                            handleInputChange(
                              "patient_count",
                              parseInt(e.target.value.replace(/,/g, "")) || 0,
                            )
                          }
                          className="bg-muted"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Hygiene Schedule</Label>
                      <Input
                        value={`${deal.hygiene_days_per_week || 0} days/week`}
                        onChange={(e) =>
                          handleInputChange(
                            "hygiene_days_per_week",
                            parseInt(e.target.value) || 0,
                          )
                        }
                        className="bg-muted"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Doctor Schedule</Label>
                      <Input
                        value={`${deal.doctor_days_per_week || 0} days/week`}
                        onChange={(e) =>
                          handleInputChange(
                            "doctor_days_per_week",
                            parseInt(e.target.value) || 0,
                          )
                        }
                        className="bg-muted"
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label>Years in Operation</Label>
                        <Input
                          value={deal.years_in_operation || 0}
                          onChange={(e) =>
                            handleInputChange(
                              "years_in_operation",
                              parseInt(e.target.value) || 0,
                            )
                          }
                          className="bg-muted"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Office Size</Label>
                        <Input
                          value={`${deal.office_size || 0} SF`}
                          onChange={(e) =>
                            handleInputChange(
                              "office_size",
                              parseInt(e.target.value) || 0,
                            )
                          }
                          className="bg-muted"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Operating Days</Label>
                        <Input
                          value={`${deal.operating_days || 0} days/week`}
                          onChange={(e) =>
                            handleInputChange(
                              "operating_days",
                              parseInt(e.target.value) || 0,
                            )
                          }
                          className="bg-muted"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </main>

          {/* Right Sidebar */}
          <aside className="fixed right-0 top-16 bottom-0 w-[400px] border-l bg-background flex flex-col">
            {/* Checklist Section - Fixed Height */}
            <div className="flex-none">
              <Checklist dealId={id || ""} />
            </div>

            {/* Activity Feed Section - Fills Remaining Space */}
            <div className="flex-1 overflow-hidden">
              <ActivityFeed dealId={id || ""} />
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default DealPage;
