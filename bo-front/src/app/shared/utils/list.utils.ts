import { ElementRef } from '@angular/core';

// Only works in after view init
export function onCloseList(list: ElementRef, input: ElementRef, onClose: () => void) {
	document.addEventListener('click', (e) => {
		const el = e.target as HTMLElement;
		const contain = list?.nativeElement.contains(el);
		const isInput = input?.nativeElement.contains(el);

		if (!contain && !isInput) onClose();
	});

	document.addEventListener('focusin', (e) => {
		const el = e.target as HTMLElement;
		const contain = list?.nativeElement.contains(el);
		const isInput = input?.nativeElement.contains(el);

		if (!contain && !isInput) onClose();
	});
}
