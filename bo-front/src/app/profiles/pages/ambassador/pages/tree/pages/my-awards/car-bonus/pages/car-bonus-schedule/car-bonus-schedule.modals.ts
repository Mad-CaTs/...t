export type BankMethod = 'bcp' | 'interbank' | 'otrosMedios' | 'wallet' | 'paypal';

export interface ModalState {
  // Notify
  showNotify: boolean;
  notifyTitle: string;
  notifyMessage: string;

  // Payments
  showPayments: boolean;
  selectedPaymentIds: string[]; 

  // Wallet
  showWallet: boolean;

  // Transferencia
  showTransfer: boolean;
  transferBank: BankMethod;

  paymentDetails: {
    amountUSD: number;
    amountPEN: number;
    exchangeRate: number;
    commission: number;
    totalPEN: number;
    concept: string;
    dueDate: string;
    installmentNum: number;
    scheduleId: string; 
    methodKey: string;
    subTypeId?: number;
  } | null;
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

  paymentDetails: null,
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
  openPayments(state: ModalState, ids: string[], details?: any): ModalState { 
    return {
      ...state,
      showPayments: true,
      selectedPaymentIds: ids,
      paymentDetails: details || null,
    };
  },
  closePayments(state: ModalState): ModalState {
    return {
      ...state,
      showPayments: false,
      selectedPaymentIds: [],
      paymentDetails: null,
    };
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
      paymentDetails: null,
    };
  },
};
