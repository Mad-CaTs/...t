import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
    selector: '[appDragScroll]',
    standalone: true,
})
export class DragScrollDirective {
    private pos = { top: 0, left: 0, x: 0, y: 0 };

    constructor(private el: ElementRef) {
        this.el.nativeElement.style.cursor = 'grab';
    }

    @HostListener('mousedown', ['$event'])
    onMouseDown(event: MouseEvent) {
        if (event.button !== 2) {
            return;
        }

        event.preventDefault();
        this.el.nativeElement.style.cursor = 'grabbing';
        this.el.nativeElement.style.userSelect = 'none';

        this.pos = {
            left: this.el.nativeElement.scrollLeft,
            top: this.el.nativeElement.scrollTop,
            x: event.clientX,
            y: event.clientY,
        };

        document.addEventListener('mousemove', this.onMouseMove);
        document.addEventListener('mouseup', this.onMouseUp);
    }

    onMouseMove = (event: MouseEvent) => {
        const dx = event.clientX - this.pos.x;
        const dy = event.clientY - this.pos.y;
        this.el.nativeElement.scrollLeft = this.pos.left - dx;
        this.el.nativeElement.scrollTop = this.pos.top - dy;
    };

    onMouseUp = () => {
        this.el.nativeElement.style.cursor = 'grab';
        this.el.nativeElement.style.userSelect = '';

        document.removeEventListener('mousemove', this.onMouseMove);
        document.removeEventListener('mouseup', this.onMouseUp);
    };

    @HostListener('contextmenu', ['$event'])
    onContextMenu(event: MouseEvent) {
        event.preventDefault();
    }
}
