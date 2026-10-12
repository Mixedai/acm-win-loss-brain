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
    PostgrestVersion: "14.18"
  }
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      action_plan_items: {
        Row: {
          action_plan_id: string
          client_id: string
          created_at: string
          description: string | null
          due_date: string | null
          id: string
          owner: string | null
          sort_order: number
          status: Database["public"]["Enums"]["action_status"]
          title: string
          updated_at: string
        }
        Insert: {
          action_plan_id: string
          client_id: string
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          owner?: string | null
          sort_order?: number
          status?: Database["public"]["Enums"]["action_status"]
          title: string
          updated_at?: string
        }
        Update: {
          action_plan_id?: string
          client_id?: string
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          owner?: string | null
          sort_order?: number
          status?: Database["public"]["Enums"]["action_status"]
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "action_plan_items_action_plan_id_fkey"
            columns: ["action_plan_id"]
            isOneToOne: false
            referencedRelation: "action_plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "action_plan_items_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      action_plans: {
        Row: {
          client_id: string
          created_at: string
          created_by: string | null
          id: string
          investment_case_id: string | null
          objective: string | null
          owner: string | null
          root_cause_id: string
          start_date: string | null
          status: Database["public"]["Enums"]["action_status"]
          target_date: string | null
          title: string
          updated_at: string
        }
        Insert: {
          client_id: string
          created_at?: string
          created_by?: string | null
          id?: string
          investment_case_id?: string | null
          objective?: string | null
          owner?: string | null
          root_cause_id: string
          start_date?: string | null
          status?: Database["public"]["Enums"]["action_status"]
          target_date?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          client_id?: string
          created_at?: string
          created_by?: string | null
          id?: string
          investment_case_id?: string | null
          objective?: string | null
          owner?: string | null
          root_cause_id?: string
          start_date?: string | null
          status?: Database["public"]["Enums"]["action_status"]
          target_date?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "action_plans_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "action_plans_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "action_plans_investment_case_id_fkey"
            columns: ["investment_case_id"]
            isOneToOne: false
            referencedRelation: "investment_cases"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "action_plans_investment_case_id_fkey"
            columns: ["investment_case_id"]
            isOneToOne: false
            referencedRelation: "v_gap_closure_overview"
            referencedColumns: ["investment_case_id"]
          },
          {
            foreignKeyName: "action_plans_root_cause_id_fkey"
            columns: ["root_cause_id"]
            isOneToOne: false
            referencedRelation: "root_causes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "action_plans_root_cause_id_fkey"
            columns: ["root_cause_id"]
            isOneToOne: false
            referencedRelation: "v_gap_closure_overview"
            referencedColumns: ["root_cause_id"]
          },
          {
            foreignKeyName: "action_plans_root_cause_id_fkey"
            columns: ["root_cause_id"]
            isOneToOne: false
            referencedRelation: "v_root_cause_addressability"
            referencedColumns: ["root_cause_id"]
          },
          {
            foreignKeyName: "action_plans_root_cause_id_fkey"
            columns: ["root_cause_id"]
            isOneToOne: false
            referencedRelation: "v_root_cause_priority"
            referencedColumns: ["root_cause_id"]
          },
        ]
      }
      analysis_runs: {
        Row: {
          client_id: string
          competitor_id: string | null
          completed_at: string | null
          created_at: string
          created_by: string | null
          error: string | null
          fiscal_quarter: string | null
          id: string
          input_summary: Json
          model_name: string | null
          output_battlecard_id: string | null
          output_summary: Json
          period_end: string | null
          period_start: string | null
          question: string
          started_at: string | null
          status: Database["public"]["Enums"]["analysis_run_status"]
        }
        Insert: {
          client_id: string
          competitor_id?: string | null
          completed_at?: string | null
          created_at?: string
          created_by?: string | null
          error?: string | null
          fiscal_quarter?: string | null
          id?: string
          input_summary?: Json
          model_name?: string | null
          output_battlecard_id?: string | null
          output_summary?: Json
          period_end?: string | null
          period_start?: string | null
          question: string
          started_at?: string | null
          status?: Database["public"]["Enums"]["analysis_run_status"]
        }
        Update: {
          client_id?: string
          competitor_id?: string | null
          completed_at?: string | null
          created_at?: string
          created_by?: string | null
          error?: string | null
          fiscal_quarter?: string | null
          id?: string
          input_summary?: Json
          model_name?: string | null
          output_battlecard_id?: string | null
          output_summary?: Json
          period_end?: string | null
          period_start?: string | null
          question?: string
          started_at?: string | null
          status?: Database["public"]["Enums"]["analysis_run_status"]
        }
        Relationships: [
          {
            foreignKeyName: "analysis_runs_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "analysis_runs_competitor_id_fkey"
            columns: ["competitor_id"]
            isOneToOne: false
            referencedRelation: "competitors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "analysis_runs_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "analysis_runs_output_battlecard_id_fkey"
            columns: ["output_battlecard_id"]
            isOneToOne: false
            referencedRelation: "battlecards"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "analysis_runs_output_battlecard_id_fkey"
            columns: ["output_battlecard_id"]
            isOneToOne: false
            referencedRelation: "v_battlecard_provenance_mix"
            referencedColumns: ["battlecard_id"]
          },
        ]
      }
      battlecard_sections: {
        Row: {
          battlecard_id: string
          body: string | null
          client_id: string
          created_at: string
          heading: string
          id: string
          section_type: Database["public"]["Enums"]["battlecard_section_type"]
          sort_order: number
          updated_at: string
        }
        Insert: {
          battlecard_id: string
          body?: string | null
          client_id: string
          created_at?: string
          heading: string
          id?: string
          section_type: Database["public"]["Enums"]["battlecard_section_type"]
          sort_order?: number
          updated_at?: string
        }
        Update: {
          battlecard_id?: string
          body?: string | null
          client_id?: string
          created_at?: string
          heading?: string
          id?: string
          section_type?: Database["public"]["Enums"]["battlecard_section_type"]
          sort_order?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "battlecard_sections_battlecard_id_fkey"
            columns: ["battlecard_id"]
            isOneToOne: false
            referencedRelation: "battlecards"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "battlecard_sections_battlecard_id_fkey"
            columns: ["battlecard_id"]
            isOneToOne: false
            referencedRelation: "v_battlecard_provenance_mix"
            referencedColumns: ["battlecard_id"]
          },
          {
            foreignKeyName: "battlecard_sections_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      battlecard_statement_evidence: {
        Row: {
          client_id: string
          competitor_claim_id: string | null
          created_at: string
          deal_id: string | null
          extracted_reason_id: string | null
          id: string
          note: string | null
          source_id: string | null
          statement_id: string
        }
        Insert: {
          client_id: string
          competitor_claim_id?: string | null
          created_at?: string
          deal_id?: string | null
          extracted_reason_id?: string | null
          id?: string
          note?: string | null
          source_id?: string | null
          statement_id: string
        }
        Update: {
          client_id?: string
          competitor_claim_id?: string | null
          created_at?: string
          deal_id?: string | null
          extracted_reason_id?: string | null
          id?: string
          note?: string | null
          source_id?: string | null
          statement_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "battlecard_statement_evidence_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "battlecard_statement_evidence_competitor_claim_id_fkey"
            columns: ["competitor_claim_id"]
            isOneToOne: false
            referencedRelation: "competitor_claims"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "battlecard_statement_evidence_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: false
            referencedRelation: "deals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "battlecard_statement_evidence_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: false
            referencedRelation: "v_reason_reconciliation"
            referencedColumns: ["deal_id"]
          },
          {
            foreignKeyName: "battlecard_statement_evidence_extracted_reason_id_fkey"
            columns: ["extracted_reason_id"]
            isOneToOne: false
            referencedRelation: "extracted_reasons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "battlecard_statement_evidence_source_id_fkey"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "sources"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "battlecard_statement_evidence_statement_id_fkey"
            columns: ["statement_id"]
            isOneToOne: false
            referencedRelation: "battlecard_statements"
            referencedColumns: ["id"]
          },
        ]
      }
      battlecard_statements: {
        Row: {
          acv_total: number | null
          client_id: string
          confidence: Database["public"]["Enums"]["confidence_level"]
          created_at: string
          deal_count: number | null
          id: string
          provenance: Database["public"]["Enums"]["provenance_type"]
          section_id: string
          sort_order: number
          statement: string
          updated_at: string
        }
        Insert: {
          acv_total?: number | null
          client_id: string
          confidence?: Database["public"]["Enums"]["confidence_level"]
          created_at?: string
          deal_count?: number | null
          id?: string
          provenance: Database["public"]["Enums"]["provenance_type"]
          section_id: string
          sort_order?: number
          statement: string
          updated_at?: string
        }
        Update: {
          acv_total?: number | null
          client_id?: string
          confidence?: Database["public"]["Enums"]["confidence_level"]
          created_at?: string
          deal_count?: number | null
          id?: string
          provenance?: Database["public"]["Enums"]["provenance_type"]
          section_id?: string
          sort_order?: number
          statement?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "battlecard_statements_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "battlecard_statements_section_id_fkey"
            columns: ["section_id"]
            isOneToOne: false
            referencedRelation: "battlecard_sections"
            referencedColumns: ["id"]
          },
        ]
      }
      battlecards: {
        Row: {
          analysis_run_id: string | null
          author_type: Database["public"]["Enums"]["author_type"]
          client_id: string
          competitor_id: string
          created_at: string
          created_by: string | null
          id: string
          published_at: string | null
          status: Database["public"]["Enums"]["battlecard_status"]
          summary: string | null
          title: string
          updated_at: string
          version: number
        }
        Insert: {
          analysis_run_id?: string | null
          author_type?: Database["public"]["Enums"]["author_type"]
          client_id: string
          competitor_id: string
          created_at?: string
          created_by?: string | null
          id?: string
          published_at?: string | null
          status?: Database["public"]["Enums"]["battlecard_status"]
          summary?: string | null
          title: string
          updated_at?: string
          version?: number
        }
        Update: {
          analysis_run_id?: string | null
          author_type?: Database["public"]["Enums"]["author_type"]
          client_id?: string
          competitor_id?: string
          created_at?: string
          created_by?: string | null
          id?: string
          published_at?: string | null
          status?: Database["public"]["Enums"]["battlecard_status"]
          summary?: string | null
          title?: string
          updated_at?: string
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "battlecards_analysis_run_id_fkey"
            columns: ["analysis_run_id"]
            isOneToOne: false
            referencedRelation: "analysis_runs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "battlecards_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "battlecards_competitor_id_fkey"
            columns: ["competitor_id"]
            isOneToOne: false
            referencedRelation: "competitors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "battlecards_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      claim_evidence: {
        Row: {
          claim_id: string
          client_id: string
          created_at: string
          deal_id: string | null
          extracted_reason_id: string | null
          id: string
          notes: string | null
          supports: boolean
        }
        Insert: {
          claim_id: string
          client_id: string
          created_at?: string
          deal_id?: string | null
          extracted_reason_id?: string | null
          id?: string
          notes?: string | null
          supports: boolean
        }
        Update: {
          claim_id?: string
          client_id?: string
          created_at?: string
          deal_id?: string | null
          extracted_reason_id?: string | null
          id?: string
          notes?: string | null
          supports?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "claim_evidence_claim_id_fkey"
            columns: ["claim_id"]
            isOneToOne: false
            referencedRelation: "competitor_claims"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "claim_evidence_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "claim_evidence_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: false
            referencedRelation: "deals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "claim_evidence_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: false
            referencedRelation: "v_reason_reconciliation"
            referencedColumns: ["deal_id"]
          },
          {
            foreignKeyName: "claim_evidence_extracted_reason_id_fkey"
            columns: ["extracted_reason_id"]
            isOneToOne: false
            referencedRelation: "extracted_reasons"
            referencedColumns: ["id"]
          },
        ]
      }
      client_access: {
        Row: {
          client_id: string
          created_at: string
          user_id: string
        }
        Insert: {
          client_id: string
          created_at?: string
          user_id: string
        }
        Update: {
          client_id?: string
          created_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "client_access_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "client_access_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      clients: {
        Row: {
          company_id: string | null
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          name: string
          slug: string
          updated_at: string
          website: string | null
        }
        Insert: {
          company_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name: string
          slug: string
          updated_at?: string
          website?: string | null
        }
        Update: {
          company_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name?: string
          slug?: string
          updated_at?: string
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "clients_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      companies: {
        Row: {
          category: Database["public"]["Enums"]["company_category"]
          created_at: string
          description: string | null
          employee_range: string | null
          founded_year: number | null
          headquarters: string | null
          id: string
          is_own_company: boolean
          name: string
          pricing_model: string | null
          slug: string
          tagline: string | null
          updated_at: string
          website: string | null
        }
        Insert: {
          category: Database["public"]["Enums"]["company_category"]
          created_at?: string
          description?: string | null
          employee_range?: string | null
          founded_year?: number | null
          headquarters?: string | null
          id?: string
          is_own_company?: boolean
          name: string
          pricing_model?: string | null
          slug: string
          tagline?: string | null
          updated_at?: string
          website?: string | null
        }
        Update: {
          category?: Database["public"]["Enums"]["company_category"]
          created_at?: string
          description?: string | null
          employee_range?: string | null
          founded_year?: number | null
          headquarters?: string | null
          id?: string
          is_own_company?: boolean
          name?: string
          pricing_model?: string | null
          slug?: string
          tagline?: string | null
          updated_at?: string
          website?: string | null
        }
        Relationships: []
      }
      company_traits: {
        Row: {
          company_id: string
          created_at: string
          description: string | null
          id: string
          kind: Database["public"]["Enums"]["trait_kind"]
          provenance: Database["public"]["Enums"]["provenance_type"]
          sort_order: number
          title: string
          updated_at: string
        }
        Insert: {
          company_id: string
          created_at?: string
          description?: string | null
          id?: string
          kind: Database["public"]["Enums"]["trait_kind"]
          provenance?: Database["public"]["Enums"]["provenance_type"]
          sort_order?: number
          title: string
          updated_at?: string
        }
        Update: {
          company_id?: string
          created_at?: string
          description?: string | null
          id?: string
          kind?: Database["public"]["Enums"]["trait_kind"]
          provenance?: Database["public"]["Enums"]["provenance_type"]
          sort_order?: number
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "company_traits_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      competitor_claims: {
        Row: {
          claim_text: string
          claim_type: Database["public"]["Enums"]["claim_type"]
          claimed_at: string | null
          client_id: string
          competitor_id: string
          created_at: string
          id: string
          provenance: Database["public"]["Enums"]["provenance_type"]
          source_id: string | null
          updated_at: string
          verification: Database["public"]["Enums"]["claim_verification"]
          verification_notes: string | null
          verified_at: string | null
          verified_by: string | null
        }
        Insert: {
          claim_text: string
          claim_type?: Database["public"]["Enums"]["claim_type"]
          claimed_at?: string | null
          client_id: string
          competitor_id: string
          created_at?: string
          id?: string
          provenance?: Database["public"]["Enums"]["provenance_type"]
          source_id?: string | null
          updated_at?: string
          verification?: Database["public"]["Enums"]["claim_verification"]
          verification_notes?: string | null
          verified_at?: string | null
          verified_by?: string | null
        }
        Update: {
          claim_text?: string
          claim_type?: Database["public"]["Enums"]["claim_type"]
          claimed_at?: string | null
          client_id?: string
          competitor_id?: string
          created_at?: string
          id?: string
          provenance?: Database["public"]["Enums"]["provenance_type"]
          source_id?: string | null
          updated_at?: string
          verification?: Database["public"]["Enums"]["claim_verification"]
          verification_notes?: string | null
          verified_at?: string | null
          verified_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "competitor_claims_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "competitor_claims_competitor_id_fkey"
            columns: ["competitor_id"]
            isOneToOne: false
            referencedRelation: "competitors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "competitor_claims_source_id_fkey"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "sources"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "competitor_claims_verified_by_fkey"
            columns: ["verified_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      competitors: {
        Row: {
          client_id: string
          company_id: string | null
          created_at: string
          description: string | null
          id: string
          is_primary: boolean
          name: string
          slug: string
          updated_at: string
          website: string | null
        }
        Insert: {
          client_id: string
          company_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_primary?: boolean
          name: string
          slug: string
          updated_at?: string
          website?: string | null
        }
        Update: {
          client_id?: string
          company_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_primary?: boolean
          name?: string
          slug?: string
          updated_at?: string
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "competitors_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "competitors_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      deal_competitors: {
        Row: {
          client_id: string
          competitor_id: string
          created_at: string
          deal_id: string
          notes: string | null
          role: Database["public"]["Enums"]["competitor_role"]
        }
        Insert: {
          client_id: string
          competitor_id: string
          created_at?: string
          deal_id: string
          notes?: string | null
          role: Database["public"]["Enums"]["competitor_role"]
        }
        Update: {
          client_id?: string
          competitor_id?: string
          created_at?: string
          deal_id?: string
          notes?: string | null
          role?: Database["public"]["Enums"]["competitor_role"]
        }
        Relationships: [
          {
            foreignKeyName: "deal_competitors_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deal_competitors_competitor_id_fkey"
            columns: ["competitor_id"]
            isOneToOne: false
            referencedRelation: "competitors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deal_competitors_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: false
            referencedRelation: "deals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deal_competitors_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: false
            referencedRelation: "v_reason_reconciliation"
            referencedColumns: ["deal_id"]
          },
        ]
      }
      deal_reconciliations: {
        Row: {
          client_id: string
          created_at: string
          customer_extracted_reason_id: string | null
          customer_reason_id: string | null
          deal_id: string
          final_reason_id: string | null
          id: string
          rationale: string | null
          reconciled_at: string
          reconciled_by: Database["public"]["Enums"]["author_type"]
          reviewed_by: string | null
          seller_extracted_reason_id: string | null
          seller_reason_id: string | null
          updated_at: string
          verdict: Database["public"]["Enums"]["reconciliation_verdict"]
        }
        Insert: {
          client_id: string
          created_at?: string
          customer_extracted_reason_id?: string | null
          customer_reason_id?: string | null
          deal_id: string
          final_reason_id?: string | null
          id?: string
          rationale?: string | null
          reconciled_at?: string
          reconciled_by?: Database["public"]["Enums"]["author_type"]
          reviewed_by?: string | null
          seller_extracted_reason_id?: string | null
          seller_reason_id?: string | null
          updated_at?: string
          verdict: Database["public"]["Enums"]["reconciliation_verdict"]
        }
        Update: {
          client_id?: string
          created_at?: string
          customer_extracted_reason_id?: string | null
          customer_reason_id?: string | null
          deal_id?: string
          final_reason_id?: string | null
          id?: string
          rationale?: string | null
          reconciled_at?: string
          reconciled_by?: Database["public"]["Enums"]["author_type"]
          reviewed_by?: string | null
          seller_extracted_reason_id?: string | null
          seller_reason_id?: string | null
          updated_at?: string
          verdict?: Database["public"]["Enums"]["reconciliation_verdict"]
        }
        Relationships: [
          {
            foreignKeyName: "deal_reconciliations_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deal_reconciliations_customer_extracted_reason_id_fkey"
            columns: ["customer_extracted_reason_id"]
            isOneToOne: false
            referencedRelation: "extracted_reasons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deal_reconciliations_customer_reason_id_fkey"
            columns: ["customer_reason_id"]
            isOneToOne: false
            referencedRelation: "loss_reasons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deal_reconciliations_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: true
            referencedRelation: "deals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deal_reconciliations_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: true
            referencedRelation: "v_reason_reconciliation"
            referencedColumns: ["deal_id"]
          },
          {
            foreignKeyName: "deal_reconciliations_final_reason_id_fkey"
            columns: ["final_reason_id"]
            isOneToOne: false
            referencedRelation: "loss_reasons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deal_reconciliations_reviewed_by_fkey"
            columns: ["reviewed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deal_reconciliations_seller_extracted_reason_id_fkey"
            columns: ["seller_extracted_reason_id"]
            isOneToOne: false
            referencedRelation: "extracted_reasons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deal_reconciliations_seller_reason_id_fkey"
            columns: ["seller_reason_id"]
            isOneToOne: false
            referencedRelation: "loss_reasons"
            referencedColumns: ["id"]
          },
        ]
      }
      deal_root_causes: {
        Row: {
          assigned_by: Database["public"]["Enums"]["author_type"]
          client_id: string
          created_at: string
          deal_id: string
          extracted_reason_id: string | null
          notes: string | null
          provenance: Database["public"]["Enums"]["provenance_type"]
          root_cause_id: string
          weight: number
        }
        Insert: {
          assigned_by?: Database["public"]["Enums"]["author_type"]
          client_id: string
          created_at?: string
          deal_id: string
          extracted_reason_id?: string | null
          notes?: string | null
          provenance: Database["public"]["Enums"]["provenance_type"]
          root_cause_id: string
          weight?: number
        }
        Update: {
          assigned_by?: Database["public"]["Enums"]["author_type"]
          client_id?: string
          created_at?: string
          deal_id?: string
          extracted_reason_id?: string | null
          notes?: string | null
          provenance?: Database["public"]["Enums"]["provenance_type"]
          root_cause_id?: string
          weight?: number
        }
        Relationships: [
          {
            foreignKeyName: "deal_root_causes_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deal_root_causes_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: false
            referencedRelation: "deals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deal_root_causes_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: false
            referencedRelation: "v_reason_reconciliation"
            referencedColumns: ["deal_id"]
          },
          {
            foreignKeyName: "deal_root_causes_extracted_reason_id_fkey"
            columns: ["extracted_reason_id"]
            isOneToOne: false
            referencedRelation: "extracted_reasons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deal_root_causes_root_cause_id_fkey"
            columns: ["root_cause_id"]
            isOneToOne: false
            referencedRelation: "root_causes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deal_root_causes_root_cause_id_fkey"
            columns: ["root_cause_id"]
            isOneToOne: false
            referencedRelation: "v_gap_closure_overview"
            referencedColumns: ["root_cause_id"]
          },
          {
            foreignKeyName: "deal_root_causes_root_cause_id_fkey"
            columns: ["root_cause_id"]
            isOneToOne: false
            referencedRelation: "v_root_cause_addressability"
            referencedColumns: ["root_cause_id"]
          },
          {
            foreignKeyName: "deal_root_causes_root_cause_id_fkey"
            columns: ["root_cause_id"]
            isOneToOne: false
            referencedRelation: "v_root_cause_priority"
            referencedColumns: ["root_cause_id"]
          },
        ]
      }
      deals: {
        Row: {
          account_industry: string | null
          account_name: string | null
          acv: number | null
          client_id: string
          close_date: string | null
          close_stage: string | null
          created_at: string
          crm_external_id: string | null
          crm_loss_reason_id: string | null
          crm_loss_reason_raw: string | null
          crm_system: string | null
          currency: string
          fiscal_quarter: string | null
          id: string
          incumbent_competitor_id: string | null
          name: string
          outcome: Database["public"]["Enums"]["deal_outcome"]
          region: string | null
          segment: Database["public"]["Enums"]["deal_segment"] | null
          seller_email: string | null
          seller_name: string | null
          synced_at: string | null
          updated_at: string
          winning_competitor_id: string | null
        }
        Insert: {
          account_industry?: string | null
          account_name?: string | null
          acv?: number | null
          client_id: string
          close_date?: string | null
          close_stage?: string | null
          created_at?: string
          crm_external_id?: string | null
          crm_loss_reason_id?: string | null
          crm_loss_reason_raw?: string | null
          crm_system?: string | null
          currency?: string
          fiscal_quarter?: string | null
          id?: string
          incumbent_competitor_id?: string | null
          name: string
          outcome?: Database["public"]["Enums"]["deal_outcome"]
          region?: string | null
          segment?: Database["public"]["Enums"]["deal_segment"] | null
          seller_email?: string | null
          seller_name?: string | null
          synced_at?: string | null
          updated_at?: string
          winning_competitor_id?: string | null
        }
        Update: {
          account_industry?: string | null
          account_name?: string | null
          acv?: number | null
          client_id?: string
          close_date?: string | null
          close_stage?: string | null
          created_at?: string
          crm_external_id?: string | null
          crm_loss_reason_id?: string | null
          crm_loss_reason_raw?: string | null
          crm_system?: string | null
          currency?: string
          fiscal_quarter?: string | null
          id?: string
          incumbent_competitor_id?: string | null
          name?: string
          outcome?: Database["public"]["Enums"]["deal_outcome"]
          region?: string | null
          segment?: Database["public"]["Enums"]["deal_segment"] | null
          seller_email?: string | null
          seller_name?: string | null
          synced_at?: string | null
          updated_at?: string
          winning_competitor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "deals_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deals_crm_loss_reason_id_fkey"
            columns: ["crm_loss_reason_id"]
            isOneToOne: false
            referencedRelation: "loss_reasons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deals_incumbent_competitor_id_fkey"
            columns: ["incumbent_competitor_id"]
            isOneToOne: false
            referencedRelation: "competitors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deals_winning_competitor_id_fkey"
            columns: ["winning_competitor_id"]
            isOneToOne: false
            referencedRelation: "competitors"
            referencedColumns: ["id"]
          },
        ]
      }
      extracted_reasons: {
        Row: {
          client_id: string
          confidence: Database["public"]["Enums"]["confidence_level"]
          created_at: string
          deal_id: string | null
          evidence_locator: string | null
          extracted_by: Database["public"]["Enums"]["author_type"]
          id: string
          loss_reason_id: string | null
          model_name: string | null
          perspective: Database["public"]["Enums"]["perspective"]
          provenance: Database["public"]["Enums"]["provenance_type"]
          reviewed_at: string | null
          reviewed_by: string | null
          source_id: string
          summary: string | null
          verbatim_quote: string
        }
        Insert: {
          client_id: string
          confidence?: Database["public"]["Enums"]["confidence_level"]
          created_at?: string
          deal_id?: string | null
          evidence_locator?: string | null
          extracted_by?: Database["public"]["Enums"]["author_type"]
          id?: string
          loss_reason_id?: string | null
          model_name?: string | null
          perspective: Database["public"]["Enums"]["perspective"]
          provenance: Database["public"]["Enums"]["provenance_type"]
          reviewed_at?: string | null
          reviewed_by?: string | null
          source_id: string
          summary?: string | null
          verbatim_quote: string
        }
        Update: {
          client_id?: string
          confidence?: Database["public"]["Enums"]["confidence_level"]
          created_at?: string
          deal_id?: string | null
          evidence_locator?: string | null
          extracted_by?: Database["public"]["Enums"]["author_type"]
          id?: string
          loss_reason_id?: string | null
          model_name?: string | null
          perspective?: Database["public"]["Enums"]["perspective"]
          provenance?: Database["public"]["Enums"]["provenance_type"]
          reviewed_at?: string | null
          reviewed_by?: string | null
          source_id?: string
          summary?: string | null
          verbatim_quote?: string
        }
        Relationships: [
          {
            foreignKeyName: "extracted_reasons_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "extracted_reasons_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: false
            referencedRelation: "deals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "extracted_reasons_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: false
            referencedRelation: "v_reason_reconciliation"
            referencedColumns: ["deal_id"]
          },
          {
            foreignKeyName: "extracted_reasons_loss_reason_id_fkey"
            columns: ["loss_reason_id"]
            isOneToOne: false
            referencedRelation: "loss_reasons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "extracted_reasons_reviewed_by_fkey"
            columns: ["reviewed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "extracted_reasons_source_id_fkey"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "sources"
            referencedColumns: ["id"]
          },
        ]
      }
      investment_cases: {
        Row: {
          assumptions: string | null
          at_risk_acv: number | null
          client_id: string
          confidence: Database["public"]["Enums"]["confidence_level"]
          created_at: string
          created_by: string | null
          currency: string
          effort_person_weeks: number | null
          estimated_cost: number | null
          expected_annual_uplift: number | null
          id: string
          payback_months: number | null
          root_cause_id: string
          status: Database["public"]["Enums"]["action_status"]
          summary: string | null
          title: string
          updated_at: string
          win_rate_uplift_pct: number | null
        }
        Insert: {
          assumptions?: string | null
          at_risk_acv?: number | null
          client_id: string
          confidence?: Database["public"]["Enums"]["confidence_level"]
          created_at?: string
          created_by?: string | null
          currency?: string
          effort_person_weeks?: number | null
          estimated_cost?: number | null
          expected_annual_uplift?: number | null
          id?: string
          payback_months?: number | null
          root_cause_id: string
          status?: Database["public"]["Enums"]["action_status"]
          summary?: string | null
          title: string
          updated_at?: string
          win_rate_uplift_pct?: number | null
        }
        Update: {
          assumptions?: string | null
          at_risk_acv?: number | null
          client_id?: string
          confidence?: Database["public"]["Enums"]["confidence_level"]
          created_at?: string
          created_by?: string | null
          currency?: string
          effort_person_weeks?: number | null
          estimated_cost?: number | null
          expected_annual_uplift?: number | null
          id?: string
          payback_months?: number | null
          root_cause_id?: string
          status?: Database["public"]["Enums"]["action_status"]
          summary?: string | null
          title?: string
          updated_at?: string
          win_rate_uplift_pct?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "investment_cases_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "investment_cases_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "investment_cases_root_cause_id_fkey"
            columns: ["root_cause_id"]
            isOneToOne: false
            referencedRelation: "root_causes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "investment_cases_root_cause_id_fkey"
            columns: ["root_cause_id"]
            isOneToOne: false
            referencedRelation: "v_gap_closure_overview"
            referencedColumns: ["root_cause_id"]
          },
          {
            foreignKeyName: "investment_cases_root_cause_id_fkey"
            columns: ["root_cause_id"]
            isOneToOne: false
            referencedRelation: "v_root_cause_addressability"
            referencedColumns: ["root_cause_id"]
          },
          {
            foreignKeyName: "investment_cases_root_cause_id_fkey"
            columns: ["root_cause_id"]
            isOneToOne: false
            referencedRelation: "v_root_cause_priority"
            referencedColumns: ["root_cause_id"]
          },
        ]
      }
      loss_reason_categories: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          slug: string
          sort_order: number
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          slug: string
          sort_order?: number
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          slug?: string
          sort_order?: number
        }
        Relationships: []
      }
      loss_reasons: {
        Row: {
          category_id: string
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          name: string
          slug: string
        }
        Insert: {
          category_id: string
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name: string
          slug: string
        }
        Update: {
          category_id?: string
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name?: string
          slug?: string
        }
        Relationships: [
          {
            foreignKeyName: "loss_reasons_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "loss_reason_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          full_name: string | null
          id: string
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          full_name?: string | null
          id: string
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Relationships: []
      }
      roadmap_items: {
        Row: {
          area: string | null
          client_id: string
          created_at: string
          description: string | null
          external_id: string | null
          id: string
          owner: string | null
          priority: number | null
          status: Database["public"]["Enums"]["roadmap_status"]
          target_quarter: string | null
          title: string
          updated_at: string
        }
        Insert: {
          area?: string | null
          client_id: string
          created_at?: string
          description?: string | null
          external_id?: string | null
          id?: string
          owner?: string | null
          priority?: number | null
          status?: Database["public"]["Enums"]["roadmap_status"]
          target_quarter?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          area?: string | null
          client_id?: string
          created_at?: string
          description?: string | null
          external_id?: string | null
          id?: string
          owner?: string | null
          priority?: number | null
          status?: Database["public"]["Enums"]["roadmap_status"]
          target_quarter?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "roadmap_items_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      root_cause_loss_reasons: {
        Row: {
          client_id: string
          created_at: string
          loss_reason_id: string
          root_cause_id: string
        }
        Insert: {
          client_id: string
          created_at?: string
          loss_reason_id: string
          root_cause_id: string
        }
        Update: {
          client_id?: string
          created_at?: string
          loss_reason_id?: string
          root_cause_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "root_cause_loss_reasons_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "root_cause_loss_reasons_loss_reason_id_fkey"
            columns: ["loss_reason_id"]
            isOneToOne: false
            referencedRelation: "loss_reasons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "root_cause_loss_reasons_root_cause_id_fkey"
            columns: ["root_cause_id"]
            isOneToOne: false
            referencedRelation: "root_causes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "root_cause_loss_reasons_root_cause_id_fkey"
            columns: ["root_cause_id"]
            isOneToOne: false
            referencedRelation: "v_gap_closure_overview"
            referencedColumns: ["root_cause_id"]
          },
          {
            foreignKeyName: "root_cause_loss_reasons_root_cause_id_fkey"
            columns: ["root_cause_id"]
            isOneToOne: false
            referencedRelation: "v_root_cause_addressability"
            referencedColumns: ["root_cause_id"]
          },
          {
            foreignKeyName: "root_cause_loss_reasons_root_cause_id_fkey"
            columns: ["root_cause_id"]
            isOneToOne: false
            referencedRelation: "v_root_cause_priority"
            referencedColumns: ["root_cause_id"]
          },
        ]
      }
      root_cause_roadmap_links: {
        Row: {
          client_id: string
          coverage: Database["public"]["Enums"]["coverage_level"]
          created_at: string
          id: string
          rationale: string | null
          recommendation: Database["public"]["Enums"]["roadmap_recommendation"]
          roadmap_item_id: string
          root_cause_id: string
          updated_at: string
        }
        Insert: {
          client_id: string
          coverage: Database["public"]["Enums"]["coverage_level"]
          created_at?: string
          id?: string
          rationale?: string | null
          recommendation?: Database["public"]["Enums"]["roadmap_recommendation"]
          roadmap_item_id: string
          root_cause_id: string
          updated_at?: string
        }
        Update: {
          client_id?: string
          coverage?: Database["public"]["Enums"]["coverage_level"]
          created_at?: string
          id?: string
          rationale?: string | null
          recommendation?: Database["public"]["Enums"]["roadmap_recommendation"]
          roadmap_item_id?: string
          root_cause_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "root_cause_roadmap_links_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "root_cause_roadmap_links_roadmap_item_id_fkey"
            columns: ["roadmap_item_id"]
            isOneToOne: false
            referencedRelation: "roadmap_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "root_cause_roadmap_links_root_cause_id_fkey"
            columns: ["root_cause_id"]
            isOneToOne: false
            referencedRelation: "root_causes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "root_cause_roadmap_links_root_cause_id_fkey"
            columns: ["root_cause_id"]
            isOneToOne: false
            referencedRelation: "v_gap_closure_overview"
            referencedColumns: ["root_cause_id"]
          },
          {
            foreignKeyName: "root_cause_roadmap_links_root_cause_id_fkey"
            columns: ["root_cause_id"]
            isOneToOne: false
            referencedRelation: "v_root_cause_addressability"
            referencedColumns: ["root_cause_id"]
          },
          {
            foreignKeyName: "root_cause_roadmap_links_root_cause_id_fkey"
            columns: ["root_cause_id"]
            isOneToOne: false
            referencedRelation: "v_root_cause_priority"
            referencedColumns: ["root_cause_id"]
          },
        ]
      }
      root_causes: {
        Row: {
          category_id: string | null
          client_id: string
          created_at: string
          created_by: Database["public"]["Enums"]["author_type"]
          description: string | null
          id: string
          is_active: boolean
          name: string
          provenance: Database["public"]["Enums"]["provenance_type"]
          slug: string
          updated_at: string
        }
        Insert: {
          category_id?: string | null
          client_id: string
          created_at?: string
          created_by?: Database["public"]["Enums"]["author_type"]
          description?: string | null
          id?: string
          is_active?: boolean
          name: string
          provenance?: Database["public"]["Enums"]["provenance_type"]
          slug: string
          updated_at?: string
        }
        Update: {
          category_id?: string | null
          client_id?: string
          created_at?: string
          created_by?: Database["public"]["Enums"]["author_type"]
          description?: string | null
          id?: string
          is_active?: boolean
          name?: string
          provenance?: Database["public"]["Enums"]["provenance_type"]
          slug?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "root_causes_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "loss_reason_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "root_causes_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      sources: {
        Row: {
          client_id: string
          competitor_id: string | null
          created_at: string
          created_by: string | null
          deal_id: string | null
          id: string
          ingestion_error: string | null
          ingestion_status: Database["public"]["Enums"]["ingestion_status"]
          language: string
          metadata: Json
          participants: string[]
          raw_content: string | null
          source_date: string | null
          source_type: Database["public"]["Enums"]["source_type"]
          storage_path: string | null
          title: string
          updated_at: string
          url: string | null
        }
        Insert: {
          client_id: string
          competitor_id?: string | null
          created_at?: string
          created_by?: string | null
          deal_id?: string | null
          id?: string
          ingestion_error?: string | null
          ingestion_status?: Database["public"]["Enums"]["ingestion_status"]
          language?: string
          metadata?: Json
          participants?: string[]
          raw_content?: string | null
          source_date?: string | null
          source_type: Database["public"]["Enums"]["source_type"]
          storage_path?: string | null
          title: string
          updated_at?: string
          url?: string | null
        }
        Update: {
          client_id?: string
          competitor_id?: string | null
          created_at?: string
          created_by?: string | null
          deal_id?: string | null
          id?: string
          ingestion_error?: string | null
          ingestion_status?: Database["public"]["Enums"]["ingestion_status"]
          language?: string
          metadata?: Json
          participants?: string[]
          raw_content?: string | null
          source_date?: string | null
          source_type?: Database["public"]["Enums"]["source_type"]
          storage_path?: string | null
          title?: string
          updated_at?: string
          url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sources_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sources_competitor_id_fkey"
            columns: ["competitor_id"]
            isOneToOne: false
            referencedRelation: "competitors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sources_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sources_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: false
            referencedRelation: "deals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sources_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: false
            referencedRelation: "v_reason_reconciliation"
            referencedColumns: ["deal_id"]
          },
        ]
      }
    }
    Views: {
      v_battlecard_provenance_mix: {
        Row: {
          battlecard_id: string | null
          client_id: string | null
          competitor_id: string | null
          provenance: Database["public"]["Enums"]["provenance_type"] | null
          statement_count: number | null
          status: Database["public"]["Enums"]["battlecard_status"] | null
          version: number | null
        }
        Relationships: [
          {
            foreignKeyName: "battlecards_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "battlecards_competitor_id_fkey"
            columns: ["competitor_id"]
            isOneToOne: false
            referencedRelation: "competitors"
            referencedColumns: ["id"]
          },
        ]
      }
      v_competitor_claim_scorecard: {
        Row: {
          claim_type: Database["public"]["Enums"]["claim_type"] | null
          client_id: string | null
          competitor_id: string | null
          competitor_name: string | null
          contradicted: number | null
          mixed: number | null
          supported: number | null
          total_claims: number | null
          unverified: number | null
        }
        Relationships: [
          {
            foreignKeyName: "competitor_claims_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "competitor_claims_competitor_id_fkey"
            columns: ["competitor_id"]
            isOneToOne: false
            referencedRelation: "competitors"
            referencedColumns: ["id"]
          },
        ]
      }
      v_competitor_losses_by_quarter: {
        Row: {
          avg_lost_acv: number | null
          client_id: string | null
          competitor_id: string | null
          competitor_name: string | null
          fiscal_quarter: string | null
          lost_acv: number | null
          lost_deal_count: number | null
          segment: Database["public"]["Enums"]["deal_segment"] | null
        }
        Relationships: [
          {
            foreignKeyName: "deals_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deals_winning_competitor_id_fkey"
            columns: ["competitor_id"]
            isOneToOne: false
            referencedRelation: "competitors"
            referencedColumns: ["id"]
          },
        ]
      }
      v_gap_closure_overview: {
        Row: {
          active_plan_count: number | null
          client_id: string | null
          done_plan_count: number | null
          estimated_cost: number | null
          expected_annual_uplift: number | null
          investment_case_id: string | null
          investment_case_title: string | null
          investment_confidence:
            | Database["public"]["Enums"]["confidence_level"]
            | null
          investment_status: Database["public"]["Enums"]["action_status"] | null
          lost_deal_count: number | null
          payback_months: number | null
          plan_count: number | null
          root_cause_id: string | null
          root_cause_name: string | null
          weighted_lost_acv: number | null
        }
        Relationships: [
          {
            foreignKeyName: "root_causes_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      v_reason_reconciliation: {
        Row: {
          account_name: string | null
          acv: number | null
          client_id: string | null
          crm_loss_reason_raw: string | null
          crm_stated_reason: string | null
          currency: string | null
          customer_quote: string | null
          customer_reason: string | null
          deal_id: string | null
          deal_name: string | null
          final_reason: string | null
          fiscal_quarter: string | null
          rationale: string | null
          segment: Database["public"]["Enums"]["deal_segment"] | null
          seller_quote: string | null
          seller_reason: string | null
          verdict: Database["public"]["Enums"]["reconciliation_verdict"] | null
          winning_competitor_id: string | null
          winning_competitor_name: string | null
        }
        Relationships: [
          {
            foreignKeyName: "deals_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deals_winning_competitor_id_fkey"
            columns: ["winning_competitor_id"]
            isOneToOne: false
            referencedRelation: "competitors"
            referencedColumns: ["id"]
          },
        ]
      }
      v_root_cause_addressability: {
        Row: {
          best_coverage: Database["public"]["Enums"]["coverage_level"] | null
          client_id: string | null
          earliest_target_quarter: string | null
          linked_roadmap_items: number | null
          on_roadmap: boolean | null
          recommendations: string | null
          root_cause_id: string | null
          root_cause_name: string | null
        }
        Relationships: [
          {
            foreignKeyName: "root_causes_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      v_root_cause_priority: {
        Row: {
          client_id: string | null
          competitor_id: string | null
          competitor_name: string | null
          deal_count: number | null
          fiscal_quarter: string | null
          lost_acv: number | null
          root_cause_id: string | null
          root_cause_name: string | null
          weighted_lost_acv: number | null
        }
        Relationships: [
          {
            foreignKeyName: "deals_winning_competitor_id_fkey"
            columns: ["competitor_id"]
            isOneToOne: false
            referencedRelation: "competitors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "root_causes_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      can_edit_client: { Args: { p_client_id: string }; Returns: boolean }
      current_user_role: {
        Args: never
        Returns: Database["public"]["Enums"]["user_role"]
      }
      fiscal_quarter: { Args: { d: string }; Returns: string }
      has_client_access: { Args: { p_client_id: string }; Returns: boolean }
      is_admin: { Args: never; Returns: boolean }
    }
    Enums: {
      action_status:
        | "proposed"
        | "approved"
        | "in_progress"
        | "done"
        | "dropped"
      analysis_run_status: "queued" | "running" | "completed" | "failed"
      author_type: "human" | "agent"
      battlecard_section_type:
        | "overview"
        | "competitor_claims"
        | "what_deals_show"
        | "why_we_win"
        | "why_we_lose"
        | "root_causes"
        | "objection_handling"
        | "landmines"
        | "pricing_positioning"
        | "recommended_plays"
      battlecard_status: "draft" | "in_review" | "published" | "archived"
      claim_type:
        | "feature"
        | "pricing"
        | "performance"
        | "customer_logo"
        | "integration"
        | "security_compliance"
        | "partnership"
        | "funding"
        | "other"
      claim_verification: "unverified" | "supported" | "contradicted" | "mixed"
      company_category:
        | "llm_platform"
        | "ai_agents"
        | "coding_assistant"
        | "customer_support_ai"
        | "sales_marketing_ai"
        | "content_generation"
        | "voice_speech"
        | "vision_video"
        | "data_analytics_ai"
        | "search_knowledge"
        | "ai_infrastructure"
        | "security_governance"
        | "vertical_ai"
        | "win_loss_intelligence"
      competitor_role: "incumbent" | "evaluated" | "winner"
      confidence_level: "low" | "medium" | "high"
      coverage_level: "none" | "partial" | "full"
      deal_outcome: "open" | "won" | "lost" | "no_decision"
      deal_segment: "smb" | "mid_market" | "enterprise"
      ingestion_status: "pending" | "processed" | "failed"
      perspective: "seller" | "customer" | "competitor" | "analyst" | "internal"
      provenance_type:
        | "crm_outcome"
        | "customer_stated"
        | "seller_stated"
        | "competitor_claim"
        | "third_party"
        | "internal_hypothesis"
      reconciliation_verdict:
        | "aligned"
        | "partially_aligned"
        | "conflicting"
        | "insufficient_data"
      roadmap_recommendation: "no_change" | "reprioritize" | "add" | "descope"
      roadmap_status:
        | "not_planned"
        | "proposed"
        | "planned"
        | "in_progress"
        | "shipped"
        | "cancelled"
      source_type:
        | "crm_export"
        | "seller_notes"
        | "seller_interview"
        | "sales_call_recording"
        | "customer_interview"
        | "win_loss_interview"
        | "competitor_press_release"
        | "competitor_battlecard"
        | "competitor_website"
        | "analyst_report"
        | "other"
      trait_kind: "strength" | "weakness"
      user_role: "admin" | "analyst" | "viewer"
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      action_status: ["proposed", "approved", "in_progress", "done", "dropped"],
      analysis_run_status: ["queued", "running", "completed", "failed"],
      author_type: ["human", "agent"],
      battlecard_section_type: [
        "overview",
        "competitor_claims",
        "what_deals_show",
        "why_we_win",
        "why_we_lose",
        "root_causes",
        "objection_handling",
        "landmines",
        "pricing_positioning",
        "recommended_plays",
      ],
      battlecard_status: ["draft", "in_review", "published", "archived"],
      claim_type: [
        "feature",
        "pricing",
        "performance",
        "customer_logo",
        "integration",
        "security_compliance",
        "partnership",
        "funding",
        "other",
      ],
      claim_verification: ["unverified", "supported", "contradicted", "mixed"],
      company_category: [
        "llm_platform",
        "ai_agents",
        "coding_assistant",
        "customer_support_ai",
        "sales_marketing_ai",
        "content_generation",
        "voice_speech",
        "vision_video",
        "data_analytics_ai",
        "search_knowledge",
        "ai_infrastructure",
        "security_governance",
        "vertical_ai",
        "win_loss_intelligence",
      ],
      competitor_role: ["incumbent", "evaluated", "winner"],
      confidence_level: ["low", "medium", "high"],
      coverage_level: ["none", "partial", "full"],
      deal_outcome: ["open", "won", "lost", "no_decision"],
      deal_segment: ["smb", "mid_market", "enterprise"],
      ingestion_status: ["pending", "processed", "failed"],
      perspective: ["seller", "customer", "competitor", "analyst", "internal"],
      provenance_type: [
        "crm_outcome",
        "customer_stated",
        "seller_stated",
        "competitor_claim",
        "third_party",
        "internal_hypothesis",
      ],
      reconciliation_verdict: [
        "aligned",
        "partially_aligned",
        "conflicting",
        "insufficient_data",
      ],
      roadmap_recommendation: ["no_change", "reprioritize", "add", "descope"],
      roadmap_status: [
        "not_planned",
        "proposed",
        "planned",
        "in_progress",
        "shipped",
        "cancelled",
      ],
      source_type: [
        "crm_export",
        "seller_notes",
        "seller_interview",
        "sales_call_recording",
        "customer_interview",
        "win_loss_interview",
        "competitor_press_release",
        "competitor_battlecard",
        "competitor_website",
        "analyst_report",
        "other",
      ],
      trait_kind: ["strength", "weakness"],
      user_role: ["admin", "analyst", "viewer"],
    },
  },
} as const
