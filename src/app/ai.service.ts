import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AiService {

async traducirProfesional(texto: string, idiomaOrigenCompleto: string, idiomaDestinoCompleto: string): Promise<string> {
  const contexto = "CV profesional: ";
  const textoConContexto = `${contexto}${texto}`;

  // Extraemos las dos primeras letras (ej: "fr" de "fr-FR")
  const origen = idiomaOrigenCompleto.split('-')[0];
  const destino = idiomaDestinoCompleto.split('-')[0];

  const langPair = `${origen}|${destino}`;
  const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(textoConContexto)}&langpair=${langPair}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.responseData && data.responseData.translatedText) {
       let traduccion = data.responseData.translatedText;

       // Limpiamos el prefijo de contexto que añadimos
       return traduccion.replace(/CV\s*(profesional|professionnel|professional)\s*:\s*/i, "").trim();
    }
    return texto; // Si no hay traducción, devuelve el original
  } catch (error) {
    console.error("Error al conectar con el traductor:", error);
    return texto;
  }
}
}
