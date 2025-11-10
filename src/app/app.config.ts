import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideHttpClient, withFetch, withInterceptors, withXsrfConfiguration } from '@angular/common/http';
import { withCredentialsInterceptor } from './interceptors/with-credentials.interceptor';
export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ 
      eventCoalescing: true 
    }), 
    provideRouter(routes), 
    provideClientHydration(),
    provideHttpClient(
      withFetch(),
      withXsrfConfiguration({
        cookieName: 'XSRF-TOKEN',   // Nombre de la cookie que Laravel envía
        headerName: 'X-XSRF-TOKEN'  // Header que Angular enviará automáticamente
      }),
      withInterceptors([withCredentialsInterceptor]) // interceptor global para cookies

    )]
};
