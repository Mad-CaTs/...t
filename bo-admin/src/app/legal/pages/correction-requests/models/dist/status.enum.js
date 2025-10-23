"use strict";
var _a, _b;
exports.__esModule = true;
exports.getStatusClass = exports.getStatusText = exports.StatusClass = exports.StatusText = exports.CorrectionStatus = void 0;
var CorrectionStatus;
(function (CorrectionStatus) {
    CorrectionStatus["SOLICITUD"] = "1";
    CorrectionStatus["EN_PROCESO"] = "2";
    CorrectionStatus["OBSERVADO"] = "3";
    CorrectionStatus["CORREGIDO"] = "4";
})(CorrectionStatus = exports.CorrectionStatus || (exports.CorrectionStatus = {}));
exports.StatusText = (_a = {},
    _a[CorrectionStatus.SOLICITUD] = 'Solicitud',
    _a[CorrectionStatus.EN_PROCESO] = 'En proceso',
    _a[CorrectionStatus.OBSERVADO] = 'Observado',
    _a[CorrectionStatus.CORREGIDO] = 'Corregido',
    _a['SOL_CORRECCION'] = 'Solicitud',
    _a['EN_PROCESO'] = 'En proceso',
    _a['OBSERVADO'] = 'Observado',
    _a['CORREGIDO'] = 'Corregido',
    _a);
exports.StatusClass = (_b = {},
    _b[CorrectionStatus.SOLICITUD] = 'badge-pending',
    _b[CorrectionStatus.EN_PROCESO] = 'badge-in-progress',
    _b[CorrectionStatus.OBSERVADO] = 'badge-warning',
    _b[CorrectionStatus.CORREGIDO] = 'badge-completed',
    _b['SOL_CORRECCION'] = 'badge-pending',
    _b['EN_PROCESO'] = 'badge-in-progress',
    _b['OBSERVADO'] = 'badge-warning',
    _b['CORREGIDO'] = 'badge-completed',
    _b);
exports.getStatusText = function (status) {
    var numStatus = typeof status === 'string' ? parseInt(status) : status;
    return exports.StatusText[numStatus] || exports.StatusText[status] || 'Desconocido';
};
exports.getStatusClass = function (status) {
    var numStatus = typeof status === 'string' ? parseInt(status) : status;
    return exports.StatusClass[numStatus] || exports.StatusClass[status] || 'badge-pending';
};
