import { RecoveryMethod } from '../enums/recovery.enum';

export const Steps = {
	CHOOSE_METHOD: {
		title: '¿Olvidaste tu contraseña?',
		message: 'Por favor, elige un método para recuperar tu contraseña.'
	},
	ENTER_EMAIL: {
		title: 'Introduzca el correo electrónico',
		message: 'Por favor, introduzca su dirección de correo electrónico asociada a su cuenta.'
	},
	VALIDATE_TOKEN_STEP: {
		title: 'Confirma tu identidad',
		message: (email: string) =>
			`Para confirmar tu identidad, hemos enviando un código de verificación a <b>${email}</b>. Por favor, ingrésalo a continuación para continuar.`
	},
	RESET_PASSWORD: {
		title: 'Restablecer contraseña',
		message: 'Por favor, ingrese su nueva contraseña.'
	}
};

export const RecoveryMethodLabels = {
	[RecoveryMethod.USER]: 'Usuario',
	[RecoveryMethod.MULTICODE]: 'Multicódigo'
};
