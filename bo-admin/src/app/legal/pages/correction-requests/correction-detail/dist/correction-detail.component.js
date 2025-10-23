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
exports.CorrectionDetailComponent = void 0;
var core_1 = require("@angular/core");
var cokkies_1 = require("src/app/utils/cokkies");
var safe_pipe_1 = require("../pipes/safe.pipe");
var common_1 = require("@angular/common");
var forms_1 = require("@angular/forms");
var ng_inline_svg_2_1 = require("ng-inline-svg-2");
var ProjectType;
(function (ProjectType) {
    ProjectType["JOYA"] = "JOYA";
    ProjectType["RIBERA"] = "RIBERA";
})(ProjectType || (ProjectType = {}));
var status_enum_1 = require("../models/status.enum");
var CorrectionDetailComponent = /** @class */ (function () {
    function CorrectionDetailComponent(route, router, pageInfo, legalService, modalService, certificateService) {
        var _this = this;
        this.route = route;
        this.router = router;
        this.pageInfo = pageInfo;
        this.legalService = legalService;
        this.modalService = modalService;
        this.certificateService = certificateService;
        this.isFromHistory = false;
        this.observationText = '';
        this.requestData = {
            id: 0,
            customerId: 0,
            username: '',
            partnerName: '',
            portfolio: '',
            documentType: '',
            identityDocument: '',
            documentNumber: '',
            requestMessage: '',
            status: '',
            requestDate: '',
            files: [],
            history: [],
            id_suscription: 0
        };
        this.mainDocumentUrl = null;
        this.errorMessage = '';
        this.selectedFile = null;
        this.viewDocument = function () {
            var _a;
            var correctionFile = (_a = _this.requestData.files) === null || _a === void 0 ? void 0 : _a.find(function (f) { return f.fileType === 'DOCUMENT_CORRECTION'; });
            if (correctionFile === null || correctionFile === void 0 ? void 0 : correctionFile.s3Url) {
                window.open(correctionFile.s3Url, '_blank');
            }
            else {
                console.error('No se encontró documento de corrección');
            }
        };
        this.viewFile = function (file) {
            var fileUrl = (file === null || file === void 0 ? void 0 : file.s3Url) || (file === null || file === void 0 ? void 0 : file.url);
            if (fileUrl) {
                window.open(fileUrl, '_blank');
            }
            else {
                console.error('No se encontró URL para el archivo:', file);
            }
        };
        this.openDocumentModal = function (file) {
            _this.selectedFile = file;
            var modalRef = _this.modalService.open(_this.documentModal, {
                size: 'lg',
                centered: true,
                backdrop: 'static'
            });
            modalRef.result.then(function (result) {
                if (result === 'Observar') {
                    _this.showObservationModal();
                }
            }, function () { });
        };
        this.showObservationModal = function () {
            var modalRef = _this.modalService.open(_this.observationModal, {
                size: 'lg',
                centered: true,
                backdrop: 'static'
            });
            modalRef.result.then(function (result) {
                if (result === 'Confirmar') {
                    _this.showSuccessModal();
                }
            }, function () { });
        };
        this.showSuccessModal = function (message) {
            if (message === void 0) { message = 'El documento ha sido observado exitosamente.'; }
            var modalRef = _this.modalService.open(_this.successModal, {
                centered: true,
                backdrop: 'static'
            });
            modalRef.componentInstance.message = message;
            modalRef.result.then(function () {
                _this.goBack();
            }, function () { });
        };
        this.showError = function (message) {
            _this.errorMessage = message;
            _this.modalService.open(_this.errorModal, {
                centered: true,
                backdrop: 'static'
            });
        };
        this.getFileIcon = function (fileName) {
            var _a;
            var extension = (_a = fileName.split('.').pop()) === null || _a === void 0 ? void 0 : _a.toLowerCase();
            switch (extension) {
                case 'pdf':
                    return 'fas fa-file-pdf';
                case 'jpg':
                case 'jpeg':
                case 'png':
                    return 'fas fa-file-image';
                default:
                    return 'fas fa-file';
            }
        };
        this.correctDocument = function () {
            var type = _this.router.url.includes('/contracts/') ? 'contracts' : 'certificates';
            if (!_this.requestData.id) {
                _this.showError('No se encontró el ID de la solicitud.');
                return;
            }
            var token = cokkies_1.getCokkie('TOKEN');
            if (!token) {
                _this.showError('No se encontró el token de autorización. Por favor, inicie sesión nuevamente.');
                return;
            }
            _this.certificateService
                .getPartnerData(_this.requestData.customerId, _this.requestData.id_suscription)
                .subscribe({
                next: function (partnerData) {
                    console.log('Datos del socio obtenidos:', partnerData);
                    if (!_this.mainDocumentUrl) {
                        _this.showError('No se encontró el documento a corregir.');
                        return;
                    }
                    var route = "/dashboard/legal/correction-requests/" + type + "/history/" + _this.requestData.username + "/edit";
                    void _this.router.navigate([route], {
                        state: {
                            detail: __assign(__assign({}, _this.requestData), { partnerData: partnerData, pdfUrl: _this.mainDocumentUrl, id: _this.requestData.id })
                        }
                    });
                },
                error: function (error) {
                    console.error('Error al obtener datos del socio:', error);
                    _this.showError('Error al obtener los datos del socio. Por favor, intente nuevamente.');
                }
            });
        };
        this.acceptCorrection = function () {
            var modalRef = _this.modalService.open(_this.observationModal, {
                size: 'lg',
                centered: true,
                backdrop: 'static'
            });
            modalRef.componentInstance.title = 'Aceptar Corrección';
            modalRef.componentInstance.message = '¿Está seguro que desea aceptar esta corrección?';
            modalRef.componentInstance.observationLabel = 'Comentarios (opcional)';
            modalRef.componentInstance.confirmButtonText = 'Aceptar';
            modalRef.componentInstance.confirmButtonClass = 'btn-success';
            modalRef.result.then(function (result) {
                if (result === 'Confirmar') {
                    _this.showSuccessModal('La corrección ha sido aceptada exitosamente.');
                }
            }, function () { });
        };
        this.rejectCorrection = function () {
            var modalRef = _this.modalService.open(_this.observationModal, {
                size: 'lg',
                centered: true,
                backdrop: 'static'
            });
            modalRef.componentInstance.title = 'Rechazar Corrección';
            modalRef.componentInstance.message = '¿Está seguro que desea rechazar esta corrección?';
            modalRef.componentInstance.observationLabel = 'Motivo del rechazo';
            modalRef.componentInstance.confirmButtonText = 'Rechazar';
            modalRef.componentInstance.confirmButtonClass = 'btn-danger';
            modalRef.result.then(function (result) {
                if (result === 'Confirmar') {
                    _this.showSuccessModal('La corrección ha sido rechazada.');
                }
            }, function () { });
        };
        this.getStatusText = function (status) {
            return status_enum_1.getStatusText(status);
        };
        this.getStatusBadgeClass = function (status) {
            return status_enum_1.getStatusClass(status);
        };
        this.goBack = function () {
            var path = _this.router.url.includes('/contracts/') ? 'contracts' : 'certificates';
            void _this.router.navigate([
                '/dashboard/legal/correction-requests',
                path,
                'history',
                _this.requestData.username
            ]);
        };
    }
    CorrectionDetailComponent.prototype.ngOnInit = function () {
        this.initializeComponent();
    };
    CorrectionDetailComponent.prototype.ngAfterViewInit = function () {
        this.initializeView();
    };
    CorrectionDetailComponent.prototype.ngOnDestroy = function () {
        this.cleanup();
    };
    CorrectionDetailComponent.prototype.initializeComponent = function () {
        var _this = this;
        var savedData = this.certificateService.getCurrentCorrectionData();
        if (savedData) {
            this.requestData = savedData;
            this.isFromHistory = true;
        }
        else {
            var state = window.history.state;
            console.log('Estado recibido en detail:', state);
            if (state) {
                console.log('Estado detallado:', state);
                this.requestData = __assign(__assign(__assign({}, this.requestData), state), { id: state.id, customerId: state.customerId, username: state.username, partnerName: state.partnerName, portfolio: state.portfolio, documentType: state.documentType, identityDocument: state.identityDocument, documentNumber: state.documentNumber, requestMessage: state.requestMessage, status: state.status, requestDate: state.requestDate, files: state.files || [], history: state.history || [], id_suscription: state.suscriptionId || state.id_suscription, documentFileUrl: state.documentFileUrl });
                console.log('RequestData después de mapeo:', this.requestData);
                this.certificateService.setCorrectionData(this.requestData);
            }
            console.log('Datos de la solicitud procesados:', this.requestData);
            if (this.requestData.id_suscription && this.requestData.customerId) {
                this.certificateService
                    .getPartnerData(this.requestData.customerId, this.requestData.id_suscription)
                    .subscribe({
                    next: function (partnerData) {
                        console.log('Datos del socio obtenidos:', partnerData);
                        _this.requestData = __assign(__assign({}, _this.requestData), { portfolio: partnerData.familyPackageName || '', documentType: partnerData.documentType || '', id_suscription: partnerData.idSuscription || 0, status: _this.requestData.status });
                        console.log('Estado actualizado:', _this.requestData.status);
                    },
                    error: function (error) {
                        console.error('Error al obtener datos del socio:', error);
                        _this.showError('Error al obtener los datos del socio. Por favor, intente nuevamente.');
                    }
                });
            }
            this.mainDocumentUrl = this.requestData.documentFileUrl || null;
            console.log('URL del documento principal:', this.mainDocumentUrl);
        }
        this.pageInfo.setTitle('Solicitud de corrección');
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
                title: 'Historial de cambios',
                path: '/dashboard/legal/correction-requests/history',
                isActive: false,
                isSeparator: false
            },
            { title: '', path: '', isActive: false, isSeparator: true },
            { title: 'Solicitud de corrección', path: '', isActive: true, isSeparator: false }
        ];
        this.pageInfo.setBreadcrumbs(breadcrumbs);
    };
    CorrectionDetailComponent.prototype.initializeView = function () {
        // No initialization needed
    };
    CorrectionDetailComponent.prototype.getCorrectionFile = function () {
        var _a;
        return (_a = this.requestData.files) === null || _a === void 0 ? void 0 : _a.find(function (f) { return f.fileType === 'DOCUMENT_CORRECTION'; });
    };
    CorrectionDetailComponent.prototype.getAdditionalFiles = function () {
        var _a;
        return ((_a = this.requestData.files) === null || _a === void 0 ? void 0 : _a.filter(function (f) { return f.fileType === 'ADDITIONAL_DOCUMENT_CORRECTION'; })) || [];
    };
    CorrectionDetailComponent.prototype.cleanup = function () {
        if (!this.isFromHistory) {
            this.certificateService.clearCorrectionData();
        }
    };
    __decorate([
        core_1.ViewChild('documentModal')
    ], CorrectionDetailComponent.prototype, "documentModal");
    __decorate([
        core_1.ViewChild('observationModal')
    ], CorrectionDetailComponent.prototype, "observationModal");
    __decorate([
        core_1.ViewChild('successModal')
    ], CorrectionDetailComponent.prototype, "successModal");
    __decorate([
        core_1.ViewChild('errorModal')
    ], CorrectionDetailComponent.prototype, "errorModal");
    CorrectionDetailComponent = __decorate([
        core_1.Component({
            selector: 'app-correction-detail',
            standalone: true,
            imports: [common_1.CommonModule, forms_1.FormsModule, ng_inline_svg_2_1.InlineSVGModule, safe_pipe_1.SafePipe],
            template: "\n\t\t<div class=\"d-flex flex-column\">\n\t\t\t<div class=\"d-flex gap-3 mb-4\">\n\t\t\t\t<button class=\"btn btn-document d-inline-flex align-items-center\" (click)=\"viewDocument()\">\n\t\t\t\t\t<span class=\"button-text\">Ver documento adjunto</span>\n\t\t\t\t\t<span [inlineSVG]=\"'assets/money-3.svg'\" class=\"svg-icon svg-icon-2 me-2\"></span>\n\t\t\t\t</button>\n\t\t\t\t<ng-container *ngIf=\"!isFromHistory\">\n\t\t\t\t\t<button\n\t\t\t\t\t\tclass=\"btn btn-warning d-inline-flex align-items-center\"\n\t\t\t\t\t\t(click)=\"correctDocument()\"\n\t\t\t\t\t>\n\t\t\t\t\t\t<span class=\"button-text\">Corregir</span>\n\t\t\t\t\t\t<span [inlineSVG]=\"'assets/Alert.svg'\" class=\"svg-icon svg-icon-2 me-2\"></span>\n\t\t\t\t\t</button>\n\t\t\t\t</ng-container>\n\t\t\t\t<ng-container *ngIf=\"isFromHistory\">\n\t\t\t\t\t<button\n\t\t\t\t\t\tclass=\"btn btn-success d-inline-flex align-items-center\"\n\t\t\t\t\t\t(click)=\"acceptCorrection()\"\n\t\t\t\t\t>\n\t\t\t\t\t\t<span class=\"button-text\">Aceptar</span>\n\t\t\t\t\t\t<span [inlineSVG]=\"'assets/check-icon.svg'\" class=\"svg-icon svg-icon-2 me-2\"></span>\n\t\t\t\t\t</button>\n\t\t\t\t\t<button\n\t\t\t\t\t\tclass=\"btn btn-danger d-inline-flex align-items-center\"\n\t\t\t\t\t\t(click)=\"rejectCorrection()\"\n\t\t\t\t\t>\n\t\t\t\t\t\t<span class=\"button-text\">Rechazar</span>\n\t\t\t\t\t\t<span\n\t\t\t\t\t\t\t[inlineSVG]=\"'./assets/icons/close.svg'\"\n\t\t\t\t\t\t\tclass=\"svg-icon svg-icon-2 me-2\"\n\t\t\t\t\t\t></span>\n\t\t\t\t\t</button>\n\t\t\t\t</ng-container>\n\t\t\t</div>\n\n\t\t\t<div class=\"row g-4\">\n\t\t\t\t<div class=\"col-md-4\">\n\t\t\t\t\t<div class=\"card\">\n\t\t\t\t\t\t<div class=\"card-body p-6\">\n\t\t\t\t\t\t\t<div class=\"d-flex align-items-center mb-2\">\n\t\t\t\t\t\t\t\t<i\n\t\t\t\t\t\t\t\t\tclass=\"fas fa-arrow-left text-gray-500 cursor-pointer me-3\"\n\t\t\t\t\t\t\t\t\t(click)=\"goBack()\"\n\t\t\t\t\t\t\t\t></i>\n\t\t\t\t\t\t\t\t<h2 class=\"subtitle\">Detalles de Correcci\u00F3n</h2>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t<p class=\"description\">Se detalla el contenido de la solicitud.</p>\n\n\t\t\t\t\t\t\t<div class=\"d-flex align-items-center mb-4\">\n\t\t\t\t\t\t\t\t<div class=\"symbol symbol-35px me-3\">\n\t\t\t\t\t\t\t\t\t<span [inlineSVG]=\"'assets/user.svg'\" class=\"svg-icon svg-icon-2\"></span>\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t<div>\n\t\t\t\t\t\t\t\t\t<div class=\"user-name\">{{ requestData.partnerName }}</div>\n\t\t\t\t\t\t\t\t\t<div class=\"date\">\n\t\t\t\t\t\t\t\t\t\t{{ requestData.requestDate | date : 'dd/MM/yyyy - hh:mm a' }}\n\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t</div>\n\n\t\t\t\t\t\t\t<div class=\"mb-4\">\n\t\t\t\t\t\t\t\t<label class=\"status-label\">Status:</label>\n\t\t\t\t\t\t\t\t<span class=\"badge-correction\" [ngClass]=\"getStatusBadgeClass(requestData.status)\">\n\t\t\t\t\t\t\t\t\t{{ getStatusText(requestData.status) }}\n\t\t\t\t\t\t\t\t</span>\n\t\t\t\t\t\t\t</div>\n\n\t\t\t\t\t\t\t<div class=\"mb-4\">\n\t\t\t\t\t\t\t\t<label class=\"form-label\">Campo de texto</label>\n\t\t\t\t\t\t\t\t<div class=\"text-box\">\n\t\t\t\t\t\t\t\t\t{{ requestData.requestMessage }}\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t</div>\n\n\t\t\t\t\t\t\t<div *ngIf=\"getAdditionalFiles().length > 0\" class=\"mb-4\">\n\t\t\t\t\t\t\t\t<label class=\"evidence-label\">Documentos adjuntos:</label>\n\t\t\t\t\t\t\t\t<div\n\t\t\t\t\t\t\t\t\t*ngFor=\"let file of getAdditionalFiles(); let last = last\"\n\t\t\t\t\t\t\t\t\tclass=\"evidence-box\"\n\t\t\t\t\t\t\t\t\t[class.mb-2]=\"!last\"\n\t\t\t\t\t\t\t\t\t(click)=\"viewFile(file)\"\n\t\t\t\t\t\t\t\t>\n\t\t\t\t\t\t\t\t\t<div class=\"d-flex align-items-center justify-content-between\">\n\t\t\t\t\t\t\t\t\t\t<div class=\"d-flex align-items-center\">\n\t\t\t\t\t\t\t\t\t\t\t<i [class]=\"getFileIcon(file.fileName)\" class=\"text-success\"></i>\n\t\t\t\t\t\t\t\t\t\t\t<div class=\"ms-3\">\n\t\t\t\t\t\t\t\t\t\t\t\t<div>{{ file.fileName }}</div>\n\t\t\t\t\t\t\t\t\t\t\t\t<small class=\"text-muted\">Documento adicional</small>\n\t\t\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t\t<span class=\"text-muted\">Ver documento</span>\n\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\n\t\t\t\t<div class=\"col-md-8\">\n\t\t\t\t\t<div class=\"card\">\n\t\t\t\t\t\t<div class=\"card-body p-0\">\n\t\t\t\t\t\t\t<iframe\n\t\t\t\t\t\t\t\t*ngIf=\"mainDocumentUrl\"\n\t\t\t\t\t\t\t\t[src]=\"mainDocumentUrl | safe : 'resourceUrl'\"\n\t\t\t\t\t\t\t\tclass=\"pdf-frame\"\n\t\t\t\t\t\t\t\tframeborder=\"0\"\n\t\t\t\t\t\t\t></iframe>\n\t\t\t\t\t\t\t<div *ngIf=\"!mainDocumentUrl\" class=\"p-4 text-center text-muted\">\n\t\t\t\t\t\t\t\tNo hay documento principal para mostrar\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t</div>\n\n\t\t<ng-template #documentModal let-modal>\n\t\t\t<div class=\"modal-header\">\n\t\t\t\t<h4 class=\"modal-title\">Documento de Identidad</h4>\n\t\t\t\t<button type=\"button\" class=\"btn-close\" (click)=\"modal.dismiss()\"></button>\n\t\t\t</div>\n\t\t\t<div class=\"modal-body\">\n\t\t\t\t<p class=\"text-muted mb-4\">\n\t\t\t\t\tRevise y valide el documento de identidad que el socio ha subido.\n\t\t\t\t</p>\n\n\t\t\t\t<div class=\"mb-4\">\n\t\t\t\t\t<label class=\"form-label\">Nombres</label>\n\t\t\t\t\t<input\n\t\t\t\t\t\ttype=\"text\"\n\t\t\t\t\t\tclass=\"form-control\"\n\t\t\t\t\t\t[value]=\"requestData.partnerName || ''\"\n\t\t\t\t\t\treadonly\n\t\t\t\t\t/>\n\t\t\t\t</div>\n\n\t\t\t\t<div class=\"mb-4\">\n\t\t\t\t\t<label class=\"form-label\">Apellidos</label>\n\t\t\t\t\t<input type=\"text\" class=\"form-control\" [value]=\"requestData.username || ''\" readonly />\n\t\t\t\t</div>\n\n\t\t\t\t<div class=\"mb-4\">\n\t\t\t\t\t<label class=\"form-label\">Tipo de documento</label>\n\t\t\t\t\t<input\n\t\t\t\t\t\ttype=\"text\"\n\t\t\t\t\t\tclass=\"form-control\"\n\t\t\t\t\t\t[value]=\"requestData.identityDocument || ''\"\n\t\t\t\t\t\treadonly\n\t\t\t\t\t/>\n\t\t\t\t</div>\n\n\t\t\t\t<div class=\"mb-4\">\n\t\t\t\t\t<label class=\"form-label\">N\u00FAmero de documento</label>\n\t\t\t\t\t<input\n\t\t\t\t\t\ttype=\"text\"\n\t\t\t\t\t\tclass=\"form-control\"\n\t\t\t\t\t\t[value]=\"requestData.documentNumber || ''\"\n\t\t\t\t\t\treadonly\n\t\t\t\t\t/>\n\t\t\t\t</div>\n\n\t\t\t\t<div class=\"text-center\">\n\t\t\t\t\t<img [src]=\"mainDocumentUrl\" class=\"img-fluid\" alt=\"Documento de identidad\" />\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t\t<div class=\"modal-footer\">\n\t\t\t\t<button type=\"button\" class=\"btn btn-light\" (click)=\"modal.close('Volver')\">Volver</button>\n\t\t\t\t<button type=\"button\" class=\"btn btn-primary\" (click)=\"modal.close('Observar')\">\n\t\t\t\t\tObservar\n\t\t\t\t</button>\n\t\t\t</div>\n\t\t</ng-template>\n\n\t\t<ng-template #observationModal let-modal>\n\t\t\t<div class=\"modal-header\">\n\t\t\t\t<h4 class=\"modal-title\">{{ modal.componentInstance?.title || 'Observar Documento' }}</h4>\n\t\t\t\t<button type=\"button\" class=\"btn-close\" (click)=\"modal.dismiss()\"></button>\n\t\t\t</div>\n\t\t\t<div class=\"modal-body\">\n\t\t\t\t<p class=\"text-muted mb-4\">\n\t\t\t\t\t{{\n\t\t\t\t\t\tmodal.componentInstance?.message ||\n\t\t\t\t\t\t\t'Por favor, indique las observaciones del documento.'\n\t\t\t\t\t}}\n\t\t\t\t</p>\n\n\t\t\t\t<div class=\"mb-4\">\n\t\t\t\t\t<label class=\"form-label\">{{\n\t\t\t\t\t\tmodal.componentInstance?.observationLabel || 'Observaciones'\n\t\t\t\t\t}}</label>\n\t\t\t\t\t<textarea\n\t\t\t\t\t\tclass=\"form-control\"\n\t\t\t\t\t\trows=\"4\"\n\t\t\t\t\t\t[(ngModel)]=\"observationText\"\n\t\t\t\t\t\t[placeholder]=\"\n\t\t\t\t\t\t\tmodal.componentInstance?.placeholder || 'Ingrese sus observaciones aqu\u00ED...'\n\t\t\t\t\t\t\"\n\t\t\t\t\t></textarea>\n\t\t\t\t</div>\n\n\t\t\t\t<div *ngIf=\"requestData.requestMessage\" class=\"mb-4\">\n\t\t\t\t\t<label class=\"form-label\">Mensaje original</label>\n\t\t\t\t\t<div class=\"text-box\">\n\t\t\t\t\t\t{{ requestData.requestMessage }}\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t\t<div class=\"modal-footer\">\n\t\t\t\t<button type=\"button\" class=\"btn btn-light\" (click)=\"modal.close('Volver')\">Volver</button>\n\t\t\t\t<button\n\t\t\t\t\ttype=\"button\"\n\t\t\t\t\t[class]=\"'btn ' + (modal.componentInstance?.confirmButtonClass || 'btn-warning')\"\n\t\t\t\t\t(click)=\"modal.close('Confirmar')\"\n\t\t\t\t>\n\t\t\t\t\t{{ modal.componentInstance?.confirmButtonText || 'Confirmar' }}\n\t\t\t\t</button>\n\t\t\t</div>\n\t\t</ng-template>\n\n\t\t<ng-template #successModal let-modal>\n\t\t\t<div class=\"modal-header\">\n\t\t\t\t<h4 class=\"modal-title\">\u00C9xito</h4>\n\t\t\t\t<button type=\"button\" class=\"btn-close\" (click)=\"modal.dismiss()\"></button>\n\t\t\t</div>\n\t\t\t<div class=\"modal-body text-center\">\n\t\t\t\t<span\n\t\t\t\t\t[inlineSVG]=\"'./assets/icons/check.svg'\"\n\t\t\t\t\tclass=\"svg-icon svg-icon-5x text-success mb-4\"\n\t\t\t\t></span>\n\t\t\t\t<p class=\"text-muted\">\n\t\t\t\t\t{{ modal.componentInstance?.message || 'El documento ha sido observado exitosamente.' }}\n\t\t\t\t</p>\n\t\t\t</div>\n\t\t\t<div class=\"modal-footer\">\n\t\t\t\t<button type=\"button\" class=\"btn btn-success\" (click)=\"modal.close()\">Aceptar</button>\n\t\t\t</div>\n\t\t</ng-template>\n\n\t\t<ng-template #errorModal let-modal>\n\t\t\t<div class=\"modal-header align-items-center\">\n\t\t\t\t<h4 class=\"modal-title d-flex align-items-center gap-2\">\n\t\t\t\t\t<span [inlineSVG]=\"'assets/Alert.svg'\" class=\"svg-icon svg-icon-2 text-warning\"></span>\n\t\t\t\t\t<span>Atenci\u00F3n</span>\n\t\t\t\t</h4>\n\t\t\t\t<button type=\"button\" class=\"btn-close\" (click)=\"modal.dismiss()\"></button>\n\t\t\t</div>\n\t\t\t<div class=\"modal-body\">\n\t\t\t\t<p class=\"text-muted mb-4\">\n\t\t\t\t\t{{ errorMessage }}\n\t\t\t\t</p>\n\t\t\t</div>\n\t\t\t<div class=\"modal-footer\">\n\t\t\t\t<button type=\"button\" class=\"btn btn-warning\" (click)=\"modal.close()\">Aceptar</button>\n\t\t\t</div>\n\t\t</ng-template>\n\t",
            styles: [
                "\n\t\t\t:host {\n\t\t\t\tdisplay: block;\n\t\t\t\tpadding: 2rem;\n\t\t\t\tbackground: white;\n\t\t\t\tborder-radius: 0.475rem;\n\t\t\t}\n\n\t\t\t.title {\n\t\t\t\tfont-family: 'Poppins', sans-serif;\n\t\t\t\tfont-weight: 500;\n\t\t\t\tfont-size: 24px;\n\t\t\t\tcolor: #181c32;\n\t\t\t\tmargin-bottom: 1rem;\n\t\t\t}\n\n\t\t\t.subtitle {\n\t\t\t\tfont-family: 'Poppins', sans-serif;\n\t\t\t\tfont-weight: 600;\n\t\t\t\tfont-size: 20px;\n\t\t\t\tcolor: #181c32;\n\t\t\t\tmargin: 0;\n\t\t\t}\n\n\t\t\t.description {\n\t\t\t\tfont-family: 'Poppins', sans-serif;\n\t\t\t\tfont-weight: 400;\n\t\t\t\tfont-size: 14px;\n\t\t\t\tcolor: #7e8299;\n\t\t\t\tmargin-bottom: 1.5rem;\n\t\t\t}\n\n\t\t\t.user-name {\n\t\t\t\tfont-family: 'Roboto', sans-serif;\n\t\t\t\tfont-weight: 600;\n\t\t\t\tfont-size: 16px;\n\t\t\t\tcolor: #181c32;\n\t\t\t\tmargin-bottom: 4px;\n\t\t\t}\n\n\t\t\t.date {\n\t\t\t\tfont-family: 'Roboto', sans-serif;\n\t\t\t\tfont-weight: 300;\n\t\t\t\tfont-size: 14px;\n\t\t\t\tcolor: #7e8299;\n\t\t\t}\n\n\t\t\t.status-label {\n\t\t\t\tfont-family: 'Roboto', sans-serif;\n\t\t\t\tfont-weight: 400;\n\t\t\t\tfont-size: 16px;\n\t\t\t\tcolor: #181c32;\n\t\t\t\tmargin-right: 0.5rem;\n\t\t\t}\n\n\t\t\t.evidence-label {\n\t\t\t\tfont-family: 'Roboto', sans-serif;\n\t\t\t\tfont-weight: 400;\n\t\t\t\tfont-size: 16px;\n\t\t\t\tcolor: #181c32;\n\t\t\t\tmargin-bottom: 0.5rem;\n\t\t\t\tdisplay: block;\n\t\t\t}\n\n\t\t\t.btn-document,\n\t\t\t.btn-warning {\n\t\t\t\tfont-family: 'Poppins', sans-serif;\n\t\t\t\tfont-weight: 400;\n\t\t\t\tfont-size: 14px;\n\t\t\t\tpadding: 8px 16px;\n\t\t\t\tborder-radius: 8px;\n\t\t\t\theight: 32px;\n\t\t\t\ttransition: all 0.2s ease;\n\t\t\t\twhite-space: nowrap;\n\n\t\t\t\t&:hover {\n\t\t\t\t\tbackground-color: rgba(254, 124, 4, 0.1);\n\t\t\t\t}\n\n\t\t\t\t.svg-icon {\n\t\t\t\t\tdisplay: inline-flex;\n\t\t\t\t\talign-items: center;\n\t\t\t\t\theight: 18px;\n\t\t\t\t\twidth: 18px;\n\t\t\t\t}\n\n\t\t\t\t.button-text {\n\t\t\t\t\tline-height: 1;\n\t\t\t\t}\n\t\t\t}\n\n\t\t\t.btn-document {\n\t\t\t\tbackground-color: transparent !important;\n\t\t\t\tborder: 1px solid #fe7c04 !important;\n\t\t\t\tcolor: #fe7c04 !important;\n\n\t\t\t\t&:hover {\n\t\t\t\t\tbackground-color: rgba(254, 124, 4, 0.1) !important;\n\t\t\t\t}\n\n\t\t\t\t.svg-icon {\n\t\t\t\t\tpath {\n\t\t\t\t\t\tfill: #fe7c04;\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t}\n\n\t\t\t.btn-warning {\n\t\t\t\tbackground-color: #fe7c04;\n\t\t\t\tborder: none;\n\t\t\t\tcolor: #ffffff;\n\n\t\t\t\t&:hover {\n\t\t\t\t\tbackground-color: rgba(254, 124, 4, 0.9);\n\t\t\t\t}\n\n\t\t\t\t.svg-icon {\n\t\t\t\t\tpath {\n\t\t\t\t\t\tfill: #ffffff;\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t}\n\n\t\t\t.evidence-box {\n\t\t\t\tborder: 1px dashed #1b7935;\n\t\t\t\tborder-radius: 12px;\n\t\t\t\tpadding: 8px 16px;\n\t\t\t\tbackground-color: #e8f2ed;\n\t\t\t\tcursor: pointer;\n\t\t\t\twidth: 100%;\n\t\t\t\ttransition: all 0.2s ease;\n\n\t\t\t\t&:hover {\n\t\t\t\t\tborder-style: solid;\n\t\t\t\t\tbackground-color: rgba(27, 121, 53, 0.1);\n\t\t\t\t}\n\n\t\t\t\t.evidence-title {\n\t\t\t\t\tfont-family: 'Roboto', sans-serif;\n\t\t\t\t\tfont-weight: 400;\n\t\t\t\t\tfont-size: 14px;\n\t\t\t\t\tcolor: #181c32;\n\t\t\t\t}\n\n\t\t\t\t.evidence-text {\n\t\t\t\t\tfont-family: 'Roboto', sans-serif;\n\t\t\t\t\tfont-weight: 400;\n\t\t\t\t\tfont-size: 12px;\n\t\t\t\t\tcolor: #7e8299;\n\t\t\t\t}\n\n\t\t\t\ti {\n\t\t\t\t\tfont-size: 24px;\n\t\t\t\t\tcolor: #1b7935;\n\t\t\t\t\tflex-shrink: 0;\n\t\t\t\t\tmargin-right: 12px;\n\t\t\t\t}\n\n\t\t\t\t.ms-3 {\n\t\t\t\t\tmin-width: 0;\n\t\t\t\t\tflex: 1;\n\t\t\t\t\tmargin-right: 12px;\n\n\t\t\t\t\tdiv {\n\t\t\t\t\t\twhite-space: nowrap;\n\t\t\t\t\t\toverflow: hidden;\n\t\t\t\t\t\ttext-overflow: ellipsis;\n\t\t\t\t\t\tmax-width: calc(100% - 24px);\n\t\t\t\t\t\tfont-weight: 500;\n\t\t\t\t\t\tcolor: #181c32;\n\t\t\t\t\t}\n\n\t\t\t\t\tsmall {\n\t\t\t\t\t\tdisplay: block;\n\t\t\t\t\t\twhite-space: nowrap;\n\t\t\t\t\t\toverflow: hidden;\n\t\t\t\t\t\ttext-overflow: ellipsis;\n\t\t\t\t\t\tmax-width: calc(100% - 24px);\n\t\t\t\t\t\tcolor: #7e8299;\n\t\t\t\t\t\tfont-size: 12px;\n\t\t\t\t\t\tmargin-top: 2px;\n\t\t\t\t\t}\n\t\t\t\t}\n\n\t\t\t\t.text-muted {\n\t\t\t\t\tflex-shrink: 0;\n\t\t\t\t\tfont-size: 12px;\n\t\t\t\t}\n\t\t\t}\n\n\t\t\t.card {\n\t\t\t\tborder: none;\n\t\t\t\tbox-shadow: 0px 0px 20px rgba(76, 87, 125, 0.02);\n\t\t\t\tbackground: white;\n\t\t\t\theight: calc(100vh - 250px);\n\t\t\t\tdisplay: flex;\n\t\t\t\tflex-direction: column;\n\t\t\t\toverflow: hidden;\n\t\t\t}\n\n\t\t\t.card-body {\n\t\t\t\tflex: 1;\n\t\t\t\tpadding: 0 !important;\n\t\t\t\tdisplay: flex;\n\t\t\t\tflex-direction: column;\n\t\t\t\toverflow-y: auto;\n\t\t\t}\n\n\t\t\t.p-6 {\n\t\t\t\tpadding: 1.5rem !important;\n\t\t\t\toverflow-y: auto;\n\t\t\t\tmax-height: 100%;\n\t\t\t}\n\n\t\t\t@import '../styles/badges.scss';\n\n\t\t\t.text-box {\n\t\t\t\tborder: 1px solid #e4e6ef;\n\t\t\t\tborder-radius: 0.475rem;\n\t\t\t\tpadding: 1rem;\n\t\t\t\tbackground-color: #ffffff;\n\t\t\t\tcolor: #3f4254;\n\t\t\t\tline-height: 1.5;\n\t\t\t}\n\n\t\t\t.pdf-frame {\n\t\t\t\twidth: 100%;\n\t\t\t\theight: calc(100vh - 200px);\n\t\t\t\tborder: none;\n\t\t\t}\n\n\t\t\t.page-input {\n\t\t\t\theight: 32px;\n\t\t\t\tmin-width: 45px;\n\n\t\t\t\tinput {\n\t\t\t\t\theight: 100%;\n\t\t\t\t\tpadding: 0;\n\t\t\t\t\tfont-size: 0.875rem;\n\t\t\t\t\tbackground-color: transparent;\n\t\t\t\t\tborder: none;\n\t\t\t\t\tcolor: #3f4254;\n\t\t\t\t\ttext-align: center;\n\n\t\t\t\t\t&:focus {\n\t\t\t\t\t\toutline: none;\n\t\t\t\t\t\tbox-shadow: none;\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t}\n\n\t\t\t.zoom-input {\n\t\t\t\theight: 32px;\n\t\t\t\tmin-width: 60px;\n\t\t\t\tdisplay: flex;\n\t\t\t\talign-items: center;\n\t\t\t\tjustify-content: center;\n\t\t\t\tfont-size: 0.875rem;\n\t\t\t\tcolor: #3f4254;\n\t\t\t}\n\n\t\t\t.btn-icon {\n\t\t\t\twidth: 32px;\n\t\t\t\theight: 32px;\n\t\t\t\tpadding: 0;\n\t\t\t\tdisplay: flex;\n\t\t\t\talign-items: center;\n\t\t\t\tjustify-content: center;\n\t\t\t\tbackground: transparent;\n\t\t\t\tborder: none;\n\t\t\t\ttransition: all 0.2s;\n\n\t\t\t\t&:hover:not(.disabled) {\n\t\t\t\t\tbackground: #f3f6f9;\n\t\t\t\t\tborder-radius: 4px;\n\t\t\t\t}\n\n\t\t\t\t&.disabled {\n\t\t\t\t\topacity: 0.5;\n\t\t\t\t\tcursor: not-allowed;\n\t\t\t\t}\n\n\t\t\t\ti {\n\t\t\t\t\tfont-size: 0.875rem;\n\t\t\t\t\tcolor: #7e8299;\n\t\t\t\t}\n\t\t\t}\n\t\t"
            ]
        })
    ], CorrectionDetailComponent);
    return CorrectionDetailComponent;
}());
exports.CorrectionDetailComponent = CorrectionDetailComponent;
