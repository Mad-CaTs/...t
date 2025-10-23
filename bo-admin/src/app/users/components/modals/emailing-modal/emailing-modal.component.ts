import { Component, Input, OnInit, ViewChild, ElementRef } from '@angular/core';
import { emailingTypes } from './mock';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from '@app/core/services/toast.service';
import { EmailingService } from '@app/users/services/emailing.service';
import { IEmailingTableData } from '@interfaces/users.interface';
import { ModalLoadingComponentManageBusiness } from '@app/manage-business/components/modals/modal-loading/modal-loading.component';

@Component({
    selector: 'app-emailing-modal',
    templateUrl: './emailing-modal.component.html',
    styleUrls: ['./emailing-modal.component.scss']
})
export class EmailingModalComponent implements OnInit {
    @Input() id: string;
    @Input() emailingData: IEmailingTableData;
    @ViewChild('masterEmail1') masterEmail1: ElementRef;
    @ViewChild('masterEmail2') masterEmail2: ElementRef;

    // Emailing Type
    selectedOption: string = '';
    emailingTypes = emailingTypes;

    // Checkboxes
    sendToPartner: boolean = false;
    sendToMaster: boolean = false;
    sendToMaster2: boolean = false;

    // Form validation
    isFormValid: boolean = true;

    constructor(
        public instanceModal: NgbActiveModal,
        private modalService: NgbModal,
        public toastService: ToastService,
        private emailingService: EmailingService
    ) {}

    ngOnInit(): void {}

    isValidEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    validateEmails(): void {
        const email1Value = this.masterEmail1?.nativeElement.value?.trim() || '';
        const email2Value = this.masterEmail2?.nativeElement.value?.trim() || '';
        const email1Valid = !this.sendToMaster || (email1Value && this.isValidEmail(email1Value));
        const email2Valid = !this.sendToMaster2 || (email2Value && this.isValidEmail(email2Value));
        this.isFormValid = email1Valid && email2Valid;
    }

    onSendEmail() {
        if (!this.isFormValid) return;

        // Open the loading modal
        const modalRef = this.modalService.open(ModalLoadingComponentManageBusiness, {
            centered: true,
            backdrop: 'static',
            keyboard: false
        });

        const typeEmail = parseInt(this.selectedOption);
        // flagSendMaster is true if either sendToMaster or sendToMaster2 is checked, indicating additional emails in otherEmail
        const flagSendMaster = this.sendToMaster || this.sendToMaster2;
        const flagSendPartner = this.sendToPartner;

        // Collect emails for otherEmail, ensuring no duplicates, to send in copy (CC)
        const otherEmails: string[] = [];
        const email1Value = this.masterEmail1?.nativeElement.value?.trim();
        const email2Value = this.masterEmail2?.nativeElement.value?.trim();
        if (this.sendToMaster && email1Value && this.isValidEmail(email1Value)) {
            otherEmails.push(email1Value);
        }
        if (this.sendToMaster2 && email2Value && this.isValidEmail(email2Value)) {
            otherEmails.push(email2Value);
        }
        // Use Set to remove duplicates and join valid emails with commas
        const uniqueEmails = [...new Set(otherEmails)];
        const otherEmail = uniqueEmails.length > 0 ? uniqueEmails.join(',') : null;

        this.emailingService.sendEmail(this.id, typeEmail, flagSendMaster, flagSendPartner, otherEmail).subscribe(
            () => {
                const name = emailingTypes.find((s) => s.id === this.selectedOption)?.title || '';
                const message = `Se envió el correo (${name}) con éxito`;
                this.toastService.addToast(message, 'success');
                modalRef.componentInstance.finishLoad.emit();
                modalRef.close();
                this.instanceModal.close();
            },
            (error) => {
                console.error('Error sending email:', error);
                const message = 'Hubo un error al enviar el correo. Por favor, intente nuevamente.';
                this.toastService.addToast(message, 'error');
                modalRef.componentInstance.finishLoad.emit();
                modalRef.close();
            }
        );
    }
}
