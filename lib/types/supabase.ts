// Minimal generated types placeholder; extend with real types as needed.
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      images: {
        Row: {
          id: number;
          user_id: string;
          filename: string;
          original_path: string;
          thumbnail_path: string;
          uploaded_at: string | null;
          size_bytes: number | null;
          content_type: string | null;
        };
      };
      image_metadata: {
        Row: {
          id: number;
          image_id: number;
          user_id: string;
          description: string | null;
          tags: string[] | null;
          colors: string[] | null;
          ai_processing_status: string | null;
          ai_error: string | null;
          created_at: string | null;
          updated_at: string | null;
        };
      };
    };
  };
}
