import { Component, inject } from '@angular/core';

import {
  optBrandMock,
  optStatesMock,
  partnerListTableMock,
  searchAsMock,
} from './commons/mocks/mock';

import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalTransferNewPartnerComponent } from './commons/modals/modal-transfer-new-partner/modal-transfer-new-partner.component';
import { InputComponent } from '@shared/components/form-control/input/input.component';
import { SelectComponent } from '@shared/components/form-control/select/select.component';
import {MatStepper, MatStepperModule} from '@angular/material/stepper';
import RadiosComponent from '@shared/components/form-control/radios/radios.component';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatCardModule} from '@angular/material/card';
import {MatChipsModule} from '@angular/material/chips';
import {MatIconModule} from '@angular/material/icon';
import { AlreadyExistsPartnerModalComponent } from './commons/components/modal-already-exists-partner/already-exists-partner-modal.component';
import { TransferLiquidationService } from './commons/service/transfer-liquidation-package.service';
import { catchError, of } from 'rxjs';
import { AlreadyExistsPartnerSubscriptionModalComponent } from './commons/components/modal-already-exists-partner-subscription/already-exists-partner-modal-subscription.component';
import { ModalTransferNewPartnerSubscriptionComponent } from './commons/modals/modal-transfer-new-partner-subscription/modal-transfer-new-partner-subscription.component';
import { IPlacementListTable } from '../../../tree/commons/interfaces';
import { LiquidationMembershipComponent } from './commons/components/modal-liquidation-membership/modal-liquidation-membership.component';
import { ActivatedRoute, Router } from '@angular/router';
import { ChatCardComponent } from './commons/components/chat-card/chat-card.component';
import { ModalChatbotComponent } from '@shared/components/modal/modal-chatbot/modal-chatbot.component';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-account-tickets-follow',
  templateUrl: './account-tickets-follow.component.html',
  styleUrl: './account-tickets-follow.component.scss',
  standalone: true,
  imports: [
    CommonModule,
    InputComponent,
    RadiosComponent,
    SelectComponent,
    MatFormFieldModule,
    MatInputModule,
    MatStepperModule,
    MatCardModule,
    MatChipsModule,
    MatProgressBarModule,
    MatIconModule,
    ReactiveFormsModule,
    ChatCardComponent
  ],
})
export default class AccountTicketsFollowComponent {
  public form: FormGroup;
  submenu: string | null = null;
  showNewCards: boolean = false;
  ref: DynamicDialogRef;
  shouldOpenModal = false; 

  public tableData = partnerListTableMock;

  public optSearchAs = searchAsMock;
  public optStates = optStatesMock;
  public optBrands = optBrandMock;
  type: number = 0;

  private _formBuilder = inject(FormBuilder);
  public typeTransfer: any[] = [];

  firstFormGroup = this._formBuilder.group({
    firstCtrl: ['', Validators.required],
  });
  secondFormGroup = this._formBuilder.group({
    secondCtrl: ['', Validators.required],
  });

  constructor(
    private formBuilder: FormBuilder,
    private modal: NgbModal,
    private __transferLiquidationService: TransferLiquidationService,
    private router: Router, private route: ActivatedRoute,
    private dialogService:DialogService
  ) {
    this.form = formBuilder.group({
      searchBy: [''],
      searchAs: [1],
      status: [1],
      brand: [0],
    });
  }

  ngOnInit() {
    // Leer el parámetro 'submenu' de la URL
    this.route.queryParamMap.subscribe(params => {
      this.submenu = params.get('submenu');
    });
  }
  toggleCards() {
    this.showNewCards = true; // Muestra los nuevos y oculta los antiguos
  }
  

  /* === Events === */
  onSwithModal(type: any){
    switch(type.idTypeTransfer) {
      case 1: {
        this.onOpenModalNewPartnerSubscription(type.idTypeTransfer);
        break;
      }
      case 2: {
        this.onOpenModalAlreadyExistsPartnerSubscription(type.idTypeTransfer);
        break;
      }
      case 3: {
         this.onOpenModalNewPartner(type.idTypeTransfer);
         break;
      } 
      case 4: { 
         this.onOpenModalAlreadyExistsPartner(type.idTypeTransfer);
         break;
      }
      case 5: {
        this.onOpenModalLiquidationMembership(type.idTypeTransfer);
        break;
      }
   } 
  }

  onOpenModalNewPartner(idTypeTransfer: number) {
    const ref = this.modal.open(ModalTransferNewPartnerComponent, {
      centered: true,
    });
    const modal = ref.componentInstance as ModalTransferNewPartnerComponent;
    modal.idTypeTransfer = idTypeTransfer;
  }

  onOpenModalAlreadyExistsPartner(idTypeTransfer: number) {
    let data: {
      selectedData: IPlacementListTable | undefined;
      fullnames: { name: string; id: number }[];
    };

    const ref = this.modal.open(AlreadyExistsPartnerModalComponent, {
      centered: true,
    });
		const modal = ref.componentInstance as AlreadyExistsPartnerModalComponent;

    modal.idTypeTransfer = idTypeTransfer;
		modal.selectedData = this.tableData[0];
		modal.fullnames = [{ name: this.tableData[0].fullname, id: this.tableData[0].id }];
  }

  onOpenModalNewPartnerSubscription(idTypeTransfer: number) {
    const ref = this.modal.open(ModalTransferNewPartnerSubscriptionComponent, {
      centered: true,
    });
    const modal = ref.componentInstance as ModalTransferNewPartnerSubscriptionComponent;
    modal.idTypeTransfer = idTypeTransfer;
  }
  
  onOpenModalAlreadyExistsPartnerSubscription(idTypeTransfer: number) {
    let data: {
      selectedData: IPlacementListTable | undefined;
      fullnames: { name: string; id: number }[];
    };

    const ref = this.modal.open(AlreadyExistsPartnerSubscriptionModalComponent, {
      centered: true,
    });
		const modal = ref.componentInstance as AlreadyExistsPartnerSubscriptionModalComponent;

    modal.idTypeTransfer = idTypeTransfer;
		modal.selectedData = this.tableData[0];
		modal.fullnames = [{ name: this.tableData[0].fullname, id: this.tableData[0].id }];
  }

  onOpenModalLiquidationMembership(idTypeTransfer: number) {
    let data: {
      selectedData: IPlacementListTable | undefined;
      fullnames: { name: string; id: number }[];
    };

    const ref = this.modal.open(LiquidationMembershipComponent, {
      centered: true,
      size: 'lg'
    });
		const modal = ref.componentInstance as LiquidationMembershipComponent;

    modal.idTypeTransfer = idTypeTransfer;
		modal.selectedData = this.tableData[0];
		modal.fullnames = [{ name: this.tableData[0].fullname, id: this.tableData[0].id }];
  }

  onOpenDetail(id: number) {
    const ref = this.modal.open(ModalTransferNewPartnerComponent, {
      centered: true,
    });
    const modal =
      ref.componentInstance as ModalTransferNewPartnerComponent;

    modal.id = id;
  }

  public getTypeTransfer(stepper: MatStepper) {
		this.__transferLiquidationService.getTypeTransfer().pipe(
      catchError(err => of([]))
    ).subscribe({
			next: (data) => {
        if (data?.result) {
          this.typeTransfer = [];
          if (this.type == 2) {
            data.data.forEach(e => {
              if (e.idTypeTransfer >= 1 && e.idTypeTransfer <= 4) {
                this.typeTransfer.push(e); 
              }
            });
          }
          if (this.type == 4) {
            data.data.forEach(e => {
              if (e.idTypeTransfer >= 5 && e.idTypeTransfer <= 6) {
                this.typeTransfer.push(e); 
              }
            });
          }
          stepper.next(); 
        }          
			},
			error: (error) => {
				console.error('Error Data Type Transfer:', error);
			}
		});
	}

  secondSteep(stepper: MatStepper){
 stepper.next(); 

   }

 


  thirdSteep(stepper: MatStepper, typeTransfer: number){
    this.type = typeTransfer;
    this.getTypeTransfer(stepper);
  }

  openModal() {
    this.ref = this.dialogService.open(ModalChatbotComponent, {
      header: 'Chatbot de Inclub activo',
      width: '45vw',
      baseZIndex: 10000,
      closable: true,
      style: {
        position: 'fixed',
        bottom: '20px', 
        right: '20px',  
        margin: '0', 
        padding: '0',
      }
    });
}


/* openModal() {
    this.ref = this.dialogService.open(ModalChatbotComponent, {
      header: 'Chatboot de inclub activo', 

      width: '45vw',
      baseZIndex: 10000,
      closable: true
    });
  }  */

}
