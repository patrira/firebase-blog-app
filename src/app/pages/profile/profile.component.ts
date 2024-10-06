import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user: any = null;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    // Get logged-in user details
    this.authService.isLoggedIn().subscribe(user => {
      this.user = user;
    });
  }

  logout() {
    this.authService.logout().then(() => {
      this.router.navigate(['/home']);  
    }).catch(err => {
      console.error('Error logging out', err);
    });
  }
}

