import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  config = signal<any>(null);

  async loadConfig(): Promise<void> {
    return fetch('assets/config.json')
      .then((r) => r.json())
      .then((c) => this.config.set(c));
  }
}
