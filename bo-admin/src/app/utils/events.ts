import { EventEmitter } from '@angular/core';

export function onCloseUtil(
	nativeElement: Node,
	onClose: EventEmitter<undefined>,
	parentElement?: HTMLElement
) {
	const el = nativeElement as HTMLDivElement;

	el.focus();

	setTimeout(() => {
		document.addEventListener('click', (e) => {
			const el = e.target as HTMLElement;
			const contain = nativeElement.contains(el);

			if (!contain && el !== parentElement) onClose.emit();
		});

		document.addEventListener('focusin', (e) => {
			const el = e.target as HTMLElement;
			const contain = nativeElement.contains(el);

			if (!contain && el !== parentElement) onClose.emit();
		});
	}, 60);
}

export function onEnter() {}
