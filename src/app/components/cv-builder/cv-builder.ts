import { Component, signal, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { SpeechService  } from '../../speech.service';
import { AiService} from '../../ai.service';

interface Experiencia {
  empresa: string;
  empresaTraducida?: string;

  puesto: string;
  puestoTraducido?: string;

  fechaInicio: string;
  fechaFin: string;

  logrosOriginal: string;
  logrosTraducido: string;
}

interface Formacion {
  tituloOriginal: string;
  tituloTraducido: string;

  institucionTraducido: string;
  institucionOriginal: string;

  fechaInicioFor: string;
  fechaFinFor: string;
}

@Component({
  selector: 'app-cv-builder',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule],
  templateUrl: './cv-builder.html',
  styleUrl: './cv-builder.css'
})


export class CvBuilder {
  private translate = inject(TranslateService);
  private platformId = inject(PLATFORM_ID);


modoEdicion = signal<'formulario' | 'formatos'>('formulario');

formatoSeleccionado = signal<'clasico' | 'moderno' | 'circular' | 'profesional' | 'vertical'>('clasico');



  // --- VARIABLES DECLARADAS AQUÍ ---
  nombre = signal('');
  puesto = signal('');
  fotoUrl = signal<string | null>(null);

experiencia = signal<Experiencia[]>([]);

formacion = signal<Formacion[]>([]);



  idiomaNatal = signal('es');
  idiomaFinal = signal('fr');

  competencias = signal('');
  pasatiempos = signal('');

  lenguajes = signal('');
  cualidades = signal('');




// Datos Personales
nombreOriginal = signal(''); nombreTraducido = signal('');
puestoOriginal = signal(''); puestoTraducido = signal('');


competenciasOriginal = signal<string[]>([]);
competenciasTraducido = signal<string[]>([]);


//cualidadesOriginal = signal(''); cualidadesTraducido = signal('');
cualidadesOriginal = signal<string[]>([]);
cualidadesTraducido = signal<string[]>([]);


//lenguajesOriginal = signal(''); lenguajesTraducido = signal('');

lenguajesOriginal = signal<string[]>([]);
lenguajesTraducido = signal<string[]>([]);


//pasatiemposOriginal = signal(''); pasatiemposTraducido = signal('');

pasatiemposOriginal = signal<string[]>([]);
pasatiemposTraducido = signal<string[]>([]);




  // ---------------------------------

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
       this.translate.addLangs(['es', 'en', 'fa', 'bal']);
       this.translate.setDefaultLang('es');
    }
  }

// En cv-builder.ts
private speechService = inject(SpeechService);
private aiService = inject(AiService);


cambiarFormato(estilo: 'clasico' | 'moderno') {
  this.formatoSeleccionado.set(estilo);
}

addExperiencia() {
  this.experiencia.update(list => [
    ...list,
    {
      empresa: '',
      puesto: '',
      fechaInicio: '',
      fechaFin: '',
      logrosOriginal: '',
      logrosTraducido: ''
    }
  ]);
}

addFormacion() {
  this.formacion.update(list => [
    ...list,
    {
      tituloOriginal: '',
      tituloTraducido: '',

      institucionTraducido: '',
      institucionOriginal: '',

      fechaInicioFor: '',
      fechaFinFor: ''

    }
  ]);
}






async grabar(
  campo:
    | 'nombre'
    | 'puesto'
    | 'competencias'
    | 'cualidades'
    | 'lenguajes'
    | 'pasatiempos'
    | {
        type: 'experiencia';
        index: number;
        campo: 'empresa' | 'puesto' | 'logros';
      }
         | {
        type: 'formacion';
        index: number;
        campo: 'titulo' | 'institucion' ;
      }
) {
  try {
    const idiomaNatal = this.idiomaNatal() === 'es' ? 'es-ES' : 'fr-FR';

    const textoEscuchado = await this.speechService.escuchar(idiomaNatal);
    const textoTraducido = await this.aiService.traducirProfesional(
      textoEscuchado,
      this.idiomaFinal()
    );

    console.log("Texto escuchado:", textoEscuchado);
    console.log("Texto traducido:", textoTraducido);

    // =========================
    // 🟢 CAMPOS SIMPLES
    // =========================
    if (typeof campo === 'string') {

      const acumulativos = [
        'competencias',
        'cualidades',
        'lenguajes',
        'pasatiempos'
      ];

      if (acumulativos.includes(campo)) {
        const signalOrig = (this as any)[campo + 'Original'];
        const signalTrad = (this as any)[campo + 'Traducido'];

        signalOrig.update((lista: string[]) => [
          ...lista,
          textoEscuchado
        ]);

        signalTrad.update((lista: string[]) => [
          ...lista,
          textoTraducido
        ]);

      } else {
        const mapaSenales: any = {
          nombre: { orig: this.nombreOriginal, trad: this.nombreTraducido },
          puesto: { orig: this.puestoOriginal, trad: this.puestoTraducido }
        };

        mapaSenales[campo].orig.set(textoEscuchado);
        mapaSenales[campo].trad.set(textoTraducido);
      }
    }

    // =========================
    // 🟡 EXPERIENCIA
    // =========================
    else {
      if (campo.type === 'experiencia') {

        this.experiencia.update(exps => {

          const exp = exps[campo.index];

          switch (campo.campo) {

            case 'empresa':
              exp.empresa = textoEscuchado;
              exp.empresaTraducida = textoTraducido;
              break;

            case 'puesto':
              exp.puesto = textoEscuchado;
              exp.puestoTraducido = textoTraducido;
              break;

            case 'logros':
              exp.logrosOriginal = textoEscuchado;
              exp.logrosTraducido = textoTraducido;
              break;
          }

          return [...exps];
        });
      }

//formacion
if (campo.type === 'formacion') {

        this.formacion.update(exps => {

          const forma = exps[campo.index];

          switch (campo.campo) {

            case 'institucion':
              forma.institucionOriginal = textoEscuchado;
              forma.institucionTraducido = textoTraducido;
              break;

            case 'titulo':
              forma.tituloOriginal = textoEscuchado;
              forma.tituloTraducido = textoTraducido;
              break;
          }

          return [...exps];
        });
      }



    }

  } catch (error) {
    console.error("Error al grabar:", error);
  }
}


onNombreChange(value: string) {
  this.nombreOriginal.set(value);

  // 🔥 si borras o cambias, resetea traducción
  this.nombreTraducido.set('');
}

onPuestoChange(value: string) {
  this.puestoOriginal.set(value);

  // 🔥 mismo aquí
  this.puestoTraducido.set('');
}

onCompetenciasChange(value: string) {
  const lista = value
    .split(',')
    .map(v => v.trim())
    .filter(v => v.length > 0);

  // actualizar original
  this.competenciasOriginal.set(lista);

  // 🔥 CLAVE: recortar traducido cuando borras
  this.competenciasTraducido.update((trad: string[]) =>
    trad.slice(0, lista.length)
  );
}

onCualidadesChange(value: string) {
  const lista = value
    .split(',')
    .map(v => v.trim())
    .filter(v => v.length > 0);

  // actualizar original
  this.cualidadesOriginal.set(lista);

  // 🔥 CLAVE: recortar traducido cuando borras
  this.cualidadesTraducido.update((trad: string[]) =>
    trad.slice(0, lista.length)
  );
}

onLenguajesChange(value: string) {
  const lista = value
    .split(',')
    .map(v => v.trim())
    .filter(v => v.length > 0);

  // actualizar original
  this.lenguajesOriginal.set(lista);

  // 🔥 CLAVE: recortar traducido cuando borras
  this.lenguajesTraducido.update((trad: string[]) =>
    trad.slice(0, lista.length)
  );
}


onPasaTiemposChange(value: string) {
  const lista = value
    .split(',')
    .map(v => v.trim())
    .filter(v => v.length > 0);

  // actualizar original
  this.pasatiemposOriginal.set(lista);

  // 🔥 CLAVE: recortar traducido cuando borras
  this.pasatiemposTraducido.update((trad: string[]) =>
    trad.slice(0, lista.length)
  );
}

// MÉTODOS PARA EL SELECTOR DE IDIOMAS
  cambiarIdioma(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const lang = selectElement.value;
    console.log('Idioma natal cambiado a:', lang);
    // this.translate.use(lang); // Descomenta esto si usas ngx-translate
  }

  cambiarIdiomaFinal(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const lang = selectElement.value;
    console.log('Idioma final (destino) seleccionado:', lang);
  }

/*
  reformular(index: number) {
    alert('Conectando con IA para reformular: ' + this.experiencia()[index].logros);
  }
*/
  imprimir() {
    window.print();
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => this.fotoUrl.set(reader.result as string);
      reader.readAsDataURL(file);
    }
  }


}
