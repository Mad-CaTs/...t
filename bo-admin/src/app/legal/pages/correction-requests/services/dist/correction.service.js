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
exports.CorrectionService = void 0;
var core_1 = require("@angular/core");
var http_1 = require("@angular/common/http");
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var environment_1 = require("src/environments/environment");
var cokkies_1 = require("@utils/cokkies");
var CorrectionService = /** @class */ (function () {
    function CorrectionService(http) {
        this.http = http;
        this.API_URL = environment_1.environment.apiLegal;
        this.ADMIN_API_URL = environment_1.environment.api;
        this.PDF_API_URL = environment_1.environment.apiPdf;
    }
    CorrectionService.prototype.getCorrectionRequests = function (filters) {
        var _this = this;
        var params = {
            documentId: (filters === null || filters === void 0 ? void 0 : filters.documentType) === 'certificates' ? 1 : 2
        };
        if (filters) {
            if (filters.search)
                params.search = filters.search;
            if (filters.portfolio)
                params.portfolio = filters.portfolio;
            if (filters.date)
                params.date = filters.date.toISOString().split('T')[0];
        }
        return this.http.get(this.API_URL + "/api/v1/legal/correction-requests", { params: params })
            .pipe(operators_1.tap(function (response) {
            if (Array.isArray(response)) {
            }
            else {
                console.log('No es un array, es:', typeof response);
            }
        }), operators_1.switchMap(function (requests) {
            var requestsWithData = requests.map(function (request) {
                if (request.customerId && request.suscriptionId) {
                    return _this.getPartnerData(request.customerId, request.suscriptionId)
                        .pipe(operators_1.map(function (partnerData) { return (__assign(__assign({}, request), { partnerName: partnerData.fullName || '', portfolio: partnerData.familyPackageName || '', documentType: partnerData.documentType || '', identityDocument: partnerData.documentNumber || '' })); }), operators_1.catchError(function () { return rxjs_1.of(request); }));
                }
                return rxjs_1.of(request);
            });
            return rxjs_1.forkJoin(requestsWithData);
        }), operators_1.catchError(function (error) {
            console.error('Error al obtener correcciones:', error);
            return rxjs_1.throwError(function () { return error; });
        }));
    };
    CorrectionService.prototype.getCorrectionDetail = function (correctionId) {
        var url = this.API_URL + "/api/v1/legal/correction-requests/" + correctionId;
        return this.http.get(url)
            .pipe(operators_1.tap(function (response) { return console.log('Detalle:', response); }), operators_1.catchError(function (error) {
            console.error('Error al obtener detalle:', error);
            return rxjs_1.throwError(function () { return error; });
        }));
    };
    CorrectionService.prototype.updateStatus = function (correctionId, status, message) {
        return this.http.put(this.API_URL + "/api/v1/legal/correction-requests/" + correctionId + "/status", {
            status: status.toString(),
            message: message,
            profileType: 'ADMIN'
        }).pipe(operators_1.tap(function (response) { return console.log('Estado actualizado:', response); }), operators_1.catchError(function (error) {
            console.error('Error al actualizar estado:', error);
            return rxjs_1.throwError(function () { return error; });
        }));
    };
    CorrectionService.prototype.getPartnerData = function (customerId, suscriptionId) {
        var numericCustomerId = Number(customerId);
        var numericSuscriptionId = Number(suscriptionId);
        if (isNaN(numericCustomerId) || isNaN(numericSuscriptionId)) {
            console.error('IDs inválidos:', { customerId: customerId, suscriptionId: suscriptionId });
            return rxjs_1.throwError(function () { return new Error('Los IDs deben ser números válidos'); });
        }
        var url = this.API_URL + "/api/v1/legal/user-data/complete?customerId=" + numericCustomerId + "&suscriptionId=" + numericSuscriptionId;
        console.log('Llamando a API:', url);
        return this.http.get(url)
            .pipe(operators_1.tap(function (response) { return console.log('Datos del socio:', response); }), operators_1.catchError(function (error) {
            return rxjs_1.throwError(function () { return error; });
        }));
    };
    CorrectionService.prototype.getHistory = function (customerId) {
        return this.http.get(this.API_URL + "/api/v1/legal/correction-requests/user/" + customerId)
            .pipe(operators_1.tap(function (response) { return console.log('Historial:', response); }), operators_1.catchError(function (error) {
            console.error('Error al obtener historial:', error);
            return rxjs_1.throwError(function () { return error; });
        }));
    };
    CorrectionService.prototype.sendObservation = function (request) {
        return this.http.post(this.API_URL + "/api/corrections/" + request.correctionId + "/observe", request)
            .pipe(operators_1.tap(function (response) { return console.log('Observación enviada:', response); }), operators_1.catchError(function (error) {
            console.error('Error al enviar observación:', error);
            return rxjs_1.throwError(function () { return error; });
        }));
    };
    CorrectionService.prototype.sendNotification = function (correctionId, type) {
        return this.http.post(this.API_URL + "/api/notifications/correction/" + correctionId, { type: type })
            .pipe(operators_1.tap(function (response) { return console.log('Notificación enviada:', response); }), operators_1.catchError(function (error) {
            console.error('Error al enviar notificación:', error);
            return rxjs_1.throwError(function () { return error; });
        }));
    };
    CorrectionService.prototype.uploadEvidence = function (correctionId, file) {
        var formData = new FormData();
        formData.append('file', file);
        return this.http.post(this.API_URL + "/api/corrections/" + correctionId + "/evidence", formData)
            .pipe(operators_1.tap(function (response) { return console.log('Evidencia subida:', response); }), operators_1.catchError(function (error) {
            console.error('Error al subir evidencia:', error);
            return rxjs_1.throwError(function () { return error; });
        }));
    };
    CorrectionService.prototype.deleteEvidence = function (correctionId, evidenceId) {
        return this.http["delete"](this.API_URL + "/api/corrections/" + correctionId + "/evidence/" + evidenceId)
            .pipe(operators_1.tap(function (response) { return console.log('Evidencia eliminada:', response); }), operators_1.catchError(function (error) {
            console.error('Error al eliminar evidencia:', error);
            return rxjs_1.throwError(function () { return error; });
        }));
    };
    CorrectionService.prototype.getPortfolios = function () {
        var token = cokkies_1.getCokkie('TOKEN');
        if (!token) {
            return rxjs_1.throwError(function () { return new Error('No se encontró token de autorización'); });
        }
        return this.http.get(this.ADMIN_API_URL + "/api/familypackage/all", { headers: { Authorization: "Bearer " + token } }).pipe(operators_1.map(function (response) {
            console.log('Respuesta del API de portfolios:', response);
            if (!response || !response.data) {
                console.warn('No hay datos en la respuesta de portfolios');
                return [];
            }
            return response.data.map(function (fp) { return fp.name; });
        }), operators_1.tap(function (response) { return console.log('Portfolios obtenidos:', response); }), operators_1.catchError(function (error) {
            console.error('Error al obtener portafolios:', error);
            return rxjs_1.throwError(function () { return error; });
        }));
    };
    CorrectionService.prototype.getPackagesByCustomerData = function (customerId, suscriptionId) {
        var _this = this;
        return this.getPartnerData(customerId, suscriptionId).pipe(operators_1.switchMap(function (partnerData) {
            console.log('Datos del socio obtenidos:', partnerData);
            var familyPackageId = partnerData.familyPackageId;
            return _this.getPackagesByFamilyId(familyPackageId);
        }));
    };
    CorrectionService.prototype.getPackagesByFamilyId = function (familyPackageId) {
        console.log('Obteniendo paquetes para familyPackageId:', familyPackageId);
        var token = cokkies_1.getCokkie('TOKEN');
        if (!token) {
            return rxjs_1.throwError(function () { return new Error('No se encontro token de autorizacion'); });
        }
        var headers = new http_1.HttpHeaders({
            'Authorization': "Bearer " + token,
            'Content-Type': 'application/json'
        });
        return this.http.get(this.ADMIN_API_URL + "/api/familypackage/package/detail/version/state/true", { headers: headers }).pipe(operators_1.tap(function (response) { return console.log('Respuesta completa del API:', response); }), operators_1.map(function (response) {
            if (!response.data) {
                console.error('No hay datos en la respuesta');
                return [];
            }
            var family = response.data.find(function (f) { return f.idFamilyPackage === familyPackageId; });
            if (family && family.packageList) {
                console.log('Familia encontrada:', family);
                return family.packageList.map(function (p) { return p.name; });
            }
            console.warn('No se encontró la familia o no tiene paquetes');
            return [];
        }), operators_1.tap(function (memberships) { return console.log('Membresías extraídas:', memberships); }), operators_1.catchError(function (error) {
            console.error('Error al obtener paquetes:', error);
            return rxjs_1.throwError(function () { return error; });
        }));
    };
    CorrectionService.prototype.createCorrectionRequest = function (request) {
        console.log('Enviando solicitud de corrección:', request);
        if (!request.suscriptionId && request.id_suscription) {
            request.suscriptionId = request.id_suscription;
        }
        else if (!request.id_suscription && request.suscriptionId) {
            request.id_suscription = request.suscriptionId;
        }
        if (!request.customerId || !request.suscriptionId) {
            console.error('Faltan datos requeridos:', { customerId: request.customerId, suscriptionId: request.suscriptionId });
            return rxjs_1.throwError(function () { return new Error('customerId y suscriptionId son requeridos'); });
        }
        if (request.status && typeof request.status !== 'string') {
            request.status = request.status.toString();
        }
        console.log('Request procesado:', request);
        return this.http.post(this.API_URL + "/api/v1/legal/correction-requests", request)
            .pipe(operators_1.tap(function (response) { return console.log('Solicitud de corrección creada:', response); }), operators_1.catchError(function (error) {
            console.error('Error al crear solicitud de corrección:', error);
            return rxjs_1.throwError(function () { return error; });
        }));
    };
    CorrectionService = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        })
    ], CorrectionService);
    return CorrectionService;
}());
exports.CorrectionService = CorrectionService;
