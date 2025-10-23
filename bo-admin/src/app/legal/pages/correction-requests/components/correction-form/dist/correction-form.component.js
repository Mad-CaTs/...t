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
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
exports.CorrectionFormComponent = void 0;
var core_1 = require("@angular/core");
var common_1 = require("@angular/common");
var forms_1 = require("@angular/forms");
var operators_1 = require("rxjs/operators");
var ng_inline_svg_2_1 = require("ng-inline-svg-2");
var safe_pipe_1 = require("../../pipes/safe.pipe");
var CorrectionFormComponent = /** @class */ (function () {
    function CorrectionFormComponent(router, route, userService, certificateService, correctionService, cdRef, location, documentModalService) {
        this.cdRef = cdRef;
        this.location = location;
        this.documentModalService = documentModalService;
        this.availableMemberships = [];
        this.MAX_MEMBERSHIPS = 5;
        this.debug = false;
        this._pdfUrl = '';
        this.isGenerateMode = false;
        this.type = 'certificates';
        this.loading = false;
        this.generatedPdfUrl = null;
        this._formData = {
            portfolioId: '',
            nombreSocio: '',
            nacionalidad: '',
            tipoDocumento: '',
            numeroDocumento: '',
            paisResidencia: '',
            departamento: '',
            escalaTotalidad: null,
            nombrePaquete: '',
            numeroAcciones: '0',
            clase: 'Clase B',
            fecha: new Date().toLocaleDateString('es-PE'),
            codigoCertificado: '',
            customerId: undefined,
            idFamilyPackage: 0,
            idSuscription: 0,
            isContrato: false,
            precioPaqueteUSD: '',
            mantenimientoUSD: '',
            programaBeneficios: {
                hijosMenores: '',
                beneficiarios: ''
            },
            numeroInvitados: '',
            documentFileUrl: '',
            files: [],
            countSuscriptionByFamily: '',
            memberships: [],
            numberQuote: '',
            membershipNumberQuotas: '',
            membershipQuotaPrice: '',
            membershipName: '',
            usufructDescription: '',
            direccion: ''
        };
        this.showError = false;
        this.UNIDADES = [
            '',
            'UN',
            'DOS',
            'TRES',
            'CUATRO',
            'CINCO',
            'SEIS',
            'SIETE',
            'OCHO',
            'NUEVE'
        ];
        this.DECENAS = [
            '',
            'DIEZ',
            'VEINTE',
            'TREINTA',
            'CUARENTA',
            'CINCUENTA',
            'SESENTA',
            'SETENTA',
            'OCHENTA',
            'NOVENTA'
        ];
        this.ESPECIALES = [
            'ONCE',
            'DOCE',
            'TRECE',
            'CATORCE',
            'QUINCE',
            'DIECISEIS',
            'DIECISIETE',
            'DIECIOCHO',
            'DIECINUEVE'
        ];
        this.CENTENAS = [
            '',
            'CIENTO',
            'DOSCIENTOS',
            'TRESCIENTOS',
            'CUATROCIENTOS',
            'QUINIENTOS',
            'SEISCIENTOS',
            'SETECIENTOS',
            'OCHOCIENTOS',
            'NOVECIENTOS'
        ];
        this.router = router;
        this.route = route;
        this.userService = userService;
        this.certificateService = certificateService;
        this.correctionService = correctionService;
    }
    Object.defineProperty(CorrectionFormComponent.prototype, "pdfUrl", {
        get: function () {
            return this._pdfUrl;
        },
        set: function (value) {
            console.log('Estableciendo pdfUrl:', value);
            this._pdfUrl = value;
            this.cdRef.detectChanges();
        },
        enumerable: false,
        configurable: true
    });
    CorrectionFormComponent.prototype.updateFormData = function (data) {
        var _a, _b, _c, _d, _e, _f, _g;
        var updatedFormData = {
            portfolioId: data.portfolioId || data.nombreFamilypackage || '',
            nombreSocio: data.nombreCompleto || '',
            nacionalidad: data.nacionalidad || '',
            tipoDocumento: data.tipoDocumento || '',
            numeroDocumento: data.nrodocument || '',
            paisResidencia: data.pais || '',
            departamento: data.distrito || '',
            escalaTotalidad: data.escalaPago || '',
            nombrePaquete: data.nombrePaquete || '',
            numeroAcciones: (data.acciones || '0').toString(),
            clase: 'Clase B',
            fecha: new Date().toLocaleDateString('es-PE'),
            codigoCertificado: data.nrodocument || '',
            customerId: Number(((_a = data.detail) === null || _a === void 0 ? void 0 : _a.customerId) || data.customerId || 0),
            idFamilyPackage: Number((_b = data.partnerData) === null || _b === void 0 ? void 0 : _b.familyPackageId) || 0,
            idSuscription: Number(((_c = data.detail) === null || _c === void 0 ? void 0 : _c.suscriptionId) || ((_d = data.partnerData) === null || _d === void 0 ? void 0 : _d.suscriptionId) || data.suscriptionId || 0),
            isContrato: (_e = data.isContrato) !== null && _e !== void 0 ? _e : false,
            precioPaqueteUSD: (data.precioPaqueteUSD || '').toString(),
            mantenimientoUSD: (data.mantenimientoUSD || '').toString(),
            programaBeneficios: {
                hijosMenores: (((_f = data.programaBeneficios) === null || _f === void 0 ? void 0 : _f.hijosMenores) || '').toString(),
                beneficiarios: (((_g = data.programaBeneficios) === null || _g === void 0 ? void 0 : _g.beneficiarios) || '').toString()
            },
            numeroInvitados: (data.numeroInvitados || '').toString(),
            documentFileUrl: data.documentFileUrl || '',
            files: data.files || [],
            countSuscriptionByFamily: data.countSuscriptionByFamily || '',
            memberships: data.memberships || [],
            numberQuote: data.numberQuote || '',
            membershipNumberQuotas: data.membershipNumberQuotas || '',
            membershipQuotaPrice: data.membershipQuotaPrice || '0',
            membershipName: data.membershipName || '',
            usufructDescription: data.usufructDescription || '',
            direccion: data.direccion || ''
        };
        console.log('FormData actualizado:', updatedFormData);
        this._formData = updatedFormData;
        this.cdRef.detectChanges();
    };
    CorrectionFormComponent.prototype.initializeProgramaBeneficios = function () {
        if (!this.formData.programaBeneficios) {
            this.formData.programaBeneficios = {
                hijosMenores: '',
                beneficiarios: ''
            };
        }
    };
    Object.defineProperty(CorrectionFormComponent.prototype, "formData", {
        get: function () {
            return __assign(__assign({}, this._formData), { files: this._formData.files || [] });
        },
        set: function (value) {
            console.log('Actualizando formData:', value);
            if (!value)
                return;
            this.updateFormData(value);
        },
        enumerable: false,
        configurable: true
    });
    CorrectionFormComponent.prototype.toggleMembership = function (membership) {
        var _this = this;
        var currentMemberships = this.formData.memberships || [];
        var index = currentMemberships.indexOf(membership);
        var newMemberships;
        if (index === -1) {
            if (currentMemberships.length >= this.MAX_MEMBERSHIPS) {
                this.showError = true;
                setTimeout(function () {
                    _this.showError = false;
                    _this.cdRef.detectChanges();
                }, 3000);
                return;
            }
            newMemberships = __spreadArrays(currentMemberships, [membership]);
        }
        else {
            newMemberships = currentMemberships.filter(function (m) { return m !== membership; });
        }
        this.showError = false;
        this._formData = __assign(__assign({}, this._formData), { memberships: newMemberships });
        this.cdRef.detectChanges();
    };
    CorrectionFormComponent.prototype.ngOnInit = function () {
        var _this = this;
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
        console.log('Iniciando CorrectionFormComponent');
        var state = window.history.state;
        console.log('Estado inicial:', state);
        var customerId = (state === null || state === void 0 ? void 0 : state.customerId) || ((_a = state === null || state === void 0 ? void 0 : state.detail) === null || _a === void 0 ? void 0 : _a.customerId);
        var suscriptionId = (state === null || state === void 0 ? void 0 : state.suscriptionId) || ((_b = state === null || state === void 0 ? void 0 : state.detail) === null || _b === void 0 ? void 0 : _b.suscriptionId);
        console.log('Datos para obtener membresías:', { customerId: customerId, suscriptionId: suscriptionId });
        if (customerId && suscriptionId) {
            this.correctionService.getPackagesByCustomerData(customerId, suscriptionId).subscribe({
                next: function (memberships) {
                    console.log('Membresías obtenidas:', memberships);
                    _this.availableMemberships = memberships;
                    _this.cdRef.detectChanges();
                },
                error: function (error) {
                    console.error('Error al obtener membresías:', error);
                }
            });
        }
        if (this.type === 'contracts' && this.formData.idFamilyPackage) {
            this.correctionService.getPackagesByFamilyId(this.formData.idFamilyPackage).subscribe({
                next: function (memberships) {
                    _this.availableMemberships = memberships;
                    _this.cdRef.detectChanges();
                },
                error: function (error) {
                    console.log('Error al cargar membresias', error);
                }
            });
        }
        if (state) {
            try {
                this.type = this.router.url.includes('/contracts/') ? 'contracts' : 'certificates';
                var isContrato = this.type === 'contracts';
                var _p = state.detail || state || {}, _q = _p.partnerData, partnerData = _q === void 0 ? {} : _q, _r = _p.documentFileUrl, documentFileUrl = _r === void 0 ? '' : _r, _s = _p.files, files = _s === void 0 ? [] : _s;
                console.log('Estado completo:', state);
                console.log('Número de documento en state:', state.nrodocument);
                console.log('Número de documento en partnerData:', partnerData.documentNumber);
                console.log('Datos del socio desde detail:', partnerData);
                var formData = {
                    portfolioId: partnerData.familyPackageName || state.nombreFamilypackage || '',
                    nombreSocio: partnerData.fullName || state.nombreCompleto || '',
                    nacionalidad: partnerData.nationality || state.nacionalidad || '',
                    tipoDocumento: partnerData.documentType || state.tipoDocumento || '',
                    numeroDocumento: partnerData.documentNumber || state.nrodocument || '',
                    paisResidencia: partnerData.country || state.pais || '',
                    departamento: partnerData.district || state.distrito || '',
                    escalaTotalidad: ((_c = this.formData) === null || _c === void 0 ? void 0 : _c.escalaTotalidad) || partnerData.paymentScale || state.escalaPago || '',
                    nombrePaquete: partnerData.packageName || state.nombrePaquete || '',
                    numeroAcciones: (partnerData.numberShares || state.acciones || '0').toString(),
                    clase: 'Clase B',
                    fecha: new Date().toLocaleDateString('es-PE'),
                    codigoCertificado: partnerData.documentNumber || '',
                    customerId: ((_d = state.detail) === null || _d === void 0 ? void 0 : _d.customerId) || state.customerId || partnerData.customerId,
                    idFamilyPackage: partnerData.familyPackageId || state.idFamilyPackage || 0,
                    idSuscription: ((_e = state.detail) === null || _e === void 0 ? void 0 : _e.id_suscription) || state.suscriptionId || ((_f = state.detail) === null || _f === void 0 ? void 0 : _f.suscriptionId) || partnerData.idSuscription,
                    isContrato: isContrato,
                    precioPaqueteUSD: isContrato ? (((_g = partnerData.precioPaqueteUSD) === null || _g === void 0 ? void 0 : _g.toString()) || '') : '',
                    mantenimientoUSD: isContrato ? (((_h = partnerData.mantenimientoUSD) === null || _h === void 0 ? void 0 : _h.toString()) || '') : '',
                    programaBeneficios: {
                        hijosMenores: isContrato ? (((_k = (_j = partnerData.programaBeneficios) === null || _j === void 0 ? void 0 : _j.hijosMenores) === null || _k === void 0 ? void 0 : _k.toString()) || '') : '',
                        beneficiarios: isContrato ? (((_m = (_l = partnerData.programaBeneficios) === null || _l === void 0 ? void 0 : _l.beneficiarios) === null || _m === void 0 ? void 0 : _m.toString()) || '') : ''
                    },
                    numeroInvitados: isContrato ? (((_o = partnerData.numeroInvitados) === null || _o === void 0 ? void 0 : _o.toString()) || '') : '',
                    documentFileUrl: documentFileUrl,
                    files: files
                };
                console.log('Formulario inicializado con:', formData);
                this._formData = formData;
                if (formData.documentFileUrl) {
                    this.pdfUrl = formData.documentFileUrl;
                }
                this.cdRef.detectChanges();
            }
            catch (error) {
                console.error('Error al procesar el estado:', error);
            }
        }
        else {
            console.error('No hay estado de navegación disponible');
        }
    };
    CorrectionFormComponent.prototype.ngAfterViewInit = function () {
        this.cdRef.detectChanges();
    };
    CorrectionFormComponent.prototype.ngOnChanges = function (changes) {
        console.log('Cambios detectados:', changes);
        console.log('PDF URL actual:', this.pdfUrl);
        console.log('Formulario actual:', this.formData);
    };
    CorrectionFormComponent.prototype.viewMainDocument = function () {
        if (this.formData.documentFileUrl) {
            window.open(this.formData.documentFileUrl, '_blank');
        }
        else {
            console.warn('No hay documento principal disponible');
            this.documentModalService.showDocumentNotAvailable('No hay documento principal para mostrar.').subscribe();
        }
    };
    CorrectionFormComponent.prototype.viewFile = function (file) {
        console.log('Intentando abrir archivo', file);
        if (file.url || file.s3Url) {
            window.open(file.url || file.s3Url, '_blank');
        }
        else {
            console.warn('No hay archivos disponibles');
            this.documentModalService.showDocumentNotAvailable('No hay archivos disponibles').subscribe();
        }
    };
    CorrectionFormComponent.prototype.getCorrectionFiles = function () {
        var _a;
        var files = ((_a = this.formData.files) === null || _a === void 0 ? void 0 : _a.filter(function (f) {
            return f.fileType === 'DOCUMENT_CORRECTION' && (f.url || f.s3Url);
        })) || [];
        console.log('Archivos de corrección filtrados:', files);
        return files;
    };
    CorrectionFormComponent.prototype.getAdditionalFiles = function () {
        var _a;
        var files = ((_a = this.formData.files) === null || _a === void 0 ? void 0 : _a.filter(function (f) {
            return f.fileType === 'ADDITIONAL_DOCUMENT_CORRECTION' && (f.url || f.s3Url);
        })) || [];
        console.log('Archivos adicionales filtrados:', files);
        return files;
    };
    CorrectionFormComponent.prototype.cancel = function () {
        this.navigateBack();
    };
    CorrectionFormComponent.prototype.numberToWords = function (number) {
        if (!number || isNaN(number))
            return 'CERO';
        if (number === 0)
            return 'CERO';
        var partes = number.toString().split('.');
        var entero = Math.abs(parseInt(partes[0]));
        var decimales = partes[1] ? parseInt(partes[1].substring(0, 2)) : 0;
        var resultado = this.convertirEntero(entero);
        resultado += ' CON ' + (decimales.toString().padEnd(2, '0')) + '/100 DOLARES';
        return resultado;
    };
    CorrectionFormComponent.prototype.convertirEntero = function (number) {
        if (number === 0)
            return '';
        if (number === 1000000)
            return 'UN MILLON';
        if (number === 100)
            return 'CIEN';
        if (number >= 1000000) {
            var millones = Math.floor(number / 1000000);
            var resto = number % 1000000;
            return (millones === 1 ? 'UN MILLON' : this.convertirEntero(millones) + 'MILLONES') +
                (resto > 0 ? ' ' + this.convertirEntero(resto) : '');
        }
        if (number >= 1000) {
            var miles = Math.floor(number / 1000);
            var resto = number % 1000;
            return (miles === 1 ? 'MIL' : this.convertirEntero(miles) + 'MIL') +
                (resto > 0 ? '' + this.convertirEntero(resto) : '');
        }
        if (number >= 100) {
            var centena = Math.floor(number / 100);
            var resto = number % 100;
            return this.CENTENAS[centena] + (resto > 0 ? ' ' + this.convertirEntero(resto) : '');
        }
        if (number >= 20) {
            var decena = Math.floor(number / 10);
            var unidad = number % 10;
            return this.DECENAS[decena] + (unidad > 0 ? 'Y' + this.UNIDADES[unidad] : '');
        }
        if (number >= 11 && number < +19) {
            return this.ESPECIALES[number - 11];
        }
        return this.UNIDADES[number];
    };
    CorrectionFormComponent.prototype.generateCorrectionCertificate = function () {
        var _this = this;
        if (!this.formData.customerId || !this.formData.idSuscription || !this.formData.idFamilyPackage || !this.formData.escalaTotalidad) {
            console.warn('Faltan campos requeridos:', {
                customerId: this.formData.customerId,
                idSuscription: this.formData.idSuscription,
                idFamilyPackage: this.formData.idFamilyPackage,
                escalaTotalidad: this.formData.escalaTotalidad
            });
            this.certificateService.showRequiredFieldsError().subscribe();
            return;
        }
        var state = window.history.state;
        var _a = ((state === null || state === void 0 ? void 0 : state.detail) || state || {}).partnerData, partnerData = _a === void 0 ? {} : _a;
        if (this.type === 'contracts') {
            var now = new Date();
            var contractData_1 = {
                username: this.formData.nombreSocio,
                countSuscriptionByFamily: "",
                creationDateYear: now.getFullYear().toString(),
                creationDateDay: now.getDate().toString(),
                creationDateMonth: now.getMonth().toString(),
                numberShares: this.formData.numeroAcciones,
                numberSharesLetter: this.numberToWords(Number(this.formData.numeroAcciones)),
                packageName: this.formData.nombrePaquete,
                memberships: [],
                priceMembership: this.formData.precioPaqueteUSD,
                amountLetter: this.numberToWords(Number(this.formData.precioPaqueteUSD)),
                numberQuote: "",
                membershipInitialPrice: "",
                membershipNumberQuotas: "",
                membershipQuotaPrice: "",
                membershipName: this.formData.nombrePaquete,
                usufructDescription: "",
                membershipMaintenance: this.formData.mantenimientoUSD,
                membershipMaintenanceLetter: this.numberToWords(Number(this.formData.mantenimientoUSD)),
                name: this.formData.nombreSocio,
                documentNumber: this.formData.numeroDocumento,
                document: this.formData.tipoDocumento,
                direction: this.formData.paisResidencia + " " + this.formData.departamento,
                nombre: this.formData.nombreSocio.split(' ')[0],
                apellido: this.formData.nombreSocio.split(' ').slice(1).join(' ')
            };
            this.correctionService.getPackagesByFamilyId(this.formData.idFamilyPackage || 0).subscribe({
                next: function (memberships) {
                    contractData_1.memberships = memberships;
                    _this.certificateService.generateCorrectionContract(_this.formData.idSuscription || 0, _this.formData.customerId || 0, contractData_1).pipe(operators_1.finalize(function () { return (_this.loading = false); })).subscribe({
                        next: function (response) {
                            console.log("Contrato generado:", response);
                            var documnetUrl = response.data[0].documento;
                            window.open(documnetUrl, '_blank');
                            var correctionRequest = {
                                customerId: _this.formData.customerId,
                                suscriptionId: _this.formData.idSuscription,
                                documentId: 2,
                                profileType: 'ADMINISTRATOR',
                                requestMessage: "Actualizacion de contrato para " + _this.formData.nombreSocio,
                                documentNumber: _this.formData.numeroDocumento,
                                documentFileUrl: documnetUrl,
                                files: __spreadArrays((_this.formData.files || []), [
                                    {
                                        s3Url: documnetUrl,
                                        fileName: "contrato_correction_" + _this.formData.numeroDocumento + ".pdf",
                                        fileType: 'DOCUMENT_CORRECTION',
                                        uploadedAt: new Date().toISOString()
                                    }
                                ]),
                                history: [
                                    {
                                        status: 1,
                                        profileType: 'ADMINISTRATOR',
                                        message: 'Solicitud de correction actualizada'
                                    }
                                ].map(function (item) { return (__assign(__assign({}, item), { status: item.status.toString() })); })
                            };
                            _this.correctionService.createCorrectionRequest(correctionRequest).subscribe({
                                next: function () {
                                    _this.certificateService.showGenerationSuccess().subscribe(function () {
                                        void _this.router.navigate(['/dashboard/legal/correction-requests', _this.type]);
                                    });
                                },
                                error: function (error) {
                                    _this.certificateService.showRequiredFieldsError().subscribe();
                                }
                            });
                        },
                        error: function (error) {
                            console.log('Error al generar el contrato:', error);
                            _this.certificateService.showRequiredFieldsError().subscribe();
                        }
                    });
                },
                error: function (error) {
                    console.log('Error al obtener paquetes:', error);
                    _this.certificateService.showRequiredFieldsError().subscribe();
                }
            });
        }
        else {
            var correctionData = {
                nombre: this.formData.nombreSocio.split(' ')[0] || '',
                apellido: this.formData.nombreSocio.split(' ').slice(1).join(' ') || '',
                nacionalidad: this.formData.nacionalidad,
                tipoDocumento: this.formData.tipoDocumento,
                dni: this.formData.numeroDocumento,
                domicilio: this.formData.paisResidencia + this.formData.departamento,
                escala: this.formData.escalaTotalidad || partnerData.paymentScale || state.escalaPago || '',
                tipoPaquete: this.formData.nombrePaquete,
                acciones: this.formData.numeroAcciones,
                lugarFirma: this.formData.departamento,
                dia: new Date().getDate().toString(),
                mes: new Date().toLocaleDateString('es-PE', {
                    month: 'long'
                }),
                anio: new Date().getFullYear().toString(),
                numeroCertificado: null
            };
            this.loading = true;
            this.certificateService.generateCorrectionCertificate(this.formData.idSuscription, this.formData.customerId, correctionData).pipe(operators_1.finalize(function () { return (_this.loading = false); })).subscribe({
                next: function (response) {
                    var documentUrl = response.data[0].documento;
                    window.open(documentUrl, '_blank');
                    var correctionRequest = {
                        customerId: _this.formData.customerId,
                        suscriptionId: _this.formData.idSuscription,
                        documentId: _this.type === 'contracts' ? 2 : 1,
                        profileType: 'ADMINISTRATOR',
                        requestMessage: "Actualizacion de " + (_this.type === 'contracts' ? 'contrato' : 'certificado') + " para " + _this.formData.nombreSocio,
                        documentNumber: _this.formData.numeroDocumento,
                        documentFileUrl: documentUrl,
                        files: __spreadArrays((_this.formData.files || []), [
                            {
                                s3Url: documentUrl,
                                fileName: "certificado_correction_" + _this.formData.numeroDocumento + ".pdf",
                                fileType: 'DOCUMENT_CORRECTION',
                                uploadedAt: new Date().toISOString()
                            }
                        ]),
                        history: [
                            {
                                status: 1,
                                profileType: 'ADMINISTRATOR',
                                message: 'Solicitud de correccion actualizada'
                            }
                        ].map(function (item) { return (__assign(__assign({}, item), { status: item.status.toString() })); })
                    };
                    _this.correctionService.createCorrectionRequest(correctionRequest).subscribe({
                        next: function () {
                            window.open(documentUrl, '_blank');
                            _this.certificateService.showGenerationSuccess().subscribe(function () {
                                void _this.router.navigate(['/dashboard/legal/correction-requests', _this.type]);
                            });
                        },
                        error: function (error) {
                            console.error('Error al guardar la solicitud:', error);
                            _this.certificateService.showRequiredFieldsError().subscribe();
                        }
                    });
                },
                error: function (error) {
                    console.log('Error al guardar la solicitud:', error);
                    _this.certificateService.showRequiredFieldsError().subscribe();
                }
            });
        }
    };
    CorrectionFormComponent.prototype.save = function () {
        /* console.log('Estado actual del formulario:', {
            formData: this.formData,
            pdfUrl: this.pdfUrl
        });

        this.loading = true;

        if (!this.formData.customerId || !this.formData.idSuscription || !this.formData.idFamilyPackage) {
            console.warn('Faltan campos requeridos:', {
                customerId: this.formData.customerId,
                idSuscription: this.formData.idSuscription,
                idFamilyPackage: this.formData.idFamilyPackage
            });
            this.certificateService.showRequiredFieldsError().subscribe();
            this.loading = false;
            return;
        }

        const correctionData: any = {
            customerId: Number(this.formData.customerId),
            suscriptionId: Number(this.formData.idSuscription),
            documentId: this.type === 'contracts' ? 2 : 1,
            profileType: 'ADMINISTRATOR',
            requestMessage: `Actualización de ${this.type === 'contracts' ? 'contrato' : 'certificado'} para ${this.formData.nombreSocio}`,
            documentNumber: this.formData.numeroDocumento,
            documentFileUrl: this.formData.documentFileUrl,
            files: this.formData.files || [],
            history: [
                {
                    status: 1,
            profileType: 'ADMINISTRATOR',
            message: 'Solicitud de corrección actualizada'
                }
            ].map(item => ({
                ...item,
                status: item.status.toString()
            }))
        };

        console.log('Guardando datos corregidos:', correctionData);

        this.correctionService.createCorrectionRequest(correctionData)
            .pipe(finalize(() => (this.loading = false)))
            .subscribe({
                next: (response: any) => {
                    console.log('Respuesta del servidor:', response);
                    this.certificateService.showGenerationSuccess().subscribe(() => {
                        void this.router.navigate(['/dashboard/legal/correction-requests', this.type]);
                    });
                },
                error: (error: Error) => {
                    console.error('Error al generar el certificado:', error);
                    this.certificateService.showRequiredFieldsError().subscribe();
                }
            }); */
        this.generateCorrectionCertificate();
    };
    CorrectionFormComponent.prototype.navigateBack = function () {
        var path = this.router.url.includes('/contracts') ? 'contracts' : 'certificates';
        void this.router.navigate(['/dashboard/legal/correction-requests', path]);
    };
    CorrectionFormComponent.prototype.onFieldChange = function (field, value) {
        var _a;
        this._formData = __assign(__assign({}, this.formData), (_a = {}, _a[field] = value, _a));
        this.cdRef.detectChanges();
    };
    CorrectionFormComponent.prototype.onEscalaTotalidadChange = function (value) {
        this._formData = __assign(__assign({}, this._formData), { escalaTotalidad: value || '' });
        this.cdRef.detectChanges();
    };
    CorrectionFormComponent.prototype.updateProgramaBeneficios = function (field, value) {
        if (!this.formData.programaBeneficios) {
            this.formData.programaBeneficios = {
                hijosMenores: '',
                beneficiarios: ''
            };
        }
        this.formData.programaBeneficios[field] = value;
        this.cdRef.detectChanges();
    };
    CorrectionFormComponent = __decorate([
        core_1.Component({
            selector: 'app-correction-form',
            standalone: true,
            imports: [common_1.CommonModule, forms_1.FormsModule, ng_inline_svg_2_1.InlineSVGModule, safe_pipe_1.SafePipe],
            templateUrl: './correction-form.component.html',
            styleUrls: ['./correction-form.component.scss']
        })
    ], CorrectionFormComponent);
    return CorrectionFormComponent;
}());
exports.CorrectionFormComponent = CorrectionFormComponent;
