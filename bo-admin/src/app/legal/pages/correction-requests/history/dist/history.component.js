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
exports.HistoryComponent = void 0;
var core_1 = require("@angular/core");
var common_1 = require("@angular/common");
var forms_1 = require("@angular/forms");
var ng_inline_svg_2_1 = require("ng-inline-svg-2");
var correction_service_1 = require("../services/correction.service");
var HistoryComponent = /** @class */ (function () {
    function HistoryComponent(route, router, pageInfo, correctionService, cdr) {
        this.route = route;
        this.router = router;
        this.pageInfo = pageInfo;
        this.correctionService = correctionService;
        this.cdr = cdr;
        this.username = '';
        this.partnerName = '';
        this.searchTerm = '';
        this.pageSize = 4;
        this.currentPage = 1;
        this.type = 'contracts';
        this.correctionId = null;
        this.customerId = null;
        this.history = [];
    }
    HistoryComponent.prototype.ngOnInit = function () {
        var _this = this;
        var state = window.history.state;
        console.log('Estado inicial:', state);
        this.type = this.router.url.includes('/contracts/') ? 'contracts' : 'certificates';
        var documentId = (state === null || state === void 0 ? void 0 : state.documentId) || (this.type === 'certificates' ? 1 : 2);
        console.log('Tipo detectado:', this.type, 'DocumentId:', documentId);
        this.pageInfo.setTitle('Historial de cambios');
        var breadcrumbs = [
            { title: 'Legal', path: '/dashboard/legal', isActive: false, isSeparator: false },
            { title: '', path: '', isActive: false, isSeparator: true },
            {
                title: 'Administrador Legal',
                path: '/dashboard/legal/legal-administrator',
                isActive: false,
                isSeparator: false
            },
            { title: '', path: '', isActive: false, isSeparator: true },
            {
                title: this.type === 'contracts' ? 'Contratos' : 'Certificados',
                path: "/dashboard/legal/correction-requests/" + this.type,
                isActive: true,
                isSeparator: false
            }
        ];
        this.pageInfo.setBreadcrumbs(breadcrumbs);
        this.route.params.subscribe(function (params) {
            if (params['username']) {
                console.log('Parámetros de ruta:', params);
                _this.username = params['username'];
                if (state) {
                    console.log('Estado encontrado:', state);
                    _this.customerId = state.customerId;
                    _this.correctionId = state.id;
                    _this.processDetail(state);
                }
                else if (state === null || state === void 0 ? void 0 : state.id) {
                    _this.correctionId = Number(state.id);
                    console.log('ID de corrección encontrado:', _this.correctionId);
                    _this.loadDetailFromService();
                }
                else {
                    console.error('No se encontró información necesaria en el state');
                }
            }
        });
    };
    HistoryComponent.prototype.loadHistory = function () {
        var _this = this;
        if (!this.customerId) {
            console.error('No se encontró el ID del usuario');
            return;
        }
        console.log('Cargando historial para customerId:', this.customerId);
        this.correctionService.getHistory(this.customerId).subscribe({
            next: function (response) {
                console.log('Historial recibido:', response);
                if (Array.isArray(response)) {
                    _this.history = response.map(function (item) {
                        var _a;
                        return (__assign(__assign({}, item), { status: (_a = item.status) === null || _a === void 0 ? void 0 : _a.toString(), partnerName: item.partnerName || _this.partnerName }));
                    });
                    _this.history.sort(function (a, b) {
                        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
                    });
                }
                else {
                    console.warn('La respuesta no es un array:', response);
                    _this.history = [];
                }
                _this.cdr.detectChanges();
            },
            error: function (error) {
                console.error('Error al cargar historial:', error);
                _this.history = [];
                _this.cdr.detectChanges();
            }
        });
    };
    HistoryComponent.prototype.processDetail = function (detail) {
        var _this = this;
        var _a;
        console.log('Procesando detalle completo:', detail);
        var processedDetail = {
            id: detail.id,
            username: detail.username,
            partnerName: detail.partnerName,
            status: detail.status,
            requestDate: detail.requestDate,
            requestMessage: detail.requestMessage || '',
            history: Array.isArray(detail.history) ? detail.history : [],
            documentId: detail.documentId,
            customerId: detail.customerId,
            suscriptionId: detail.suscriptionId,
            nombreSocio: detail.nombreSocio,
            nacionalidad: detail.nacionalidad,
            tipoDocumento: detail.tipoDocumento,
            numeroDocumento: detail.nrodocument,
            paisResidencia: detail.paisResidencia,
            departamento: detail.departamento,
            nombrePaquete: detail.nombrePaquete,
            nombreFamilypackage: detail.nombreFamilypackage,
            numeroAcciones: detail.acciones,
            escalaTotalidad: detail.escalaTotalidad
        };
        console.log('Detalle procesado:', processedDetail);
        this.username = processedDetail.username;
        this.partnerName = processedDetail.partnerName;
        var initialEntry = {
            id: processedDetail.id,
            status: (_a = processedDetail.status) === null || _a === void 0 ? void 0 : _a.toString(),
            profileType: 'USER',
            partnerName: processedDetail.partnerName,
            message: processedDetail.requestMessage,
            createdAt: processedDetail.requestDate,
            username: processedDetail.username
        };
        if (!processedDetail.history || processedDetail.history.length === 0) {
            console.log('No hay historial, usando entrada inicial:', initialEntry);
            this.history = [initialEntry];
        }
        else {
            console.log('Procesando historial existente:', processedDetail.history);
            this.history = processedDetail.history.map(function (h) {
                var _a;
                return (__assign(__assign({}, h), { status: (_a = h.status) === null || _a === void 0 ? void 0 : _a.toString(), partnerName: h.partnerName || _this.partnerName }));
            });
        }
        this.history.sort(function (a, b) {
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });
        console.log('Historial final:', this.history);
        this.cdr.detectChanges();
    };
    HistoryComponent.prototype.loadDetailFromService = function () {
        var _this = this;
        if (!this.correctionId)
            return;
        console.log('Cargando detalle del servicio para ID:', this.correctionId);
        this.correctionService.getCorrectionDetail(this.correctionId).subscribe({
            next: function (detail) {
                console.log('Detalle recibido:', detail);
                if (detail.customerId && detail.id_suscription) {
                    _this.correctionService.getPartnerData(detail.customerId, detail.id_suscription).subscribe({
                        next: function (partnerData) {
                            console.log('Datos del socio:', partnerData);
                            var enrichedDetail = __assign(__assign({}, detail), { nombreSocio: partnerData.nombreCompleto, nacionalidad: partnerData.nacionalidad, tipoDocumento: partnerData.tipoDocumento, numeroDocumento: partnerData.nrodocument, paisResidencia: partnerData.pais, departamento: partnerData.distrito, nombrePaquete: partnerData.nombrePaquete, nombreFamilypackage: partnerData.nombreFamilypackage, numeroAcciones: partnerData.acciones, escalaTotalidad: partnerData.escalaPago });
                            _this.processDetail(enrichedDetail);
                        },
                        error: function (error) {
                            console.error('Error al obtener datos del socio:', error);
                            _this.processDetail(detail);
                        }
                    });
                }
                else {
                    _this.processDetail(detail);
                }
            },
            error: function (error) {
                console.error('Error al cargar historial:', error);
            }
        });
    };
    HistoryComponent.prototype.onSearch = function () {
        this.loadHistory();
    };
    HistoryComponent.prototype.onPageSizeChange = function () {
        this.currentPage = 1;
        // TODO: Recargar datos con nuevo tamaño de página
    };
    HistoryComponent.prototype.previousPage = function () {
        if (this.currentPage > 1) {
            this.currentPage--;
            // TODO: Cargar página anterior
        }
    };
    HistoryComponent.prototype.nextPage = function () {
        this.currentPage++;
        // TODO: Cargar siguiente página
    };
    HistoryComponent.prototype.goToPage = function (page) {
        this.currentPage = page;
        // TODO: Cargar página específica
    };
    HistoryComponent.prototype.viewDetail = function (item) {
        var _this = this;
        if (!this.correctionId)
            return;
        console.log('Viendo detalle del item:', item);
        this.correctionService.getCorrectionDetail(this.correctionId).subscribe({
            next: function (detail) {
                console.log('Detalle recibido para mostrar:', detail);
                var processedDetail = {
                    id: detail.id,
                    username: detail.username,
                    partnerName: detail.partnerName,
                    status: detail.status,
                    requestDate: detail.requestDate,
                    requestMessage: detail.requestMessage || '',
                    history: Array.isArray(detail.history) ? detail.history.map(function (h) {
                        var _a;
                        return (__assign(__assign({}, h), { status: ((_a = h.status) === null || _a === void 0 ? void 0 : _a.toString()) || '1' }));
                    }) : [],
                    documentId: detail.documentId,
                    customerId: detail.customerId,
                    suscriptionId: detail.suscriptionId,
                    nombreSocio: detail.nombreSocio,
                    nacionalidad: detail.nacionalidad,
                    tipoDocumento: detail.tipoDocumento,
                    numeroDocumento: detail.nrodocument,
                    paisResidencia: detail.paisResidencia,
                    departamento: detail.departamento,
                    nombrePaquete: detail.nombrePaquete,
                    nombreFamilypackage: detail.nombreFamilypackage,
                    numeroAcciones: detail.acciones,
                    escalaTotalidad: detail.escalaTotalidad,
                    documentFileUrl: detail.documentFileUrl,
                    files: detail.files || []
                };
                var navigationState = __assign(__assign({}, processedDetail), { id: detail.id, documentId: detail.documentId, nombreCompleto: detail.nombreSocio, nacionalidad: detail.nacionalidad, tipoDocumento: detail.tipoDocumento, nrodocument: detail.nrodocument, pais: detail.paisResidencia, distrito: detail.departamento, nombrePaquete: detail.nombrePaquete, nombreFamilypackage: detail.nombreFamilypackage, acciones: detail.acciones, escalaPago: detail.escalaTotalidad, documentFileUrl: detail.documentFileUrl, files: detail.files || [] });
                _this.router.navigate(['/dashboard/legal/correction-requests', _this.type, 'history', _this.username, 'detail'], {
                    state: navigationState
                });
            },
            error: function (error) {
                console.error('Error al obtener detalle:', error);
            }
        });
    };
    HistoryComponent.prototype.getStatusClass = function (status) {
        if (!status)
            return 'badge-pending';
        var statusClasses = {
            '1': 'badge-pending',
            '2': 'badge-in-progress',
            '3': 'badge-warning',
            '4': 'badge-completed',
            'SOL_CORRECCION': 'badge-pending',
            'EN_PROCESO': 'badge-in-progress',
            'OBSERVADO': 'badge-warning',
            'CORREGIDO': 'badge-completed'
        };
        return statusClasses[status] || 'badge-pending';
    };
    HistoryComponent.prototype.getStatusText = function (status) {
        if (!status)
            return 'Solicitud';
        var statusTexts = {
            '1': 'Solicitud',
            '2': 'En proceso',
            '3': 'Observado',
            '4': 'Corregido',
            'SOL_CORRECCION': 'Solicitud',
            'EN_PROCESO': 'En proceso',
            'OBSERVADO': 'Observado',
            'CORREGIDO': 'Corregido'
        };
        return statusTexts[status] || 'Solicitud';
    };
    HistoryComponent.prototype.showNotifications = function (item) {
        // TODO: Implementar vista de notificaciones
        console.log('Ver notificaciones:', item);
    };
    HistoryComponent = __decorate([
        core_1.Component({
            selector: 'app-history',
            standalone: true,
            imports: [common_1.CommonModule, forms_1.FormsModule, ng_inline_svg_2_1.InlineSVGModule],
            providers: [correction_service_1.CorrectionService],
            templateUrl: './history.component.html',
            styleUrls: ['./history.component.scss']
        })
    ], HistoryComponent);
    return HistoryComponent;
}());
exports.HistoryComponent = HistoryComponent;
