export interface IconData {
	name: string;
	color: string;
	bgColor: string;
	borderColor: string;
}

export type ModalType = 'info' | 'success' | 'error' | 'warning';

export type DialogData =
	| {
			kind: 'preset';
			title: string;
			message: string | ((args: string) => string);
			type: ModalType;
	  }
	| {
			kind: 'custom';
			title: string;
			message: string | ((args: string) => string);
			icon: IconData;
	  };
