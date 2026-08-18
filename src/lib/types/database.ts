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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      agencies: {
        Row: {
          avg_rating: number | null
          commission_rate: number
          created_at: string
          description: string | null
          id: string
          logo_url: string | null
          name: string
          profile_id: string | null
          slug: string
          specialties: string[] | null
          stripe_account_id: string | null
          total_installs: number | null
          total_reviews: number | null
          total_savings_generated: number | null
          updated_at: string
          verified: boolean
          website: string | null
        }
        Insert: {
          avg_rating?: number | null
          commission_rate?: number
          created_at?: string
          description?: string | null
          id?: string
          logo_url?: string | null
          name: string
          profile_id?: string | null
          slug: string
          specialties?: string[] | null
          stripe_account_id?: string | null
          total_installs?: number | null
          total_reviews?: number | null
          total_savings_generated?: number | null
          updated_at?: string
          verified?: boolean
          website?: string | null
        }
        Update: {
          avg_rating?: number | null
          commission_rate?: number
          created_at?: string
          description?: string | null
          id?: string
          logo_url?: string | null
          name?: string
          profile_id?: string | null
          slug?: string
          specialties?: string[] | null
          stripe_account_id?: string | null
          total_installs?: number | null
          total_reviews?: number | null
          total_savings_generated?: number | null
          updated_at?: string
          verified?: boolean
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "agencies_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      agency_members: {
        Row: {
          agency_id: string
          created_at: string
          id: string
          profile_id: string
          role: string
        }
        Insert: {
          agency_id: string
          created_at?: string
          id?: string
          profile_id: string
          role?: string
        }
        Update: {
          agency_id?: string
          created_at?: string
          id?: string
          profile_id?: string
          role?: string
        }
        Relationships: [
          {
            foreignKeyName: "agency_members_agency_id_fkey"
            columns: ["agency_id"]
            isOneToOne: false
            referencedRelation: "agencies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agency_members_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      analytics_events: {
        Row: {
          created_at: string
          employee_id: string | null
          event_type: string
          id: string
          profile_id: string | null
          properties: Json | null
        }
        Insert: {
          created_at?: string
          employee_id?: string | null
          event_type: string
          id?: string
          profile_id?: string | null
          properties?: Json | null
        }
        Update: {
          created_at?: string
          employee_id?: string | null
          event_type?: string
          id?: string
          profile_id?: string | null
          properties?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "analytics_events_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "analytics_events_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      businesses: {
        Row: {
          created_at: string
          current_software: string[] | null
          departments: string[] | null
          description: string | null
          employee_count: string | null
          goals: string[] | null
          id: string
          industry: string | null
          name: string
          pain_points: string[] | null
          profile_id: string
          revenue_range: string | null
          updated_at: string
          website: string | null
        }
        Insert: {
          created_at?: string
          current_software?: string[] | null
          departments?: string[] | null
          description?: string | null
          employee_count?: string | null
          goals?: string[] | null
          id?: string
          industry?: string | null
          name: string
          pain_points?: string[] | null
          profile_id: string
          revenue_range?: string | null
          updated_at?: string
          website?: string | null
        }
        Update: {
          created_at?: string
          current_software?: string[] | null
          departments?: string[] | null
          description?: string | null
          employee_count?: string | null
          goals?: string[] | null
          id?: string
          industry?: string | null
          name?: string
          pain_points?: string[] | null
          profile_id?: string
          revenue_range?: string | null
          updated_at?: string
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "businesses_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          created_at: string
          description: string | null
          icon: string | null
          id: string
          name: string
          seo_description: string | null
          seo_title: string | null
          slug: string
          sort_order: number | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          name: string
          seo_description?: string | null
          seo_title?: string | null
          slug: string
          sort_order?: number | null
        }
        Update: {
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          name?: string
          seo_description?: string | null
          seo_title?: string | null
          slug?: string
          sort_order?: number | null
        }
        Relationships: []
      }
      classroom_modules: {
        Row: {
          content: string
          created_at: string | null
          description: string | null
          id: string
          sort_order: number | null
          title: string
          updated_at: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          description?: string | null
          id?: string
          sort_order?: number | null
          title: string
          updated_at?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          description?: string | null
          id?: string
          sort_order?: number | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      consultant_activities: {
        Row: {
          contact_id: string | null
          created_at: string
          id: string
          notes: string | null
          profile_id: string
          type: Database["public"]["Enums"]["contact_activity_type"]
        }
        Insert: {
          contact_id?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          profile_id: string
          type: Database["public"]["Enums"]["contact_activity_type"]
        }
        Update: {
          contact_id?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          profile_id?: string
          type?: Database["public"]["Enums"]["contact_activity_type"]
        }
        Relationships: [
          {
            foreignKeyName: "consultant_activities_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "consultant_contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "consultant_activities_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      consultant_clients: {
        Row: {
          business_name: string
          contact_name: string | null
          created_at: string | null
          email: string | null
          id: string
          industry: string | null
          notes: string | null
          phone: string | null
          status: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          business_name: string
          contact_name?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          industry?: string | null
          notes?: string | null
          phone?: string | null
          status?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          business_name?: string
          contact_name?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          industry?: string | null
          notes?: string | null
          phone?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      consultant_contacts: {
        Row: {
          business_name: string
          contact_name: string | null
          created_at: string
          deal_value_cents: number | null
          email: string | null
          id: string
          phone: string | null
          profile_id: string
          report_id: string | null
          source: string | null
          stage: Database["public"]["Enums"]["contact_stage"]
          type: Database["public"]["Enums"]["contact_type"]
          updated_at: string
        }
        Insert: {
          business_name: string
          contact_name?: string | null
          created_at?: string
          deal_value_cents?: number | null
          email?: string | null
          id?: string
          phone?: string | null
          profile_id: string
          report_id?: string | null
          source?: string | null
          stage?: Database["public"]["Enums"]["contact_stage"]
          type?: Database["public"]["Enums"]["contact_type"]
          updated_at?: string
        }
        Update: {
          business_name?: string
          contact_name?: string | null
          created_at?: string
          deal_value_cents?: number | null
          email?: string | null
          id?: string
          phone?: string | null
          profile_id?: string
          report_id?: string | null
          source?: string | null
          stage?: Database["public"]["Enums"]["contact_stage"]
          type?: Database["public"]["Enums"]["contact_type"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "consultant_contacts_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "consultant_contacts_report_id_fkey"
            columns: ["report_id"]
            isOneToOne: false
            referencedRelation: "reports"
            referencedColumns: ["id"]
          },
        ]
      }
      consultant_notes: {
        Row: {
          body: string
          contact_id: string
          created_at: string
          id: string
          profile_id: string
        }
        Insert: {
          body: string
          contact_id: string
          created_at?: string
          id?: string
          profile_id: string
        }
        Update: {
          body?: string
          contact_id?: string
          created_at?: string
          id?: string
          profile_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "consultant_notes_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "consultant_contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "consultant_notes_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      consultant_progress: {
        Row: {
          completed: boolean | null
          created_at: string | null
          id: string
          module: number
          user_id: string
        }
        Insert: {
          completed?: boolean | null
          created_at?: string | null
          id?: string
          module: number
          user_id: string
        }
        Update: {
          completed?: boolean | null
          created_at?: string | null
          id?: string
          module?: number
          user_id?: string
        }
        Relationships: []
      }
      consultant_reports: {
        Row: {
          client_id: string | null
          created_at: string | null
          id: string
          report_id: string | null
          user_id: string
        }
        Insert: {
          client_id?: string | null
          created_at?: string | null
          id?: string
          report_id?: string | null
          user_id: string
        }
        Update: {
          client_id?: string | null
          created_at?: string | null
          id?: string
          report_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "consultant_reports_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "consultant_clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "consultant_reports_report_id_fkey"
            columns: ["report_id"]
            isOneToOne: false
            referencedRelation: "reports"
            referencedColumns: ["id"]
          },
        ]
      }
      consultant_tasks: {
        Row: {
          contact_id: string | null
          created_at: string
          done: boolean
          due_date: string | null
          id: string
          profile_id: string
          title: string
        }
        Insert: {
          contact_id?: string | null
          created_at?: string
          done?: boolean
          due_date?: string | null
          id?: string
          profile_id: string
          title: string
        }
        Update: {
          contact_id?: string | null
          created_at?: string
          done?: boolean
          due_date?: string | null
          id?: string
          profile_id?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "consultant_tasks_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "consultant_contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "consultant_tasks_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      demo_requests: {
        Row: {
          company: string | null
          created_at: string
          email: string
          employee_id: string
          id: string
          message: string | null
          name: string
          profile_id: string | null
          status: string
        }
        Insert: {
          company?: string | null
          created_at?: string
          email: string
          employee_id: string
          id?: string
          message?: string | null
          name: string
          profile_id?: string | null
          status?: string
        }
        Update: {
          company?: string | null
          created_at?: string
          email?: string
          employee_id?: string
          id?: string
          message?: string | null
          name?: string
          profile_id?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "demo_requests_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "demo_requests_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      employee_tags: {
        Row: {
          employee_id: string
          tag_id: string
        }
        Insert: {
          employee_id: string
          tag_id: string
        }
        Update: {
          employee_id?: string
          tag_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "employee_tags_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "employee_tags_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "tags"
            referencedColumns: ["id"]
          },
        ]
      }
      employees: {
        Row: {
          agency_id: string | null
          agency_name: string | null
          avg_rating: number | null
          avg_roi_percent: number | null
          business_problems: string[] | null
          category_id: string | null
          created_at: string
          demo_url: string | null
          description: string
          expected_monthly_savings: number | null
          featured: boolean
          id: string
          industries: string[] | null
          integrations: string[] | null
          is_published: boolean | null
          best_for_description: string | null
          primary_tasks: string[] | null
          website_url: string | null
          name: string
          outcomes: string[] | null
          price_annual: number | null
          price_monthly: number | null
          price_type: string
          profile_id: string | null
          role: string
          screenshots: string[] | null
          setup_time: string | null
          slug: string
          status: Database["public"]["Enums"]["listing_status"]
          tagline: string | null
          thumbnail_url: string | null
          total_purchases: number | null
          total_reviews: number | null
          updated_at: string
          video_url: string | null
        }
        Insert: {
          agency_id?: string | null
          agency_name?: string | null
          avg_rating?: number | null
          avg_roi_percent?: number | null
          business_problems?: string[] | null
          category_id?: string | null
          created_at?: string
          demo_url?: string | null
          description: string
          expected_monthly_savings?: number | null
          featured?: boolean
          id?: string
          industries?: string[] | null
          integrations?: string[] | null
          is_published?: boolean | null
          best_for_description?: string | null
          primary_tasks?: string[] | null
          website_url?: string | null
          name: string
          outcomes?: string[] | null
          price_annual?: number | null
          price_monthly?: number | null
          price_type?: string
          profile_id?: string | null
          role: string
          screenshots?: string[] | null
          setup_time?: string | null
          slug: string
          status?: Database["public"]["Enums"]["listing_status"]
          tagline?: string | null
          thumbnail_url?: string | null
          total_purchases?: number | null
          total_reviews?: number | null
          updated_at?: string
          video_url?: string | null
        }
        Update: {
          agency_id?: string | null
          agency_name?: string | null
          avg_rating?: number | null
          avg_roi_percent?: number | null
          business_problems?: string[] | null
          category_id?: string | null
          created_at?: string
          demo_url?: string | null
          description?: string
          expected_monthly_savings?: number | null
          featured?: boolean
          id?: string
          industries?: string[] | null
          integrations?: string[] | null
          is_published?: boolean | null
          best_for_description?: string | null
          primary_tasks?: string[] | null
          website_url?: string | null
          name?: string
          outcomes?: string[] | null
          price_annual?: number | null
          price_monthly?: number | null
          price_type?: string
          profile_id?: string | null
          role?: string
          screenshots?: string[] | null
          setup_time?: string | null
          slug?: string
          status?: Database["public"]["Enums"]["listing_status"]
          tagline?: string | null
          thumbnail_url?: string | null
          total_purchases?: number | null
          total_reviews?: number | null
          updated_at?: string
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "employees_agency_id_fkey"
            columns: ["agency_id"]
            isOneToOne: false
            referencedRelation: "agencies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "employees_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "employees_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      favorites: {
        Row: {
          created_at: string
          employee_id: string
          id: string
          profile_id: string
        }
        Insert: {
          created_at?: string
          employee_id: string
          id?: string
          profile_id: string
        }
        Update: {
          created_at?: string
          employee_id?: string
          id?: string
          profile_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "favorites_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "favorites_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          body: string | null
          created_at: string
          id: string
          link: string | null
          profile_id: string
          read: boolean
          title: string
          type: string
        }
        Insert: {
          body?: string | null
          created_at?: string
          id?: string
          link?: string | null
          profile_id: string
          read?: boolean
          title: string
          type: string
        }
        Update: {
          body?: string | null
          created_at?: string
          id?: string
          link?: string | null
          profile_id?: string
          read?: boolean
          title?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          agency_id: string
          agency_payout: number
          amount_total: number
          created_at: string
          employee_id: string
          id: string
          platform_commission: number
          profile_id: string
          status: Database["public"]["Enums"]["order_status"]
          stripe_invoice_id: string | null
          stripe_payment_intent_id: string | null
          updated_at: string
        }
        Insert: {
          agency_id: string
          agency_payout: number
          amount_total: number
          created_at?: string
          employee_id: string
          id?: string
          platform_commission: number
          profile_id: string
          status?: Database["public"]["Enums"]["order_status"]
          stripe_invoice_id?: string | null
          stripe_payment_intent_id?: string | null
          updated_at?: string
        }
        Update: {
          agency_id?: string
          agency_payout?: number
          amount_total?: number
          created_at?: string
          employee_id?: string
          id?: string
          platform_commission?: number
          profile_id?: string
          status?: Database["public"]["Enums"]["order_status"]
          stripe_invoice_id?: string | null
          stripe_payment_intent_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_agency_id_fkey"
            columns: ["agency_id"]
            isOneToOne: false
            referencedRelation: "agencies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          email_verified: boolean
          email_verified_at: string | null
          full_name: string | null
          id: string
          role: Database["public"]["Enums"]["user_role"]
          stripe_customer_id: string | null
          subscription_plan: Database["public"]["Enums"]["subscription_plan"]
          subscription_type:
            | Database["public"]["Enums"]["subscription_type"]
            | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          email_verified?: boolean
          email_verified_at?: string | null
          full_name?: string | null
          id: string
          role?: Database["public"]["Enums"]["user_role"]
          stripe_customer_id?: string | null
          subscription_plan?: Database["public"]["Enums"]["subscription_plan"]
          subscription_type?:
            | Database["public"]["Enums"]["subscription_type"]
            | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          email_verified?: boolean
          email_verified_at?: string | null
          full_name?: string | null
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          stripe_customer_id?: string | null
          subscription_plan?: Database["public"]["Enums"]["subscription_plan"]
          subscription_type?:
            | Database["public"]["Enums"]["subscription_type"]
            | null
          updated_at?: string
        }
        Relationships: []
      }
      report_recommendations: {
        Row: {
          created_at: string
          employee_id: string | null
          estimated_monthly_savings: number | null
          estimated_roi_percent: number | null
          id: string
          priority: number
          reason: string | null
          report_id: string
        }
        Insert: {
          created_at?: string
          employee_id?: string | null
          estimated_monthly_savings?: number | null
          estimated_roi_percent?: number | null
          id?: string
          priority?: number
          reason?: string | null
          report_id: string
        }
        Update: {
          created_at?: string
          employee_id?: string | null
          estimated_monthly_savings?: number | null
          estimated_roi_percent?: number | null
          id?: string
          priority?: number
          reason?: string | null
          report_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "report_recommendations_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "report_recommendations_report_id_fkey"
            columns: ["report_id"]
            isOneToOne: false
            referencedRelation: "reports"
            referencedColumns: ["id"]
          },
        ]
      }
      reports: {
        Row: {
          agency_recommendations: Json | null
          ai_readiness_score: number | null
          automation_score: number | null
          biggest_bottlenecks: string[] | null
          business_id: string | null
          business_name: string | null
          created_at: string
          current_software: string[] | null
          current_workflows: string | null
          departments: string[] | null
          departments_needing_ai: string[] | null
          description: string | null
          employee_count: string | null
          estimated_annual_savings: number | null
          estimated_hours_saved_monthly: number | null
          estimated_monthly_investment: number | null
          estimated_revenue_opportunity: number | null
          estimated_roi_percent: number | null
          expected_risks: string[] | null
          goals: string[] | null
          growth_score: number | null
          id: string
          implementation_priority: Json | null
          industry: string | null
          is_premium: boolean
          pain_points: string[] | null
          profile_id: string | null
          recommended_ai_stack: Json | null
          revenue_range: string | null
          roadmap_30_day: Json | null
          roadmap_90_day: Json | null
          roadmap_one_year: Json | null
          software_recommendations: Json | null
          status: Database["public"]["Enums"]["report_status"]
          updated_at: string
          website: string | null
        }
        Insert: {
          agency_recommendations?: Json | null
          ai_readiness_score?: number | null
          automation_score?: number | null
          biggest_bottlenecks?: string[] | null
          business_id?: string | null
          business_name?: string | null
          created_at?: string
          current_software?: string[] | null
          current_workflows?: string | null
          departments?: string[] | null
          departments_needing_ai?: string[] | null
          description?: string | null
          employee_count?: string | null
          estimated_annual_savings?: number | null
          estimated_hours_saved_monthly?: number | null
          estimated_monthly_investment?: number | null
          estimated_revenue_opportunity?: number | null
          estimated_roi_percent?: number | null
          expected_risks?: string[] | null
          goals?: string[] | null
          growth_score?: number | null
          id?: string
          implementation_priority?: Json | null
          industry?: string | null
          is_premium?: boolean
          pain_points?: string[] | null
          profile_id?: string | null
          recommended_ai_stack?: Json | null
          revenue_range?: string | null
          roadmap_30_day?: Json | null
          roadmap_90_day?: Json | null
          roadmap_one_year?: Json | null
          software_recommendations?: Json | null
          status?: Database["public"]["Enums"]["report_status"]
          updated_at?: string
          website?: string | null
        }
        Update: {
          agency_recommendations?: Json | null
          ai_readiness_score?: number | null
          automation_score?: number | null
          biggest_bottlenecks?: string[] | null
          business_id?: string | null
          business_name?: string | null
          created_at?: string
          current_software?: string[] | null
          current_workflows?: string | null
          departments?: string[] | null
          departments_needing_ai?: string[] | null
          description?: string | null
          employee_count?: string | null
          estimated_annual_savings?: number | null
          estimated_hours_saved_monthly?: number | null
          estimated_monthly_investment?: number | null
          estimated_revenue_opportunity?: number | null
          estimated_roi_percent?: number | null
          expected_risks?: string[] | null
          goals?: string[] | null
          growth_score?: number | null
          id?: string
          implementation_priority?: Json | null
          industry?: string | null
          is_premium?: boolean
          pain_points?: string[] | null
          profile_id?: string | null
          recommended_ai_stack?: Json | null
          revenue_range?: string | null
          roadmap_30_day?: Json | null
          roadmap_90_day?: Json | null
          roadmap_one_year?: Json | null
          software_recommendations?: Json | null
          status?: Database["public"]["Enums"]["report_status"]
          updated_at?: string
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reports_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reports_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      reviews: {
        Row: {
          body: string | null
          created_at: string
          employee_id: string
          id: string
          profile_id: string
          rating: number
          title: string | null
          verified_purchase: boolean
        }
        Insert: {
          body?: string | null
          created_at?: string
          employee_id: string
          id?: string
          profile_id: string
          rating: number
          title?: string | null
          verified_purchase?: boolean
        }
        Update: {
          body?: string | null
          created_at?: string
          employee_id?: string
          id?: string
          profile_id?: string
          rating?: number
          title?: string | null
          verified_purchase?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "reviews_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      subscriptions: {
        Row: {
          cancel_at_period_end: boolean
          created_at: string
          current_period_end: string | null
          current_period_start: string | null
          id: string
          plan: Database["public"]["Enums"]["subscription_plan"]
          profile_id: string
          status: Database["public"]["Enums"]["subscription_status"]
          stripe_price_id: string | null
          stripe_subscription_id: string | null
          type: Database["public"]["Enums"]["subscription_type"]
          updated_at: string
        }
        Insert: {
          cancel_at_period_end?: boolean
          created_at?: string
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          plan?: Database["public"]["Enums"]["subscription_plan"]
          profile_id: string
          status?: Database["public"]["Enums"]["subscription_status"]
          stripe_price_id?: string | null
          stripe_subscription_id?: string | null
          type?: Database["public"]["Enums"]["subscription_type"]
          updated_at?: string
        }
        Update: {
          cancel_at_period_end?: boolean
          created_at?: string
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          plan?: Database["public"]["Enums"]["subscription_plan"]
          profile_id?: string
          status?: Database["public"]["Enums"]["subscription_status"]
          stripe_price_id?: string | null
          stripe_subscription_id?: string | null
          type?: Database["public"]["Enums"]["subscription_type"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      tags: {
        Row: {
          id: string
          name: string
          slug: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
        }
        Relationships: []
      }
      waitlist: {
        Row: {
          created_at: string
          email: string
          id: string
          name: string | null
          source: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          name?: string | null
          source?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          name?: string | null
          source?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      verify_email: { Args: { user_id: string }; Returns: undefined }
    }
    Enums: {
      contact_activity_type:
        | "contacted"
        | "meeting_booked"
        | "proposal_sent"
        | "deal_closed"
      contact_stage:
        | "new"
        | "contacted"
        | "meeting_booked"
        | "proposal_sent"
        | "won"
        | "lost"
      contact_type: "prospect" | "client"
      listing_status:
        | "draft"
        | "pending_review"
        | "published"
        | "rejected"
        | "archived"
      order_status: "pending" | "completed" | "refunded" | "cancelled"
      report_status: "draft" | "processing" | "complete" | "failed"
      subscription_plan: "free" | "pro"
      subscription_status: "active" | "cancelled" | "past_due" | "trialing"
      subscription_type: "pro" | "consulting"
      user_role: "business" | "agency" | "admin" | "consultant"
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

// Type aliases for commonly imported types
export type Profile = Tables<"profiles">
export type Employee = Tables<"employees">
export type Agency = Tables<"agencies">
export type Category = Tables<"categories">
export type Subscription = Tables<"subscriptions">
export type Report = Tables<"reports">
export type ConsultantContact = Tables<"consultant_contacts">
export type ConsultantTask = Tables<"consultant_tasks">
export type ConsultantNote = Tables<"consultant_notes">
export type ClassroomModule = Tables<"classroom_modules">

export type SubscriptionType = Enums<"subscription_type">
export type SubscriptionPlan = Enums<"subscription_plan">
export type SubscriptionStatus = Enums<"subscription_status">
export type UserRole = Enums<"user_role">
export type ContactStage = Enums<"contact_stage">
export type ContactType = Enums<"contact_type">
export type ListingStatus = Enums<"listing_status">
export type OrderStatus = Enums<"order_status">
export type ReportStatus = Enums<"report_status">
export type ContactActivityType = Enums<"contact_activity_type">
