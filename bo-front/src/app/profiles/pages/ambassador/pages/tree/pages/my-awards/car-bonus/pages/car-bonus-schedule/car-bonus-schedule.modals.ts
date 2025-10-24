// car-bonus-schedule.modals.ts

export type BankMethod = 'bcp' | 'interbank' | 'otrosMedios';

export interface ModalState {
  // Notify
  showNotify: boolean;
  notifyTitle: string;
  notifyMessage: string;

  // Payments
  showPayments: boolean;
  selectedPaymentIds: number[];

  // Wallet
  showWallet: boolean;

  // Transferencia
  showTransfer: boolean;
  transferBank: BankMethod;
}

export const createModalState = (): ModalState => ({
  showNotify: false,
  notifyTitle: '',
  notifyMessage: '',

  showPayments: false,
  selectedPaymentIds: [],

  showWallet: false,

  showTransfer: false,
  transferBank: 'bcp',
});

export const ModalsController = {
  // -------- Notify ----------
  openNotify(state: ModalState, title: string, message: string): ModalState {
    return { ...state, showNotify: true, notifyTitle: title, notifyMessage: message };
  },
  closeNotify(state: ModalState): ModalState {
    return { ...state, showNotify: false, notifyTitle: '', notifyMessage: '' };
  },

  // -------- Payments ----------
  openPayments(state: ModalState, ids: number[]): ModalState {
    return { ...state, showPayments: true, selectedPaymentIds: ids };
  },
  closePayments(state: ModalState): ModalState {
    return { ...state, showPayments: false, selectedPaymentIds: [] };
  },

  // -------- Wallet ----------
  openWallet(state: ModalState): ModalState {
    return { ...state, showWallet: true };
  },
  closeWallet(state: ModalState): ModalState {
    return { ...state, showWallet: false };
  },

  // -------- Transferencia ----------
  openTransfer(state: ModalState, bank: BankMethod): ModalState {
    return { ...state, showTransfer: true, transferBank: bank };
  },
  closeTransfer(state: ModalState): ModalState {
    return { ...state, showTransfer: false };
  },

  // -------- Utilitario ----------
  closeAll(state: ModalState): ModalState {
    return {
      ...state,
      showNotify: false,
      showPayments: false,
      showWallet: false,
      showTransfer: false,
    };
  },
};
