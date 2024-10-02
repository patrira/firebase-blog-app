import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerForm: FormGroup;
  submitted = false;
  registerError: string = '';

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validator: this.passwordsMatch });
  }

  get f() { return this.registerForm.controls; }

  // Validator to check if passwords match
  passwordsMatch(group: FormGroup) {
    const password = group.get('password');
    const confirmPassword = group.get('confirmPassword');
    return password?.value === confirmPassword?.value ? null : { notMatching: true };
  }

  onSubmit() {
    this.submitted = true;

    // Stop if the form is invalid
    if (this.registerForm.invalid) {
      return;
    }

    this.authService.register(this.f['email'].value, this.f['password'].value).then(() => {
      this.router.navigate(['/login']);
    }).catch(err => {
      this.registerError = 'Registration failed. Please try again.';
    });
  }
}
