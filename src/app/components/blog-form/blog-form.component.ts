import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BlogService } from '../../services/blog.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-blog-form',
  templateUrl: './blog-form.component.html',
  styleUrls: ['./blog-form.component.css']
})
export class BlogFormComponent {
  blogForm: FormGroup;
  submitted = false;

  constructor(private fb: FormBuilder, private blogService: BlogService, private router: Router) {
    this.blogForm = this.fb.group({
      title: ['', Validators.required],
      content: ['', Validators.required],
      createdAt: [new Date()],
      likes: [0]  // Set default likes to 0
    });
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
