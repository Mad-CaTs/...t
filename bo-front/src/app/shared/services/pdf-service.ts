import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import htmlToPdfmake from 'html-to-pdfmake';

@Injectable({
  providedIn: 'root',
})
export class PdfService {
  private pdfMake: any;

  constructor(private http: HttpClient) {}

  // Método para cargar pdfMake y las fuentes de manera dinámica
  private async cargarPdfMake(): Promise<void> {
    if (!this.pdfMake) {
      const pdfMakeModule = await import('pdfmake/build/pdfmake');
      const pdfFontsModule = await import('pdfmake/build/vfs_fonts');
      this.pdfMake = pdfMakeModule.default; // Cargar pdfMake
      this.pdfMake.vfs = pdfFontsModule.pdfMake.vfs || (pdfFontsModule as any).vfs;// Asignar las fuentes
    }
  }

  // Cargar HTML externo y generar PDF
  async cargarHTMLyGenerarPDF(urlHTML: string, nombreArchivo: string = 'reporte.pdf'): Promise<void> {
    try {
      const htmlContent = await this.http.get(urlHTML, { responseType: 'text' }).toPromise();
      await this.cargarPdfMake();
      this.generarPDFDesdeHTML(htmlContent, nombreArchivo);
    } catch (err) {
      console.error('Error al generar PDF:', err);
    }
  }

  private generarPDFDesdeHTML(htmlContent: string, nombreArchivo: string): void {
    // Convertir HTML a formato compatible con pdfMake
    const htmlContentParsed = htmlToPdfmake(htmlContent);

    const docDefinition = {
      content: htmlContentParsed, // Contenido convertido
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          margin: [0, 10, 0, 10],
        },
        body: {
          fontSize: 12,
          margin: [0, 5, 0, 5],
        },
      },
    };

    this.pdfMake.createPdf(docDefinition).download(nombreArchivo);
  }
}
