import { Component, OnInit } from '@angular/core';
import { BlogService } from '../../services/blog.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  posts: any[] = [];
  user: any = null;
  newComment: { [key: string]: string } = {};
  authSubscription!: Subscription;  // Subscription for auth state

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

    // Subscribe to auth state to dynamically update UI
    this.authSubscription = this.authService.isLoggedIn().subscribe(user => {
      this.user = user;
    });

    // Fetch blog posts from Firestore
    this.blogService.getPosts().subscribe(data => {
      this.posts = data;
    }, (error: any) => {
      console.error('Error fetching posts', error);
    });
  }

  // Like a blog post (with user info)
  likePost(id: string, likes: number) {
    if (this.user) {
      const userInfo = {
        displayName: this.user.displayName || 'Anonymous',
        email: this.user.email,
        likedAt: new Date()
      };

      // Use the BlogService to like the post and pass user info
      this.blogService.likePost(id, likes, userInfo).then(() => {
        console.log('Post liked');
      }).catch((err: any) => {
        console.error('Error liking post', err);
      });
    }
  }

  // Delete a blog post
  deletePost(id: string) {
    this.blogService.deletePost(id).then(() => {
      console.log('Post deleted');
    }).catch((err: any) => {
      console.error('Error deleting post', err);
    });
  }

  // Update a blog post (for UI logic)
  updatePost(post: any) {
    alert(`Updating post: ${post.title}`);
    // Additional inline editing logic can go here
  }

  // Add comment to a post
  addComment(postId: string) {
    if (this.newComment[postId]) {
      const commentData = {
        text: this.newComment[postId],
        createdAt: new Date()
      };

      this.blogService.addComment(postId, commentData).then(() => {
        console.log('Comment added');
        this.newComment[postId] = '';  // Clear the input after comment
      }).catch((err: any) => {
        console.error('Error adding comment', err);
      });
    }
  }

  // Read more (Navigate to full post page)
  readMore(post: any) {
    alert(`Reading more about: ${post.title}`);
  }

  // Logout user and redirect to home
  logout() {
    this.authService.logout().then(() => {
      this.router.navigate(['/home']);  // Redirect to home after logout
    }).catch((err: any) => {
      console.error('Logout error', err);
    });
  }

  // Unsubscribe from auth state to avoid memory leaks
  ngOnDestroy() {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }
}
