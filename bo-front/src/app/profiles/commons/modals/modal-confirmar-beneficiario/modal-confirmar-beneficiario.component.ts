import { Component, OnDestroy, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-modal-confirmar-beneficiario',
  standalone: true,
  imports: [],
  templateUrl: './modal-confirmar-beneficiario.component.html',
  styleUrl: './modal-confirmar-beneficiario.component.scss'
})
export class ModalConfirmarBeneficiarioComponent implements OnInit, OnDestroy{

  seconds = 10;
  private start = 10;
  private sub?: Subscription;
  nextChangeDate: string = '';

  constructor(public ref: DynamicDialogRef, public config: DynamicDialogConfig){}

  ngOnInit(): void {


    this.start = Number(this.config.data?.seconds ?? 10);
    this.seconds = this.start;

    this.sub = interval(1000).subscribe(() => {
      this.seconds--;
      if (this.seconds <= 0) {
        this.confirm(); 
      }
    });

    this.nextChangeDate = this.config.data?.nextChangeDate ?? '';

  }

  ngOnDestroy(): void {
     this.sub?.unsubscribe();
  }

  get fullName(): string {
    return this.config.data?.fullName ?? 'el beneficiario';
  }

  get nextChangeData(): string {
    return this.config.data?.nextChangeDate ?? '';
  }

  get progress(): number {
    return Math.round(((this.start - this.seconds) / this.start) * 100);
  }

  back(): void   { this.ref.close(false); }
  confirm(): void{ this.ref.close(true);  } 


}
