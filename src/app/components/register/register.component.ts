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

  constructor(public fb: FormBuilder, public authService: AuthService, public router: Router) { 
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
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

    if (this.registerForm.invalid) {
      return;
    }

    const { name, email, password } = this.registerForm.value;

    this.authService.register(name, email, password).then(() => {
      this.router.navigate(['/home']);
    }).catch(err => {
      this.registerError = 'Registration failed. Please try again.';
    });
  }
}
