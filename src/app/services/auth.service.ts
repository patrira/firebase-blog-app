import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { GoogleAuthProvider } from 'firebase/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private afAuth: AngularFireAuth) {}

  
  register(name: string, email: string, password: string) {
    return this.afAuth.createUserWithEmailAndPassword(email, password).then(userCredential => {
      
      return userCredential.user?.updateProfile({
        displayName: name
      });
    });
  }

  
  login(email: string, password: string) {
    return this.afAuth.signInWithEmailAndPassword(email, password);
  }

  
  googleSignIn() {
    return this.afAuth.signInWithPopup(new GoogleAuthProvider());
  }

  
  logout() {
    return this.afAuth.signOut();
  }

  // Get current auth state (logged in user)
  isLoggedIn() {
    return this.afAuth.authState;
  }
}
