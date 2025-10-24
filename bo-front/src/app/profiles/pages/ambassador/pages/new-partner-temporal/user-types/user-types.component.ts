import { Component, OnInit, AfterViewInit , TemplateRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-user-types',
  standalone: true,
  imports: [
    CommonModule,

  ],
  templateUrl: './user-types.component.html',
  styleUrl: './user-types.component.scss'
})
export default class UserTypesComponent implements OnInit {

  constructor(
    private modalService: NgbModal,
    public fb: FormBuilder,
  ) { }

  modalRef: NgbModalRef;
  @ViewChild('modalTemplateClock') modalTemplate: TemplateRef<any>;
  typeModal = 'create';
  form: FormGroup;

  selectedOption: string | null = null;

  options: object[] = [
    {
      id: 'option1',
      title: 'Opción 1',
      type: 'Usuario',
      description: 'Al seleccionar esta opción registras un solo usuario'
    },
    {
      id: 'option2',
      title: 'Opción 2',
      type: 'Multiusuario',
      description: 'Al seleccionar esta opción registras varios usuarios'
    },
    {
      id: 'option3',
      title: 'Opción 3',
      type: 'Promotor',
      description: 'Al seleccionar esta opción registras a promotores'
    }
  ];

  ngOnInit() {  }
  ngAfterViewInit() {
    this.showModalMessage();
  }

  selectOption(optionId: string): void {
    this.selectedOption = optionId;
  }

  showModalMessage(){
    const modalData = { form: this.form };
    this.modalRef = this.modalService.open(this.modalTemplate, { size: 'md' });
  }

  getVersion(): string {
    try {
      // @ts-ignore - Acceder a la versión si está disponible
      return bootstrap.Tooltip.VERSION || 'Versión no disponible';
    } catch {
      return 'Bootstrap no está cargado correctamente';
    }
  }


  closeModal() {
    this.modalRef?.close();
  }


}
