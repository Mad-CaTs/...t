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
exports.CorrectionListComponent = void 0;
var core_1 = require("@angular/core");
var common_1 = require("@angular/common");
var forms_1 = require("@angular/forms");
var tables_module_1 = require("@shared/components/tables/tables.module");
var correction_service_1 = require("../services/correction.service");
var user_service_1 = require("../services/user.service");
var status_enum_1 = require("../models/status.enum");
var ng_inline_svg_2_1 = require("ng-inline-svg-2");
var generate_document_modal_component_1 = require("../components/generate-document-modal/generate-document-modal.component");
var CorrectionListComponent = /** @class */ (function () {
    function CorrectionListComponent(router, route, modalService, correctionService, userService, cdr, location) {
        this.router = router;
        this.route = route;
        this.modalService = modalService;
        this.correctionService = correctionService;
        this.userService = userService;
        this.cdr = cdr;
        this.location = location;
        this.searchTerm = '';
        this.selectedPortfolio = '';
        this.selectedDate = null;
        this.pageSize = 4;
        this.currentPage = 1;
        this.type = 'contracts';
        this.totalItems = 0;
        this.totalPages = 0;
        this.requests = [];
        this.loading = false;
        this.portfolios = [];
    }
    CorrectionListComponent.prototype.ngOnChanges = function () {
        console.log('Cambios detectados en requests:', this.requests);
    };
    CorrectionListComponent.prototype.getStatusClass = function (status) {
        return status ? status_enum_1.getStatusClass(status) : 'badge-pending';
    };
    CorrectionListComponent.prototype.getStatusText = function (status) {
        return status ? status_enum_1.getStatusText(status) : 'Pendiente';
    };
    CorrectionListComponent.prototype.ngOnInit = function () {
        var _this = this;
        var url = this.router.url;
        this.type = url.includes('/contracts') ? 'contracts' : 'certificates';
        this.correctionService.getPortfolios().subscribe({
            next: function (portfolios) {
                _this.portfolios = portfolios;
                _this.cdr.detectChanges();
            },
            error: function (error) {
                console.error('Error al cargar portafolios:', error);
            }
        });
        this.loadData();
    };
    CorrectionListComponent.prototype.loadData = function () {
        var _this = this;
        this.loading = true;
        var filters = {
            search: this.searchTerm || '',
            portfolio: this.selectedPortfolio || '',
            date: this.selectedDate ? new Date(this.selectedDate) : undefined,
            documentType: this.type
        };
        this.correctionService.getCorrectionRequests(filters).subscribe({
            next: function (data) {
                console.log('Datos recibidos:', data);
                _this.requests = data;
                _this.totalItems = data.length;
                _this.totalPages = Math.ceil(data.length / _this.pageSize);
                _this.loading = false;
                _this.cdr.detectChanges();
                console.log('Datos mapeados:', _this.requests);
            },
            error: function (error) {
                console.error('Error al cargar las solicitudes:', error);
                _this.loading = false;
                _this.cdr.detectChanges();
            }
        });
    };
    CorrectionListComponent.prototype.onFiltersChange = function () {
        this.loadData();
    };
    CorrectionListComponent.prototype.applyFilter = function () {
        this.loadData();
    };
    CorrectionListComponent.prototype.reset = function () {
        this.searchTerm = '';
        this.selectedPortfolio = '';
        this.selectedDate = null;
        this.currentPage = 1;
        this.loadData();
    };
    CorrectionListComponent.prototype.newRequest = function () {
        var _this = this;
        var modalRef = this.modalService.open(generate_document_modal_component_1.GenerateDocumentModalComponent, {
            centered: true,
            size: 'md'
        });
        modalRef.componentInstance.documentType = this.type === 'certificates' ? 'Certificado' : 'Contrato';
        modalRef.componentInstance.portfolios = this.portfolios;
        modalRef.closed.subscribe(function (result) {
            if (result) {
                console.log('Generando', _this.type, 'con:', result);
                if (result.customerId && result.idsuscription) {
                    console.log('Obteniendo datos del socio para generación:', result);
                    _this.userService.setSelectedUser(__assign(__assign({}, result), { idUser: result.customerId }));
                    _this.userService.getSubscriptionData(result.idsuscription).subscribe({
                        next: function (subscriptionData) {
                            console.log('Datos del socio obtenidos para generación:', subscriptionData);
                            console.log('Datos del resultado:', result);
                            var navigationState = {
                                detail: {
                                    mode: 'generate',
                                    customerId: result.customerId,
                                    suscriptionId: result.idsuscription,
                                    documentId: _this.type === 'certificates' ? 1 : 2,
                                    isContrato: _this.type === 'contracts',
                                    nombreCompleto: result.nombreCompleto || subscriptionData.nombreCompleto,
                                    nacionalidad: result.nacionalidad || subscriptionData.nacionalidad,
                                    tipoDocumento: result.tipoDocumento || subscriptionData.tipoDocumento,
                                    nrodocument: result.nrodocument || subscriptionData.nrodocument,
                                    pais: result.pais || subscriptionData.pais,
                                    distrito: result.distrito || subscriptionData.distrito,
                                    nombrePaquete: result.nombrePaquete || subscriptionData.nombrePaquete,
                                    nombreFamilypackage: result.nombreFamilypackage || subscriptionData.nombreFamilypackage,
                                    acciones: subscriptionData.acciones || result.acciones,
                                    escalaPago: subscriptionData.escalaPago || result.escalaPago,
                                    idFamilyPackage: result.familyPackageId || result.idFamilyPackage || subscriptionData.familyPackageId || subscriptionData.idFamilyPackage,
                                    portfolioId: result.portfolioId || subscriptionData.portfolioId
                                }
                            };
                            console.log('Estado de navegación preparado:', navigationState);
                            _this.router.navigate(['/dashboard/legal/correction-requests', _this.type, 'generate', 'new'], { state: navigationState.detail });
                        },
                        error: function (error) {
                            console.error('Error al obtener datos del socio para generación:', error);
                            var errorNavigationState = {
                                detail: {
                                    mode: 'generate',
                                    customerId: result.customerId,
                                    suscriptionId: result.idsuscription,
                                    documentId: _this.type === 'certificates' ? 1 : 2,
                                    isContrato: _this.type === 'contracts',
                                    nombreCompleto: result.nombreCompleto,
                                    nacionalidad: result.nacionalidad,
                                    tipoDocumento: result.tipoDocumento,
                                    nrodocument: result.nrodocument,
                                    pais: result.pais,
                                    distrito: result.distrito,
                                    nombrePaquete: result.nombrePaquete,
                                    nombreFamilypackage: result.nombreFamilypackage,
                                    acciones: result.acciones,
                                    escalaPago: result.escalaPago,
                                    idFamilyPackage: result.familyPackageId || result.idFamilyPackage || 0,
                                    portfolioId: result.portfolioId
                                }
                            };
                            console.log('Estado de navegación en error:', errorNavigationState);
                            _this.router.navigate(['/dashboard/legal/correction-requests', _this.type, 'generate', 'new'], { state: errorNavigationState.detail });
                        }
                    });
                }
                else {
                    var defaultState = {
                        mode: 'generate',
                        customerId: result.customerId,
                        suscriptionId: result.idsuscription,
                        documentId: _this.type === 'certificates' ? 1 : 2,
                        isContrato: _this.type === 'contracts',
                        nombreCompleto: result.nombreCompleto,
                        nacionalidad: result.nacionalidad,
                        tipoDocumento: result.tipoDocumento,
                        nrodocument: result.nrodocument,
                        pais: result.pais,
                        distrito: result.distrito,
                        nombrePaquete: result.nombrePaquete,
                        nombreFamilypackage: result.nombreFamilypackage,
                        acciones: result.acciones,
                        escalaPago: result.escalaPago,
                        idFamilyPackage: result.familyPackageId || result.idFamilyPackage || 0,
                        portfolioId: result.portfolioId
                    };
                    console.log('Estado de navegación por defecto:', defaultState);
                    _this.router.navigate(['/dashboard/legal/correction-requests', _this.type, 'generate', 'new'], { state: defaultState });
                }
            }
        });
    };
    CorrectionListComponent.prototype.onPageSizeChange = function () {
        this.currentPage = 1;
        this.loadData();
    };
    CorrectionListComponent.prototype.previousPage = function () {
        if (this.currentPage > 1) {
            this.currentPage--;
            this.loadData();
        }
    };
    CorrectionListComponent.prototype.nextPage = function () {
        if (this.currentPage < this.totalPages) {
            this.currentPage++;
            this.loadData();
        }
    };
    CorrectionListComponent.prototype.goToPage = function (page) {
        if (page !== this.currentPage && page > 0 && page <= this.totalPages) {
            this.currentPage = page;
            this.loadData();
        }
    };
    CorrectionListComponent.prototype.getPageNumbers = function () {
        var pages = [];
        var maxPages = 5;
        var start = Math.max(1, this.currentPage - Math.floor(maxPages / 2));
        var end = Math.min(start + maxPages - 1, this.totalPages);
        if (end - start + 1 < maxPages) {
            start = Math.max(1, end - maxPages + 1);
        }
        for (var i = start; i <= end; i++) {
            pages.push(i);
        }
        return pages;
    };
    CorrectionListComponent.prototype.getPageRangeText = function () {
        var start = (this.currentPage - 1) * this.pageSize + 1;
        var end = Math.min(start + this.pageSize - 1, this.totalItems);
        return start + " - " + end + " de " + this.totalItems;
    };
    CorrectionListComponent.prototype.viewDetail = function (item) {
        var _this = this;
        console.log('Ver detalle de:', item);
        var type = this.router.url.includes('/contracts') ? 'contracts' : 'certificates';
        var documentId = type === 'certificates' ? 1 : 2;
        this.correctionService.getCorrectionDetail(item.id).subscribe({
            next: function (detail) {
                console.log('Detalle obtenido:', detail);
                _this.userService.getSubscriptionData(item.suscriptionId || item.customerId).subscribe({
                    next: function (subscriptionData) {
                        console.log('Datos de suscripción obtenidos:', subscriptionData);
                        var processedDetail = __assign(__assign({}, detail), { id: item.id, username: item.username, partnerName: item.partnerName, status: item.status, requestDate: item.requestDate, requestMessage: item.requestMessage || '', history: Array.isArray(detail.history) ? detail.history : [], documentId: documentId, customerId: item.customerId, suscriptionId: item.suscriptionId || item.customerId, nombreSocio: subscriptionData.nombreCompleto, nacionalidad: subscriptionData.nacionalidad, tipoDocumento: subscriptionData.tipoDocumento, numeroDocumento: subscriptionData.nrodocument, paisResidencia: subscriptionData.pais, departamento: subscriptionData.distrito, nombrePaquete: subscriptionData.nombrePaquete, nombreFamilypackage: subscriptionData.nombreFamilypackage, numeroAcciones: subscriptionData.acciones, escalaTotalidad: subscriptionData.escalaPago });
                        console.log('Detalle procesado con datos del socio:', processedDetail);
                        var navigationState = __assign(__assign({}, processedDetail), { id: item.id, documentId: documentId, nombreCompleto: subscriptionData.nombreCompleto, nacionalidad: subscriptionData.nacionalidad, tipoDocumento: subscriptionData.tipoDocumento, nrodocument: subscriptionData.nrodocument, pais: subscriptionData.pais, distrito: subscriptionData.distrito, nombrePaquete: subscriptionData.nombrePaquete, nombreFamilypackage: subscriptionData.nombreFamilypackage, acciones: subscriptionData.acciones, escalaPago: subscriptionData.escalaPago });
                        console.log('Estado de navegación para history:', navigationState);
                        _this.location.replaceState(_this.router.createUrlTree(['/dashboard/legal/correction-requests', type, 'history', item.username]).toString(), JSON.stringify(navigationState));
                        _this.router.navigate(['/dashboard/legal/correction-requests', type, 'history', item.username], {
                            state: navigationState
                        });
                    },
                    error: function (error) {
                        console.error('Error al obtener datos del socio:', error);
                        var processedDetail = __assign(__assign({}, detail), { id: item.id, username: item.username, partnerName: item.partnerName, status: item.status, requestDate: item.requestDate, requestMessage: item.requestMessage || '', history: Array.isArray(detail.history) ? detail.history : [], documentId: documentId });
                        var navigationState = __assign(__assign({}, processedDetail), { id: item.id, documentId: documentId });
                        console.log('Estado de navegación para history (error):', navigationState);
                        _this.location.replaceState(_this.router.createUrlTree(['/dashboard/legal/correction-requests', type, 'history', item.username]).toString(), JSON.stringify(navigationState));
                        _this.router.navigate(['/dashboard/legal/correction-requests', type, 'history', item.username], {
                            state: navigationState
                        });
                    }
                });
            },
            error: function (error) {
                console.error('Error al obtener detalle:', error);
            }
        });
    };
    CorrectionListComponent = __decorate([
        core_1.Component({
            selector: 'app-correction-list',
            standalone: true,
            imports: [
                common_1.CommonModule,
                forms_1.FormsModule,
                tables_module_1.TablesModule,
                ng_inline_svg_2_1.InlineSVGModule,
                generate_document_modal_component_1.GenerateDocumentModalComponent
            ],
            providers: [correction_service_1.CorrectionService, user_service_1.UserService],
            templateUrl: './correction-list.component.html',
            styleUrls: ['./correction-list.component.scss']
        })
    ], CorrectionListComponent);
    return CorrectionListComponent;
}());
exports.CorrectionListComponent = CorrectionListComponent;
