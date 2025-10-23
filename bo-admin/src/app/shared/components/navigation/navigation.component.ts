import {
	AfterViewInit,
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	ElementRef,
	EventEmitter,
	HostListener,
	Input,
	OnChanges,
	OnDestroy,
	Output,
	QueryList,
	SimpleChanges,
	ViewChild,
	ViewChildren,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Event as RouterEvent, NavigationEnd, Router, RouterLink } from '@angular/router';
import type { INavigationTab } from '@interfaces/shared.interface';
import type { Subscription } from 'rxjs';

@Component({
	selector: 'app-navigation',
	standalone: true,
	imports: [CommonModule, RouterLink],
	templateUrl: './navigation.component.html',
	styleUrls: ['./navigation.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavigationComponent implements AfterViewInit, OnChanges, OnDestroy {
	@Input() data: INavigationTab[] = [];
	@Input() noPaths = false;
	@Output() selected = new EventEmitter<number>();

	@ViewChild('indicator', { static: true })
	indicator!: ElementRef<HTMLSpanElement>;

	@ViewChild('tabContainer', { static: true })
	tabContainer!: ElementRef<HTMLDivElement>;

	@ViewChildren('tabRef', { read: ElementRef })
	tabRefs!: QueryList<ElementRef<HTMLElement>>;

	public currentIndex = 0;
	private subs: Subscription[] = [];
	private resizeObs?: ResizeObserver;

	constructor(private router: Router, private cdr: ChangeDetectorRef) { }

	ngAfterViewInit(): void {
		if (!this.noPaths) {
			this.updateIndexFromUrl(this.router.url);
			this.subs.push(
				this.router.events.subscribe((e: RouterEvent) => {
					if (e instanceof NavigationEnd) this.updateIndexFromUrl(e.urlAfterRedirects);
				})
			);
		}

		this.resizeObs = new ResizeObserver(() => this.moveIndicator());
		this.resizeObs.observe(this.tabContainer.nativeElement);

		queueMicrotask(() => this.moveIndicator());
	}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes['data']) {
			if (!this.noPaths) {
				this.updateIndexFromUrl(this.getUrlWithoutParams());
			} else {
				this.currentIndex = Math.min(this.currentIndex, Math.max(this.data.length - 1, 0));
			}
			queueMicrotask(() => this.moveIndicator());
		}
	}

	ngOnDestroy(): void {
		this.subs.forEach((s) => s.unsubscribe());
		this.resizeObs?.disconnect();
	}

	setIndex(i: number): void {
		if (i === this.currentIndex) return;
		this.currentIndex = i;
		this.selected.emit(i);
		this.moveIndicator();
		this.cdr.markForCheck();
	}

	private updateIndexFromUrl(url: string): void {
		const base = this.stripParams(url);
		const matched = this.data
			.map((d) => d.path || '')
			.filter(Boolean)
			.filter((p) => base.startsWith(p))
			.sort((a, b) => b.length - a.length)[0];

		const idx = Math.max(this.data.findIndex((d) => d.path === matched), 0);

		if (idx !== this.currentIndex) {
			this.currentIndex = idx;
			this.moveIndicator();
			this.cdr.markForCheck();
		}
	}

	private getUrlWithoutParams(): string {
		return this.stripParams(this.router.url);
	}

	private stripParams(u: string): string {
		return (u || '').split(/[?#]/)[0];
	}

	private moveIndicator(): void {
		const tabs = this.tabRefs?.toArray().map((r) => r.nativeElement) ?? [];
		const active = tabs[this.currentIndex];
		const ind = this.indicator?.nativeElement;
		if (!active || !ind) return;

		const left = active.offsetLeft;
		const width = active.offsetWidth;

		requestAnimationFrame(() => {
			ind.style.left = `${left}px`;
			ind.style.width = `${width}px`;
		});
	}

	trackByIndex = (index: number) => index;

	@HostListener('window:resize')
	onResize(): void {
		this.moveIndicator();
	}
}
