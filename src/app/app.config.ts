import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import {provideRouter} from '@angular/router';
import {routes} from './app.routes';
import {provideHttpClient} from '@angular/common/http';
import {
  provideKeycloak,

} from 'keycloak-angular';
import {environment} from '../environments/environment';

export const provideKeycloakAngular = () =>
  provideKeycloak({
    config: {
      url: environment.keycloak.config.url,
      realm: environment.keycloak.config.realm,
      clientId: environment.keycloak.config.clientId
    },
    initOptions: {
      onLoad: 'login-required',
      silentCheckSsoRedirectUri: window.location.origin + '/public/silent-check-sso.html'
    }
  });

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideKeycloakAngular(),
  ],
};
