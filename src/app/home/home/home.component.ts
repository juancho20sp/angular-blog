import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '@services/firebase.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  public posts: any = [];

  constructor(
    private firebaseService: FirebaseService
  ) { }

  ngOnInit(): void {
    this.getAllPosts();
  }

  getAllPosts() {
    this.firebaseService.getAllPosts().subscribe((res: any) => {
      const newPosts = res.map((e: any) => {
        const document = e.payload.doc.data();
        return {
          firebaseId: e.payload.doc.id,
          title: document.title,
          subtitle: document.subtitle,
          imageUrl: document.imageUrl,
          likes: document.likes,
          description: document.description,
          comments: document.comments
        }
      });

      this.posts = newPosts;
      console.log(this.posts);
    })
  }

}
