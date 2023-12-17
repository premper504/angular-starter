import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { SupabaseService } from '../app/services/supabase.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'my-app';
  fichaSalidaData: any[] = [];

  
  constructor(private supabaseService: SupabaseService) {  }

  async ngOnInit() {
    // Llama al método para obtener los datos de la tabla ficha_salida
    const { data, error } = await this.supabaseService.supabase
      .from('ficha_salida')
      .select('*'); // Puedes especificar las columnas que deseas seleccionar aquí

    if (!error) {
      this.fichaSalidaData = data; // Almacena los datos en la propiedad
    } else {
      console.error('Error al obtener datos de ficha_salida:', error);
    }
  }
  
}
