import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '@services/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  public loginForm!: FormGroup;
  public isLoggedIn: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.createForm();

    if (localStorage.getItem('user')) {
      this.isLoggedIn = true;
    }
  }


  createForm() {
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.compose([Validators.email, Validators.required])],
      password: ['', Validators.compose([Validators.required])]
    })
  }


  async signUp() {
    const { email, password } = this.loginForm.value;

    await this.auth.singUp(email, password);

    if (this.auth.isLoggedIn) {
      this.isLoggedIn = true;
      this.goToAdmin();
    }
  }

  async signIn() {
    const { email, password } = this.loginForm.value;
    await this.auth.singIn(email, password);

    if (this.auth.isLoggedIn) {
      this.isLoggedIn = true;
      this.goToAdmin();
    }
  }

  goToAdmin() {
    this.router.navigateByUrl('/admin');
  }
}
