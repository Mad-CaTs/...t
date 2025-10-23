import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modals-import-success',
  templateUrl: './modals-import-success.component.html',
  styleUrls: ['./modals-import-success.component.scss']
})
export class ModalsImportSuccessComponent {
  @Input() recordCount: number = 0;
  
  constructor(
    public activeModal: NgbActiveModal,
    public cdr: ChangeDetectorRef
  ) { }

  continuar(): void {
    this.activeModal.close({ success: true });
  }
}
