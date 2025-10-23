import { Action, createReducer, on } from '@ngrx/store';

import * as ToastActions from '../actions/toasts.actions';

import type { IToastData } from '@interfaces/shared.interface';

const initialState: IToastData[] = [];

export const toastReducer = createReducer<IToastData[]>(
	initialState,
	on(ToastActions.addToast, addToast),
	on(ToastActions.clearToasts, (_state) => [])
);

function addToast(state: IToastData[], payload: ToastActions.IAddToast) {
	const newState = [...state];
	const { content, kind, id } = payload;

	newState.push({ content, kind, id, active: false });

	return newState;
}
