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
var safe_pipe_1 = require("../pipes/safe.pipe");
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
        var files = ((_a = this.formData.files) === null || _a === void 0 ? void 0 : _a.filter(function (f) { return f.fileType === 'DOCUMENT_CORRECTION'; })) || [];
        return files;
    };
    CorrectionFormComponent.prototype.getAdditionalFiles = function () {
        var _a;
        var files = ((_a = this.formData.files) === null || _a === void 0 ? void 0 : _a.filter(function (f) { return f.fileType === 'ADDITIONAL_DOCUMENT_CORRECTION'; })) || [];
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
            // changeDetection: ChangeDetectionStrategy.OnPush,
            template: "\n\t\t<div class=\"d-flex flex-column\">\n\t\t\t<div class=\"d-flex flex-column gap-3 mb-4\" *ngIf=\"formData\">\n\t\t\t\t<!-- Documento Adjunto -->\n\t\t\t\t<div *ngFor=\"let file of getCorrectionFiles()\" class=\"d-flex gap-2\">\n\t\t\t\t\t<button class=\"btn btn-document d-inline-flex align-items-center\" (click)=\"viewFile(file)\">\n\t\t\t\t\t<span class=\"button-text\">Ver documento adjunto</span>\n\t\t\t\t\t<span [inlineSVG]=\"'assets/money-3.svg'\" class=\"svg-icon svg-icon-2 me-2\"></span>\n\t\t\t\t</button>\n\t\t\t\t</div>\n\t\t\t</div>\n\n\t\t\t<div class=\"row g-4\">\n\t\t\t\t<div class=\"col-md-4\">\n\t\t\t\t\t<div class=\"card\">\n\t\t\t\t\t\t<div class=\"card-body p-6\">\n\t\t\t\t\t\t\t<div class=\"d-flex align-items-center mb-2\">\n\t\t\t\t\t\t\t\t<i\n\t\t\t\t\t\t\t\t\tclass=\"fas fa-arrow-left text-gray-500 cursor-pointer me-3\"\n\t\t\t\t\t\t\t\t\t(click)=\"navigateBack()\"\n\t\t\t\t\t\t\t\t></i>\n\t\t\t\t\t\t\t\t<h2 class=\"subtitle\">Generar Certificado</h2>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t<p class=\"description\">\n\t\t\t\t\t\t\t\tValida y rellene todos los campos antes de Generar el Certificado\n\t\t\t\t\t\t\t</p>\n\n\t\t\t\t\t\t\t<form>\n\t\t\t\t\t\t\t\t<div class=\"mb-4\">\n\t\t\t\t\t\t\t\t\t<label class=\"form-label\">Portafolio</label>\n\t\t\t\t\t\t\t\t\t<input\n\t\t\t\t\t\t\t\t\t\ttype=\"text\"\n\t\t\t\t\t\t\t\t\t\tclass=\"form-control\"\n\t\t\t\t\t\t\t\t\t\t[(ngModel)]=\"formData.portfolioId\"\n\t\t\t\t\t\t\t\t\t\t(ngModelChange)=\"onFieldChange('portfolioId', $event)\"\n\t\t\t\t\t\t\t\t\t\tname=\"portfolioId\"\n\t\t\t\t\t\t\t\t\t/>\n\t\t\t\t\t\t\t\t</div>\n\n\t\t\t\t\t\t\t\t<div class=\"mb-4\">\n\t\t\t\t\t\t\t\t\t<label class=\"form-label\">Nombre de Socio*</label>\n\t\t\t\t\t\t\t\t\t<input\n\t\t\t\t\t\t\t\t\t\ttype=\"text\"\n\t\t\t\t\t\t\t\t\t\tclass=\"form-control\"\n\t\t\t\t\t\t\t\t\t\t[(ngModel)]=\"formData.nombreSocio\"\n\t\t\t\t\t\t\t\t\t\t(ngModelChange)=\"onFieldChange('nombreSocio', $event)\"\n\t\t\t\t\t\t\t\t\t\tname=\"nombreSocio\"\n\t\t\t\t\t\t\t\t\t/>\n\t\t\t\t\t\t\t\t</div>\n\n\t\t\t\t\t\t\t\t<div class=\"mb-4\">\n\t\t\t\t\t\t\t\t\t<label class=\"form-label\">Nacionalidad</label>\n\t\t\t\t\t\t\t\t\t<input\n\t\t\t\t\t\t\t\t\t\ttype=\"text\"\n\t\t\t\t\t\t\t\t\t\tclass=\"form-control\"\n\t\t\t\t\t\t\t\t\t\t[(ngModel)]=\"formData.nacionalidad\"\n\t\t\t\t\t\t\t\t\t\t(ngModelChange)=\"onFieldChange('nacionalidad', $event)\"\n\t\t\t\t\t\t\t\t\t\tname=\"nacionalidad\"\n\t\t\t\t\t\t\t\t\t/>\n\t\t\t\t\t\t\t\t</div>\n\n\t\t\t\t\t\t\t\t<div class=\"row mb-4\">\n\t\t\t\t\t\t\t\t\t<div class=\"col-md-6\">\n\t\t\t\t\t\t\t\t\t\t<label class=\"form-label\">Tip. de Documento*</label>\n\t\t\t\t\t\t\t\t\t\t<input\n\t\t\t\t\t\t\t\t\t\t\ttype=\"text\"\n\t\t\t\t\t\t\t\t\t\t\tclass=\"form-control\"\n\t\t\t\t\t\t\t\t\t\t\t[(ngModel)]=\"formData.tipoDocumento\"\n\t\t\t\t\t\t\t\t\t\t\t(ngModelChange)=\"onFieldChange('tipoDocumento', $event)\"\n\t\t\t\t\t\t\t\t\t\t\tname=\"tipoDocumento\"\n\t\t\t\t\t\t\t\t\t\t/>\n\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t<div class=\"col-md-6\">\n\t\t\t\t\t\t\t\t\t\t<label class=\"form-label\">N\u00B0 de Documento</label>\n\t\t\t\t\t\t\t\t\t\t<input\n\t\t\t\t\t\t\t\t\t\t\ttype=\"text\"\n\t\t\t\t\t\t\t\t\t\t\tclass=\"form-control\"\n\t\t\t\t\t\t\t\t\t\t\t[(ngModel)]=\"formData.numeroDocumento\"\n\t\t\t\t\t\t\t\t\t\t\t(ngModelChange)=\"onFieldChange('numeroDocumento', $event)\"\n\t\t\t\t\t\t\t\t\t\t\tname=\"numeroDocumento\"\n\t\t\t\t\t\t\t\t\t\t/>\n\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t</div>\n\n\t\t\t\t\t\t\t\t<div class=\"row mb-4\">\n\t\t\t\t\t\t\t\t\t<div class=\"col-md-6\">\n\t\t\t\t\t\t\t\t\t\t<label class=\"form-label\">Pa\u00EDs de Residencia</label>\n\t\t\t\t\t\t\t\t\t\t<input\n\t\t\t\t\t\t\t\t\t\t\ttype=\"text\"\n\t\t\t\t\t\t\t\t\t\t\tclass=\"form-control\"\n\t\t\t\t\t\t\t\t\t\t\t[(ngModel)]=\"formData.paisResidencia\"\n\t\t\t\t\t\t\t\t\t\t\t(ngModelChange)=\"onFieldChange('paisResidencia', $event)\"\n\t\t\t\t\t\t\t\t\t\t\tname=\"paisResidencia\"\n\t\t\t\t\t\t\t\t\t\t/>\n\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t<div class=\"col-md-6\">\n\t\t\t\t\t\t\t\t\t\t<label class=\"form-label\">Departamento</label>\n\t\t\t\t\t\t\t\t\t\t<input\n\t\t\t\t\t\t\t\t\t\t\ttype=\"text\"\n\t\t\t\t\t\t\t\t\t\t\tclass=\"form-control\"\n\t\t\t\t\t\t\t\t\t\t\t[(ngModel)]=\"formData.departamento\"\n\t\t\t\t\t\t\t\t\t\t\t(ngModelChange)=\"onFieldChange('departamento', $event)\"\n\t\t\t\t\t\t\t\t\t\t\tname=\"departamento\"\n\t\t\t\t\t\t\t\t\t\t/>\n\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t</div>\n\n\t\t\t\t\t\t\t\t<div class=\"mb-4\">\n\t\t\t\t\t\t\t\t\t<label class=\"form-label\">Escala de Totalidad de Membres\u00EDa*</label>\n\t\t\t\t\t\t\t\t\t<input\n\t\t\t\t\t\t\t\t\t\ttype=\"text\"\n\t\t\t\t\t\t\t\t\t\tclass=\"form-control\"\n\t\t\t\t\t\t\t\t\t\t[(ngModel)]=\"formData.escalaTotalidad\"\n\t\t\t\t\t\t\t\t\t\t(ngModelChange)=\"onFieldChange('escalaTotalidad', $event)\"\n\t\t\t\t\t\t\t\t\t\tname=\"escalaTotalidad\"\n\t\t\t\t\t\t\t\t\t\trequired\n\t\t\t\t\t\t\t\t\t/>\n\t\t\t\t\t\t\t\t</div>\n\n\t\t\t\t\t\t\t\t<div class=\"mb-4\">\n\t\t\t\t\t\t\t\t\t<label class=\"form-label\">Nombre de Paquete</label>\n\t\t\t\t\t\t\t\t\t<input\n\t\t\t\t\t\t\t\t\t\ttype=\"text\"\n\t\t\t\t\t\t\t\t\t\tclass=\"form-control\"\n\t\t\t\t\t\t\t\t\t\t[(ngModel)]=\"formData.nombrePaquete\"\n\t\t\t\t\t\t\t\t\t\t(ngModelChange)=\"onFieldChange('nombrePaquete', $event)\"\n\t\t\t\t\t\t\t\t\t\tname=\"nombrePaquete\"\n\t\t\t\t\t\t\t\t\t/>\n\t\t\t\t\t\t\t\t</div>\n\n\t\t\t\t\t\t\t\t<div class=\"row mb-4\">\n\t\t\t\t\t\t\t\t\t<div class=\"col-md-6\">\n\t\t\t\t\t\t\t\t\t\t<label class=\"form-label\">N\u00FAmero total de Acciones</label>\n\t\t\t\t\t\t\t\t\t\t<input\n\t\t\t\t\t\t\t\t\t\t\ttype=\"text\"\n\t\t\t\t\t\t\t\t\t\t\tclass=\"form-control\"\n\t\t\t\t\t\t\t\t\t\t\t[(ngModel)]=\"formData.numeroAcciones\"\n\t\t\t\t\t\t\t\t\t\t\t(ngModelChange)=\"onFieldChange('numeroAcciones', $event)\"\n\t\t\t\t\t\t\t\t\t\t\tname=\"numeroAcciones\"\n\t\t\t\t\t\t\t\t\t\t/>\n\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t<div class=\"col-md-6\">\n\t\t\t\t\t\t\t\t\t\t<label class=\"form-label\">Clase</label>\n\t\t\t\t\t\t\t\t\t\t<input\n\t\t\t\t\t\t\t\t\t\t\ttype=\"text\"\n\t\t\t\t\t\t\t\t\t\t\tclass=\"form-control\"\n\t\t\t\t\t\t\t\t\t\t\t[(ngModel)]=\"formData.clase\"\n\t\t\t\t\t\t\t\t\t\t\t(ngModelChange)=\"onFieldChange('clase', $event)\"\n\t\t\t\t\t\t\t\t\t\t\tname=\"clase\"\n\t\t\t\t\t\t\t\t\t\t/>\n\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t</div>\n\n\t\t\t\t\t\t\t\t<div class=\"row mb-4\">\n\t\t\t\t\t\t\t\t\t<div class=\"col-md-6\">\n\t\t\t\t\t\t\t\t\t\t<label class=\"form-label\">Fecha</label>\n\t\t\t\t\t\t\t\t\t\t<input\n\t\t\t\t\t\t\t\t\t\t\ttype=\"text\"\n\t\t\t\t\t\t\t\t\t\t\tclass=\"form-control\"\n\t\t\t\t\t\t\t\t\t\t\t[(ngModel)]=\"formData.fecha\"\n\t\t\t\t\t\t\t\t\t\t\t(ngModelChange)=\"onFieldChange('fecha', $event)\"\n\t\t\t\t\t\t\t\t\t\t\tname=\"fecha\"\n\t\t\t\t\t\t\t\t\t\t/>\n\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t<div class=\"col-md-6\">\n\t\t\t\t\t\t\t\t\t\t<label class=\"form-label\">{{ formData.isContrato ? 'Cod de Contrato' : 'Cod de Certificado' }}</label>\n\t\t\t\t\t\t\t\t\t\t<input\n\t\t\t\t\t\t\t\t\t\t\ttype=\"text\"\n\t\t\t\t\t\t\t\t\t\t\tclass=\"form-control\"\n\t\t\t\t\t\t\t\t\t\t\t[(ngModel)]=\"formData.codigoCertificado\"\n\t\t\t\t\t\t\t\t\t\t\tname=\"codigoCertificado\"\n\t\t\t\t\t\t\t\t\t\t/>\n\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t</div>\n\n\t\t\t\t\t\t\t\t<!-- Campos adicionales para contratos -->\n\t\t\t\t\t\t\t\t<ng-container *ngIf=\"formData.isContrato\">\n\t\t\t\t\t\t\t\t\t<div class=\"row mb-4\">\n\t\t\t\t\t\t\t\t\t\t<div class=\"col-md-6\">\n\t\t\t\t\t\t\t\t\t\t\t<label class=\"form-label\">Precio del Paquete USD*</label>\n\t\t\t\t\t\t\t\t\t\t\t<input\n\t\t\t\t\t\t\t\t\t\t\t\ttype=\"text\"\n\t\t\t\t\t\t\t\t\t\t\t\tclass=\"form-control\"\n\t\t\t\t\t\t\t\t\t\t\t\t[(ngModel)]=\"formData.precioPaqueteUSD\"\n\t\t\t\t\t\t\t\t\t\t\t\tname=\"precioPaqueteUSD\"\n\t\t\t\t\t\t\t\t\t\t\t/>\n\t\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t\t<div class=\"col-md-6\">\n\t\t\t\t\t\t\t\t\t\t\t<label class=\"form-label\">Mantenimiento USD*</label>\n\t\t\t\t\t\t\t\t\t\t\t<input\n\t\t\t\t\t\t\t\t\t\t\t\ttype=\"text\"\n\t\t\t\t\t\t\t\t\t\t\t\tclass=\"form-control\"\n\t\t\t\t\t\t\t\t\t\t\t\t[(ngModel)]=\"formData.mantenimientoUSD\"\n\t\t\t\t\t\t\t\t\t\t\t\tname=\"mantenimientoUSD\"\n\t\t\t\t\t\t\t\t\t\t\t/>\n\t\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t</div>\n\n\t\t\t\t\t\t\t\t\t<div class=\"mb-4\">\n\t\t\t\t\t\t\t\t\t\t<label class=\"form-label\">Programa de Beneficios*</label>\n\t\t\t\t\t\t\t\t\t\t<div class=\"row\">\n\t\t\t\t\t\t\t\t\t\t\t<div class=\"col-md-6\">\n\t\t\t\t\t\t\t\t\t\t\t\t<div class=\"input-group\">\n\t\t\t\t\t\t\t\t\t\t\t\t\t<span class=\"input-group-text\">Hijos menores</span>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<input\n\t\t\t\t\t\t\t\t\t\t\t\t\t\ttype=\"text\"\n\t\t\t\t\t\t\t\t\t\t\t\t\t\tclass=\"form-control\"\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t[ngModel]=\"formData.programaBeneficios?.hijosMenores || ''\"\n\t\t\t\t\t\t\t\t\t\t\t\t\t\treadonly\n\t\t\t\t\t\t\t\t\t\t\t\t\t\tname=\"hijosMenores\"\n\t\t\t\t\t\t\t\t\t\t\t\t\t/>\n\t\t\t\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t\t\t<div class=\"col-md-6\">\n\t\t\t\t\t\t\t\t\t\t\t\t<div class=\"input-group\">\n\t\t\t\t\t\t\t\t\t\t\t\t\t<span class=\"input-group-text\">Beneficiarios</span>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<input\n\t\t\t\t\t\t\t\t\t\t\t\t\t\ttype=\"text\"\n\t\t\t\t\t\t\t\t\t\t\t\t\t\tclass=\"form-control\"\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t[ngModel]=\"formData.programaBeneficios?.beneficiarios || ''\"\n\t\t\t\t\t\t\t\t\t\t\t\t\t\treadonly\n\t\t\t\t\t\t\t\t\t\t\t\t\t\tname=\"beneficiarios\"\n\t\t\t\t\t\t\t\t\t\t\t\t\t/>\n\t\t\t\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t</div>\n\n\t\t\t\t\t\t\t\t\t<div class=\"mb-4\">\n\t\t\t\t\t\t\t\t\t\t<label class=\"form-label\">N\u00FAmero de Invitados*</label>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<input\n\t\t\t\t\t\t\t\t\t\t\ttype=\"text\"\n\t\t\t\t\t\t\t\t\t\t\tclass=\"form-control\"\n\t\t\t\t\t\t\t\t\t\t\t[(ngModel)]=\"formData.numeroInvitados\"\n\t\t\t\t\t\t\t\t\t\t\treadonly\n\t\t\t\t\t\t\t\t\t\t\tname=\"numeroInvitados\"\n\t\t\t\t\t\t\t\t\t\t/>\n\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t\t<div class=\"mb-4\">\n\t\t\t\t\t\t\t\t\t\t<label class=\"form-label\">Cantidad de suscripciones por familia</label>\n\t\t\t\t\t\t\t\t\t\t\t<input\n\t\t\t\t\t\t\t\t\t\t\ttype=\"text\"\n\t\t\t\t\t\t\t\t\t\t\tclass=\"form-control\"\n\t\t\t\t\t\t\t\t\t\t\t[(ngModel)]=\"formData.countSuscriptionByFamily\"\n\t\t\t\t\t\t\t\t\t\t\t(ngModelChange)=\"onFieldChange('countSuscriptionByFamily', $event)\"\n\t\t\t\t\t\t\t\t\t\t\tname=\"countSuscriptionByFamily\"\n\t\t\t\t\t\t\t\t\t\t/>\n\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t\t<div class=\"mb-4\">\n\t\t\t\t\t\t\t\t\t\t\t<label class=\"form-label\">Membres\u00EDas (seleccione hasta 5)*</label>\n\t\t\t\t\t\t\t\t\t\t\t<div class=\"select-container\">\n\t\t\t\t\t\t\t\t\t\t\t\t<div\n\t\t\t\t\t\t\t\t\t\t\t\t\tclass=\"membership-list\"\n\t\t\t\t\t\t\t\t\t\t\t\t\tstyle=\"width: 100%; min-height: 200px; border-radius: 8px; background-color: white; font-family: 'Poppins', sans-serif; overflow-y: auto;\"\n\t\t\t\t\t\t\t\t\t\t\t\t>\n\t\t\t\t\t\t\t\t\t\t\t\t\t<div \n\t\t\t\t\t\t\t\t\t\t\t\t\t\t*ngFor=\"let membership of availableMemberships\"\n\t\t\t\t\t\t\t\t\t\t\t\t\t\tclass=\"membership-option\"\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t[class.selected]=\"formData.memberships?.includes(membership)\"\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t(click)=\"toggleMembership(membership)\"\n\t\t\t\t\t\t\t\t\t\t\t\t\t\tstyle=\"padding: 12px 15px; margin: 4px 0; cursor: pointer; border-radius: 4px; display: flex; align-items: center;\"\n\t\t\t\t\t\t\t\t\t\t\t\t\t>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t<span class=\"check-icon\" *ngIf=\"formData.memberships?.includes(membership)\">\u2713</span>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t<span class=\"membership-text\">{{ membership }}</span>\n\t\t\t\t\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t\t\t<div class=\"mt-2\">\n\t\t\t\t\t\t\t\t\t\t\t\t<small [class]=\"showError ? 'text-danger' : 'text-muted'\" class=\"d-block\">\n\t\t\t\t\t\t\t\t\t\t\t\t\t{{ showError ? 'Solo puede seleccionar hasta 5 membres\u00EDas' : 'Seleccionados: ' + (formData.memberships?.length || 0) + '/5' }}\n\t\t\t\t\t\t\t\t\t\t\t\t</small>\n\t\t\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t\t</div>\n\n\t\t\t\t\t\t\t\t\t\t<style>\n\t\t\t\t\t\t\t\t\t\t\t.select-container {\n\t\t\t\t\t\t\t\t\t\t\t\tborder: 1px solid #e4e6ef;\n\t\t\t\t\t\t\t\t\t\t\t\tborder-radius: 8px;\n\t\t\t\t\t\t\t\t\t\t\t\toverflow: hidden;\n\t\t\t\t\t\t\t\t\t\t\t\tbackground: white;\n\t\t\t\t\t\t\t\t\t\t\t}\n\n\t\t\t\t\t\t\t\t\t\t\t.membership-option {\n\t\t\t\t\t\t\t\t\t\t\t\tdisplay: flex;\n\t\t\t\t\t\t\t\t\t\t\t\talign-items: center;\n\t\t\t\t\t\t\t\t\t\t\t\tpadding: 12px 15px;\n\t\t\t\t\t\t\t\t\t\t\t\tmargin: 4px;\n\t\t\t\t\t\t\t\t\t\t\t\tcursor: pointer;\n\t\t\t\t\t\t\t\t\t\t\t\tborder-radius: 4px;\n\t\t\t\t\t\t\t\t\t\t\t\ttransition: all 0.2s ease;\n\t\t\t\t\t\t\t\t\t\t\t\tbackground: white;\n\t\t\t\t\t\t\t\t\t\t\t\tcolor: #181c32;\n\t\t\t\t\t\t\t\t\t\t\t}\n\n\t\t\t\t\t\t\t\t\t\t\t.membership-option:hover {\n\t\t\t\t\t\t\t\t\t\t\t\tbackground-color: #fff5eb;\n\t\t\t\t\t\t\t\t\t\t\t}\n\n\t\t\t\t\t\t\t\t\t\t\t.membership-option.selected {\n\t\t\t\t\t\t\t\t\t\t\t\tbackground-color: #fe7c04 !important;\n\t\t\t\t\t\t\t\t\t\t\t\tcolor: white !important;\n\t\t\t\t\t\t\t\t\t\t\t}\n\n\t\t\t\t\t\t\t\t\t\t\t.check-icon {\n\t\t\t\t\t\t\t\t\t\t\t\tmargin-right: 10px;\n\t\t\t\t\t\t\t\t\t\t\t\tfont-weight: bold;\n\t\t\t\t\t\t\t\t\t\t\t}\n\n\t\t\t\t\t\t\t\t\t\t\t.membership-text {\n\t\t\t\t\t\t\t\t\t\t\t\tflex: 1;\n\t\t\t\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t\t\t\t</style>\n\t\t\t\t\t\t\t\t\t<label class=\"form-label\">Numero de Cuota</label>\n\t\t\t\t\t\t\t\t\t\t\t<input\n\t\t\t\t\t\t\t\t\t\t\ttype=\"text\"\n\t\t\t\t\t\t\t\t\t\t\tclass=\"form-control\"\n\t\t\t\t\t\t\t\t\t\t\t[(ngModel)]=\"formData.numberQuote\"\n\t\t\t\t\t\t\t\t\t\t\t(ngModelChange)=\"onFieldChange('numberQuote', $event)\"\n\t\t\t\t\t\t\t\t\t\t\tname=\"numberQuote\"\n\t\t\t\t\t\t\t\t\t\t/>\n\t\t\t\t\t\t\t\t\t\t<label class=\"form-label\">Numero de cuotas de membresias</label>\n\t\t\t\t\t\t\t\t\t\t\t<input\n\t\t\t\t\t\t\t\t\t\t\ttype=\"text\"\n\t\t\t\t\t\t\t\t\t\t\tclass=\"form-control\"\n\t\t\t\t\t\t\t\t\t\t\t[(ngModel)]=\"formData.membershipNumberQuotas\"\n\t\t\t\t\t\t\t\t\t\t\t(ngModelChange)=\"onFieldChange('membershipNumberQuotas', $event)\"\n\t\t\t\t\t\t\t\t\t\t\tname=\"membershipNumberQuotas\"\n\t\t\t\t\t\t\t\t\t\t/>\n\t\t\t\t\t\t\t\t</ng-container>\n\n\t\t\t\t\t\t\t\t<div class=\"form-actions\">\n\t\t\t\t\t\t\t\t\t<button type=\"button\" class=\"btn btn-outline-orange\" (click)=\"cancel()\">\n\t\t\t\t\t\t\t\t\t\tCancelar\n\t\t\t\t\t\t\t\t\t</button>\n\t\t\t\t\t\t\t\t\t<button type=\"button\" class=\"btn btn-orange\" (click)=\"save()\">\n\t\t\t\t\t\t\t\t\t\tGuardar\n\t\t\t\t\t\t\t\t\t</button>\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t</form>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\n\t\t\t\t<div class=\"col-md-8\">\n\t\t\t\t\t<div class=\"card\">\n\t\t\t\t\t\t<div class=\"card-body p-0\">\n\t\t\t\t\t\t\t<iframe\n\t\t\t\t\t\t\t\t[src]=\"pdfUrl | safe : 'resourceUrl'\"\n\t\t\t\t\t\t\t\tclass=\"pdf-frame\"\n\t\t\t\t\t\t\t\tframeborder=\"0\"\n\t\t\t\t\t\t\t\t*ngIf=\"pdfUrl\"\n\t\t\t\t\t\t\t></iframe>\n\t\t\t\t\t\t\t<div *ngIf=\"!pdfUrl\" class=\"p-4 text-center text-muted\">\n\t\t\t\t\t\t\t\tNo hay documento principal para mostrar\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t</div>\n\t",
            styles: [
                "\n\t\t\t:host {\n\t\t\t\tdisplay: block;\n\t\t\t\tpadding: 2rem;\n\t\t\t\tbackground: white;\n\t\t\t\tborder-radius: 0.475rem;\n\t\t\t}\n\n\t\t\t.title {\n\t\t\t\tfont-family: 'Poppins', sans-serif;\n\t\t\t\tfont-weight: 500;\n\t\t\t\tfont-size: 24px;\n\t\t\t\tcolor: #181c32;\n\t\t\t\tmargin-bottom: 1rem;\n\t\t\t}\n\n\t\t\t.subtitle {\n\t\t\t\tfont-family: 'Poppins', sans-serif;\n\t\t\t\tfont-weight: 600;\n\t\t\t\tfont-size: 20px;\n\t\t\t\tcolor: #181c32;\n\t\t\t\tmargin: 0;\n\t\t\t}\n\n\t\t\t.description {\n\t\t\t\tfont-family: 'Poppins', sans-serif;\n\t\t\t\tfont-weight: 400;\n\t\t\t\tfont-size: 14px;\n\t\t\t\tcolor: #7e8299;\n\t\t\t\tmargin-bottom: 1.5rem;\n\t\t\t}\n\n\t\t\t.card {\n\t\t\t\tborder: none;\n\t\t\t\tbox-shadow: 0px 0px 20px rgba(76, 87, 125, 0.02);\n\t\t\t\tbackground: white;\n\t\t\t\theight: calc(100vh - 250px);\n\t\t\t\tdisplay: flex;\n\t\t\t\tflex-direction: column;\n\t\t\t\toverflow: hidden;\n\t\t\t}\n\n\t\t\t.card-body {\n\t\t\t\tflex: 1;\n\t\t\t\tpadding: 0 !important;\n\t\t\t\tdisplay: flex;\n\t\t\t\tflex-direction: column;\n\t\t\t\toverflow-y: auto;\n\t\t\t}\n\n\t\t\t.p-6 {\n\t\t\t\tpadding: 1.5rem !important;\n\t\t\t\toverflow-y: auto;\n\t\t\t\tmax-height: 100%;\n\t\t\t}\n\n\t\t\t.pdf-frame {\n\t\t\t\twidth: 100%;\n\t\t\t\theight: calc(100vh - 200px);\n\t\t\t\tborder: none;\n\t\t\t}\n\n\t\t\t.form-label {\n\t\t\t\tfont-family: 'Poppins', sans-serif;\n\t\t\t\tfont-weight: 400;\n\t\t\t\tfont-size: 14px;\n\t\t\t\tcolor: #363a3e;\n\t\t\t\tmargin-bottom: 8px;\n\t\t\t\tdisplay: block;\n\t\t\t}\n\n\t\t\t.form-control {\n\t\t\t\tborder: 1px solid #e4e6ef;\n\t\t\t\tborder-radius: 16px;\n\t\t\t\tpadding: 8px 16px;\n\t\t\t\tfont-family: 'Poppins', sans-serif;\n\t\t\t\tfont-size: 14px;\n\t\t\t\tcolor: #181d27;\n\t\t\t\theight: 42px;\n\t\t\t\tbackground-color: white;\n\n\t\t\t\t&:focus {\n\t\t\t\t\tborder-color: #fe7c04;\n\t\t\t\t\tbox-shadow: none;\n\t\t\t\t}\n\t\t\t}\n\n\t\t\t.btn-document {\n\t\t\t\tbackground-color: transparent !important;\n\t\t\t\tborder: 1px solid #fe7c04 !important;\n\t\t\t\tcolor: #fe7c04 !important;\n\t\t\t\theight: 32px;\n\t\t\t\tborder-radius: 6px;\n\t\t\t\tpadding: 8px 16px;\n\t\t\t\tfont-family: 'Poppins', sans-serif;\n\t\t\t\tfont-weight: 400;\n\t\t\t\tfont-size: 14px;\n\t\t\t\tdisplay: inline-flex;\n\t\t\t\talign-items: center;\n\t\t\t\tgap: 8px;\n\t\t\t\ttransition: opacity 0.2s ease;\n\n\t\t\t\t&:hover {\n\t\t\t\t\tbackground-color: rgba(254, 124, 4, 0.1) !important;\n\t\t\t\t}\n\n\t\t\t\t.svg-icon {\n\t\t\t\t\tpath {\n\t\t\t\t\t\tfill: #fe7c04;\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t}\n\n\t\t\t.form-actions {\n\t\t\t\tdisplay: flex;\n\t\t\t\tjustify-content: center;\n\t\t\t\tgap: 16px;\n\t\t\t\tmargin-top: 32px;\n\t\t\t\tpadding-top: 24px;\n\t\t\t\tborder-top: 1px solid #e4e6ef;\n\t\t\t}\n\n\t\t\t.btn {\n\t\t\t\tpadding: 8px 16px;\n\t\t\t\tborder-radius: 8px;\n\t\t\t\tfont-family: 'Poppins', sans-serif;\n\t\t\t\tfont-weight: 400;\n\t\t\t\tfont-size: 14px;\n\t\t\t\ttransition: all 0.2s ease;\n\t\t\t\tmin-width: 120px;\n\t\t\t\theight: 42px;\n\t\t\t\tdisplay: inline-flex;\n\t\t\t\talign-items: center;\n\t\t\t\tjustify-content: center;\n\t\t\t}\n\n\t\t\t.btn-outline-orange {\n\t\t\t\tbackground-color: transparent;\n\t\t\t\tborder: 1px solid #fe7c04;\n\t\t\t\tcolor: #fe7c04;\n\t\t\t\theight: 42px;\n\t\t\t\tborder-radius: 6px;\n\t\t\t\tpadding: 0.75rem 1.5rem;\n\t\t\t\tfont-family: 'Poppins', sans-serif;\n\t\t\t\tfont-weight: 500;\n\t\t\t\tfont-size: 14px;\n\t\t\t\tdisplay: inline-flex;\n\t\t\t\talign-items: center;\n\t\t\t\tjustify-content: center;\n\t\t\t\tmin-width: 120px;\n\t\t\t\ttransition: opacity 0.2s ease;\n\n\t\t\t\t&:hover {\n\t\t\t\t\tbackground-color: rgba(254, 124, 4, 0.1);\n\t\t\t\t}\n\t\t\t}\n\n\t\t\t.btn-orange {\n\t\t\t\tbackground-color: #fe7c04;\n\t\t\t\tborder: none;\n\t\t\t\tcolor: white;\n\t\t\t\theight: 42px;\n\t\t\t\tborder-radius: 6px;\n\t\t\t\tpadding: 0.75rem 1.5rem;\n\t\t\t\tfont-family: 'Poppins', sans-serif;\n\t\t\t\tfont-weight: 500;\n\t\t\t\tfont-size: 14px;\n\t\t\t\tdisplay: inline-flex;\n\t\t\t\talign-items: center;\n\t\t\t\tjustify-content: center;\n\t\t\t\tmin-width: 120px;\n\t\t\t\ttransition: opacity 0.2s ease;\n\n\t\t\t\t&:hover {\n\t\t\t\t\tbackground-color: rgba(254, 124, 4, 0.9);\n\t\t\t\t}\n\t\t\t}\n\n\t\t\t.cursor-pointer {\n\t\t\t\tcursor: pointer;\n\t\t\t}\n\t\t"
            ]
        })
    ], CorrectionFormComponent);
    return CorrectionFormComponent;
}());
exports.CorrectionFormComponent = CorrectionFormComponent;
