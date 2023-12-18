
import { Injectable } from '@angular/core';
import { createClient } from '@supabase/supabase-js';

@Injectable({
    providedIn: 'root'
  })
  export class SupabaseService {
    private supabaseUrl = process.env['SUPABASE_URL'] || 'https://oeocvjsxmjrpytostwrc.supabase.co'; 
    private supabaseApiKey = process.env['SUPABASE_API_KEY'] || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9lb2N2anN4bWpycHl0b3N0d3JjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDI1MDI1NDEsImV4cCI6MjAxODA3ODU0MX0.9kiGnBg8IyLxX1NGqhYnwH2rLG4zaS-WffsYSiPbSaA'; 
    public supabase = createClient(this.supabaseUrl, this.supabaseApiKey);
  
    constructor() { }


    async insertData(tableName: string, data: any) {
      const { data: insertedData, error } = await this.supabase
        .from(tableName)
        .insert([data]);
      if (error) throw error;
      return insertedData;
    }
    
  }