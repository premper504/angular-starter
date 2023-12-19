
import { Injectable } from '@angular/core';
import { createClient } from '@supabase/supabase-js';
import { environment } from '../../../src/environments/environment.prod';

@Injectable({
    providedIn: 'root'
  })
  export class SupabaseService {
    private supabaseUrl = environment.supabaseUrl;
    private supabaseApiKey = environment.supabaseApiKey; 
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