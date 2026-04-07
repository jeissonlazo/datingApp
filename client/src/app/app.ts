import { Component, inject } from '@angular/core';
import { Nav } from "../layout/nav/nav";
import { Router, RouterOutlet } from "@angular/router";

@Component({
  selector: 'app-root',
  imports: [Nav, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected router = inject(Router);
}
