import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  submitted = false;
  loginError: string = '';

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  get f() { return this.loginForm.controls; }

  onSubmit() {
    this.submitted = true;

    // Stop if the form is invalid
    if (this.loginForm.invalid) {
      return;
    }

    // Use bracket notation to access form controls
    this.authService.login(this.f['email'].value, this.f['password'].value).then(() => {
      this.router.navigate(['/home']);
    }).catch(err => {
      this.loginError = 'Invalid email or password. Please try again.';
    });
  }

  googleSignIn() {
    this.authService.googleSignIn().then(() => {
      this.router.navigate(['/home']);
    }).catch(err => {
      this.loginError = 'Google login failed. Please try again.';
    });
  }
}
