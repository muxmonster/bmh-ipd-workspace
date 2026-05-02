import { computed, inject, Injectable } from '@angular/core';
import { ConfigService } from '../configs/config.service';

@Injectable({
  providedIn: 'root',
})
export class HosxpService {
  private configService = inject(ConfigService);
  private version = computed(()=> this.configService.config()?.VERSION ??[]);

  loadVersion(){
    return this.version();
  }
}
