import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-tarjeta-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tarjeta-modal.component.html',
  styleUrls: ['./tarjeta-modal.component.scss']
})
export class TarjetaModalComponent {
  @Input() isOpen = false;
  @Output() closeModal = new EventEmitter<void>();
  @Output() paymentSuccess = new EventEmitter<void>();

  isProcessing = false;

  // Datos del formulario de tarjeta
  cardData = {
    cardNumber: '',
    expirationDate: '',
    cvv: '',
    firstName: '',
    lastName: '',
    email: ''
  };

  // Errores de validación
  errors = {
    cardNumber: '',
    expirationDate: '',
    cvv: '',
    firstName: '',
    lastName: '',
    email: ''
  };

  // Validación de campos
  isFormValid(): boolean {
    return this.isValidCardNumber() &&
           this.isValidExpirationDate() &&
           this.isValidCVV() &&
           this.isValidFirstName() &&
           this.isValidLastName() &&
           this.isValidEmail(this.cardData.email);
  }

  // Validación de número de tarjeta
  isValidCardNumber(): boolean {
    const cleanNumber = this.cardData.cardNumber.replace(/\D/g, '');
    return cleanNumber.length >= 13 && cleanNumber.length <= 19;
  }

  // Validación de fecha de expiración
  isValidExpirationDate(): boolean {
    if (!this.cardData.expirationDate) return false;
    
    const parts = this.cardData.expirationDate.split('/');
    if (parts.length !== 2) return false;
    
    const month = parseInt(parts[0]);
    const year = parseInt(parts[1]);
    
    if (month < 1 || month > 12) return false;
    
    const currentYear = new Date().getFullYear() % 100;
    const currentMonth = new Date().getMonth() + 1;
    
    if (year < currentYear || (year === currentYear && month < currentMonth)) {
      return false;
    }
    
    return true;
  }

  // Validación de CVV
  isValidCVV(): boolean {
    const cleanCVV = this.cardData.cvv.replace(/\D/g, '');
    return cleanCVV.length === 3;
  }

  // Validación de nombres
  isValidFirstName(): boolean {
    const name = this.cardData.firstName.trim();
    return name.length >= 2 && /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(name);
  }

  // Validación de apellidos
  isValidLastName(): boolean {
    const name = this.cardData.lastName.trim();
    return name.length >= 2 && /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(name);
  }

  // Validación de email
  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Actualizar errores en tiempo real
  updateErrors(): void {
    this.errors.cardNumber = this.getCardNumberError();
    this.errors.expirationDate = this.getExpirationDateError();
    this.errors.cvv = this.getCVVError();
    this.errors.firstName = this.getFirstNameError();
    this.errors.lastName = this.getLastNameError();
    this.errors.email = this.getEmailError();
  }

  // Mensajes de error específicos
  getCardNumberError(): string {
    if (!this.cardData.cardNumber) return '';
    if (!this.isValidCardNumber()) {
      return 'El número de tarjeta debe tener entre 13 y 19 dígitos';
    }
    return '';
  }

  getExpirationDateError(): string {
    if (!this.cardData.expirationDate) return '';
    if (!this.isValidExpirationDate()) {
      return 'Fecha de expiración inválida o vencida';
    }
    return '';
  }

  getCVVError(): string {
    if (!this.cardData.cvv) return '';
    if (!this.isValidCVV()) {
      return 'El CVV debe tener 3 dígitos';
    }
    return '';
  }

  getFirstNameError(): string {
    if (!this.cardData.firstName) return '';
    if (!this.isValidFirstName()) {
      return 'Ingresa un nombre válido (solo letras)';
    }
    return '';
  }

  getLastNameError(): string {
    if (!this.cardData.lastName) return '';
    if (!this.isValidLastName()) {
      return 'Ingresa apellidos válidos (solo letras)';
    }
    return '';
  }

  getEmailError(): string {
    if (!this.cardData.email) return '';
    if (!this.isValidEmail(this.cardData.email)) {
      return 'Ingresa un email válido';
    }
    return '';
  }

  // Formateo manual
  formatCardNumberManual(event: any): void {
    let value = event.target.value.replace(/\D/g, '');
    if (value.length <= 16) {
      value = value.replace(/(\d{4})(\d{4})(\d{4})(\d{4})/, '$1-$2-$3-$4');
    } else {
      value = value.replace(/(\d{4})(\d{4})(\d{4})(\d{4})(\d{3})/, '$1-$2-$3-$4-$5');
    }
    this.cardData.cardNumber = value;
    this.updateErrors();
  }

  formatExpirationDateManual(event: any): void {
    let value = event.target.value.replace(/\D/g, '');
    if (value.length >= 2) {
      const month = parseInt(value.substring(0, 2));
      if (month > 12) {
        value = '12' + value.substring(2);
      }
      value = value.substring(0, 2) + '/' + value.substring(2, 4);
    }
    this.cardData.expirationDate = value;
    this.updateErrors();
  }

  formatCVVManual(event: any): void {
    let value = event.target.value.replace(/\D/g, '');
    this.cardData.cvv = value.substring(0, 3);
    this.updateErrors();
  }

  // Validar nombres en tiempo real
  onNameChange(field: 'firstName' | 'lastName'): void {
    this.updateErrors();
  }

  // Validar email en tiempo real
  onEmailChange(): void {
    this.updateErrors();
  }

  // Procesar pago
  processPayment(): void {
    this.updateErrors();
    
    if (!this.isFormValid()) {
      return;
    }

    this.isProcessing = true;

    // Simular procesamiento de pago
    setTimeout(() => {
      this.isProcessing = false;
      this.paymentSuccess.emit();
    }, 2000);
  }

  onClose(): void {
    this.closeModal.emit();
    // Resetear formulario y errores
    this.cardData = {
      cardNumber: '',
      expirationDate: '',
      cvv: '',
      firstName: '',
      lastName: '',
      email: ''
    };
    this.errors = {
      cardNumber: '',
      expirationDate: '',
      cvv: '',
      firstName: '',
      lastName: '',
      email: ''
    };
  }
}
