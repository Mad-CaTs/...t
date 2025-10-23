"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.PdfViewerComponent = void 0;
var core_1 = require("@angular/core");
var environment_1 = require("src/environments/environment");
var PdfViewerComponent = /** @class */ (function () {
    function PdfViewerComponent(sanitizer) {
        this.sanitizer = sanitizer;
        this.PDF_PROXY_URL = environment_1.environment.apiLegal + '/api/v1/legal/documents/proxy';
    }
    PdfViewerComponent.prototype.ngOnInit = function () {
        if (this.pdfUrl) {
            // Usar Google Docs como visor de PDF
            var url = "https://docs.google.com/viewer?url=" + encodeURIComponent(this.pdfUrl.toString()) + "&embedded=true";
            this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
        }
    };
    __decorate([
        core_1.Input()
    ], PdfViewerComponent.prototype, "pdfUrl");
    PdfViewerComponent = __decorate([
        core_1.Component({
            selector: 'app-pdf-viewer',
            template: "\n    <iframe [src]=\"pdfUrl\" width=\"100%\" height=\"600px\" frameborder=\"0\"></iframe>\n  "
        })
    ], PdfViewerComponent);
    return PdfViewerComponent;
}());
exports.PdfViewerComponent = PdfViewerComponent;
