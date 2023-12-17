import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SupabaseService } from '../app/services/supabase.service';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { MessageService } from 'primeng/api';
import { MessagesModule } from 'primeng/messages';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { v4 as uuidv4 } from 'uuid';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule, 
    RouterOutlet, 
    FormsModule, 
    ButtonModule,
    ToastModule, 
    ProgressSpinnerModule, 
    MessagesModule,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [MessageService]
})
export class AppComponent implements OnInit {
  @ViewChild('fileInput') fileInput: ElementRef | undefined;

  title = 'my-app';
  isLoading = false;
  messages: any[] = [];
  selectedFile: File | null = null;

  formData = {
    name: '',
    last_name: '',
    email: '',
    phone: '',
    city: '',
    station: '',
    id_number: '',
    suscribe: true,
    image: '',
    upload: ''
  };

  showForm() {
    // Cambiar la propiedad display de form_container
    const formContainer = document.querySelector('.form_container') as HTMLElement;
    if (formContainer) {
      formContainer.style.display = 'flex';
    }

    // Desplazar el scroll a formheader
    const formHeader = document.querySelector('.formheader') as HTMLElement;
    if (formHeader) {
      formHeader.scrollIntoView({ behavior: 'smooth' });
    }
  }


  constructor(
    private supabaseService: SupabaseService,
    private messageService: MessageService
  ) { }

  ngOnInit() {}


  
  handleFileInput(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files.item(0);
    }
  }

  isFormValid(): boolean {
    return this.formData.name !== '' && 
           this.formData.last_name !== '' &&
           this.formData.email !== '' && 
           this.formData.phone !== '' &&
           this.formData.city !== '' && 
           this.formData.station !== '' &&
           this.formData.id_number !== '' && 
           this.selectedFile != null;
  }

  async onSubmit() {
    if (!this.isFormValid()) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Por favor, completa todos los campos requeridos.',
        life: 4000
      });
      return;
    }

    this.isLoading = true;
    try {
      if (this.selectedFile) {
        const uniqueFileName = `${uuidv4()}-${this.selectedFile.name}`;
        console.log("Nombre de archivo único:", uniqueFileName);

        const filePath = `uploads/${uniqueFileName}`;
        console.log("Ruta de archivo para subir:", filePath);

        const { data, error } = await this.supabaseService.supabase.storage.from('uno').upload(filePath, this.selectedFile);

        if (error) throw error;

        const fileUrl = `https://oeocvjsxmjrpytostwrc.supabase.co/storage/v1/object/public/uno/${data.path}`;
        this.formData.image = fileUrl;
      }

      const result = await this.supabaseService.insertData('promoUNOnavidad', this.formData);
      console.log('Datos insertados con éxito', result);
      this.messageService.add({severity:'success', summary:'Éxito', detail:'Datos insertados con éxito', life: 4000});
      
    } catch (error) {
      console.error('Error al insertar datos', error);
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Por favor, completa todos los campos requeridos.',
        life: 4000
      });
    } finally {
      this.resetForm();
      this.selectedFile = null;
      this.isLoading = false;
    }
  }

  resetForm() {
    this.formData = {
      name: '',
      last_name: '',
      email: '',
      phone: '',
      city: '',
      station: '',
      id_number: '',
      suscribe: false,
      image: '',
      upload: ''
    };
    if (this.fileInput && this.fileInput.nativeElement) {
      this.fileInput.nativeElement.value = "";
    }
  }
}
