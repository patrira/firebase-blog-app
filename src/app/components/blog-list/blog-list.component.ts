import { Component, OnInit } from '@angular/core';
import { BlogService } from '../../services/blog.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-blog-list',
  templateUrl: './blog-list.component.html',
  styleUrls: ['./blog-list.component.css']
})
export class BlogListComponent implements OnInit {
  posts: any[] = [];
  comments: { [key: string]: any[] } = {};  // Store comments for each post
  newComment: { [key: string]: string } = {};  // Store new comment for each post

  constructor(private blogService: BlogService, private router: Router) {}

  ngOnInit() {
    // Fetch posts from Firestore
    this.blogService.getPosts().subscribe(data => {
      this.posts = data;

      // For each post, get its comments
      this.posts.forEach(post => {
        this.blogService.getComments(post.id).subscribe(comments => {
          this.comments[post.id] = comments;
        });
      });
    });
  }

  // Like post
  likePost(id: string, likes: number) {
    this.blogService.likePost(id, likes).then(() => {
      console.log('Post liked');
    }).catch(err => {
      console.error('Error liking post', err);
    });
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

  // Share post (placeholder)
  sharePost(post: any) {
    console.log('Sharing post:', post);
    alert(`Sharing post: ${post.title}`);
  }

  // Add comment to post
  addComment(postId: string) {
    if (this.newComment[postId]) {
      const commentData = {
        text: this.newComment[postId],
        createdAt: new Date()
      };

      this.blogService.addComment(postId, commentData).then(() => {
        console.log('Comment added');
        this.newComment[postId] = '';  // Clear comment input after submission
      }).catch(err => {
        console.error('Error adding comment', err);
      });
    }
  }
}
