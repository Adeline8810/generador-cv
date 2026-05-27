import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideTranslateService } from '@ngx-translate/core';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter([]),
    provideHttpClient(),
    // Configuramos el servicio sin cargadores complejos que causan errores en SSR
    provideTranslateService({
      defaultLanguage: 'es',
      fallbackLang: 'es' // Soluciona la advertencia de deprecación
    })
  ]
};
