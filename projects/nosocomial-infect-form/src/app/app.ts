import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HosxpService } from './services/hosxp/hosxp.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('nosocomial-infect-form');
  private hosxpS = inject(HosxpService);

  constructor() {
    console.log('Version: ', this.hosxpS.loadVersion());
  }
}
