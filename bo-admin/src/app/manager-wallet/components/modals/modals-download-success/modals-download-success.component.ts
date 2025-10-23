import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modals-download-success',
  templateUrl: './modals-download-success.component.html',
  styleUrls: ['./modals-download-success.component.scss']
})
export class ModalsDownloadSuccessComponent {
  @Input() recordCount: number = 0;
  @Input() currentStepIndex: boolean = true;

  constructor(
    public activeModal: NgbActiveModal,
    public cdr: ChangeDetectorRef
  ) {
  }

  continuar(): void {
    this.activeModal.close({ success: true });
  }
}