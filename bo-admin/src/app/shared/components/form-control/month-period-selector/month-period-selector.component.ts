import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { NgbDropdown } from '@ng-bootstrap/ng-bootstrap';

interface IPeriodOption {
	id: string | number;
	text: string;
}

interface IMonthGroup {
	label: string;
	value: string;
	periods: IPeriodOption[];
}

@Component({
	selector: 'app-month-period-selector',
	templateUrl: './month-period-selector.component.html',
	styleUrls: ['./month-period-selector.component.scss']
})
export class MonthPeriodSelectorComponent implements OnInit {
	@Input() controlName!: string;
	@Input() periodsControlName!: string;
	@Input() formGroup!: FormGroup;
	@Input() placeholder: string = 'Selecciona';
	@Input() label: string = '';
	private currentMonth: string | null = null;

	@Input()
	set refreshPeriods(flag: boolean) {
		if (flag) {
			const month = this.formGroup.get(this.controlName)?.value;
			if (month) {
				this.updateAvailablePeriods(month);
			}
		}
	}
	@Output() selectionChange = new EventEmitter<{
		month: string;
		periods: (string | number)[];
	}>();

	@ViewChild('d', { static: true }) dropdown!: NgbDropdown;

	private _groupedOptions: IMonthGroup[] = [];
	@Input()
	set groupedOptions(val: IMonthGroup[] | undefined) {
		this._groupedOptions = val ?? [];
		const cur = this.formGroup.get(this.controlName)?.value;
		if (cur) this.updateAvailablePeriods(cur);
	}
	get groupedOptions() {
		return this._groupedOptions;
	}

	selectedMonthPeriods: IPeriodOption[] = [];
	selectedPeriods = new Set<string | number>();
	allSelected = false;
	selectedPeriodsText = '';

	constructor(private cdr: ChangeDetectorRef) {}

	ngOnInit() {
		this.formGroup.get(this.controlName)!.valueChanges.subscribe((month) => {
			this.updateAvailablePeriods(month);
			this.resetSelections();
			this.cdr.detectChanges();
		});
	}

	onMonthChange(event: Event): void {
		const monthValue = (event.target as HTMLSelectElement).value;
		const actualValue = monthValue.includes(':') ? monthValue.split(':')[1].trim() : monthValue;

		this.currentMonth = actualValue;
		this.updateAvailablePeriods(actualValue);
		this.dropdown.open();
		this.resetSelections();
		this.emitSelectionChange();
	}

	emitSelectionChange() {
		this.selectionChange.emit({
			month: this.formGroup.get(this.controlName)!.value,
			periods: Array.from(this.selectedPeriods)
		});
	}

	onCheckboxChange(evt: Event, period: IPeriodOption) {
		const chk = (evt.target as HTMLInputElement).checked;
		if (chk) this.selectedPeriods.add(period.id);
		else {
			this.selectedPeriods.delete(period.id);
			this.allSelected = false;
		}
		this.updateSelectedText();
		this.pushPeriodsToForm();
		this.emitSelection();
		this.scheduleClose();
	}

	toggleSelectAll(evt: Event) {
		this.allSelected = (evt.target as HTMLInputElement).checked;
		if (this.allSelected) {
			this.selectedPeriods = new Set(this.selectedMonthPeriods.map((p) => p.id));
		} else {
			this.selectedPeriods.clear();
		}
		this.updateSelectedText();
		this.pushPeriodsToForm();
		this.emitSelection();
		this.scheduleClose();
	}

	private updateAvailablePeriods(monthValue: string) {
		const found = this._groupedOptions.find((m) => m.value === monthValue);
		this.selectedMonthPeriods = found ? [...found.periods] : [];
	}

	private resetSelections() {
		this.selectedPeriods.clear();
		this.allSelected = false;
		this.selectedPeriodsText = '';
		this.pushPeriodsToForm();
	}

	private pushPeriodsToForm() {
		const arr = this.selectedMonthPeriods.filter((p) => this.selectedPeriods.has(p.id));
		this.formGroup.get(this.periodsControlName)!.setValue(arr, { emitEvent: false });
	}

	private updateSelectedText() {
		if (this.selectedPeriods.size === 0) {
			this.selectedPeriodsText = '';
		} else if (this.selectedPeriods.size === this.selectedMonthPeriods.length) {
			this.selectedPeriodsText = 'Todos los ciclos';
		} else {
			this.selectedPeriodsText = this.selectedMonthPeriods
				.filter((p) => this.selectedPeriods.has(p.id))
				.map((p) => p.text)
				.join(', ');
		}
	}

	private emitSelection() {
		this.selectionChange.emit({
			month: this.formGroup.get(this.controlName)!.value,
			periods: Array.from(this.selectedPeriods)
		});
	}

	private scheduleClose() {
		setTimeout(() => {
			this.dropdown.close();
			this.cdr.detectChanges();
		}, 3000);
	}

	get selectedMonthLabel(): string {
		const month = this.formGroup.get(this.controlName)!.value;
		if (!month) return this.placeholder;
		const found = this._groupedOptions.find((m) => m.value === month);
		return found ? found.label : this.placeholder;
	}
}
