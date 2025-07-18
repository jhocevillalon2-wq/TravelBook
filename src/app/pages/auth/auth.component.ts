import { Component } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {ShopifyAuthService} from '../../core/services/shopify-auth.service';
import {Router} from '@angular/router';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [
    NgIf,
    ReactiveFormsModule
  ],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css'
})
export class AuthComponent {
  loginForm: FormGroup;
  registerForm: FormGroup;
  isLoginMode = true;
  loading = false;
  message = '';

  constructor(
    private fb: FormBuilder,
    private authService: ShopifyAuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

    this.registerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      phone: ['']
    });
  }

  async onLogin() {
    if (this.loginForm.valid) {
      this.loading = true;
      try {
        const { email, password } = this.loginForm.value;
        await this.authService.login(email, password);
        this.router.navigate(['/productos']);
      } catch (error: any) {
        this.message = error.message || 'Error al iniciar sesión';
      } finally {
        this.loading = false;
      }
    }
  }

  async onRegister() {
    if (this.registerForm.valid) {
      this.loading = true;
      try {
        await this.authService.register(this.registerForm.value);
        this.message = 'Cuenta creada exitosamente. Ahora puedes iniciar sesión.';
        this.isLoginMode = true;
      } catch (error: any) {
        this.message = error.message || 'Error al crear cuenta';
      } finally {
        this.loading = false;
      }
    }
  }

  toggleMode() {
    this.isLoginMode = !this.isLoginMode;
    this.message = '';
  }
}
