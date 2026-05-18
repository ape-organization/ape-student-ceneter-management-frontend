import { Component, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MaterialModule } from '../../../material/MaterialModule';
import { Router } from '@angular/router';
import { SharedModule } from '../../../material/SharedModule';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [SharedModule, MaterialModule],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
hidePassword = true;
  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  onSubmit() {
    if (this.loginForm.valid) {
      console.log('Login logic here', this.loginForm.value);
      // Mock login success
      this.router.navigate(['/home']);
    }
  }

  goToRegister() {
    this.router.navigate(['/signup']);
  }
}
