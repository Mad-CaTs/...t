"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.DocumentNotAvailableModalComponent = void 0;
var core_1 = require("@angular/core");
var common_1 = require("@angular/common");
var ng_inline_svg_2_1 = require("ng-inline-svg-2");
var DocumentNotAvailableModalComponent = /** @class */ (function () {
    function DocumentNotAvailableModalComponent(activeModal) {
        this.activeModal = activeModal;
        this.title = 'Documento no disponible';
        this.message = 'No hay documento disponible para mostrar.';
    }
    __decorate([
        core_1.Input()
    ], DocumentNotAvailableModalComponent.prototype, "title");
    __decorate([
        core_1.Input()
    ], DocumentNotAvailableModalComponent.prototype, "message");
    DocumentNotAvailableModalComponent = __decorate([
        core_1.Component({
            selector: 'app-document-not-available-modal',
            standalone: true,
            imports: [common_1.CommonModule, ng_inline_svg_2_1.InlineSVGModule],
            template: "\n\t\t<div class=\"modal-content\">\n\t\t\t<div class=\"modal-header border-0 justify-content-end\">\n\t\t\t\t<button type=\"button\" class=\"btn-close\" (click)=\"activeModal.dismiss()\"></button>\n\t\t\t</div>\n\t\t\t<div class=\"modal-body text-center pb-0\">\n\t\t\t\t<span class=\"svg-icon svg-icon-5x text-warning mb-4\">\n\t\t\t\t\t<span [inlineSVG]=\"'assets/Alert.svg'\"></span>\n\t\t\t\t</span>\n\t\t\t\t<h4 class=\"modal-title mb-3\">{{ title }}</h4>\n\t\t\t\t<p class=\"text-muted mb-4\">{{ message }}</p>\n\t\t\t</div>\n\t\t\t<div class=\"modal-footer border-0 justify-content-center pb-4\">\n\t\t\t\t<button type=\"button\" class=\"btn btn-orange\" (click)=\"activeModal.close()\">\n\t\t\t\t\tAceptar\n\t\t\t\t</button>\n\t\t\t</div>\n\t\t</div>\n\t",
            styles: [
                "\n\t\t\t:host {\n\t\t\t\tdisplay: block;\n\t\t\t}\n\n\t\t\t.modal-content {\n\t\t\t\tborder-radius: 1rem;\n\t\t\t\tborder: none;\n\t\t\t\tbox-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.1);\n\t\t\t}\n\n\t\t\t.modal-header {\n\t\t\t\tpadding: 1rem;\n\t\t\t}\n\n\t\t\t.modal-body {\n\t\t\t\tpadding: 1.5rem;\n\t\t\t}\n\n\t\t\t.modal-footer {\n\t\t\t\tpadding: 1rem;\n\t\t\t}\n\n\t\t\t.modal-title {\n\t\t\t\tfont-family: 'Poppins', sans-serif;\n\t\t\t\tfont-weight: 600;\n\t\t\t\tfont-size: 1.25rem;\n\t\t\t\tcolor: #181c32;\n\t\t\t}\n\n\t\t\t.text-muted {\n\t\t\t\tfont-family: 'Poppins', sans-serif;\n\t\t\t\tfont-weight: 400;\n\t\t\t\tfont-size: 1rem;\n\t\t\t\tcolor: #7e8299;\n\t\t\t}\n\n\t\t\t.btn-orange {\n\t\t\t\tbackground-color: #fe7c04;\n\t\t\t\tborder: none;\n\t\t\t\tcolor: white;\n\t\t\t\theight: 42px;\n\t\t\t\tborder-radius: 6px;\n\t\t\t\tpadding: 0.75rem 1.5rem;\n\t\t\t\tfont-family: 'Poppins', sans-serif;\n\t\t\t\tfont-weight: 500;\n\t\t\t\tfont-size: 14px;\n\t\t\t\tmin-width: 120px;\n\t\t\t\ttransition: opacity 0.2s ease;\n\n\t\t\t\t&:hover {\n\t\t\t\t\tbackground-color: rgba(254, 124, 4, 0.9);\n\t\t\t\t}\n\t\t\t}\n\n\t\t\t.svg-icon {\n\t\t\t\tdisplay: inline-block;\n\t\t\t\tline-height: 0;\n\t\t\t\t\n\t\t\t\tsvg {\n\t\t\t\t\theight: 50px;\n\t\t\t\t\twidth: 50px;\n\t\t\t\t}\n\n\t\t\t\t&.text-warning {\n\t\t\t\t\tpath {\n\t\t\t\t\t\tfill: #fe7c04;\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t}\n\t\t"
            ]
        })
    ], DocumentNotAvailableModalComponent);
    return DocumentNotAvailableModalComponent;
}());
exports.DocumentNotAvailableModalComponent = DocumentNotAvailableModalComponent;
