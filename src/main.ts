// main.ts
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { AppComponent } from './app/app.component';
import { appRoutes } from './app/app.routes';
import { OAuthService, OAuthModule } from 'angular-oauth2-oidc';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';



bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(appRoutes),
    provideHttpClient(withFetch()), provideAnimationsAsync(), // This should provide HttpClient app-wide,
    // OAuthService,
    // { provide: OAuthModule, useValue: OAuthModule.forRoot() }
  ]
}).catch(err => console.error(err));
