export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5";
  };
  public: {
    Tables: {
      careers: {
        Row: {
          created_at: string;
          detail: string | null;
          holland_code: string | null;
          id: string;
          name: string;
          short_desc: string | null;
          slug: string;
          source: string | null;
        };
        Insert: {
          created_at?: string;
          detail?: string | null;
          holland_code?: string | null;
          id?: string;
          name: string;
          short_desc?: string | null;
          slug: string;
          source?: string | null;
        };
        Update: {
          created_at?: string;
          detail?: string | null;
          holland_code?: string | null;
          id?: string;
          name?: string;
          short_desc?: string | null;
          slug?: string;
          source?: string | null;
        };
        Relationships: [];
      };
      faculties: {
        Row: {
          id: string;
          name: string;
          slug: string | null;
          university_id: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug?: string | null;
          university_id: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string | null;
          university_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "faculties_university_id_fkey";
            columns: ["university_id"];
            isOneToOne: false;
            referencedRelation: "universities";
            referencedColumns: ["id"];
          },
        ];
      };
      majors: {
        Row: {
          career_paths: string | null;
          faculty_id: string;
          id: string;
          name: string;
          slug: string | null;
          source: string | null;
          what_you_learn: string | null;
        };
        Insert: {
          career_paths?: string | null;
          faculty_id: string;
          id?: string;
          name: string;
          slug?: string | null;
          source?: string | null;
          what_you_learn?: string | null;
        };
        Update: {
          career_paths?: string | null;
          faculty_id?: string;
          id?: string;
          name?: string;
          slug?: string | null;
          source?: string | null;
          what_you_learn?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "majors_faculty_id_fkey";
            columns: ["faculty_id"];
            isOneToOne: false;
            referencedRelation: "faculties";
            referencedColumns: ["id"];
          },
        ];
      };
      riasec_career_map: {
        Row: {
          career_id: string;
          dimension: Database["public"]["Enums"]["riasec_dimension"];
          id: string;
          reason: string;
          weight: number;
        };
        Insert: {
          career_id: string;
          dimension: Database["public"]["Enums"]["riasec_dimension"];
          id?: string;
          reason: string;
          weight?: number;
        };
        Update: {
          career_id?: string;
          dimension?: Database["public"]["Enums"]["riasec_dimension"];
          id?: string;
          reason?: string;
          weight?: number;
        };
        Relationships: [
          {
            foreignKeyName: "riasec_career_map_career_id_fkey";
            columns: ["career_id"];
            isOneToOne: false;
            referencedRelation: "careers";
            referencedColumns: ["id"];
          },
        ];
      };
      riasec_major_map: {
        Row: {
          dimension: Database["public"]["Enums"]["riasec_dimension"];
          id: string;
          major_id: string;
          reason: string;
          weight: number;
        };
        Insert: {
          dimension: Database["public"]["Enums"]["riasec_dimension"];
          id?: string;
          major_id: string;
          reason: string;
          weight?: number;
        };
        Update: {
          dimension?: Database["public"]["Enums"]["riasec_dimension"];
          id?: string;
          major_id?: string;
          reason?: string;
          weight?: number;
        };
        Relationships: [
          {
            foreignKeyName: "riasec_major_map_major_id_fkey";
            columns: ["major_id"];
            isOneToOne: false;
            referencedRelation: "majors";
            referencedColumns: ["id"];
          },
        ];
      };
      riasec_questions: {
        Row: {
          active: boolean;
          created_at: string;
          dimension: Database["public"]["Enums"]["riasec_dimension"];
          display_order: number;
          id: string;
          source: string;
          text: string;
          text_en: string | null;
        };
        Insert: {
          active?: boolean;
          created_at?: string;
          dimension: Database["public"]["Enums"]["riasec_dimension"];
          display_order: number;
          id?: string;
          source: string;
          text: string;
          text_en?: string | null;
        };
        Update: {
          active?: boolean;
          created_at?: string;
          dimension?: Database["public"]["Enums"]["riasec_dimension"];
          display_order?: number;
          id?: string;
          source?: string;
          text?: string;
          text_en?: string | null;
        };
        Relationships: [];
      };
      riasec_track_map: {
        Row: {
          dimension: Database["public"]["Enums"]["riasec_dimension"];
          id: string;
          reason: string;
          track_id: string;
          weight: number;
        };
        Insert: {
          dimension: Database["public"]["Enums"]["riasec_dimension"];
          id?: string;
          reason: string;
          track_id: string;
          weight?: number;
        };
        Update: {
          dimension?: Database["public"]["Enums"]["riasec_dimension"];
          id?: string;
          reason?: string;
          track_id?: string;
          weight?: number;
        };
        Relationships: [
          {
            foreignKeyName: "riasec_track_map_track_id_fkey";
            columns: ["track_id"];
            isOneToOne: false;
            referencedRelation: "study_tracks";
            referencedColumns: ["id"];
          },
        ];
      };
      study_tracks: {
        Row: {
          description: string | null;
          display_order: number | null;
          id: string;
          name: string;
          slug: string;
          source: string | null;
          why_suitable: string | null;
        };
        Insert: {
          description?: string | null;
          display_order?: number | null;
          id?: string;
          name: string;
          slug: string;
          source?: string | null;
          why_suitable?: string | null;
        };
        Update: {
          description?: string | null;
          display_order?: number | null;
          id?: string;
          name?: string;
          slug?: string;
          source?: string | null;
          why_suitable?: string | null;
        };
        Relationships: [];
      };
      test_sessions: {
        Row: {
          answers: Json;
          created_at: string;
          grade_level: string;
          holland_code: string | null;
          id: string;
          scores: Json | null;
          user_id: string;
        };
        Insert: {
          answers: Json;
          created_at?: string;
          grade_level: string;
          holland_code?: string | null;
          id?: string;
          scores?: Json | null;
          user_id?: string;
        };
        Update: {
          answers?: Json;
          created_at?: string;
          grade_level?: string;
          holland_code?: string | null;
          id?: string;
          scores?: Json | null;
          user_id?: string;
        };
        Relationships: [];
      };
      universities: {
        Row: {
          created_at: string;
          id: string;
          is_featured: boolean;
          name: string;
          province: string | null;
          slug: string;
          type: string | null;
          website: string | null;
        };
        Insert: {
          created_at?: string;
          id?: string;
          is_featured?: boolean;
          name: string;
          province?: string | null;
          slug: string;
          type?: string | null;
          website?: string | null;
        };
        Update: {
          created_at?: string;
          id?: string;
          is_featured?: boolean;
          name?: string;
          province?: string | null;
          slug?: string;
          type?: string | null;
          website?: string | null;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      riasec_dimension: "R" | "I" | "A" | "S" | "E" | "C";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    keyof DefaultSchema["Enums"] | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    keyof DefaultSchema["CompositeTypes"] | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {
      riasec_dimension: ["R", "I", "A", "S", "E", "C"],
    },
  },
} as const;
