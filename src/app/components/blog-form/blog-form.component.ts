import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BlogService } from '../../services/blog.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-blog-form',
  templateUrl: './blog-form.component.html',
  styleUrls: ['./blog-form.component.css']
})
export class BlogFormComponent implements OnInit {
  blogForm: FormGroup;
  submitted = false;

  constructor(private fb: FormBuilder, private blogService: BlogService, public router: Router) {
    this.blogForm = this.fb.group({
      title: ['', Validators.required],
      content: ['', Validators.required],
      imageUrl: [''],
      videoUrl: [''],
      createdAt: [new Date()],
      likes: [0]
    });
  }

  ngOnInit() {
    const state = this.router.getCurrentNavigation()?.extras.state as { post: any };
    if (state && state.post) {
      this.blogForm.patchValue(state.post);
    }
  }

  get f() {
    return this.blogForm.controls;
  }

  onSubmit() {
    this.submitted = true;

    if (this.blogForm.invalid) {
      return;
    }

    const postData = {
      title: this.blogForm.value.title,
      content: this.blogForm.value.content,
      imageUrl: this.blogForm.value.imageUrl,
      videoUrl: this.blogForm.value.videoUrl,
      createdAt: new Date(),
      likes: 0
    };

    this.blogService.createPost(postData).then(() => {
      this.router.navigate(['/home']);
    }).catch(err => {
      console.error('Error creating post', err);
    });
  }
}
