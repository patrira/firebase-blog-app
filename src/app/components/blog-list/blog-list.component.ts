import { Component, OnInit } from '@angular/core';
import { BlogService } from '../../services/blog.service';
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

  constructor(
    private blogService: BlogService,
    private router: Router,
    private meta: Meta,               
    private titleService: Title       
  ) {}

  ngOnInit() {
    
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

  // Share post
  sharePost(post: any) {
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
        this.newComment[postId] = '';  
      }).catch(err => {
        console.error('Error adding comment', err);
      });
    }
  }
}
