import { DialogData } from '@shared/components/modal/modal-info/interface/modal-info.interface';
import { AttemptResult, TokenGenerationStatus } from '../enums/recovery.enum';

export const RECOVERY_MESSAGES: Record<
	'SUCCESS' | 'EMAIL_NOT_FOUND' | 'PASSWORDS_NOT_MATCH' | 'ITS_MULTICODE_ACCOUNT' | 'ITS_USER_ACCOUNT',
	DialogData
> = {
	SUCCESS: {
		kind: 'preset',
		type: 'success',
		title: '¡Contraseña actualizada!',
		message:
			'Tu contraseña ha sido actualizada correctamente. Ahora puedes iniciar sesión con tu nueva contraseña. Si tienes algún inconveniente, no dudes en contactarnos para recibir asistencia.'
	},
	EMAIL_NOT_FOUND: {
		kind: 'preset',
		type: 'error',
		title: '¡Error!',
		message:
			'El correo electrónico que ingresaste no está registrado en nuestro sistema. Por favor, verifica que hayas escrito correctamente tu dirección de correo o intenta con otra cuenta. Si el problema persiste, contacta al soporte técnico para recibir ayuda.'
	},
	ITS_MULTICODE_ACCOUNT: {
		kind: 'preset',
		type: 'warning',
		title: '¡Cuenta multicódigo detectada!',
		message:
			'La cuenta que intentas recuperar es una cuenta multicódigo. Por favor, elige la opción de recuperación de contraseña para cuentas <b>multicódigo</b>. Si necesitas ayuda adicional, contacta al soporte técnico.'
	},
	ITS_USER_ACCOUNT: {
		kind: 'preset',
		type: 'warning',
		title: '¡Cuenta de usuario detectada!',
		message:
			'La cuenta que intentas recuperar es una cuenta de usuario. Por favor, elige la opción de recuperación de contraseña para cuentas de <b>usuario</b>. Si necesitas ayuda adicional, contacta al soporte técnico.'
	},
	PASSWORDS_NOT_MATCH: {
		kind: 'preset',
		type: 'error',
		title: '¡Las contraseñas no coinciden!',
		message:
			'Las contraseñas ingresadas no coinciden. Por favor, asegúrate de escribir la misma contraseña en ambos campos antes de continuar.'
	}
};

export const ATTEMPT_MESSAGES: Record<AttemptResult, DialogData> = {
	[AttemptResult.SUCCESS]: {
		kind: 'preset',
		type: 'success',
		title: '¡Recuperación exitosa!',
		message:
			'El código de recuperación que ingresaste es <b>válido</b>. Ahora puedes proceder a cambiar tu contraseña de forma segura. Por favor, asegúrate de elegir una contraseña fuerte y que no utilices en otros sitios. Si tienes algún inconveniente durante el proceso, no dudes en contactarnos para recibir asistencia. <b>¡Tu seguridad es nuestra prioridad!</b>.'
	},
	[AttemptResult.EXPIRED]: {
		kind: 'preset',
		type: 'error',
		title: 'Código expirado',
		message:
			'El código de recuperación que ingresaste ha <b>expirado</b>. Por motivos de seguridad, los códigos de recuperación tienen un tiempo de validez limitado. Por favor, solicita un nuevo código y vuelve a intentarlo. Si el problema persiste o necesitas asistencia adicional, no dudes en ponerte en contacto con nuestro equipo de soporte. Estamos aquí para ayudarte a recuperar el acceso a tu cuenta de manera segura.'
	},
	[AttemptResult.TOO_MANY_ATTEMPTS]: {
		kind: 'preset',
		type: 'error',
		title: 'Demasiados intentos',
		message:
			'Has excedido el número <b>máximo de intentos</b> para ingresar el código de recuperación. Por motivos de seguridad, no puedes solicitar un nuevo código en este momento. Por favor, espera un tiempo antes de volver a intentarlo o comunícate con nuestro equipo de soporte para recibir asistencia.'
	},
	[AttemptResult.ALREADY_USED]: {
		kind: 'preset',
		type: 'error',
		title: 'Código ya utilizado',
		message:
			'El código de recuperación que ingresaste ya ha sido utilizado. Por motivos de seguridad, cada código de recuperación es único y solo puede ser utilizado una vez. Si necesitas recuperar tu contraseña nuevamente, por favor solicita un nuevo código y sigue el proceso de recuperación. Si tienes alguna duda o necesitas ayuda adicional, no dudes en contactarnos.'
	},
	[AttemptResult.FAILURE]: {
		kind: 'preset',
		type: 'error',
		title: 'Código incorrecto',
		message:
			'El código de recuperación que ingresaste es <b>incorrecto</b>. Por favor, verifica el código y vuelve a intentarlo. Si necesitas ayuda adicional, no dudes en contactarnos.'
	}
};

export const TOKEN_GENERATION_MESSAGES: Record<TokenGenerationStatus, DialogData> = {
	[TokenGenerationStatus.ALLOWED]: {
		kind: 'preset',
		type: 'success',
		title: 'Código enviado',
		message:
			'El código de recuperación ha sido enviado a tu correo electrónico. Por favor, revisa tu bandeja de entrada y también la carpeta de spam o correo no deseado.'
	},
	[TokenGenerationStatus.ERROR_TOO_SOON]: {
		kind: 'preset',
		type: 'error',
		title: '¡Espera un momento!',
		message: (remainingTime: string) =>
			`No puedes solicitar un nuevo código de recuperación tan pronto. Por favor, espera <b>${remainingTime}</b> antes de intentar nuevamente.`
	},
	[TokenGenerationStatus.ERROR_COOLDOWN_EXCEEDED]: {
		kind: 'preset',
		type: 'error',
		title: '¡Demasiados intentos!',
		message: (remainingTime: string) =>
			`Has excedido el número máximo de intentos para solicitar un nuevo código de recuperación. Por favor, espera <b>${remainingTime}</b> antes de volver a intentarlo.`
	}
};

export const SERVER_ERROR_MESSAGES: Record<'DEFAULT', DialogData> = {
	DEFAULT: {
		kind: 'preset',
		type: 'error',
		title: 'Error del servidor',
		message:
			'Ha ocurrido un error en el servidor. Por favor, intenta nuevamente más tarde. Si el problema persiste, contacta al soporte técnico.'
	}
};
