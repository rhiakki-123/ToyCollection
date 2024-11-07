import { AuthConfig } from 'angular-oauth2-oidc';

const redirectUri = typeof window !== 'undefined' ? window.location.origin : '';

export const googleAuthConfig: AuthConfig = {
  issuer: 'https://accounts.google.com',
  redirectUri: redirectUri,
  clientId: 'YOUR_GOOGLE_CLIENT_ID',
  scope: 'openid profile email',
  strictDiscoveryDocumentValidation: false,
};

export const twitterAuthConfig: AuthConfig = {
  issuer: 'https://api.twitter.com',
  redirectUri: redirectUri,
  clientId: 'YOUR_TWITTER_CLIENT_ID',
  scope: 'openid profile email',
  strictDiscoveryDocumentValidation: false,
};

export const githubAuthConfig: AuthConfig = {
  issuer: 'https://github.com/login/oauth/authorize',
  redirectUri: redirectUri,
  clientId: 'YOUR_GITHUB_CLIENT_ID',
  scope: 'openid profile email',
  strictDiscoveryDocumentValidation: false,
};