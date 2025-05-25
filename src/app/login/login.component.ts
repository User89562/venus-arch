import { ChangeDetectorRef, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, UntypedFormBuilder, Validators } from '@angular/forms';
import { LoginForm } from './login';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { LoginUtil } from '../utils/login-util';
import { ApiService } from '../services/api.service';
import { MaterialComponents } from '../modules/material-components.module';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, MaterialComponents, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  message: string;
  hide = true;
  loggingIn = false;
  loginUtil = LoginUtil;
  title = 'Venus\' Arch';
  subtitle = 'A web archive/delete filter for Hydrus';
  logo: string;
  loginForm = this.fb.group({
    apiUrl: ["", Validators.required],
    apiKey: ["", Validators.required],
  });
  loginError: string;


  constructor(
    private router: Router,
    private fb: UntypedFormBuilder,
    titleService: Title,
    private apiService: ApiService,
    private cdr: ChangeDetectorRef
  ) {
    this.message = "";
    this.loginError = "";
    this.logo = "/assets/app-logos/app-logo.png";
    titleService.setTitle("Login | Venus\' Arch");
  }
  ngAfterViewInit(): void {
    this.logo = this.determineLoginLogo();
    this.cdr.detectChanges();
  }

  ngOnInit(): void {
    this.determineAuth();
  }

  determineAuth(): void {
    const key = this.loginUtil.retrieveKey();
    const api = this.loginUtil.retrieveUrl();

    if (!(key == "" && api == "")) {
      this.apiService.verifyAccess(api, key).subscribe({
        next: (result) => {
          this.loggingIn = true;
          setTimeout(() => this.router.navigate(["/file-search"]), 700);
        },
      });
    }
  }

  login() {
    this.message = "Trying to log in ...";
  }

  onKey(event: any) {
    if (event.key === "Enter" && this.loginForm.valid) {
      this.onSubmit(this.loginForm.value);
    }
  }

  logout() {
    this.message = "Successfully logged out";
  }

  determineLoginLogo(): string {
    const path = "assets/app-logos/";
    const images = [
      "app-logo.png"
    ];
    let index = Math.floor(Math.random() * (images.length - 1 - 0 + 1) + 0);

    return path + images[index];
  }

  onSubmit(formValues: LoginForm): void {
    this.apiService
      .verifyAccess(formValues.apiUrl, formValues.apiKey)
      .subscribe({
        next: (result) => {
          this.loginUtil.addToStorage(formValues.apiUrl, formValues.apiKey);
          this.loggingIn = true;
          setTimeout(() => this.router.navigate(["/file-search"]), 700);
        },
        error: (e) => {
          this.loginError =
            "Unable to login - Incorrect access, url doesn't exist, or service isn't up";
        },
      });
  }

}
