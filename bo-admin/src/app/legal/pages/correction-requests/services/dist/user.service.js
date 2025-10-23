"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.UserService = void 0;
var core_1 = require("@angular/core");
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var environment_1 = require("src/environments/environment");
var UserService = /** @class */ (function () {
    // private readonly PDF_API_URL = 'https://pdfapi-dev.inclub.world/api/v1';
    function UserService(http) {
        this.http = http;
        this.API_URL = environment_1.environment.api;
        this.LEGAL_API_URL = 'http://localhost:8081';
        //private readonly LEGAL_API_URL = environment.apiLegal;
        this.selectedUser = null;
    }
    UserService.prototype.setSelectedUser = function (user) {
        this.selectedUser = user;
    };
    ;
    UserService.prototype.searchUsers = function (searchTerm) {
        var formattedTerm = searchTerm.toLowerCase().trim();
        var body = { username: formattedTerm, typeUser: 1 };
        return this.http.post(this.API_URL + "/api/user/getListUsersOfAdmin/search", body)
            .pipe(operators_1.tap(function (response) { return console.log('Respuesta de la API de búsqueda:', response); }), operators_1.catchError(function (error) {
            console.error('Error en la API de búsqueda:', error);
            return rxjs_1.of([]);
        }));
    };
    UserService.prototype.getUserPortfolios = function (userId) {
        if (!userId) {
            console.error('No se proporcionó ID del usuario');
            return rxjs_1.throwError(function () { return new Error('No se proporcionó ID del usuario'); });
        }
        return this.http.get(this.API_URL + "/api/suscription/user/" + userId).pipe(operators_1.tap(function (response) {
            if (Array.isArray(response) && response.length > 0) {
                console.log('IDs de portafolios:', response.map(function (p) { return p.id; }));
            }
        }), operators_1.catchError(function (error) {
            console.error('Error en API de portafolios:', error);
            if (error.status === 401) {
                return rxjs_1.throwError(function () { return new Error('Sesión expirada. Por favor ingrese nuevamente.'); });
            }
            return rxjs_1.throwError(function () { return error; });
        }));
    };
    UserService.prototype.getSubscriptionData = function (subscriptionId) {
        var _a;
        if (!subscriptionId) {
            console.error('No se proporcionó ID de suscripción');
            return rxjs_1.throwError(function () { return new Error('No se proporcionó ID de suscripción'); });
        }
        if (!((_a = this.selectedUser) === null || _a === void 0 ? void 0 : _a.idUser)) {
            console.error('No se encontró ID del usuario');
            return rxjs_1.throwError(function () { return new Error('No se encontró ID del usuario'); });
        }
        console.log('Obteniendo datos de suscripción:', {
            customerId: this.selectedUser.idUser,
            subscriptionId: subscriptionId
        });
        return this.http.get(this.LEGAL_API_URL + "/api/v1/legal/user-data/complete?customerId=" + this.selectedUser.idUser + "&suscriptionId=" + subscriptionId, {
            headers: { 'Authorization': "Bearer " + localStorage.getItem('token') }
        }).pipe(operators_1.tap(function (response) { return console.log('Datos de suscripción obtenidos:', response); }), operators_1.catchError(function (error) {
            console.error('Error al obtener datos de suscripción:', error);
            return rxjs_1.throwError(function () { return error; });
        }));
    };
    UserService.prototype.generateDocument = function (subscriptionId, userId, isContract) {
        if (isContract === void 0) { isContract = false; }
        return rxjs_1.of({
            success: true,
            pdfBlob: new Blob(['Mock PDF content'], { type: 'application/pdf' })
        });
        /*
        return this.getUserPortfolios(userId).pipe(
          map(portfolios => {
            const portfolio = portfolios.find(p => p.id === subscriptionId);
            if (!portfolio) {
              throw new Error('Portafolio no encontrado');
            }
    
            const familyId = portfolio.pack.idFamilyPackage;
            const documentType = isContract ? '2' : '1';
            
            return this.http.get(`${this.PDF_API_URL}/legal-document/${subscriptionId}/${documentType}/${familyId}/true`, {
              responseType: 'blob'
            });
          }),
          catchError(error => {
            console.error('Error al generar documento:', error);
            return of({
              success: false,
              error: error.message
            });
          })
        );
        */
    };
    UserService = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        })
    ], UserService);
    return UserService;
}());
exports.UserService = UserService;
