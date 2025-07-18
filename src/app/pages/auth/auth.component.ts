import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {ShopifyAuthService} from '../../core/services/shopify-auth.service';
import {Router} from '@angular/router';
import {NgClass, NgIf} from '@angular/common';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [
    NgIf,
    ReactiveFormsModule,
    NgClass
  ],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css'
})
export class AuthComponent implements OnInit,OnDestroy{
  // Formularios
  registerForm!: FormGroup;
  loginForm!: FormGroup;
  verifyForm!: FormGroup;
  updateProfileForm!: FormGroup;

  // Estados de la UI
  isLoginMode = true;
  showVerification = false;
  showProfile = false;
  loading = false;
  message = '';
  messageType: 'success' | 'error' = 'success';

  // Estado de autenticación
  isLoggedIn = false;
  currentCustomer: any = null;

  private subscriptions: Subscription[] = [];

  constructor(
    private fb: FormBuilder,
    private authService: ShopifyAuthService,
    private router: Router
  ) {
    this.initForms();
  }

  ngOnInit() {
    this.subscribeToAuthState();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  // ========== INICIALIZACIÓN ==========

  private initForms() {
    this.registerForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });

    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });

    this.verifyForm = this.fb.group({
      code: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]]
    });

    this.updateProfileForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['']
    });
  }

  private subscribeToAuthState() {
    // Suscribirse al estado de autenticación
    const authSub = this.authService.isLoggedIn$.subscribe(isLoggedIn => {
      this.isLoggedIn = isLoggedIn;
      if (isLoggedIn) {
        this.showProfile = true;
        this.showVerification = false;
        this.resetForms();
      }
    });

    // Suscribirse a los datos del cliente actual
    const customerSub = this.authService.currentCustomer$.subscribe(customer => {
      this.currentCustomer = customer;
      if (customer) {
        this.updateProfileForm.patchValue({
          firstName: customer.firstName,
          lastName: customer.lastName,
          email: customer.email,
          phone: customer.phone || ''
        });
      }
    });

    this.subscriptions.push(authSub, customerSub);
  }

  // ========== VALIDADORES ==========

  private passwordMatchValidator(group: FormGroup) {
    const password = group.get('password');
    const confirmPassword = group.get('confirmPassword');

    if (password && confirmPassword && password.value !== confirmPassword.value) {
      return { passwordMismatch: true };
    }
    return null;
  }

  // ========== MÉTODOS DE AUTENTICACIÓN ==========

  async onRegister() {
    if (this.registerForm.valid) {
      this.loading = true;
      this.clearMessage();

      try {
        const formData = this.registerForm.value;
        await this.authService.register({
          email: formData.email,
          password: formData.password,
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone
        });

        this.showMessage('Cuenta creada exitosamente. Ahora puedes iniciar sesión.', 'success');
        this.switchToLogin();
      } catch (error: any) {
        this.showMessage(error.message || 'Error al crear cuenta', 'error');
      } finally {
        this.loading = false;
      }
    } else {
      this.markFormGroupTouched(this.registerForm);
    }
  }

  async onLogin() {
    if (this.loginForm.valid) {
      this.loading = true;
      this.clearMessage();

      try {
        await this.authService.login(this.loginForm.value.email);
        this.showVerification = true;
        this.showMessage('Código enviado a tu email', 'success');
      } catch (error: any) {
        this.showMessage(error.message || 'Error al iniciar sesión', 'error');
      } finally {
        this.loading = false;
      }
    } else {
      this.markFormGroupTouched(this.loginForm);
    }
  }

  async onVerifyCode() {
    if (this.verifyForm.valid) {
      this.loading = true;
      this.clearMessage();

      try {
        await this.authService.verifyCode(
          this.loginForm.value.email,
          this.verifyForm.value.code
        );

        this.showMessage('Sesión iniciada exitosamente', 'success');
        // El estado se actualiza automáticamente por la suscripción

        // Opcional: redirigir a otra página
        // this.router.navigate(['/dashboard']);
      } catch (error: any) {
        this.showMessage(error.message || 'Código inválido', 'error');
      } finally {
        this.loading = false;
      }
    } else {
      this.markFormGroupTouched(this.verifyForm);
    }
  }

  // ========== GESTIÓN DE PERFIL ==========

  async onUpdateProfile() {
    if (this.updateProfileForm.valid && this.currentCustomer) {
      this.loading = true;
      this.clearMessage();

      try {
        await this.authService.updateCustomer(
          this.currentCustomer.id,
          this.updateProfileForm.value
        );

        this.showMessage('Perfil actualizado exitosamente', 'success');
      } catch (error: any) {
        this.showMessage(error.message || 'Error al actualizar perfil', 'error');
      } finally {
        this.loading = false;
      }
    } else {
      this.markFormGroupTouched(this.updateProfileForm);
    }
  }

  async loadCustomerData() {
    if (this.currentCustomer) {
      this.loading = true;
      try {
        const customerData = await this.authService.getCustomerData(this.currentCustomer.id);
        // Los datos se actualizan automáticamente por el servicio
        this.showMessage('Datos actualizados', 'success');
      } catch (error: any) {
        this.showMessage('Error al cargar datos', 'error');
      } finally {
        this.loading = false;
      }
    }
  }

  // ========== LOGOUT ==========

  onLogout() {
    this.authService.logout();
    this.showProfile = false;
    this.showVerification = false;
    this.isLoginMode = true;
    this.resetForms();
    this.showMessage('Sesión cerrada exitosamente', 'success');
  }

  // ========== MÉTODOS DE UI ==========

  switchToLogin() {
    this.isLoginMode = true;
    this.showVerification = false;
    this.resetForms();
    this.clearMessage();
  }

  switchToRegister() {
    this.isLoginMode = false;
    this.showVerification = false;
    this.resetForms();
    this.clearMessage();
  }

  backToLogin() {
    this.showVerification = false;
    this.clearMessage();
  }

  private resetForms() {
    this.registerForm.reset();
    this.loginForm.reset();
    this.verifyForm.reset();
  }

  private showMessage(message: string, type: 'success' | 'error') {
    this.message = message;
    this.messageType = type;

    // Limpiar mensaje después de 5 segundos
    setTimeout(() => {
      this.clearMessage();
    }, 5000);
  }

  private clearMessage() {
    this.message = '';
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  // ========== GETTERS PARA VALIDACIÓN ==========

  get registerFormControls() { return this.registerForm.controls; }
  get loginFormControls() { return this.loginForm.controls; }
  get verifyFormControls() { return this.verifyForm.controls; }
  get updateProfileFormControls() { return this.updateProfileForm.controls; }

  // Métodos de validación para el template
  isFieldInvalid(form: FormGroup, fieldName: string): boolean {
    const field = form.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(form: FormGroup, fieldName: string): string {
    const field = form.get(fieldName);
    if (field && field.errors && (field.dirty || field.touched)) {
      if (field.errors['required']) return `${fieldName} es requerido`;
      if (field.errors['email']) return 'Email inválido';
      if (field.errors['minlength']) return `Mínimo ${field.errors['minlength'].requiredLength} caracteres`;
      if (field.errors['pattern']) return 'Formato inválido';
      if (field.errors['passwordMismatch']) return 'Las contraseñas no coinciden';
    }
    return '';
  }
}
