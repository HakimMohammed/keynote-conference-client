import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import {provideRouter} from '@angular/router';
import {routes} from './app.routes';
import {provideHttpClient, withInterceptors} from '@angular/common/http';
import {
  INCLUDE_BEARER_TOKEN_INTERCEPTOR_CONFIG,
  includeBearerTokenInterceptor,
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
    provideHttpClient(withInterceptors([includeBearerTokenInterceptor])),
    {
      provide: INCLUDE_BEARER_TOKEN_INTERCEPTOR_CONFIG,
      useValue: [
        {
          urlPattern: /^(http:\/\/localhost:8888)(\/.*)?$/i,
          httpMethods: ['GET', 'POST'] // Token added only for GET and POST
        }
      ]
    },
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideKeycloakAngular(),
  ],
};
