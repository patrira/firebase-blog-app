import { Component, OnInit, OnDestroy } from '@angular/core';
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
export class HomeComponent implements OnInit, OnDestroy {
  posts: any[] = [];
  user: any = null;
  newComment: { [key: string]: string } = {};
  selectedPost: any = null;  // For Read More modal
  authSubscription!: Subscription;

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

  // Update a blog post (navigate to blog form for editing)
  updatePost(post: any) {
    this.router.navigate(['/blog-form'], { state: { post } });
  }

  // Add comment to a post
  addComment(postId: string) {
    if (this.newComment[postId]) {
      const commentData = {
        text: this.newComment[postId],
        createdAt: new Date(),
        displayName: this.user.displayName || 'Anonymous',
        email: this.user.email
      };

      this.blogService.addComment(postId, commentData).then(() => {
        console.log('Comment added');
        this.newComment[postId] = '';  // Clear the input after comment

        // Fetch updated comments to reflect new count
        this.blogService.getComments(postId).subscribe(comments => {
          this.posts.find(p => p.id === postId).comments = comments;
        });
      }).catch((err: any) => {
        console.error('Error adding comment', err);
      });
    }
  }

  // Read more (Show full post in modal)
  readMore(post: any) {
    this.selectedPost = post;
  }

  // Close Read More modal and navigate back to home
  closeModal() {
    this.selectedPost = null;
    this.router.navigate(['/home']);
  }

  // Logout user and redirect to home
  logout() {
    this.authService.logout().then(() => {
      this.router.navigate(['/home']);  
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
