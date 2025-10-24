import { HttpErrorResponse } from '@angular/common/http';

export function handleHttpError(err: HttpErrorResponse): {
  notifyType: 'error',
  notifyTitle: string,
  notifyMessage: string
} {
  console.error('[HTTP ERROR]', err);

  if (err.status === 0) {
    return {
      notifyType: 'error',
      notifyTitle: 'Sin conexión',
      notifyMessage: 'No se pudo conectar con el servidor. Verifica tu conexión a internet.'
    };  
  }

  if (err.status >= 100 && err.status < 200) {
    return {
      notifyType: 'error',
      notifyTitle: `Respuesta informativa (${err.status})`,
      notifyMessage: 'El servidor respondió pero no se puede procesar información aún.'
    };
  }

  if (err.status >= 300 && err.status < 400) {
    return {
      notifyType: 'error',
      notifyTitle: `Redirección (${err.status})`,
      notifyMessage: 'La solicitud fue redirigida. Podría requerir atención adicional.'
    };
  }

  if (err.status >= 400 && err.status < 500) {
    switch (err.status) {
      case 400: {
        // Manejo especial para errores de clave foránea
        let msg = '';
        if (typeof err.error === 'string') {
          msg = err.error;
        } else if (err.error?.message) {
          msg = err.error.message;
        }
        if (msg.includes('violates foreign key constraint') || msg.includes('clave foránea') || msg.includes('foreign key')) {
          return {
            notifyType: 'error',
            notifyTitle: 'No permitido',
            notifyMessage: 'No se puede eliminar este tipo de evento porque está siendo referenciado por otros registros.'
          };
        }
        return {
          notifyType: 'error',
          notifyTitle: 'Solicitud inválida (400)',
          notifyMessage: msg || 'La solicitud contiene errores no válidos.'
        };
      }
      case 401:
        return {
          notifyType: 'error',
          notifyTitle: 'No autorizado (401)',
          notifyMessage: 'Tu sesión ha expirado o no tienes credenciales válidas.'
        };
      case 403:
        return {
          notifyType: 'error',
          notifyTitle: 'Acceso denegado (403)',
          notifyMessage: 'No tienes permisos para realizar esta acción.'
        };
      case 404:
        return {
          notifyType: 'error',
          notifyTitle: 'No encontrado (404)',
          notifyMessage: 'No se encontró el recurso solicitado.'
        };
      case 409:
        return {
          notifyType: 'error',
          notifyTitle: 'Conflicto de datos (409)',
          notifyMessage: err.error?.message || 'Ya existe un registro con estos datos.'
        };
      case 422:
        return {
          notifyType: 'error',
          notifyTitle: 'Datos inválidos (422)',
          notifyMessage: err.error?.message || 'Algunos datos enviados no son válidos.'
        };
      case 429:
        return {
          notifyType: 'error',
          notifyTitle: 'Demasiadas solicitudes (429)',
          notifyMessage: 'Has realizado demasiadas solicitudes. Intenta nuevamente más tarde.'
        };
      default:
        return {
          notifyType: 'error',
          notifyTitle: `Error del cliente (${err.status})`,
          notifyMessage: err.error?.message || 'Ocurrió un error con tu solicitud.'
        };
    }
  }

  if (err.status >= 500 && err.status < 600) {
    return {
      notifyType: 'error',
      notifyTitle: `Error del servidor (${err.status})`,
      notifyMessage: err.error?.message || 'Error interno del servidor. Intenta más tarde.'
    };
  }

  return {
    notifyType: 'error',
    notifyTitle: `Error desconocido (${err.status})`,
    notifyMessage: 'Se produjo un error inesperado. Revisa consola para más detalles.'
  };
}
