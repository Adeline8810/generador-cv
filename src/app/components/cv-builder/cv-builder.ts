import { Component, signal, inject, PLATFORM_ID,ElementRef, ViewChild } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { SpeechService  } from '../../speech.service';
import { AiService} from '../../ai.service';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas'
import { Document, Packer, Paragraph, TextRun } from 'docx';
import { saveAs } from 'file-saver';

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
  @ViewChild('cvContent', { static: false }) el!: ElementRef;
  @ViewChild('leftPanel', { static: false }) leftPanel!: ElementRef;

modoEdicion = signal<'formulario' | 'formatos' | 'preview'>('formulario');
esVIP = signal(false);

private isResizing = false;

//formatoSeleccionado = signal<'clasico' | 'moderno' | 'circular' | 'profesional' | 'vertical'>('clasico');

formatoSeleccionado = signal<string>('modelo2');



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
telefonoOriginal = signal(''); telefonoTraducido = signal('');
emailOriginal = signal(''); emailTraducido = signal('');
direccionOriginal = signal(''); direccionTraducido = signal('');
estadoCivilOriginal = signal(''); estadoCivilTraducido = signal('');

puestoOriginal = signal(''); puestoTraducido = signal('');
fraseOriginal = signal(''); fraseTraducido = signal('');


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


initResizing(event: MouseEvent) {
  this.isResizing = true;
  document.addEventListener('mousemove', this.resize.bind(this));
  document.addEventListener('mouseup', this.stopResizing.bind(this));
}

resize(event: MouseEvent) {
  if (!this.isResizing) return;

  // Limita el ancho para que no desaparezca
  const newWidth = Math.max(200, Math.min(event.clientX, window.innerWidth - 300));

  if (this.leftPanel?.nativeElement) {
    this.leftPanel.nativeElement.style.width = `${newWidth}px`;
  }
}

stopResizing() {
  this.isResizing = false;
  document.removeEventListener('mousemove', this.resize.bind(this));
}

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
    | 'telefono'
    | 'email'
    | 'direccion'
    | 'estadoCivil'
    | 'puesto'
    | 'frase'
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
   // const idiomaNatal = this.idiomaNatal() === 'es' ? 'es-ES' : 'fr-FR';

    const idiomaEntrada = this.idiomaNatal(); // Ej: 'fr-FR'
    const idiomaSalida = this.idiomaFinal();   // Ej: 'es-ES'

    const textoEscuchado = await this.speechService.escuchar(idiomaEntrada);

 const textoTraducido = await this.aiService.traducirProfesional(
  textoEscuchado,
  this.idiomaNatal(), // <--- Enviamos el origen
  this.idiomaFinal()  // <--- Enviamos el destino
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
          telefono: { orig: this.telefonoOriginal, trad: this.telefonoTraducido },
          email: { orig: this.emailOriginal, trad: this.emailTraducido },
          direccion: { orig: this.direccionOriginal, trad: this.direccionTraducido },
          estadoCivil: { orig: this.estadoCivilOriginal, trad: this.estadoCivilTraducido },
          frase: { orig: this.fraseOriginal, trad: this.fraseTraducido },
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

onTelefonoChange(value: string) {
  this.telefonoOriginal.set(value);

  // 🔥 si borras o cambias, resetea traducción
  this.telefonoTraducido.set('');
}

onEmailChange(value: string) {
  this.emailOriginal.set(value);

  // 🔥 si borras o cambias, resetea traducción
  this.emailTraducido.set('');
}

onDireccionChange(value: string) {
  this.direccionOriginal.set(value);

  // 🔥 si borras o cambias, resetea traducción
  this.direccionTraducido.set('');
}

onEstadoCivilChange(value: string) {
  this.estadoCivilOriginal.set(value);

  // 🔥 si borras o cambias, resetea traducción
  this.estadoCivilTraducido.set('');
}

onFraseChange(value: string) {
  this.fraseOriginal.set(value);

  // 🔥 si borras o cambias, resetea traducción
  this.fraseTraducido.set('');
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
/*  cambiarIdiomaNatal(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const lang = selectElement.value;

    // this.translate.use(lang); // Descomenta esto si usas ngx-translate
  }*/

cambiarIdiomaNatal(event: Event) {
  const target = event.target as HTMLSelectElement;
  this.idiomaNatal.set(target.value);
}

/*

  cambiarIdiomaFinal(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const lang = selectElement.value;

  }*/

cambiarIdiomaFinal(event: Event) {
  const target = event.target as HTMLSelectElement;
  this.idiomaFinal.set(target.value);
}


/*
  reformular(index: number) {
    alert('Conectando con IA para reformular: ' + this.experiencia()[index].logros);
  }
*/


  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => this.fotoUrl.set(reader.result as string);
      reader.readAsDataURL(file);
    }
  }


imprimir() {

  const data = this.el.nativeElement;

  html2canvas(data, {
    scale: 3,
    useCORS: true,
    scrollY: -window.scrollY,
    scrollX: 0,
    backgroundColor: "#ffffff"
  }).then(canvas => {

    const pdf = new jsPDF('p', 'mm', 'a4');

    const pageWidth = 210;
    const pageHeight = 297;

    const imgWidth = pageWidth;

    const imgHeight =
      (canvas.height * imgWidth) / canvas.width;

    const imgData = canvas.toDataURL('image/png');

    // margen superior de seguridad
    const margenSuperior = 5;

    let heightLeft = imgHeight;
    let position = margenSuperior;

    pdf.addImage(
      imgData,
      'PNG',
      0,
      position,
      imgWidth,
      imgHeight
    );

    heightLeft -= pageHeight;

    while (heightLeft > 0) {

      position = heightLeft - imgHeight + margenSuperior;

      pdf.addPage();

      pdf.addImage(
        imgData,
        'PNG',
        0,
        position,
        imgWidth,
        imgHeight
      );

      heightLeft -= pageHeight;
    }

    pdf.save('Mi_CV_Profesional.pdf');

  });

}
  descargar(formato: string) {
  if (formato === 'pdf') {
    this.imprimir(); // Tu función actual de PDF
  } else {
    this.generarWord(); // Nueva función para Word
  }
}
generarWord() {
  if (!this.nombreOriginal()) {
    alert("Por favor, ingresa al menos tu nombre antes de descargar.");
    return;
  }
  const doc = new Document({
    sections: [{
      properties: {},
      children: [
        // Nombre y Puesto
        new Paragraph({ text: this.nombreOriginal() || "Nombre", heading: "Heading1" }),
        new Paragraph({ text: this.puestoOriginal() || "Puesto", heading: "Heading2" }),
        new Paragraph({ text: "--------------------------------------------------" }),

        // Datos Personales
        new Paragraph({ text: "DATOS PERSONALES", heading: "Heading3" }),
        new Paragraph({ text: `Teléfono: ${this.telefonoOriginal()}` }),
        new Paragraph({ text: `Email: ${this.emailOriginal()}` }),
        new Paragraph({ text: `Dirección: ${this.direccionOriginal()}` }),
        new Paragraph({ text: `Estado Civil: ${this.estadoCivilOriginal()}` }),
        new Paragraph({ text: "" }), // Salto de línea

        // Experiencia
        new Paragraph({ text: "EXPERIENCIA PROFESIONAL", heading: "Heading3" }),
        ...this.experiencia().map(exp => new Paragraph({
          children: [
            new TextRun({ text: `${exp.empresa} - ${exp.puesto}`, bold: true }),
            new TextRun({ text: `\n${exp.fechaInicio} a ${exp.fechaFin}\n${exp.logrosOriginal}`, break: 1 })
          ]
        })),
        new Paragraph({ text: "" }),

        // Formación
        new Paragraph({ text: "FORMACIÓN", heading: "Heading3" }),
        ...this.formacion().map(f => new Paragraph({
          children: [
            new TextRun({ text: `${f.tituloOriginal} en ${f.institucionOriginal}`, bold: true }),
            new TextRun({ text: `\n${f.fechaInicioFor} a ${f.fechaFinFor}`, break: 1 })
          ]
        })),
        new Paragraph({ text: "" }),

        // Competencias y otros
        new Paragraph({ text: "COMPETENCIAS", heading: "Heading3" }),
        new Paragraph({ text: this.competenciasOriginal().join(', ') }),

        new Paragraph({ text: "CUALIDADES", heading: "Heading3" }),
        new Paragraph({ text: this.cualidadesOriginal().join(', ') })
      ],
    }],
  });

  Packer.toBlob(doc).then(blob => {
    saveAs(blob, "Mi_CV_Editable.docx");
  });
}
}
