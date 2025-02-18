export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      activities: {
        Row: {
          content: string
          created_at: string | null
          deal_id: string | null
          id: string
          metadata: Json | null
          type: string
          user_id: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          deal_id?: string | null
          id?: string
          metadata?: Json | null
          type: string
          user_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          deal_id?: string | null
          id?: string
          metadata?: Json | null
          type?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "activities_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: false
            referencedRelation: "deals"
            referencedColumns: ["id"]
          },
        ]
      }
      contacts: {
        Row: {
          avatar_url: string | null
          company: string | null
          created_at: string | null
          email: string | null
          id: string
          name: string
          phone: string | null
          role: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          company?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          name: string
          phone?: string | null
          role?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          company?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          name?: string
          phone?: string | null
          role?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      deal_contacts: {
        Row: {
          contact_id: string | null
          created_at: string | null
          deal_id: string | null
          id: string
        }
        Insert: {
          contact_id?: string | null
          created_at?: string | null
          deal_id?: string | null
          id?: string
        }
        Update: {
          contact_id?: string | null
          created_at?: string | null
          deal_id?: string | null
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "deal_contacts_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deal_contacts_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: false
            referencedRelation: "deals"
            referencedColumns: ["id"]
          },
        ]
      }
      deal_milestones: {
        Row: {
          completed: boolean | null
          completed_at: string | null
          created_at: string | null
          deal_id: string | null
          description: string | null
          display_order: number | null
          id: string
          is_custom: boolean | null
          template_id: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          completed?: boolean | null
          completed_at?: string | null
          created_at?: string | null
          deal_id?: string | null
          description?: string | null
          display_order?: number | null
          id?: string
          is_custom?: boolean | null
          template_id?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          completed?: boolean | null
          completed_at?: string | null
          created_at?: string | null
          deal_id?: string | null
          description?: string | null
          display_order?: number | null
          id?: string
          is_custom?: boolean | null
          template_id?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "deal_milestones_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: false
            referencedRelation: "deals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deal_milestones_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "milestone_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      deal_stages: {
        Row: {
          color_scheme: Json | null
          created_at: string | null
          display_order: number
          id: string
          is_active: boolean | null
          name: string
          updated_at: string | null
        }
        Insert: {
          color_scheme?: Json | null
          created_at?: string | null
          display_order: number
          id?: string
          is_active?: boolean | null
          name: string
          updated_at?: string | null
        }
        Update: {
          color_scheme?: Json | null
          created_at?: string | null
          display_order?: number
          id?: string
          is_active?: boolean | null
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      deals: {
        Row: {
          active_patients: string | null
          address: string | null
          asking_price: number | null
          avg_new_patients_per_month: number | null
          building_for_sale: boolean | null
          care_credit_percent: number | null
          cash_at_close: number | null
          cash_check_card_percent: number | null
          city: string | null
          company_name: string
          contact_email: string | null
          contact_name: string | null
          contact_phone: string | null
          created_at: string | null
          data_room_url: string | null
          deal_value: number
          doctor_days_per_week: number | null
          doctor_exiting: string | null
          due_date: string
          ebitda_post: number | null
          ebitda_pre: number | null
          enterprise_value: number | null
          equity_rollover: number | null
          future_hygiene: string | null
          gp_production: number | null
          hygiene_days_per_week: number | null
          hygiene_production: number | null
          id: string
          insurance_percent: number | null
          lease_expiration: string | null
          lease_extensions: string | null
          lease_rate: string | null
          np_count: number | null
          num_ops: number | null
          num_ops_details: string | null
          office_hours: string | null
          office_name: string | null
          office_size: number | null
          operating_days: number | null
          patient_count: number | null
          practice_type: string | null
          prospectus_url: string | null
          revenue: number | null
          review_score: string | null
          seller_email: string | null
          seller_name: string | null
          seller_phone: string | null
          specialty_production: number | null
          specialty_referrals: string | null
          stage_id: string | null
          state: string | null
          status: Database["public"]["Enums"]["deal_status"] | null
          title: string
          updated_at: string | null
          workbook_url: string | null
          years_in_operation: number | null
        }
        Insert: {
          active_patients?: string | null
          address?: string | null
          asking_price?: number | null
          avg_new_patients_per_month?: number | null
          building_for_sale?: boolean | null
          care_credit_percent?: number | null
          cash_at_close?: number | null
          cash_check_card_percent?: number | null
          city?: string | null
          company_name: string
          contact_email?: string | null
          contact_name?: string | null
          contact_phone?: string | null
          created_at?: string | null
          data_room_url?: string | null
          deal_value: number
          doctor_days_per_week?: number | null
          doctor_exiting?: string | null
          due_date: string
          ebitda_post?: number | null
          ebitda_pre?: number | null
          enterprise_value?: number | null
          equity_rollover?: number | null
          future_hygiene?: string | null
          gp_production?: number | null
          hygiene_days_per_week?: number | null
          hygiene_production?: number | null
          id?: string
          insurance_percent?: number | null
          lease_expiration?: string | null
          lease_extensions?: string | null
          lease_rate?: string | null
          np_count?: number | null
          num_ops?: number | null
          num_ops_details?: string | null
          office_hours?: string | null
          office_name?: string | null
          office_size?: number | null
          operating_days?: number | null
          patient_count?: number | null
          practice_type?: string | null
          prospectus_url?: string | null
          revenue?: number | null
          review_score?: string | null
          seller_email?: string | null
          seller_name?: string | null
          seller_phone?: string | null
          specialty_production?: number | null
          specialty_referrals?: string | null
          stage_id?: string | null
          state?: string | null
          status?: Database["public"]["Enums"]["deal_status"] | null
          title: string
          updated_at?: string | null
          workbook_url?: string | null
          years_in_operation?: number | null
        }
        Update: {
          active_patients?: string | null
          address?: string | null
          asking_price?: number | null
          avg_new_patients_per_month?: number | null
          building_for_sale?: boolean | null
          care_credit_percent?: number | null
          cash_at_close?: number | null
          cash_check_card_percent?: number | null
          city?: string | null
          company_name?: string
          contact_email?: string | null
          contact_name?: string | null
          contact_phone?: string | null
          created_at?: string | null
          data_room_url?: string | null
          deal_value?: number
          doctor_days_per_week?: number | null
          doctor_exiting?: string | null
          due_date?: string
          ebitda_post?: number | null
          ebitda_pre?: number | null
          enterprise_value?: number | null
          equity_rollover?: number | null
          future_hygiene?: string | null
          gp_production?: number | null
          hygiene_days_per_week?: number | null
          hygiene_production?: number | null
          id?: string
          insurance_percent?: number | null
          lease_expiration?: string | null
          lease_extensions?: string | null
          lease_rate?: string | null
          np_count?: number | null
          num_ops?: number | null
          num_ops_details?: string | null
          office_hours?: string | null
          office_name?: string | null
          office_size?: number | null
          operating_days?: number | null
          patient_count?: number | null
          practice_type?: string | null
          prospectus_url?: string | null
          revenue?: number | null
          review_score?: string | null
          seller_email?: string | null
          seller_name?: string | null
          seller_phone?: string | null
          specialty_production?: number | null
          specialty_referrals?: string | null
          stage_id?: string | null
          state?: string | null
          status?: Database["public"]["Enums"]["deal_status"] | null
          title?: string
          updated_at?: string | null
          workbook_url?: string | null
          years_in_operation?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "deals_stage_id_fkey"
            columns: ["stage_id"]
            isOneToOne: false
            referencedRelation: "deal_stages"
            referencedColumns: ["id"]
          },
        ]
      }
      milestone_templates: {
        Row: {
          created_at: string | null
          default_display_order: number | null
          description: string | null
          id: string
          is_active: boolean | null
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          default_display_order?: number | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          default_display_order?: number | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string | null
          email: string
          full_name: string | null
          id: string
          role_id: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          full_name?: string | null
          id: string
          role_id: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          full_name?: string | null
          id?: string
          role_id?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "user_roles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string | null
          description: string | null
          id: number
          name: Database["public"]["Enums"]["user_role"]
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: number
          name: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: number
          name?: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      deal_status: "active" | "pending" | "completed"
      user_role: "admin" | "manager" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
