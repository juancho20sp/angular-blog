import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  constructor(private firestore: AngularFirestore) { }

  getAllPosts(): any {
    return this.firestore.collection('posts').snapshotChanges();
  }

  deletePost(id: string) {
    return this.firestore.collection('posts').doc(id).delete();
  }

  updatePost(id: string, post: any) {
    return this.firestore.collection('posts').doc(id).update(post);
  }

  createPost(post: any) {
    return this.firestore.collection('posts').add(post);
  }
}
