import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BlogService {
  // Firestore collection for blog posts
  private collectionPath = 'blogPosts';  

  constructor(private firestore: AngularFirestore) {}

  // Create a new blog post
  createPost(post: any) {
    return this.firestore.collection(this.collectionPath).add(post);
  }

  // Get all blog posts
  getPosts(): Observable<any[]> {
    return this.firestore.collection(this.collectionPath, ref => ref.orderBy('createdAt', 'desc')).valueChanges({ idField: 'id' });
  }

  // Update an existing blog post
  updatePost(id: string, post: any) {
    return this.firestore.collection(this.collectionPath).doc(id).update(post);
  }

  // Delete a blog post
  deletePost(id: string) {
    return this.firestore.collection(this.collectionPath).doc(id).delete();
  }

  // Like a blog post
  likePost(id: string, likes: number) {
    return this.firestore.collection(this.collectionPath).doc(id).update({ likes: likes + 1 });
  }

  // Add a comment to a post (stored in a subcollection)
  addComment(postId: string, comment: any) {
    return this.firestore.collection(`${this.collectionPath}/${postId}/comments`).add(comment);
  }

  // Get comments for a specific post
  getComments(postId: string): Observable<any[]> {
    return this.firestore.collection(`${this.collectionPath}/${postId}/comments`, ref => ref.orderBy('createdAt', 'asc')).valueChanges();
  }
}
