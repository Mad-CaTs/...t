"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.HttpClientInterceptor = void 0;
var core_1 = require("@angular/core");
var cokkies_1 = require("@utils/cokkies");
var environment_1 = require("src/environments/environment");
var HttpClientInterceptor = /** @class */ (function () {
    function HttpClientInterceptor() {
    }
    HttpClientInterceptor.prototype.intercept = function (req, next) {
        // Omitir autorización para todos los endpoints TicketApi y PDF
        if (req.url.startsWith(environment_1.environment.TicketApi) || req.url.startsWith(environment_1.environment.apiPdf)) {
            return next.handle(req);
        }
        if (req.url.includes('/type-wallet-transaction') || req.url.includes('/list/bonus') || req.url.includes('/three/getLevelsAndCommissionsPanelAdmin') ||
            req.url.includes('/solicitudebank') || req.url.includes('/reasonbank') || req.url.includes('/three/listPartnersAdvanced') || req.url.includes('/three/ranges/active') || req.url.includes('/three/listSponsors') || req.url.includes('/three/listSponsors/export') ||
            req.url.includes('/three/listPartnersAdvanced/export')) {
            return next.handle(req);
        }
        var token = cokkies_1.getCokkie('TOKEN');
        //const token = localStorage.getItem('TOKEN');
        //alert(token)
        var clonedRequest = req;
        if (token) {
            clonedRequest = req.clone({
                headers: req.headers.set('Authorization', "Bearer " + token)
            });
        }
        //if (token) {
        //	req = req.clone({ headers: req.headers.set('Authorization', `Bearer ${token}`) });
        //}
        return next.handle(clonedRequest);
    };
    HttpClientInterceptor = __decorate([
        core_1.Injectable()
    ], HttpClientInterceptor);
    return HttpClientInterceptor;
}());
exports.HttpClientInterceptor = HttpClientInterceptor;
