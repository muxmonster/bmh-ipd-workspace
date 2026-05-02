import { Component, signal } from '@angular/core';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-noso-list',
  imports: [RouterLink],
  templateUrl: './noso-list.html',
  styleUrl: './noso-list.scss',
})
export class NosoList {
  an = signal<string>('680001234');

}
