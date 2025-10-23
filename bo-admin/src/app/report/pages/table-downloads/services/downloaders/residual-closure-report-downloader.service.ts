import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseReportDownloader } from '../base/base-report-downloader.service';
import { DownloadParams, ReportDownloadResult } from '../../interfaces/report.interface';

@Injectable({
    providedIn: 'root'
})
export class ResidualClosureReportDownloader extends BaseReportDownloader {

    async download(params?: DownloadParams): Promise<ReportDownloadResult> {
        // Validar fechas antes de proceder con la descarga
        const dateValidation = this.validatePeriodDates(params);
        if (!dateValidation.isValid) {
            this.showDateValidationError(dateValidation.message);
            return {
                blob: new Blob(),
                filename: '',
                success: false,
                error: dateValidation.message
            };
        }

        const downloadObservable = this.downloadResidualClosuresReport(params);
        const filename = this.generateFilename(params);
        
        return this.executeDownload(downloadObservable, filename);
    }

    generateFilename(params?: DownloadParams): string {
        const baseFilename = 'cierre_residual';
        const today = new Date().toISOString().split('T')[0];
        
        if (params?.startDate && params?.endDate) {
            const startStr = params.startDate.toISOString().split('T')[0];
            const endStr = params.endDate.toISOString().split('T')[0];
            return `${baseFilename}_${startStr}_a_${endStr}.xlsx`;
        } else if (params?.startDate || params?.endDate) {
            return `${baseFilename}_filtrado_${today}.xlsx`;
        }
        
        return `${baseFilename}_sistema.xlsx`;
    }

    /**
     * Valida que las fechas de inicio y fin correspondan a períodos válidos
     */
    private validatePeriodDates(params?: DownloadParams): { isValid: boolean; message: string } {
        if (!params?.startDate && !params?.endDate) {
            return { isValid: true, message: '' };
        }

        // Validar fecha de inicio
        if (params.startDate) {
            const startDay = params.startDate.getDate();
            const validStartDays = [1, 8, 15, 22];
            
            if (!validStartDays.includes(startDay)) {
                return {
                    isValid: false,
                    message: `La fecha de inicio debe ser: 1, 8, 15 o 22 del mes. Fecha ingresada: día ${startDay}`
                };
            }
        }

        // Validar fecha de fin
        if (params.endDate) {
            const endDay = params.endDate.getDate();
            const endMonth = params.endDate.getMonth() + 1;
            const endYear = params.endDate.getFullYear();
            
            const validEndDays = this.getValidEndDays(endMonth, endYear);
            
            if (!validEndDays.includes(endDay)) {
                return {
                    isValid: false,
                    message: `La fecha de fin debe ser: ${validEndDays.join(', ')} para ${this.getMonthName(endMonth)}. Fecha ingresada: día ${endDay}`
                };
            }
        }

        return { isValid: true, message: '' };
    }

    /**
     * Obtiene los días válidos de fin de período según el mes
     */
    private getValidEndDays(month: number, year: number): number[] {
        const daysInMonth = new Date(year, month, 0).getDate();
        
        // Para febrero (mes 2)
        if (month === 2) {
            return [7, 14, 21, daysInMonth]; // 28 o 29 según año bisiesto
        }
        
        // Para otros meses: 7, 14, 21 y último día del mes (30 o 31)
        return [7, 14, 21, daysInMonth];
    }

    /**
     * Obtiene el nombre del mes en español
     */
    private getMonthName(month: number): string {
        const months = [
            '', 'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
            'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
        ];
        return months[month];
    }

    /**
     * Muestra modal de error para fechas inválidas usando Bootstrap
     */
    private showDateValidationError(message: string): void {
        const alertHtml = `
            <div id="date-validation-modal" class="modal fade show" style="display: block; background: rgba(0,0,0,0.6);">
                <div class="modal-dialog modal-dialog-centered modal-lg">
                    <div class="modal-content">
                        <div class="modal-header bg-warning">
                            <h5 class="modal-title text-white fw-bold">
                                <i class="ki-duotone ki-warning-2 text-white fs-2 me-2">
                                    <span class="path1"></span>
                                    <span class="path2"></span>
                                    <span class="path3"></span>
                                </i>
                                Fechas de período inválidas
                            </h5>
                            <button type="button" class="btn-close btn-close-white" onclick="this.removeDateValidationModal()"></button>
                        </div>
                        <div class="modal-body p-6">
                            <div class="alert alert-warning border-0 mb-4">
                                <div class="d-flex align-items-center">
                                    <i class="ki-duotone ki-information fs-2x text-warning me-3">
                                        <span class="path1"></span>
                                        <span class="path2"></span>
                                        <span class="path3"></span>
                                    </i>
                                    <div>
                                        <div class="fw-bold text-dark mb-1">Error detectado:</div>
                                        <div class="text-dark">${message}</div>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="card border border-primary">
                                <div class="card-header bg-light-primary border-primary">
                                    <h6 class="card-title fw-bold text-primary mb-0">
                                        <i class="ki-duotone ki-calendar-2 fs-2 me-2">
                                            <span class="path1"></span>
                                            <span class="path2"></span>
                                            <span class="path3"></span>
                                            <span class="path4"></span>
                                        </i>
                                        Períodos válidos para Cierre Residual
                                    </h6>
                                </div>
                                <div class="card-body">
                                    <div class="row">
                                        <div class="col-md-6">
                                            <div class="mb-4">
                                                <h6 class="fw-bold text-success mb-3">
                                                    <i class="ki-duotone ki-rocket fs-3 text-success me-2">
                                                        <span class="path1"></span>
                                                        <span class="path2"></span>
                                                    </i>
                                                    Fechas de Inicio
                                                </h6>
                                                <div class="d-flex flex-wrap gap-2">
                                                    <span class="badge badge-success fs-7 px-3 py-2">Día 1</span>
                                                    <span class="badge badge-success fs-7 px-3 py-2">Día 8</span>
                                                    <span class="badge badge-success fs-7 px-3 py-2">Día 15</span>
                                                    <span class="badge badge-success fs-7 px-3 py-2">Día 22</span>
                                                </div>
                                                <div class="text-muted fs-7 mt-2">Válido para cualquier mes</div>
                                            </div>
                                        </div>
                                        <div class="col-md-6">
                                            <div class="mb-4">
                                                <h6 class="fw-bold text-info mb-3">
                                                    <i class="ki-duotone ki-check-square fs-3 text-info me-2">
                                                        <span class="path1"></span>
                                                        <span class="path2"></span>
                                                        <span class="path3"></span>
                                                    </i>
                                                    Fechas de Fin
                                                </h6>
                                                <div class="d-flex flex-wrap gap-2 mb-2">
                                                    <span class="badge badge-info fs-7 px-3 py-2">Día 7</span>
                                                    <span class="badge badge-info fs-7 px-3 py-2">Día 14</span>
                                                    <span class="badge badge-info fs-7 px-3 py-2">Día 21</span>
                                                    <span class="badge badge-primary fs-7 px-3 py-2">Fin de mes</span>
                                                </div>
                                                <div class="text-muted fs-7">
                                                    <div>• Febrero: 28 o 29</div>
                                                    <div>• Otros meses: 30 o 31</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div class="separator separator-dashed my-4"></div>
                                    
                                    <div class="alert alert-light-info border-info">
                                        <div class="d-flex align-items-center">
                                            <i class="ki-duotone ki-information-5 fs-2x text-info me-3">
                                                <span class="path1"></span>
                                                <span class="path2"></span>
                                                <span class="path3"></span>
                                            </i>
                                            <div class="text-info fs-7">
                                                <div class="fw-bold mb-1">Ejemplos de períodos válidos:</div>
                                                <div>• Del 1 al 7 • Del 8 al 14 • Del 15 al 21 • Del 22 al fin de mes</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-primary fw-bold" onclick="this.removeDateValidationModal()">
                                <i class="ki-duotone ki-check fs-2 me-2">
                                    <span class="path1"></span>
                                    <span class="path2"></span>
                                </i>
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
        backdrop.id = 'date-validation-backdrop';
        document.body.appendChild(backdrop);

        // Función global para remover modal
        (window as any).removeDateValidationModal = () => {
            const modal = document.getElementById('date-validation-modal');
            const backdrop = document.getElementById('date-validation-backdrop');
            if (modal) modal.remove();
            if (backdrop) backdrop.remove();
            document.body.classList.remove('modal-open');
        };
    }

    /**
     * Descarga el reporte de cierre residual
     * 
     * Utiliza POST /api/v1/reports/residual-closures/download
     * - Si no hay parámetros: descarga todos los registros
     * - Si hay fechas: filtra por period.creation_date
     * 
     * @param params Parámetros de descarga (rango de fechas para filtrar períodos)
     */
    private downloadResidualClosuresReport(params?: DownloadParams): Observable<Blob> {
        const url = `${this.baseUrl}/reports/residual-closures/download`;
        const headers = this.getStandardHeaders();
        
        // Construir el body de la request
        const body = this.buildRequestBody(params);
        
        return this.http.post(url, body, { 
            responseType: 'blob',
            headers
        });
    }

    /**
     * Construye el body de la request
     * Si no hay fechas, envía body vacío (null) para obtener todos los registros
     * Si hay fechas, las incluye para filtrar por period.creation_date
     */
    private buildRequestBody(params?: DownloadParams): any {
        // Si no hay parámetros de fecha, enviar body vacío para obtener todos
        if (!params?.startDate && !params?.endDate) {
            return null;
        }
        
        const body: any = {};
        
        if (params?.startDate) {
            body.startDate = this.formatDateForBackend(params.startDate);
        }
        
        if (params?.endDate) {
            body.endDate = this.formatDateForBackend(params.endDate);
        }
        
        return body;
    }
}