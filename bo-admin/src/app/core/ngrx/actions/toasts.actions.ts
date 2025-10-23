import { createAction, props } from '@ngrx/store';

import { IToastData } from '@interfaces/shared.interface';

export type IAddToast = {
	content: IToastData['content'];
	kind: IToastData['kind'];
	id: string;
};

export const addToast = createAction('add', props<IAddToast>());
export const clearToasts = createAction('clear');
