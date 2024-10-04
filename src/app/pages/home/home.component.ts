import { Component, OnInit } from '@angular/core';
import { BlogService } from '../../services/blog.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  posts: any[] = [];

  constructor(
    private blogService: BlogService,
    private authService: AuthService,
    private router: Router,
    private meta: Meta,
    private titleService: Title
  ) {}

  ngOnInit() {
    // Set meta tags for the homepage
    this.titleService.setTitle('Home - Blog Platform');
    this.meta.updateTag({
      name: 'description',
      content: 'Welcome to the blog platform, where you can read and share amazing blog posts.'
    });

    // Fetch blog posts from Firestore
    this.blogService.getPosts().subscribe(data => {
      this.posts = data;
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

  // Like a blog post
  likePost(id: string, likes: number) {
    this.blogService.likePost(id, likes).then(() => {
      console.log('Post liked');
    }).catch(err => {
      console.error('Error liking post', err);
    });
  }

  // Delete a blog post
  deletePost(id: string) {
    this.blogService.deletePost(id).then(() => {
      console.log('Post deleted');
    }).catch(err => {
      console.error('Error deleting post', err);
    });
  }
}
