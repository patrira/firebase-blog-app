import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user: any;

  constructor(
    private authService: AuthService,
    private router: Router,
    private meta: Meta,
    private titleService: Title
  ) {}

  ngOnInit() {
    
    this.titleService.setTitle('Profile - Blog Platform');
    this.meta.updateTag({ name: 'description', content: 'Your profile details on Blog Platform.' });

    
    this.authService.isLoggedIn().subscribe(user => {
      this.user = user;
      if (!this.user) {
        this.router.navigate(['/login']);  
      }
    });
  }

  // Logout user
  logout() {
    this.authService.logout().then(() => {
      this.router.navigate(['/login']);
    }).catch(err => {
      console.error('Logout error', err);
    });
  }
}
