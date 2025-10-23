import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modals-registro-exitoso',
  templateUrl: './modals-registro-exitoso.component.html',
  styleUrls: ['./modals-registro-exitoso.component.scss']
})
export class ModalsRegistroExitosoComponent {
  constructor(
    public instanceModal: NgbActiveModal,
  ) { }

}
