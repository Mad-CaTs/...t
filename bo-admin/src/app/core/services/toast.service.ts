import { Injectable } from '@angular/core';

import type { IToastData } from '@interfaces/shared.interface';

import { Subject } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class ToastService {
	private toasts: IToastData[] = [];

	public toasts$ = new Subject<IToastData[]>();

	constructor() {}

	addToast(content: string, kind: IToastData['kind']) {
		const id = Math.random().toString(16).slice(2);
		const toast = { content, kind, id, active: false };

		this.toasts.push(toast);
		this.toasts$.next(this.toasts);

		setTimeout(() => {
			const toastIndex = this.toasts.findIndex((t) => t.id === id);
			this.toasts[toastIndex].active = true;

			this.toasts$.next(this.toasts);
		}, 100);

		setTimeout(() => this.closeToast(id), 5100);
	}

	closeToast(id: string) {
		const toastIndex = this.toasts.findIndex((t) => t.id === id);

		if (toastIndex === -1) return;

		this.toasts[toastIndex].active = false;
		this.toasts$.next(this.toasts);

		setTimeout(() => {
			this.toasts = this.toasts.filter((t) => t.id !== id);

			this.toasts$.next(this.toasts);
		}, 600);
	}
}
