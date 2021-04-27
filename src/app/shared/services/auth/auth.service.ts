import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public isLoggedIn: boolean = false;

  constructor(private auth: AngularFireAuth,
    private router: Router) { }

  async singIn(email: string, password: string) {
    await this.auth.signInWithEmailAndPassword(email, password)
      .then(res => {
        this.isLoggedIn = true;

        console.log(res);

        localStorage.setItem('user', JSON.stringify(res.user));
      })
      .catch(err => {
        console.error(err)
      })
  }

  async singUp(email: string, password: string) {
    await this.auth.createUserWithEmailAndPassword(email, password)
      .then(res => {
        this.isLoggedIn = true;

        console.log(res);

        localStorage.setItem('user', JSON.stringify(res.user));
      })
      .catch(err => {
        console.error(err)
      })
  }

  logout() {
    this.auth.signOut();
    localStorage.removeItem('user');
    this.router.navigateByUrl('/');
  }
}
