import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import firebase from 'firebase/compat/app';  // Import firebase for FieldValue operations

@Injectable({
  providedIn: 'root'
})
export class BlogService {
  private collectionPath = 'blogPosts';  // Firestore collection for blog posts

  constructor(private firestore: AngularFirestore, private authService: AuthService) {}

  // Create a new blog post
  createPost(post: any) {
    return this.firestore.collection(this.collectionPath).add(post);
  }

  // Get all blog posts
  getPosts(): Observable<any[]> {
    return this.firestore.collection(this.collectionPath, ref => ref.orderBy('createdAt', 'desc')).valueChanges({ idField: 'id' });
  }

  // Like a blog post (with user info and timestamp)
  likePost(id: string, likes: number, userInfo: any) {
    // Update the blog post with like and user info using firebase.firestore.FieldValue
    return this.firestore.collection(this.collectionPath).doc(id).update({
      likes: likes + 1,
      likedBy: firebase.firestore.FieldValue.arrayUnion(userInfo)
    });
  }

  // Delete a blog post
  deletePost(id: string) {
    return this.firestore.collection(this.collectionPath).doc(id).delete();
  }

  // Update an existing blog post
  updatePost(id: string, post: any) {
    return this.firestore.collection(this.collectionPath).doc(id).update(post);
  }

  // Add a comment to a post
  addComment(postId: string, comment: any) {
    return this.firestore.collection(`${this.collectionPath}/${postId}/comments`).add(comment);
  }

  // Get comments for a specific post
  getComments(postId: string): Observable<any[]> {
    return this.firestore.collection(`${this.collectionPath}/${postId}/comments`, ref => ref.orderBy('createdAt', 'asc')).valueChanges();
  }
}
