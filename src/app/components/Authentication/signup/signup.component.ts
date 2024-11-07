import { Component } from '@angular/core';
import { ToyService } from '../../../services/toy.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OAuthService } from 'angular-oauth2-oidc';
//import { googleAuthConfig, twitterAuthConfig, githubAuthConfig } from '../../../auth.config';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
  providers: [OAuthService]
})
export class SignupComponent {
  user = { username: '', password: '', role: '' };
  errorMessage: string = '';

  constructor(private toyService: ToyService, private router: Router, //private oauthService: OAuthService
  ) {}

  signup() {
    this.toyService.signup(this.user).subscribe(
      () => this.router.navigate(['/login']),
      error => this.errorMessage = 'Error signing up'
    );
  }


  // loginWithGoogle() {
  //   this.oauthService.configure(googleAuthConfig);
  //   this.oauthService.initImplicitFlow();
  // }

  // loginWithTwitter() {
  //   this.oauthService.configure(twitterAuthConfig);
  //   this.oauthService.initImplicitFlow();
  // }

  // loginWithGitHub() {
  //   this.oauthService.configure(githubAuthConfig);
  //   this.oauthService.initImplicitFlow();
  // }
  
}
