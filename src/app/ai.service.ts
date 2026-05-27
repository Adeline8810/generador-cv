import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AiService {

async traducirProfesional(texto: string, idiomaDestino: string): Promise<string> {
  // Contexto para mejorar la calidad de la traducción técnica
  const contexto = "CV profesional: ";
  const textoConContexto = `${contexto}${texto}`;

  const langPair = `es|${idiomaDestino}`;
  const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(textoConContexto)}&langpair=${langPair}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    let traduccion = data.responseData.translatedText || "";

    // Expresión regular mejorada para limpiar el prefijo de forma infalible:
    // /CV\s*(profesional|professionnel)\s*:\s*/i
    // Explica: Busca "CV", espacios opcionales, la palabra en es/fr, dos puntos y espacios.
    return traduccion.replace(/CV\s*(profesional|professionnel)\s*:\s*/i, "").trim();

  } catch (error) {
    console.error("Error al conectar con el traductor:", error);
    return texto;
  }
}
}
