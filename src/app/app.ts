import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { CvBuilder } from './components/cv-builder/cv-builder';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, CvBuilder],
  templateUrl: './app.component.html', // Aquí apunta al archivo que acabas de crear
  styleUrl: './app.css'
})
export class App {
  title = 'cv-ia-frontend';
}
