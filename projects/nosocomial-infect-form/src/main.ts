import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { ConfigService } from './app/services/configs/config.service';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';

const configService = new ConfigService();
configService.loadConfig().then(() => {
  // bootstrapApplication(App, appConfig)
  // .catch((err) => console.error(err));
  bootstrapApplication(App, {
    providers: [provideRouter(routes), { provide: ConfigService, useValue: configService }],
  }).catch((err) => console.error(err));
});
