import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class SpeechService {
  private platformId = inject(PLATFORM_ID);
  private recognition: any;

  constructor() {
    // Solo ejecutamos esto si estamos en el navegador
    if (isPlatformBrowser(this.platformId)) {
      const { webkitSpeechRecognition }: any = window;
      if (webkitSpeechRecognition) {
        this.recognition = new webkitSpeechRecognition();
        this.recognition.lang = 'es-ES';
      }
    }
  }

async escuchar(lang: string): Promise<string> {
  return new Promise((resolve, reject) => {
    // Aquí configuramos el idioma en la API nativa del navegador
    this.recognition.lang = lang;

    this.recognition.start();

    this.recognition.onresult = (event: any) => {
      resolve(event.results[0][0].transcript);
    };

    this.recognition.onerror = (err: any) => reject(err);
  });
}
}
