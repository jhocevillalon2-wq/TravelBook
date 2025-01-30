import { Component } from '@angular/core';
import {NavbarComponent} from "../../shared/components/navbar/navbar.component";
import {FooterComponent} from '../../shared/components/footer/footer.component';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {PhoneCodeSelectorComponent} from '../../shared/components/phone-code-selector/phone-code-selector.component';

@Component({
  selector: 'app-contact-us',
  standalone: true,
  imports: [
    NavbarComponent,
    FooterComponent,
    ReactiveFormsModule,
    PhoneCodeSelectorComponent
  ],
  templateUrl: './contact-us.component.html',
  styleUrl: './contact-us.component.css'
})
export class ContactUsComponent {
  contactForm: FormGroup;
  numero:string='';
  constructor(private fb: FormBuilder) {
    // Configura el formulario con los campos
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      phone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      travel_agency: ['no', Validators.required],
      hotel_category: [''],
      price: [0],
      destination: ['', Validators.required],
      date_start: ['', Validators.required],
      date_end: ['', Validators.required],
      message: [''],
    });
  }
  onPhoneCodeSelected(phoneCode: string): void {
    this.numero = phoneCode.replace('+', ''); // Elimina el '+' del código telefónico
    console.log('Código telefónico seleccionado:', this.numero);
  }
  onSubmit() {
    this.contactForm.value.phone=this.numero+' '+this.contactForm.value.phone;
    if (this.contactForm.valid) {
      const formData = this.contactForm.value;
      console.log('Formulario enviado:', formData);

      // Cambia esta URL por la de tu Apps Script o API
      const url = 'https://script.google.com/macros/s/AKfycbyHD2kfTp0mksS3tr2JAAWLyBMlHQT2WviphZ3zKDArVeGdT0W2xBqe4VmIblAq0sPbmg/exec';

      // Configurar los encabezados de la solicitud
      const headers = {
        'Content-Type': 'text/plain;charset=utf-8'
      };

      // Usamos fetch para enviar la solicitud POST
      fetch(url, {
        redirect:'follow',
        method: 'POST',
        headers: headers,
        body: JSON.stringify(formData) // Convertir formData a JSON
      })
        .then((response) => response.json()) // Parsear la respuesta
        .then((data) => {
          console.log('Datos enviados correctamente:', data);
          alert('Formulario enviado correctamente.');
          this.contactForm.reset();
        })
        .catch((error) => {
          console.error('Error al enviar los datos:', error);
          alert('Ocurrió un error al enviar el formulario.');
        });
    } else {
      alert('Por favor completa todos los campos requeridos.');
    }
  }
}
