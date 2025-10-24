import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { InputOtpModule } from 'primeng/inputotp';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RemainingTime } from '../../commons/interfaces/recovery.interface';

@Component({
	selector: 'app-token-input-otp',
	standalone: true,
	imports: [InputOtpModule, FormsModule, ReactiveFormsModule],
	templateUrl: './token-input-otp.component.html',
	styleUrl: './token-input-otp.component.scss'
})
export class TokenInputOtpComponent implements OnInit, OnChanges {
	@Input() form: FormGroup;
	@Input() controlName: string;
	@Input() remainingTime: RemainingTime | null = null;
	@Output() requestNewCode = new EventEmitter<void>();
	private remainingSeconds: number = 0;
	private countdownInterval: any;

	ngOnInit() {
		this.form.get(this.controlName)?.reset();
		this.startCountdown(this.remainingTime);
	}

	ngOnChanges() {
		if (this.remainingTime) {
			this.startCountdown(this.remainingTime);
		}
	}

	ngOnDestroy() {
		if (this.countdownInterval) {
			clearInterval(this.countdownInterval);
		}
	}

	onRequestNewCode() {
		this.form.get(this.controlName)?.reset();
		this.requestNewCode.emit();
	}

	startCountdown(remainingTime: RemainingTime) {
		this.remainingSeconds = remainingTime.minutes * 60 + remainingTime.seconds;

		if (this.countdownInterval) {
			clearInterval(this.countdownInterval);
		}

		this.updateRemainingTime();

		this.countdownInterval = setInterval(() => {
			this.remainingSeconds--;

			if (this.remainingSeconds <= 0) {
				clearInterval(this.countdownInterval);
				this.remainingTime = null;
				return;
			}

			this.updateRemainingTime();
		}, 1000);
	}

	private updateRemainingTime() {
		const minutes = Math.floor(this.remainingSeconds / 60);
		const seconds = this.remainingSeconds % 60;
		this.remainingTime = { minutes, seconds };
	}

	calculateRemainingTime(): string {
		if (!this.remainingTime) return '00:00';

		const { minutes, seconds } = this.remainingTime;
		const totalSeconds = minutes * 60 + seconds;

		if (totalSeconds >= 60) {
			const paddedMin = minutes < 10 ? '0' + minutes : minutes;
			const paddedSec = seconds < 10 ? '0' + seconds : seconds;
			return `${paddedMin}:${paddedSec} minutos`;
		} else {
			return `${seconds} segundo${seconds !== 1 ? 's' : ''}`;
		}
	}
}
