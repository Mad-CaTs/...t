import { ITransferMessageConfig } from '../interfaces/transfer.interfaces';

export const TRANSFER_MESSAGES: Record<string, ITransferMessageConfig> = {
  MULTIPLE_ACCOUNTS: {
    title: 'Lo sentimos',
    message: `Usted posee varias cuentas (multicódigo), por lo que esta opción está disponible únicamente para usuarios con una cuenta normal.<br><br>
              Le invitamos a realizar el traspaso a su cuenta multicódigo para continuar.`,
    buttonText: 'Volver',
    returnValue: 'volver',
    autoAdvance: false,
  },
  SINGLE_ACCOUNT: {
    title: 'Recuerda',
    message: `Si estás traspasando tu cuenta a un nuevo socio, también estarás compartiendo su código junto con toda la red.`,
    buttonText: 'Continuar con el proceso',
    returnValue: 'continuar',
    autoAdvance: true,
  },
};
