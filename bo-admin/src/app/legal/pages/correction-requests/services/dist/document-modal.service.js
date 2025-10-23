"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.DocumentModalService = void 0;
var core_1 = require("@angular/core");
var rxjs_1 = require("rxjs");
var document_not_available_modal_component_1 = require("../components/document-not-available-modal/document-not-available-modal.component");
var DocumentModalService = /** @class */ (function () {
    function DocumentModalService(modalService) {
        this.modalService = modalService;
    }
    DocumentModalService.prototype.showDocumentNotAvailable = function (message) {
        if (message === void 0) { message = 'No hay documento disponible para mostrar.'; }
        var modalRef = this.modalService.open(document_not_available_modal_component_1.DocumentNotAvailableModalComponent, {
            centered: true,
            size: 'sm',
            backdropClass: 'modal-backdrop-dark',
            windowClass: 'modal-custom-orange'
        });
        modalRef.componentInstance.message = message;
        return rxjs_1.from(modalRef.result);
    };
    DocumentModalService = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        })
    ], DocumentModalService);
    return DocumentModalService;
}());
exports.DocumentModalService = DocumentModalService;
