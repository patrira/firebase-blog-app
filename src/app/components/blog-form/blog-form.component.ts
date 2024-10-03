import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BlogService } from '../../services/blog.service';
import { Router } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';  // Import Meta and Title services

@Component({
  selector: 'app-blog-form',
  templateUrl: './blog-form.component.html',
  styleUrls: ['./blog-form.component.css']
})
export class BlogFormComponent {
  blogForm: FormGroup;
  submitted = false;

  constructor(
    private fb: FormBuilder,
    private blogService: BlogService,
    private router: Router,
    private meta: Meta,               // Inject Meta service
    private titleService: Title       // Inject Title service
  ) {
    this.blogForm = this.fb.group({
      title: ['', Validators.required],
      content: ['', Validators.required],
      createdAt: [new Date()],
      likes: [0]  // Set default likes to 0
    });
  }

  ngOnInit() {
    // Set meta tags for the blog form (create post) page
    this.titleService.setTitle('Create a New Blog Post');
    this.meta.updateTag({ name: 'description', content: 'Create a new blog post and share your thoughts with the world.' });
  }

  get f() {
    return this.blogForm.controls;
  }

  onSubmit() {
    this.submitted = true;

    if (this.blogForm.invalid) {
      return;
    }

    // Prepare the post data
    const postData = {
      title: this.blogForm.value.title,
      content: this.blogForm.value.content,
      createdAt: new Date(),
      likes: 0
    };

    // Create a new blog post and store it in Firestore
    this.blogService.createPost(postData).then(() => {
      this.router.navigate(['/home']);  // Redirect to home after creation
    }).catch(err => {
      console.error('Error creating post', err);
    });
  }
}
