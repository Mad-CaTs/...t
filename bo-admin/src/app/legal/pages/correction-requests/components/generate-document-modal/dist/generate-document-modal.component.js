"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.GenerateDocumentModalComponent = void 0;
var core_1 = require("@angular/core");
var common_1 = require("@angular/common");
var forms_1 = require("@angular/forms");
var operators_1 = require("rxjs/operators");
var rxjs_1 = require("rxjs");
var GenerateDocumentModalComponent = /** @class */ (function () {
    function GenerateDocumentModalComponent(activeModal, userService) {
        var _this = this;
        this.activeModal = activeModal;
        this.userService = userService;
        this.documentType = 'Documento';
        this.searchTerm = '';
        this.users = [];
        this.selectedUser = null;
        this.selectedPortfolio = '';
        this.portfolios = [];
        this.showResults = false;
        this.subscriptionId = 0;
        this.searchSubject = new rxjs_1.Subject();
        this.searchSubject.pipe(operators_1.tap(function (term) { return console.log('Término de búsqueda:', term); }), operators_1.debounceTime(300), operators_1.distinctUntilChanged(), operators_1.switchMap(function (term) {
            console.log('Realizando llamada a API con término:', term);
            return _this.userService.searchUsers(term);
        })).subscribe({
            next: function (users) {
                console.log('Usuarios encontrados:', users);
                _this.users = users;
                _this.showResults = users.length > 0;
            },
            error: function (error) {
                console.error('Error al buscar usuarios:', error);
                _this.users = [];
                _this.showResults = false;
            }
        });
    }
    GenerateDocumentModalComponent.prototype.ngOnInit = function () { };
    GenerateDocumentModalComponent.prototype.onSearch = function (event) {
        var term = event.target.value.trim();
        console.log('Entrada de búsqueda cambiada:', term);
        if (term && term.length >= 3) {
            console.log('Iniciando búsqueda para:', term);
            this.searchSubject.next(term);
        }
        else {
            console.log('Término de búsqueda muy corto, limpiando resultados');
            this.users = [];
            this.showResults = false;
        }
    };
    GenerateDocumentModalComponent.prototype.selectUser = function (user) {
        var _this = this;
        console.log('Usuario seleccionado:', user);
        this.selectedUser = user;
        this.userService.setSelectedUser(user);
        this.searchTerm = user.name + " " + user.lastName;
        this.showResults = false;
        this.userService.getUserPortfolios(user.idUser).subscribe({
            next: function (portfolios) {
                console.log('Portafolios cargados:', portfolios);
                _this.portfolios = portfolios;
            },
            error: function (error) {
                console.error('Error al cargar portafolios:', error);
                _this.portfolios = [];
            }
        });
    };
    GenerateDocumentModalComponent.prototype.onPortfolioSelect = function (portfolioId) {
        var _a;
        console.log('Portfolio seleccionado:', portfolioId);
        if (!portfolioId)
            return;
        var selectedPortfolioData = this.portfolios.find(function (p) { return p.id === Number(portfolioId); });
        if (!((_a = selectedPortfolioData === null || selectedPortfolioData === void 0 ? void 0 : selectedPortfolioData.pack) === null || _a === void 0 ? void 0 : _a.idFamilyPackage)) {
            console.error('Portafolio no válido o sin idFamilyPackage');
            return;
        }
        this.subscriptionId = selectedPortfolioData.id;
        this.userService.getSubscriptionData(selectedPortfolioData.id).subscribe({
            next: function (subscriptionData) {
                console.log('Datos de suscripción obtenidos:', {
                    portfolioId: selectedPortfolioData.id,
                    familyPackageId: selectedPortfolioData.pack.idFamilyPackage,
                    subscriptionData: subscriptionData
                });
            },
            error: function (error) {
                console.error('Error al obtener datos de suscripción:', error);
            }
        });
    };
    GenerateDocumentModalComponent.prototype.filterUsers = function (users, term) {
        var normalizedTerm = term.toLowerCase();
        return users.filter(function (user) {
            return user.documentNumber.toLowerCase().includes(normalizedTerm) ||
                user.name.toLowerCase().includes(normalizedTerm) ||
                user.lastName.toLowerCase().includes(normalizedTerm) ||
                user.username.toLowerCase().includes(normalizedTerm);
        });
    };
    Object.defineProperty(GenerateDocumentModalComponent.prototype, "isFormValid", {
        get: function () {
            if (!this.selectedUser || !this.selectedPortfolio)
                return false;
            return !!(this.selectedUser.documentNumber &&
                this.selectedUser.documentName &&
                (this.selectedUser.name + " " + this.selectedUser.lastName).trim());
        },
        enumerable: false,
        configurable: true
    });
    GenerateDocumentModalComponent.prototype.onGenerate = function () {
        var _this = this;
        var _a, _b, _c, _d;
        if (!this.selectedUser || !this.selectedPortfolio) {
            console.error('Falta usuario o portafolio');
            return;
        }
        var selectedPortfolioData = this.portfolios.find(function (p) { return p.id === Number(_this.selectedPortfolio); });
        console.log('Portafolio seleccionado:', selectedPortfolioData);
        if (!selectedPortfolioData) {
            console.error('Portafolio no encontrado con ID:', this.selectedPortfolio);
            return;
        }
        var userData = {
            customerId: this.selectedUser.idUser,
            nombreCompleto: this.selectedUser.name + " " + this.selectedUser.lastName,
            nacionalidad: 'PERUANA',
            tipoDocumento: 'DNI-DOCUMENTO NACIONAL DE IDENTIDAD',
            nrodocument: this.selectedUser.documentNumber,
            distrito: '',
            pais: 'PERÚ',
            portfolioId: selectedPortfolioData.id.toString(),
            nombrePaquete: ((_a = selectedPortfolioData.pack) === null || _a === void 0 ? void 0 : _a.name) || '',
            nombreFamilypackage: ((_b = selectedPortfolioData.pack) === null || _b === void 0 ? void 0 : _b.description) || '',
            acciones: ((_c = selectedPortfolioData.packageDetailResponse) === null || _c === void 0 ? void 0 : _c.numberShares) || 0,
            idsuscription: selectedPortfolioData.id,
            codigoCertificado: null,
            escalaPago: null,
            familyPackageId: (_d = selectedPortfolioData.pack) === null || _d === void 0 ? void 0 : _d.idFamilyPackage
        };
        if (this.selectedUser.nationality)
            userData.nacionalidad = this.selectedUser.nationality;
        if (this.selectedUser.documentType)
            userData.tipoDocumento = this.selectedUser.documentType;
        if (this.selectedUser.district)
            userData.distrito = this.selectedUser.district;
        if (this.selectedUser.country)
            userData.pais = this.selectedUser.country;
        console.log('Cerrando modal con datos:', userData);
        this.activeModal.close(userData);
    };
    __decorate([
        core_1.Input()
    ], GenerateDocumentModalComponent.prototype, "documentType");
    GenerateDocumentModalComponent = __decorate([
        core_1.Component({
            selector: 'app-generate-document-modal',
            standalone: true,
            imports: [common_1.CommonModule, forms_1.FormsModule],
            styles: ["\n    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap');\n\n    :host ::ng-deep .modal-content {\n      border-radius: 16px;\n      border: none;\n      box-shadow: 0px 0px 20px rgba(76, 87, 125, 0.2);\n    }\n\n    .modal-header {\n      padding: 24px;\n      border-bottom: 1px solid #E4E6EF;\n      display: flex;\n      align-items: center;\n      justify-content: space-between;\n    }\n\n    .modal-title {\n      font-family: 'Poppins', sans-serif;\n      font-weight: 600;\n      font-size: 18px;\n      line-height: 28px;\n      letter-spacing: 0;\n      color: #181C32;\n      margin: 0;\n    }\n\n    .modal-body {\n      padding: 24px;\n      background: #FFFFFF;\n    }\n\n    .modal-footer {\n      padding: 16px 24px;\n      border-top: 1px solid #E4E6EF;\n    }\n\n    .text-muted {\n      font-family: 'Poppins', sans-serif;\n      font-weight: 400;\n      font-size: 14px;\n      line-height: 20px;\n      letter-spacing: 0.2px;\n      color: #7E8299;\n      margin-bottom: 24px;\n    }\n\n    .form-label {\n      font-family: 'Poppins', sans-serif;\n      font-weight: 400;\n      font-size: 14px;\n      line-height: 20px;\n      letter-spacing: 0.2px;\n      color: #181C32;\n      margin-bottom: 8px;\n      display: block;\n    }\n\n    .form-control, .form-select {\n      width: 100%;\n      height: 44px;\n      border: 1px solid #E4E6EF;\n      border-radius: 16px;\n      padding: 12px 16px;\n      font-family: 'Poppins', sans-serif;\n      font-size: 14px;\n      line-height: 20px;\n      color: #5E6278;\n      background-color: #FFFFFF;\n      transition: border-color 0.2s ease;\n\n      &:focus {\n        border-color: #FE7C04;\n        box-shadow: none;\n      }\n\n      &::placeholder {\n        color: #A1A5B7;\n      }\n    }\n\n    .form-select {\n      background-image: url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='%23A1A5B7' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M2 5l6 6 6-6'/%3e%3c/svg%3e\");\n      background-repeat: no-repeat;\n      background-position: right 1rem center;\n      background-size: 16px 12px;\n      padding-right: 2.5rem;\n    }\n\n    .btn {\n      height: 44px;\n      padding: 12px 24px;\n      border-radius: 8px;\n      font-family: 'Poppins', sans-serif;\n      font-weight: 500;\n      font-size: 14px;\n      line-height: 20px;\n      display: inline-flex;\n      align-items: center;\n      justify-content: center;\n      transition: all 0.2s ease;\n    }\n\n    .btn-light {\n      background-color: #FFFFFF;\n      border: 1px solid #FE7C04;\n      color: #FE7C04;\n\n      &:hover {\n        background-color: #FFF5ED;\n      }\n    }\n\n    .btn-primary {\n      background-color: #FE7C04;\n      border: none;\n      color: #FFFFFF;\n\n      &:hover {\n        background-color: #E66E00;\n      }\n\n      &:disabled {\n        background-color: #FFB777;\n        cursor: not-allowed;\n      }\n    }\n\n    .featured-icon {\n      width: 24px;\n      height: 24px;\n      margin-right: 8px;\n    }\n\n    .search-icon {\n      position: absolute;\n      right: 16px;\n      top: 50%;\n      transform: translateY(-50%);\n      color: #A1A5B7;\n    }\n\n    .form-group {\n      position: relative;\n      margin-bottom: 16px;\n    }\n\n    .search-results {\n      position: absolute;\n      top: 100%;\n      left: 0;\n      right: 0;\n      background: white;\n      border: 1px solid #E4E6EF;\n      border-radius: 8px;\n      margin-top: 4px;\n      max-height: 200px;\n      overflow-y: auto;\n      z-index: 1000;\n      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);\n    }\n\n    .search-result-item {\n      padding: 12px 16px;\n      cursor: pointer;\n      display: flex;\n      justify-content: space-between;\n      align-items: center;\n      border-bottom: 1px solid #E4E6EF;\n\n      &:last-child {\n        border-bottom: none;\n      }\n\n      &:hover {\n        background-color: #F5F8FA;\n      }\n    }\n\n    .user-info {\n      display: flex;\n      flex-direction: column;\n      gap: 4px;\n    }\n\n    .username {\n      font-family: 'Poppins', sans-serif;\n      font-weight: 600;\n      font-size: 14px;\n      color: #181C32;\n    }\n\n    .name {\n      font-family: 'Poppins', sans-serif;\n      font-size: 12px;\n      color: #7E8299;\n    }\n\n    .document {\n      font-family: 'Poppins', sans-serif;\n      font-size: 12px;\n      color: #7E8299;\n    }\n  "],
            template: "\n    <div class=\"modal-header\">\n      <h5 class=\"modal-title\">\n        <img src=\"assets/Featured icon.svg\" class=\"featured-icon\" alt=\"icon\">\n        Generar {{ documentType }}\n      </h5>\n      <button type=\"button\" class=\"btn-close\" aria-label=\"Close\" (click)=\"activeModal.dismiss()\"></button>\n    </div>\n    <div class=\"modal-body\">\n      <p class=\"text-muted\">Por favor, valide e ingrese los datos del socio para generar el {{ documentType.toLowerCase() }}.</p>\n\n      <div class=\"form-group\">\n        <label class=\"form-label\">Socio</label>\n        <div class=\"position-relative\">\n          <input\n            type=\"text\"\n            class=\"form-control\"\n            placeholder=\"Buscar socio\"\n            [(ngModel)]=\"searchTerm\"\n            (input)=\"onSearch($event)\"\n          />\n          <i class=\"fas fa-search search-icon\"></i>\n        </div>\n        <div class=\"search-results\" *ngIf=\"users.length > 0 && showResults\">\n          <div \n            class=\"search-result-item\" \n            *ngFor=\"let user of users\" \n            (click)=\"selectUser(user)\"\n          >\n            <div class=\"user-info\">\n              <span class=\"username\">{{user.username}}</span>\n              <span class=\"name\">{{user.name}} {{user.lastName}}</span>\n            </div>\n            <small class=\"document\">{{user.documentNumber}}</small>\n          </div>\n        </div>\n      </div>\n\n      <div class=\"form-group\">\n        <label class=\"form-label\">Cod. Usuario</label>\n        <input\n          type=\"text\"\n          class=\"form-control\"\n          [value]=\"selectedUser?.username || ''\"\n          readonly\n        />\n      </div>\n\n      <div class=\"form-group\">\n        <label class=\"form-label\">Portafolio</label>\n        <select \n          class=\"form-select\" \n          [(ngModel)]=\"selectedPortfolio\"\n          [disabled]=\"!selectedUser\"\n          (ngModelChange)=\"onPortfolioSelect($event)\"\n        >\n          <option value=\"\">Seleccione uno</option>\n          <option *ngFor=\"let portfolio of portfolios\" [value]=\"portfolio.id\">\n            {{ portfolio?.pack?.name }} - {{ portfolio?.pack?.description || 'Sin descripci\u00F3n' }}\n          </option>\n        </select>\n      </div>\n    </div>\n    <div class=\"modal-footer\">\n      <button class=\"btn btn-light\" (click)=\"activeModal.dismiss()\">Cancelar</button>\n      <button \n        class=\"btn btn-primary\" \n        [disabled]=\"!isFormValid\"\n        (click)=\"onGenerate()\"\n      >\n        Generar\n      </button>\n    </div>\n  "
        })
    ], GenerateDocumentModalComponent);
    return GenerateDocumentModalComponent;
}());
exports.GenerateDocumentModalComponent = GenerateDocumentModalComponent;
