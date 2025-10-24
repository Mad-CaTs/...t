import { CommonModule } from '@angular/common';
import {
  AfterViewInit, Component, ElementRef, ViewChild,
  ChangeDetectionStrategy, input, output
} from '@angular/core';

@Component({
  selector: 'app-event-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './event-card.component.html',
  styleUrls: ['./event-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EventCardComponent implements AfterViewInit {
  readonly imageUrl = input<string>();
  readonly title = input<string>();
  readonly date = input<string>();
  readonly price = input<string>();
  readonly type = input<string>();
  readonly buttonText = input({ transform: (v: string | undefined) => v ?? 'Comprar' });

  readonly showBuy = input<boolean>(true);
  readonly isMainEvent = input<boolean>(false);
  /** Tamaño del badge en px (opcional). Default 36 */
  readonly badgeSize = input<number>(36);

  readonly buy = output<void>();

  @ViewChild('root', { static: true }) root!: ElementRef<HTMLElement>;

  ngAfterViewInit() {
    requestAnimationFrame(() => this.root.nativeElement.classList.add('enter'));
  }

  onClick() {
    const el = this.root.nativeElement;
    el.animate(
      [{ transform: 'scale(1)' }, { transform: 'scale(0.96)' }, { transform: 'scale(1)' }],
      { duration: 200, easing: 'ease-out' }
    );
    this.buy.emit();
  }
}
