export interface Painting {
  id: string;
  slug: string;
  title: string;
  medium: string;
  dimensions: string;
  year: number;
  price: number;
  original_price?: number;
  available: boolean;
  featured: boolean;
  image: string;
  description: string;
  tags: string[];
  sort_order?: number;
}

export interface Inquiry {
  id?: string;
  full_name: string;
  email: string;
  phone?: string;
  inquiry_type: "purchase" | "commission" | "general";
  painting_interest?: string;
  commission_description?: string;
  budget_range?: string;
  timeline?: string;
  source?: string;
  message?: string;
  status?: "new" | "reviewed" | "archived";
  created_at?: string;
  updated_at?: string;
}

export interface CRMLead {
  id: string;
  board_id: string;
  pipeline_column_id: string;
  inquiry_id?: string;
  full_name: string;
  email: string;
  phone?: string;
  inquiry_type: string;
  painting_interest?: string;
  commission_description?: string;
  budget_range?: string;
  quote_amount?: number;
  assigned_to?: string;
  tags?: string[];
  next_action?: string;
  next_action_due?: string;
  notes_text?: string;
  position: number;
  city?: string;
  state?: string;
  created_at: string;
  updated_at: string;
}

export interface CRMColumn {
  id: string;
  board_id: string;
  name: string;
  position: number;
  color?: string;
  is_archived: boolean;
  created_at: string;
  updated_at: string;
}

export interface CRMNote {
  id: string;
  lead_id: string;
  body: string;
  created_by?: string;
  created_at: string;
}

export interface CRMActivity {
  id: string;
  lead_id: string;
  type: string;
  body: string;
  meta?: Record<string, unknown>;
  created_at: string;
}
