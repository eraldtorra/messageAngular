import { ApplicationConfig, provideZoneChangeDetection, APP_INITIALIZER } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAuth0 } from '@auth0/auth0-angular';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura';

import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { AppInitializerService } from './services/app-initializer.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    provideAnimationsAsync(),
    providePrimeNG({
            theme: {
                preset: Aura
            }
        }),
    {
      provide: APP_INITIALIZER,
      useFactory: (appInitializer: AppInitializerService) => () => appInitializer.initialize(),
      deps: [AppInitializerService],
      multi: true
    }
  ],
};

