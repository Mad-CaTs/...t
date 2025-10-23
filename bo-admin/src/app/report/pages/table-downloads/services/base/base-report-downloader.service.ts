import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { DownloadParams, ReportDownloadResult, IReportDownloader } from '../../interfaces/report.interface';

@Injectable({
    providedIn: 'root'
})
export abstract class BaseReportDownloader implements IReportDownloader {
    
    protected readonly baseUrl = environment.apireports;

    constructor(protected http: HttpClient) {}

    abstract download(params?: DownloadParams): Promise<ReportDownloadResult>;
    abstract generateFilename(params?: DownloadParams): string;

    protected downloadFile(blob: Blob, filename: string): void {
        try {
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = filename;
            
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error al iniciar descarga:', error);
            throw error;
        }
    }

    protected getStandardHeaders() {
        return {
            'Content-Type': 'application/json',
            'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        };
    }

    /**
     * Muestra modal de carga usando Bootstrap
     */
    protected showLoadingAlert(): void {
        const loadingHtml = `
            <div id="download-loading-modal" class="modal fade show" style="display: block; background: rgba(0,0,0,0.6);" data-bs-backdrop="static" data-bs-keyboard="false">
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content">
                        <div class="modal-body text-center p-5">
                            <div class="d-flex justify-content-center mb-4">
                                <div class="spinner-border text-primary" style="width: 3rem; height: 3rem;" role="status">
                                    <span class="visually-hidden">Cargando...</span>
                                </div>
                            </div>
                            <h5 class="fw-bold text-dark mb-3">Generando reporte...</h5>
                            <p class="text-muted mb-0">Por favor espera mientras se procesa la información</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', loadingHtml);
        document.body.classList.add('modal-open');
        
        // Agregar backdrop
        const backdrop = document.createElement('div');
        backdrop.className = 'modal-backdrop fade show';
        backdrop.id = 'download-loading-backdrop';
        document.body.appendChild(backdrop);
    }

    /**
     * Muestra toast de éxito usando Bootstrap
     */
    protected showSuccessAlert(filename: string): void {
        const toastHtml = `
            <div class="toast-container position-fixed top-0 end-0 p-3" style="z-index: 9999;">
                <div id="success-toast" class="toast show border-0" role="alert" aria-live="assertive" aria-atomic="true">
                    <div class="toast-header bg-success text-white border-0">
                        <i class="ki-duotone ki-check-circle fs-2 me-2">
                            <span class="path1"></span>
                            <span class="path2"></span>
                        </i>
                        <strong class="me-auto">¡Descarga exitosa!</strong>
                        <button type="button" class="btn-close btn-close-white ms-2" data-bs-dismiss="toast" aria-label="Close"></button>
                    </div>
                    <div class="toast-body bg-light">
                        <div class="d-flex align-items-center">
                            <i class="ki-duotone ki-file-down fs-2x text-success me-3">
                                <span class="path1"></span>
                                <span class="path2"></span>
                            </i>
                            <div>
                                <div class="fw-bold text-dark">${filename}</div>
                                <div class="text-muted fs-7">Archivo descargado correctamente</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', toastHtml);
        
        // Auto-remover después de 4 segundos
        setTimeout(() => {
            const toastElement = document.getElementById('success-toast');
            const toastContainer = toastElement?.closest('.toast-container');
            if (toastContainer) {
                toastContainer.remove();
            }
        }, 4000);

        // Manejar click en botón de cerrar
        const closeBtn = document.querySelector('#success-toast .btn-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                const toastContainer = closeBtn.closest('.toast-container');
                if (toastContainer) {
                    toastContainer.remove();
                }
            });
        }
    }

    /**
     * Muestra modal de error usando Bootstrap
     */
    protected showErrorAlert(error: string): void {
        const alertHtml = `
            <div id="error-alert-modal" class="modal fade show" style="display: block; background: rgba(0,0,0,0.6);">
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content">
                        <div class="modal-header bg-danger">
                            <h5 class="modal-title text-white fw-bold">
                                <i class="ki-duotone ki-cross-circle text-white fs-2 me-2">
                                    <span class="path1"></span>
                                    <span class="path2"></span>
                                </i>
                                Error en la descarga
                            </h5>
                            <button type="button" class="btn-close btn-close-white" onclick="this.removeErrorModal()"></button>
                        </div>
                        <div class="modal-body p-5">
                            <div class="d-flex align-items-center">
                                <i class="ki-duotone ki-information fs-2x text-danger me-4">
                                    <span class="path1"></span>
                                    <span class="path2"></span>
                                    <span class="path3"></span>
                                </i>
                                <div>
                                    <p class="text-dark fw-semibold mb-2">Ha ocurrido un problema:</p>
                                    <p class="text-muted mb-0">${error}</p>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary fw-bold" onclick="this.removeErrorModal()">
                                Entendido
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', alertHtml);
        document.body.classList.add('modal-open');
        
        // Agregar backdrop
        const backdrop = document.createElement('div');
        backdrop.className = 'modal-backdrop fade show';
        backdrop.id = 'error-alert-backdrop';
        document.body.appendChild(backdrop);

        // Función global para remover modal
        (window as any).removeErrorModal = () => {
            const modal = document.getElementById('error-alert-modal');
            const backdrop = document.getElementById('error-alert-backdrop');
            if (modal) modal.remove();
            if (backdrop) backdrop.remove();
            document.body.classList.remove('modal-open');
        };
    }

    /**
     * Cierra el modal de carga
     */
    protected closeLoadingAlert(): void {
        const loadingModal = document.getElementById('download-loading-modal');
        const backdrop = document.getElementById('download-loading-backdrop');
        
        if (loadingModal) loadingModal.remove();
        if (backdrop) backdrop.remove();
        document.body.classList.remove('modal-open');
    }

    /**
     * Maneja la conversión de Observable a Promise con manejo de errores
     */
    protected async executeDownload(
        observable: Observable<Blob>, 
        filename: string
    ): Promise<ReportDownloadResult> {
        this.showLoadingAlert();
        
        return new Promise((resolve) => {
            observable.subscribe({
                next: (blob: Blob) => {
                    this.closeLoadingAlert();
                    
                    if (blob.size === 0) {
                        console.warn('El archivo descargado está vacío');
                        this.showErrorAlert('El archivo descargado está vacío');
                        resolve({
                            blob,
                            filename,
                            success: false,
                            error: 'El archivo descargado está vacío'
                        });
                        return;
                    }
                    
                    this.downloadFile(blob, filename);
                    this.showSuccessAlert(filename);
                    resolve({
                        blob,
                        filename,
                        success: true
                    });
                },
                error: (error) => {
                    this.closeLoadingAlert();
                    console.error('Error en la descarga:', error);
                    const errorMessage = error.message || 'Error desconocido durante la descarga';
                    this.showErrorAlert(errorMessage);
                    resolve({
                        blob: new Blob(),
                        filename,
                        success: false,
                        error: errorMessage
                    });
                }
            });
        });
    }

    /**
     * Convierte Date a formato LocalDateTime para el backend (sin zona horaria)
     * Formato esperado: YYYY-MM-DDTHH:mm:ss (sin la Z del final)
     */
    protected formatDateForBackend(date: Date): string {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        
        return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
    }
}