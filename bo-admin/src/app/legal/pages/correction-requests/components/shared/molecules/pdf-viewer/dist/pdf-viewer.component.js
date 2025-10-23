"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.PdfViewerComponent = void 0;
var core_1 = require("@angular/core");
var common_1 = require("@angular/common");
var pdfjsLib = require("pdfjs-dist");
pdfjsLib.GlobalWorkerOptions.workerSrc = 'assets/pdfjs/pdf.worker.min.js';
var PdfViewerComponent = /** @class */ (function () {
    function PdfViewerComponent() {
        this._pdfUrl = '';
        this.currentPage = 1;
        this.totalPages = 0;
        this.scale = 1;
        this.rotation = 0;
        this.pdfDoc = null;
        this.Math = Math;
    }
    Object.defineProperty(PdfViewerComponent.prototype, "pdfUrl", {
        get: function () {
            return this._pdfUrl;
        },
        set: function (value) {
            console.log('Nueva URL de PDF:', value);
            this._pdfUrl = value;
            if (this._pdfUrl) {
                this.loadPdf();
            }
        },
        enumerable: false,
        configurable: true
    });
    PdfViewerComponent.prototype.ngAfterViewInit = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.pdfUrl) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.loadPdf()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        });
    };
    PdfViewerComponent.prototype.loadPdf = function () {
        return __awaiter(this, void 0, void 0, function () {
            var context, loadingTask, _a, error_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!this.canvas || !this._pdfUrl) {
                            console.log('No hay canvas o URL:', { canvas: !!this.canvas, url: this._pdfUrl });
                            return [2 /*return*/];
                        }
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 4, , 5]);
                        console.log('Cargando PDF desde:', this._pdfUrl);
                        context = this.canvas.nativeElement.getContext('2d');
                        if (context) {
                            context.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
                        }
                        loadingTask = pdfjsLib.getDocument(this._pdfUrl);
                        _a = this;
                        return [4 /*yield*/, loadingTask.promise];
                    case 2:
                        _a.pdfDoc = _b.sent();
                        this.totalPages = this.pdfDoc.numPages;
                        this.currentPage = 1;
                        this.scale = 1;
                        this.rotation = 0;
                        console.log('PDF cargado, renderizando página');
                        return [4 /*yield*/, this.renderPage()];
                    case 3:
                        _b.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        error_1 = _b.sent();
                        console.error('Error loading PDF:', error_1);
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    PdfViewerComponent.prototype.renderPage = function () {
        return __awaiter(this, void 0, void 0, function () {
            var page, viewport, canvas, context, renderContext;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.pdfDoc)
                            return [2 /*return*/];
                        return [4 /*yield*/, this.pdfDoc.getPage(this.currentPage)];
                    case 1:
                        page = _a.sent();
                        viewport = page.getViewport({ scale: this.scale, rotation: this.rotation });
                        canvas = this.canvas.nativeElement;
                        context = canvas.getContext('2d');
                        if (!context)
                            return [2 /*return*/];
                        canvas.height = viewport.height;
                        canvas.width = viewport.width;
                        renderContext = {
                            canvasContext: context,
                            viewport: viewport
                        };
                        return [4 /*yield*/, page.render(renderContext).promise];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    PdfViewerComponent.prototype.onPageChange = function (event) {
        return __awaiter(this, void 0, void 0, function () {
            var newPage;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        newPage = parseInt(event.target.value);
                        if (!(newPage && newPage > 0 && newPage <= this.totalPages)) return [3 /*break*/, 2];
                        this.currentPage = newPage;
                        return [4 /*yield*/, this.renderPage()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        });
    };
    PdfViewerComponent.prototype.zoomIn = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(this.scale < 2)) return [3 /*break*/, 2];
                        this.scale += 0.1;
                        return [4 /*yield*/, this.renderPage()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        });
    };
    PdfViewerComponent.prototype.zoomOut = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(this.scale > 0.5)) return [3 /*break*/, 2];
                        this.scale -= 0.1;
                        return [4 /*yield*/, this.renderPage()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        });
    };
    PdfViewerComponent.prototype.rotate = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.rotation = (this.rotation + 90) % 360;
                        return [4 /*yield*/, this.renderPage()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    PdfViewerComponent.prototype.toggleFullscreen = function () {
        var element = this.container.nativeElement;
        if (!document.fullscreenElement) {
            element.requestFullscreen();
        }
        else {
            document.exitFullscreen();
        }
    };
    PdfViewerComponent.prototype.download = function () {
        var link = document.createElement('a');
        link.href = this.pdfUrl;
        link.download = 'documento.pdf';
        link.click();
    };
    PdfViewerComponent.prototype.print = function () {
        var _a;
        (_a = window.open(this.pdfUrl, '_blank')) === null || _a === void 0 ? void 0 : _a.print();
    };
    __decorate([
        core_1.Input()
    ], PdfViewerComponent.prototype, "pdfUrl");
    __decorate([
        core_1.ViewChild('pdfCanvas')
    ], PdfViewerComponent.prototype, "canvas");
    __decorate([
        core_1.ViewChild('pdfContent')
    ], PdfViewerComponent.prototype, "container");
    PdfViewerComponent = __decorate([
        core_1.Component({
            selector: 'app-pdf-viewer',
            standalone: true,
            imports: [common_1.CommonModule],
            template: "\n    <div class=\"pdf-container\">\n      <div class=\"pdf-toolbar d-flex align-items-center justify-content-between px-4 py-2 border-bottom\">\n        <div class=\"d-flex align-items-center\">\n          <div class=\"page-input d-flex align-items-center bg-white rounded border me-2\">\n            <input\n              type=\"text\"\n              class=\"form-control form-control-sm border-0 text-center\"\n              [value]=\"currentPage\"\n              (change)=\"onPageChange($event)\"\n            />\n          </div>\n          <span class=\"text-gray-600\">/</span>\n          <span class=\"text-gray-600 ms-2\">{{ totalPages }}</span>\n        </div>\n        <div class=\"d-flex align-items-center\">\n          <button class=\"btn btn-icon btn-sm\" [class.disabled]=\"scale <= 0.5\" (click)=\"zoomOut()\">\n            <i class=\"fas fa-minus\"></i>\n          </button>\n          <div class=\"zoom-input bg-white rounded border mx-2 px-2\">\n            <span>{{ Math.round(scale * 100) }}%</span>\n          </div>\n          <button class=\"btn btn-icon btn-sm\" [class.disabled]=\"scale >= 2\" (click)=\"zoomIn()\">\n            <i class=\"fas fa-plus\"></i>\n          </button>\n          <button class=\"btn btn-icon btn-sm ms-2\" (click)=\"toggleFullscreen()\">\n            <i class=\"fas fa-expand\"></i>\n          </button>\n          <button class=\"btn btn-icon btn-sm\" (click)=\"rotate()\">\n            <i class=\"fas fa-redo\"></i>\n          </button>\n          <button class=\"btn btn-icon btn-sm\" (click)=\"download()\">\n            <i class=\"fas fa-download\"></i>\n          </button>\n          <button class=\"btn btn-icon btn-sm\" (click)=\"print()\">\n            <i class=\"fas fa-print\"></i>\n          </button>\n        </div>\n      </div>\n      <div class=\"pdf-content\" #pdfContent>\n        <canvas #pdfCanvas></canvas>\n      </div>\n    </div>\n  ",
            styles: ["\n    :host {\n      display: flex;\n      flex-direction: column;\n      height: 100%;\n    }\n\n    .pdf-container {\n      flex: 1;\n      display: flex;\n      flex-direction: column;\n      background: #BFBFBF;\n      height: 100%;\n    }\n\n    .pdf-toolbar {\n      background: white;\n      border-bottom: 1px solid #e4e6ef;\n      padding: 0.75rem 1.5rem;\n    }\n\n    .pdf-content {\n      flex: 1;\n      overflow: auto;\n      display: flex;\n      justify-content: center;\n      align-items: flex-start;\n      padding: 2rem;\n      background: #BFBFBF;\n      min-height: 0; /* Importante para que el scroll funcione correctamente */\n    }\n\n    canvas {\n      background: white;\n      box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);\n      border-radius: 0.475rem;\n    }\n\n    .page-input {\n      height: 32px;\n      min-width: 45px;\n\n      input {\n        height: 100%;\n        padding: 0;\n        font-size: 0.875rem;\n        background-color: transparent;\n        border: none;\n        color: #3f4254;\n        text-align: center;\n\n        &:focus {\n          outline: none;\n          box-shadow: none;\n        }\n      }\n    }\n\n    .zoom-input {\n      height: 32px;\n      min-width: 60px;\n      display: flex;\n      align-items: center;\n      justify-content: center;\n      font-size: 0.875rem;\n      color: #3f4254;\n    }\n\n    .btn-icon {\n      width: 32px;\n      height: 32px;\n      padding: 0;\n      display: flex;\n      align-items: center;\n      justify-content: center;\n      background: transparent;\n      border: none;\n      transition: all 0.2s;\n\n      &:hover:not(.disabled) {\n        background: #f3f6f9;\n        border-radius: 4px;\n      }\n\n      &.disabled {\n        opacity: 0.5;\n        cursor: not-allowed;\n      }\n\n      i {\n        font-size: 0.875rem;\n        color: #7e8299;\n      }\n    }\n  "]
        })
    ], PdfViewerComponent);
    return PdfViewerComponent;
}());
exports.PdfViewerComponent = PdfViewerComponent;
