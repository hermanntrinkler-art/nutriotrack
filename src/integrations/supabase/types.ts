export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      badge_images: {
        Row: {
          badge_id: string
          created_at: string
          id: string
          image_url: string
          updated_at: string
        }
        Insert: {
          badge_id: string
          created_at?: string
          id?: string
          image_url: string
          updated_at?: string
        }
        Update: {
          badge_id?: string
          created_at?: string
          id?: string
          image_url?: string
          updated_at?: string
        }
        Relationships: []
      }
      custom_products: {
        Row: {
          barcode: string
          calories: number
          carbs_g: number
          created_at: string
          default_quantity: number
          default_unit: string
          fat_g: number
          food_name: string
          id: string
          protein_g: number
          updated_at: string
          user_id: string
        }
        Insert: {
          barcode: string
          calories?: number
          carbs_g?: number
          created_at?: string
          default_quantity?: number
          default_unit?: string
          fat_g?: number
          food_name: string
          id?: string
          protein_g?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          barcode?: string
          calories?: number
          carbs_g?: number
          created_at?: string
          default_quantity?: number
          default_unit?: string
          fat_g?: number
          food_name?: string
          id?: string
          protein_g?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      meal_entries: {
        Row: {
          ai_analysis_status:
            | Database["public"]["Enums"]["ai_analysis_status"]
            | null
          created_at: string
          entry_date: string
          entry_time: string | null
          id: string
          image_url: string | null
          meal_type: Database["public"]["Enums"]["meal_type"]
          notes: string | null
          total_calories: number | null
          total_carbs_g: number | null
          total_fat_g: number | null
          total_protein_g: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          ai_analysis_status?:
            | Database["public"]["Enums"]["ai_analysis_status"]
            | null
          created_at?: string
          entry_date?: string
          entry_time?: string | null
          id?: string
          image_url?: string | null
          meal_type?: Database["public"]["Enums"]["meal_type"]
          notes?: string | null
          total_calories?: number | null
          total_carbs_g?: number | null
          total_fat_g?: number | null
          total_protein_g?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          ai_analysis_status?:
            | Database["public"]["Enums"]["ai_analysis_status"]
            | null
          created_at?: string
          entry_date?: string
          entry_time?: string | null
          id?: string
          image_url?: string | null
          meal_type?: Database["public"]["Enums"]["meal_type"]
          notes?: string | null
          total_calories?: number | null
          total_carbs_g?: number | null
          total_fat_g?: number | null
          total_protein_g?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      meal_food_items: {
        Row: {
          calories: number | null
          carbs_g: number | null
          confidence_score: number | null
          created_at: string
          fat_g: number | null
          food_name: string
          id: string
          meal_entry_id: string
          protein_g: number | null
          quantity: number | null
          unit: string | null
          was_user_edited: boolean | null
        }
        Insert: {
          calories?: number | null
          carbs_g?: number | null
          confidence_score?: number | null
          created_at?: string
          fat_g?: number | null
          food_name: string
          id?: string
          meal_entry_id: string
          protein_g?: number | null
          quantity?: number | null
          unit?: string | null
          was_user_edited?: boolean | null
        }
        Update: {
          calories?: number | null
          carbs_g?: number | null
          confidence_score?: number | null
          created_at?: string
          fat_g?: number | null
          food_name?: string
          id?: string
          meal_entry_id?: string
          protein_g?: number | null
          quantity?: number | null
          unit?: string | null
          was_user_edited?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "meal_food_items_meal_entry_id_fkey"
            columns: ["meal_entry_id"]
            isOneToOne: false
            referencedRelation: "meal_entries"
            referencedColumns: ["id"]
          },
        ]
      }
      nutrition_daily_summaries: {
        Row: {
          calories_remaining: number | null
          calories_total: number | null
          carbs_remaining_g: number | null
          carbs_total_g: number | null
          created_at: string
          fat_remaining_g: number | null
          fat_total_g: number | null
          id: string
          protein_remaining_g: number | null
          protein_total_g: number | null
          summary_date: string
          updated_at: string
          user_id: string
        }
        Insert: {
          calories_remaining?: number | null
          calories_total?: number | null
          carbs_remaining_g?: number | null
          carbs_total_g?: number | null
          created_at?: string
          fat_remaining_g?: number | null
          fat_total_g?: number | null
          id?: string
          protein_remaining_g?: number | null
          protein_total_g?: number | null
          summary_date?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          calories_remaining?: number | null
          calories_total?: number | null
          carbs_remaining_g?: number | null
          carbs_total_g?: number | null
          created_at?: string
          fat_remaining_g?: number | null
          fat_total_g?: number | null
          id?: string
          protein_remaining_g?: number | null
          protein_total_g?: number | null
          summary_date?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          daily_photo_scans: number
          daily_scans_reset_date: string
          email: string | null
          id: string
          language: string | null
          name: string | null
          onboarding_completed: boolean | null
          subscription_end_date: string | null
          subscription_start_date: string | null
          subscription_status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          daily_photo_scans?: number
          daily_scans_reset_date?: string
          email?: string | null
          id?: string
          language?: string | null
          name?: string | null
          onboarding_completed?: boolean | null
          subscription_end_date?: string | null
          subscription_start_date?: string | null
          subscription_status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          daily_photo_scans?: number
          daily_scans_reset_date?: string
          email?: string | null
          id?: string
          language?: string | null
          name?: string | null
          onboarding_completed?: boolean | null
          subscription_end_date?: string | null
          subscription_start_date?: string | null
          subscription_status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      saved_recipe_items: {
        Row: {
          calories: number | null
          carbs_g: number | null
          created_at: string
          fat_g: number | null
          food_name: string
          id: string
          protein_g: number | null
          quantity: number | null
          recipe_id: string
          unit: string | null
        }
        Insert: {
          calories?: number | null
          carbs_g?: number | null
          created_at?: string
          fat_g?: number | null
          food_name: string
          id?: string
          protein_g?: number | null
          quantity?: number | null
          recipe_id: string
          unit?: string | null
        }
        Update: {
          calories?: number | null
          carbs_g?: number | null
          created_at?: string
          fat_g?: number | null
          food_name?: string
          id?: string
          protein_g?: number | null
          quantity?: number | null
          recipe_id?: string
          unit?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "saved_recipe_items_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "saved_recipes"
            referencedColumns: ["id"]
          },
        ]
      }
      saved_recipes: {
        Row: {
          created_at: string
          emoji: string | null
          id: string
          meal_type: string | null
          name: string
          total_calories: number | null
          total_carbs_g: number | null
          total_fat_g: number | null
          total_protein_g: number | null
          updated_at: string
          use_count: number | null
          user_id: string
        }
        Insert: {
          created_at?: string
          emoji?: string | null
          id?: string
          meal_type?: string | null
          name: string
          total_calories?: number | null
          total_carbs_g?: number | null
          total_fat_g?: number | null
          total_protein_g?: number | null
          updated_at?: string
          use_count?: number | null
          user_id: string
        }
        Update: {
          created_at?: string
          emoji?: string | null
          id?: string
          meal_type?: string | null
          name?: string
          total_calories?: number | null
          total_carbs_g?: number | null
          total_fat_g?: number | null
          total_protein_g?: number | null
          updated_at?: string
          use_count?: number | null
          user_id?: string
        }
        Relationships: []
      }
      user_goals: {
        Row: {
          activity_level: Database["public"]["Enums"]["activity_level"] | null
          age: number | null
          calorie_target: number | null
          carbs_target_g: number | null
          created_at: string
          current_weight_kg: number | null
          deficit_intensity: number | null
          fat_target_g: number | null
          goal_type: Database["public"]["Enums"]["goal_type"] | null
          goal_weight_kg: number | null
          height_cm: number | null
          id: string
          protein_target_g: number | null
          sex: string | null
          start_weight_kg: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          activity_level?: Database["public"]["Enums"]["activity_level"] | null
          age?: number | null
          calorie_target?: number | null
          carbs_target_g?: number | null
          created_at?: string
          current_weight_kg?: number | null
          deficit_intensity?: number | null
          fat_target_g?: number | null
          goal_type?: Database["public"]["Enums"]["goal_type"] | null
          goal_weight_kg?: number | null
          height_cm?: number | null
          id?: string
          protein_target_g?: number | null
          sex?: string | null
          start_weight_kg?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          activity_level?: Database["public"]["Enums"]["activity_level"] | null
          age?: number | null
          calorie_target?: number | null
          carbs_target_g?: number | null
          created_at?: string
          current_weight_kg?: number | null
          deficit_intensity?: number | null
          fat_target_g?: number | null
          goal_type?: Database["public"]["Enums"]["goal_type"] | null
          goal_weight_kg?: number | null
          height_cm?: number | null
          id?: string
          protein_target_g?: number | null
          sex?: string | null
          start_weight_kg?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      weight_entries: {
        Row: {
          created_at: string
          entry_date: string
          id: string
          note: string | null
          user_id: string
          weight_kg: number
        }
        Insert: {
          created_at?: string
          entry_date?: string
          id?: string
          note?: string | null
          user_id: string
          weight_kg: number
        }
        Update: {
          created_at?: string
          entry_date?: string
          id?: string
          note?: string | null
          user_id?: string
          weight_kg?: number
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      activity_level:
        | "sedentary"
        | "lightly_active"
        | "moderately_active"
        | "very_active"
        | "extremely_active"
      ai_analysis_status:
        | "pending"
        | "analyzing"
        | "completed"
        | "failed"
        | "manual"
      app_role: "admin" | "user"
      goal_type: "lose" | "maintain" | "gain"
      meal_type: "breakfast" | "lunch" | "dinner" | "snack"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      activity_level: [
        "sedentary",
        "lightly_active",
        "moderately_active",
        "very_active",
        "extremely_active",
      ],
      ai_analysis_status: [
        "pending",
        "analyzing",
        "completed",
        "failed",
        "manual",
      ],
      app_role: ["admin", "user"],
      goal_type: ["lose", "maintain", "gain"],
      meal_type: ["breakfast", "lunch", "dinner", "snack"],
    },
  },
} as const
