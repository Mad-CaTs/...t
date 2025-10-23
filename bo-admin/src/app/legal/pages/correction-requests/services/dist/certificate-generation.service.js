"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.CertificateGenerationService = void 0;
var core_1 = require("@angular/core");
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var environment_1 = require("src/environments/environment");
var alert_modal_component_1 = require("../components/alert-modal/alert-modal.component");
var confirm_send_modal_component_1 = require("../components/confirm-send-modal/confirm-send-modal.component");
var cokkies_1 = require("@utils/cokkies");
var CertificateGenerationService = /** @class */ (function () {
    function CertificateGenerationService(modalService, http, userService) {
        this.modalService = modalService;
        this.http = http;
        this.userService = userService;
        //private readonly API_URL = environment.apiLegal;
        this.correctionDataSubject = new rxjs_1.BehaviorSubject(null);
        this.correctionData$ = this.correctionDataSubject.asObservable();
        this.API_URL = 'http://localhost:8081';
        this.PDF_API_URL = environment_1.environment.apiPdf;
    }
    CertificateGenerationService.prototype.createCorrectionRequest = function (request) {
        var token = cokkies_1.getCokkie('TOKEN');
        if (!token) {
            console.error('No se encontró token de autorización');
            return rxjs_1.throwError(function () { return new Error('No se encontró token de autorización'); });
        }
        console.log('Creando solicitud de corrección:', {
            url: this.API_URL + "/api/v1/legal/correction-requests",
            request: JSON.stringify(request, null, 2),
            token: token.substring(0, 10) + '...'
        });
        var headers = {
            'Authorization': "Bearer " + token,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        };
        console.log('Headers de la solicitud:', headers);
        return this.http
            .post(this.API_URL + "/api/v1/legal/correction-requests", request, { headers: headers })
            .pipe(operators_1.tap(function (response) { return console.log('Respuesta de crear solicitud:', response); }), operators_1.catchError(function (error) {
            var _a, _b;
            console.error('Error al crear solicitud:', {
                status: error.status,
                statusText: error.statusText,
                error: error.error,
                message: error.message,
                headers: ((_b = (_a = error.headers) === null || _a === void 0 ? void 0 : _a.keys) === null || _b === void 0 ? void 0 : _b.call(_a)) || []
            });
            if (error.status === 401) {
                return rxjs_1.throwError(function () { return new Error('Sesión expirada. Por favor ingrese nuevamente.'); });
            }
            return rxjs_1.throwError(function () { var _a; return new Error(((_a = error.error) === null || _a === void 0 ? void 0 : _a.message) || error.message || 'Error al crear la solicitud'); });
        }));
    };
    CertificateGenerationService.prototype.setCorrectionData = function (data) {
        this.correctionDataSubject.next(data);
    };
    CertificateGenerationService.prototype.clearCorrectionData = function () {
        this.correctionDataSubject.next(null);
    };
    CertificateGenerationService.prototype.getCurrentCorrectionData = function () {
        return this.correctionDataSubject.getValue();
    };
    CertificateGenerationService.prototype.getPartnerData = function (customerId, suscriptionId) {
        console.log('Obteniendo datos del socio:', { customerId: customerId, suscriptionId: suscriptionId });
        var token = cokkies_1.getCokkie('TOKEN') || '';
        return this.http
            .get(this.API_URL + "/api/v1/legal/user-data/complete?customerId=" + customerId + "&suscriptionId=" + suscriptionId, { headers: { Authorization: "Bearer " + token } })
            .pipe(operators_1.map(function (response) {
            console.log('Respuesta del API de datos del socio:', response);
            if (!response) {
                throw new Error('No se encontraron datos del socio');
            }
            var data = __assign(__assign({}, response), { familyPackageId: response.familyPackageId || 0, familyPackageName: response.familyPackageName || '', documentType: response.documentType || '', idSuscription: response.idSuscription || 0 });
            console.log('Partner data mapped:', data);
            return data;
        }), operators_1.catchError(function (error) {
            console.error('Error al obtener datos del socio:', error);
            return rxjs_1.throwError(function () { return error; });
        }));
    };
    CertificateGenerationService.prototype.getCorrectionRequest = function (requestId) {
        var token = cokkies_1.getCokkie('TOKEN') || '';
        return this.http
            .get(this.API_URL + "/api/v1/legal/correction-requests/" + requestId, {
            headers: { Authorization: "Bearer " + token }
        })
            .pipe(operators_1.map(function (response) {
            if (!response) {
                throw new Error('No se encontraron datos de la solicitud');
            }
            return response;
        }));
    };
    CertificateGenerationService.prototype.getCorrectionRequestByUser = function (userId) {
        var token = cokkies_1.getCokkie('TOKEN') || '';
        return this.http
            .get(this.API_URL + "/api/v1/legal/correction-requests/user/" + userId, {
            headers: { Authorization: "Bearer " + token }
        })
            .pipe(operators_1.map(function (response) {
            if (!response) {
                throw new Error('No se encontraron solicitudes para el usuario');
            }
            return response;
        }));
    };
    CertificateGenerationService.prototype.getCorrectionRequestBySuscription = function (suscriptionId) {
        var token = cokkies_1.getCokkie('TOKEN') || '';
        return this.http
            .get(this.API_URL + "/api/v1/legal/correction-requests/suscription/" + suscriptionId, { headers: { Authorization: "Bearer " + token } })
            .pipe(operators_1.map(function (response) {
            if (!response) {
                throw new Error('No se encontraron solicitudes para la suscripción');
            }
            return response;
        }));
    };
    CertificateGenerationService.prototype.generateCertificatePdf = function (suscriptionId, documentId, familyPackageId) {
        console.log('Iniciando generación de PDF con parámetros:', {
            suscriptionId: suscriptionId,
            documentId: documentId,
            familyPackageId: familyPackageId
        });
        var url = this.PDF_API_URL + "/" + suscriptionId + "/" + documentId + "/" + familyPackageId + "/true";
        console.log('URL de generación de PDF:', url);
        console.log('parameters:', {
            suscriptionId: suscriptionId,
            documentId: documentId,
            familyPackageId: familyPackageId
        });
        return this.http.get(url).pipe(operators_1.map(function (response) {
            var _a, _b;
            console.log('Respuesta exitosa del servicio PDF:', {
                status: 'success',
                apiUrl: url,
                documentUrl: (_b = (_a = response.data) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.documento,
                fullResponse: response
            });
            if (!response) {
                console.error('Respuesta vacía del servicio PDF');
                throw new Error('Error al generar el PDF del certificado');
            }
            return response;
        }), operators_1.catchError(function (error) {
            var _a, _b, _c;
            console.error('Error detallado en la generación del PDF:', {
                status: error.status,
                statusText: error.statusText,
                error: error.error,
                message: error.message,
                url: error.url,
                headers: ((_b = (_a = error.headers) === null || _a === void 0 ? void 0 : _a.keys) === null || _b === void 0 ? void 0 : _b.call(_a)) || []
            });
            if (error.status === 401) {
                console.error('Error de autorización en la generación del PDF');
                return rxjs_1.throwError(function () { return new Error('No autorizado. Por favor, inicie sesión nuevamente.'); });
            }
            var errorMessage = 'Error al generar el PDF. ';
            if ((_c = error.error) === null || _c === void 0 ? void 0 : _c.message) {
                errorMessage += error.error.message;
            }
            else if (error.message) {
                errorMessage += error.message;
            }
            console.error('Mensaje de error final:', errorMessage);
            return rxjs_1.throwError(function () { return new Error(errorMessage); });
        }));
    };
    CertificateGenerationService.prototype.generateCertificate = function (formData) {
        var _this = this;
        console.log('Iniciando generación de certificado con formData:', formData);
        // if (!formData.customerId) {
        //   console.error('No se encontró ID del cliente');
        //   return throwError(() => new Error('No se encontró ID del cliente'));
        // }
        // if (!formData.idFamilyPackage) {
        //   console.error('No se encontró ID del paquete familiar');
        //   return throwError(() => new Error('No se encontró ID del paquete familiar'));
        // }
        var missingFields = this.validateForm(formData);
        if (missingFields.length > 0) {
            return rxjs_1.throwError(function () { return new Error("Faltan campos requeridos: " + missingFields.join(', ')); });
        }
        var token = cokkies_1.getCokkie('TOKEN');
        if (!token) {
            return rxjs_1.throwError(function () { return new Error('Sesión expirada. Por favor ingrese nuevamente.'); });
        }
        if (!formData.customerId) {
            console.error('No se encontró ID del cliente');
            return rxjs_1.throwError(function () { return new Error('No se encontró ID del cliente'); });
        }
        return this.userService.getSubscriptionData(formData.customerId).pipe(operators_1.switchMap(function (subscriptionsData) {
            console.log('Subscription data:', subscriptionsData);
            var suscriptionId = subscriptionsData.idsuscription;
            console.log('Using suscriptionId:', suscriptionId);
            console.log('Full request data:', {
                customerId: formData.customerId,
                suscriptionId: suscriptionId,
                profileType: 'ADMIN',
                documentId: 1
            });
            if (!suscriptionId) {
                return rxjs_1.throwError(function () { return new Error('No se encontro ID suscription'); });
            }
            return _this.generateCertificatePdf(suscriptionId, 1, formData.familyPackageId || 0).pipe(operators_1.switchMap(function (response) {
                var _a;
                console.log('Respuesta de generacion de PDF:', response);
                if (!response.result) {
                    var errorMsg_1 = typeof response.data[0] === 'string'
                        ? response.data[0]
                        : 'Error al generar el documento';
                    console.error('Error del servidor:', errorMsg_1);
                    return rxjs_1.throwError(function () { return new Error(errorMsg_1); });
                }
                if (!Array.isArray(response.data) || !((_a = response.data[0]) === null || _a === void 0 ? void 0 : _a.documento)) {
                    console.error('Respuesta invalida', response);
                    return rxjs_1.throwError(function () { return new Error('Respuesta invalida del servidor'); });
                }
                var documentData = response.data[0];
                console.log('Documento generado:', documentData);
                var pdfUrl = documentData.documento.trim();
                var corectionRequest = {
                    customerId: formData.customerId,
                    suscriptionId: suscriptionId,
                    id_suscription: suscriptionId,
                    profileType: 'ADMINISTRATOR',
                    documentId: 1,
                    requestMessage: "Generacion de certificado para " + formData.nombreSocio,
                    documentNumber: formData.numeroDocumento,
                    portfolio: formData.portfolioId,
                    status: '1',
                    documentFileUrl: documentData.documento.trim(),
                    files: [
                        {
                            s3Url: documentData.documento.trim(),
                            fileName: "certificado_" + formData.numeroDocumento + ".pdf",
                            fileType: 'DOCUMENT_CORRECTION',
                            uploadedAt: new Date().toISOString()
                        }
                    ],
                    history: [
                        {
                            status: '1',
                            profileType: 'ADMINISTRATOR',
                            message: "Generacion de certificado para " + formData.nombreSocio,
                            createdAt: new Date().toISOString()
                        }
                    ]
                };
                console.log('Guardando solicitud', corectionRequest);
                var result = {
                    success: true,
                    data: pdfUrl,
                    downloadUrl: pdfUrl
                };
                return _this.createCorrectionRequest(corectionRequest).pipe(operators_1.map(function () { return result; }), operators_1.catchError(function (error) {
                    console.error('Error al crear solicitud:', error);
                    return rxjs_1.of(result);
                }));
            }));
        }));
        // const suscriptionId = parseInt(formData.codigoCertificado?.split('.')[0] || '0');
        // if (!suscriptionId) {
        //   console.error('ID de suscripción inválido:', formData.codigoCertificado);
        //   return throwError(() => new Error('ID de suscripción inválido'));
        // }
        // console.log('Datos del usuario:', {
        //   customerId: formData.customerId,
        //   suscriptionId,
        //   nombreSocio: formData.nombreSocio,
        //   numeroDocumento: formData.numeroDocumento,
        //   familyPackageId: formData.idFamilyPackage
        // });
        // return this.generateCertificatePdf(
        //   suscriptionId,
        //   1, // 1 para certificados
        //   Number(formData.idFamilyPackage)
        // ).pipe(
        //   switchMap(response => {
        //     console.log('Respuesta de generación de PDF:', response);
        //     if (!response.result) {
        //       const errorMsg = typeof response.data[0] === 'string' ? response.data[0] : 'Error al generar el documento';
        //       console.error('Error del servidor:', errorMsg);
        //       return throwError(() => new Error(errorMsg));
        //     }
        //     if (!Array.isArray(response.data) || !response.data[0]?.documento) {
        //       console.error('Respuesta inválida:', response);
        //       return throwError(() => new Error('Respuesta inválida del servidor'));
        //     }
        //     const documentData = response.data[0];
        //     console.log('Documento generado:', documentData);
        //     const correctionRequest = {
        //       customerId: formData.customerId,
        //       subscriptionId: suscriptionId,
        //       profileType: 'ADMINISTRATOR',
        //       requestMessage: `Generación de certificado para ${formData.nombreSocio}`,
        //       documentNumber: formData.numeroDocumento,
        //       files: [{
        //         url: documentData.documento,
        //         fileName: `certificado_${documentData.numberSerial}.pdf`,
        //         fileType: 'application/pdf'
        //       }]
        //     };
        //     console.log('Guardando solicitud:', correctionRequest);
        //     return this.createCorrectionRequest(correctionRequest).pipe(
        //       map(response => {
        //         console.log('Solicitud guardada:', response);
        //         return {
        //           success: true,
        //           data: documentData.documento
        //         };
        //       })
        //     );
        //   })
        // );
    };
    CertificateGenerationService.prototype.validateForm = function (formData) {
        var requiredFields = ['tipoDocumento', 'numeroDocumento', 'nombreSocio'];
        return requiredFields.filter(function (field) { return !formData[field]; });
    };
    CertificateGenerationService.prototype.showRequiredFieldsError = function () {
        var modalRef = this.modalService.open(alert_modal_component_1.AlertModalComponent, {
            centered: true,
            size: 'sm',
            backdropClass: 'modal-backdrop-dark',
            windowClass: 'modal-custom-orange'
        });
        modalRef.componentInstance.type = 'warning';
        modalRef.componentInstance.title = 'Complete todos los Campos';
        modalRef.componentInstance.message =
            'Deberás de completar todos los campos necesarios para la generación de este contrato.';
        modalRef.componentInstance.buttonText = 'Corregir';
        return rxjs_1.from(modalRef.result);
    };
    CertificateGenerationService.prototype.showGenerationSuccess = function () {
        var modalRef = this.modalService.open(alert_modal_component_1.AlertModalComponent, {
            centered: true,
            size: 'sm',
            backdropClass: 'modal-backdrop-dark',
            windowClass: 'modal-custom-orange'
        });
        modalRef.componentInstance.type = 'success';
        modalRef.componentInstance.title = 'Documento Generado';
        modalRef.componentInstance.message =
            'El documento se ha generado correctamente. Puedes descargarlo y, si lo deseas, notificar al socio.';
        modalRef.componentInstance.buttonText = 'Continuar';
        return rxjs_1.from(modalRef.result);
    };
    CertificateGenerationService.prototype.showConfirmSend = function (recipientName) {
        var modalRef = this.modalService.open(confirm_send_modal_component_1.ConfirmSendModalComponent, {
            centered: true
        });
        modalRef.componentInstance.recipientName = recipientName;
        return rxjs_1.from(modalRef.result);
    };
    CertificateGenerationService.prototype.showSendSuccess = function () {
        var modalRef = this.modalService.open(alert_modal_component_1.AlertModalComponent, {
            centered: true,
            size: 'sm',
            backdropClass: 'modal-backdrop-dark',
            windowClass: 'modal-custom-orange'
        });
        modalRef.componentInstance.type = 'success';
        modalRef.componentInstance.title = 'Documento enviado';
        modalRef.componentInstance.message = 'El documento se ha enviado correctamente al socio indicado.';
        modalRef.componentInstance.buttonText = 'Continuar';
        return rxjs_1.from(modalRef.result);
    };
    CertificateGenerationService.prototype.sendCertificate = function (certificateId, message) {
        return rxjs_1.from(Promise.resolve({ success: true }));
    };
    CertificateGenerationService.prototype.downloadPdf = function (url, fileName) {
        if (fileName === void 0) { fileName = 'certificado.pdf'; }
        return this.http.get(url, { responseType: 'blob' })
            .pipe(operators_1.map(function (blob) {
            var blobUrl = window.URL.createObjectURL(blob);
            var link = document.createElement('a');
            link.href = blobUrl;
            link.download = fileName;
            link.click();
            window.URL.revokeObjectURL(blobUrl);
            return { success: true };
        }), operators_1.catchError(function (error) {
            console.error('Error al descargar el PDF:', error);
            return rxjs_1.throwError(function () { return new Error('Error al descargar el PDF'); });
        }));
    };
    CertificateGenerationService = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        })
    ], CertificateGenerationService);
    return CertificateGenerationService;
}());
exports.CertificateGenerationService = CertificateGenerationService;
