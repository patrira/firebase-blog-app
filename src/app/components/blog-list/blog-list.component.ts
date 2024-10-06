import { Component, OnInit } from '@angular/core';
import { BlogService } from '../../services/blog.service';
import { AuthService } from '../../services/auth.service';  // Import AuthService
import { Router } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';  

@Component({
  selector: 'app-blog-list',
  templateUrl: './blog-list.component.html',
  styleUrls: ['./blog-list.component.css']
})
export class BlogListComponent implements OnInit {
  posts: any[] = [];
  comments: { [key: string]: any[] } = {};
  newComment: { [key: string]: string } = {};
  user: any = null;  // Store the logged-in user

  constructor(
    private blogService: BlogService,
    private authService: AuthService,  // Inject AuthService
    private router: Router,
    private meta: Meta,
    private titleService: Title
  ) {}

  ngOnInit() {
    // Subscribe to auth state
    this.authService.isLoggedIn().subscribe(user => {
      this.user = user;
    });

    // Set meta tags for blog posts
    this.titleService.setTitle('Blog Posts');
    this.meta.updateTag({ name: 'description', content: 'Explore a wide range of blog posts on various topics.' });

    // Fetch posts from Firestore
    this.blogService.getPosts().subscribe(data => {
      this.posts = data;

      if (this.posts.length > 0) {
        const firstPost = this.posts[0];
        this.titleService.setTitle(firstPost.title);
        this.meta.updateTag({ name: 'description', content: firstPost.content.substring(0, 150) });
        this.meta.updateTag({ property: 'og:title', content: firstPost.title });
        this.meta.updateTag({ property: 'og:description', content: firstPost.content.substring(0, 150) });
      }

      // Fetch comments for each post
      this.posts.forEach(post => {
        this.blogService.getComments(post.id).subscribe(comments => {
          this.comments[post.id] = comments;
        });
      });
    });
  }

  // Like post with user info
  likePost(id: string, likes: number) {
    if (this.user) {
      const userInfo = {
        displayName: this.user.displayName || 'Anonymous',
        email: this.user.email,
        likedAt: new Date()
      };

      this.blogService.likePost(id, likes, userInfo).then(() => {
        console.log('Post liked');
      }).catch(err => {
        console.error('Error liking post', err);
      });
    }
  }

  // Delete post
  deletePost(id: string) {
    this.blogService.deletePost(id).then(() => {
      console.log('Post deleted');
    }).catch(err => {
      console.error('Error deleting post', err);
    });
  }

  // Update post - Navigate to the blog form for editing
  updatePost(post: any) {
    this.router.navigate(['/blog-form'], { state: { post } });
  }

  // Add comment to post
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
      }).catch(err => {
        console.error('Error adding comment', err);
      });
    }
  }
}
