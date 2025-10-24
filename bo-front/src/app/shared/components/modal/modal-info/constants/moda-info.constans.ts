import { IconData } from '../interface/modal-info.interface';

export type ModalType = 'info' | 'success' | 'error' | 'warning';

export const MODAL_INFO_CONSTANTS: Record<ModalType, IconData> = {
	info: {
		name: 'pi pi-info-circle',
		color: '218,104,6',
		bgColor: '#FFEEB2',
		borderColor: '#FFFAEB'
	},
	success: {
		name: 'pi pi-check-circle',
		color: '3,152,85',
		bgColor: '#D1FADF',
		borderColor: '#ECFDF3'
	},
	error: {
		name: 'pi pi-times-circle',
		color: '220,38,69',
		bgColor: '#F5C2C7',
		borderColor: '#F8E0E2'
	},
	warning: {
		name: 'pi pi-exclamation-triangle',
		color: '255,182,0',
		bgColor: '#FFF0B2',
		borderColor: '#FFFBE6'
	},
};
