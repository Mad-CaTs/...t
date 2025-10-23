import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.interface';
import { PortfolioResponse } from '../../models/portfolio.interface';
import { debounceTime, distinctUntilChanged, switchMap, tap } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-generate-document-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './generate-document-modal.component.html',
  styleUrls: ['./generate-document-modal.component.scss'],

})
export class GenerateDocumentModalComponent implements OnInit {
  @Input() documentType: string = 'Documento';

  searchTerm = '';
  users: User[] = [];
  selectedUser: User | null = null;
  selectedPortfolio: string = '';
  portfolios: PortfolioResponse[] = [];
  showResults = false;
  subscriptionId: number = 0;

  private searchSubject = new Subject<string>();

  constructor(
    public activeModal: NgbActiveModal,
    private userService: UserService
  ) {
    this.searchSubject.pipe(
      tap(term => console.log('Término de búsqueda:', term)),
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(term => {
        console.log('Realizando llamada a API con término:', term);
        return this.userService.searchUsers(term);
      })
    ).subscribe({
      next: (users) => {
        console.log('Usuarios encontrados:', users);
        this.users = users;
        this.showResults = users.length > 0;
      },
      error: (error) => {
        console.error('Error al buscar usuarios:', error);
        this.users = [];
        this.showResults = false;
      }
    });
  }

  ngOnInit() { }

  onSearch(event: any) {
    const term = event.target.value.trim();
    console.log('Entrada de búsqueda cambiada:', term);
    if (term && term.length >= 3) {
      console.log('Iniciando búsqueda para:', term);
      this.searchSubject.next(term);
    } else {
      console.log('Término de búsqueda muy corto, limpiando resultados');
      this.users = [];
      this.showResults = false;
    }
  }

  selectUser(user: User) {
    console.log('Usuario seleccionado:', user);
    this.selectedUser = user;
    this.userService.setSelectedUser(user);
    this.searchTerm = `${user.name} ${user.lastName}`;
    this.showResults = false;

    this.userService.getUserPortfolios(user.idUser).subscribe({
      next: (portfolios) => {
        console.log('Portafolios cargados:', portfolios);
        this.portfolios = portfolios;
      },
      error: (error) => {
        console.error('Error al cargar portafolios:', error);
        this.portfolios = [];
      }
    });
  }

  onPortfolioSelect(portfolioId: string) {
    console.log('Portfolio seleccionado:', portfolioId);
    if (!portfolioId) return;

    const selectedPortfolioData = this.portfolios.find(p => p.id === Number(portfolioId));
    if (!selectedPortfolioData?.pack?.idFamilyPackage) {
      console.error('Portafolio no válido o sin idFamilyPackage');
      return;
    }

    this.subscriptionId = selectedPortfolioData.id;

    this.userService.getSubscriptionData(selectedPortfolioData.id).subscribe({
      next: (subscriptionData) => {
        console.log('Datos de suscripción obtenidos:', {
          portfolioId: selectedPortfolioData.id,
          familyPackageId: selectedPortfolioData.pack.idFamilyPackage,
          subscriptionData: subscriptionData
        });
      },
      error: (error) => {
        console.error('Error al obtener datos de suscripción:', error);
      }
    });
  }

  filterUsers(users: User[], term: string): User[] {
    const normalizedTerm = term.toLowerCase();
    return users.filter(user =>
      user.documentNumber.toLowerCase().includes(normalizedTerm) ||
      user.name.toLowerCase().includes(normalizedTerm) ||
      user.lastName.toLowerCase().includes(normalizedTerm) ||
      user.username.toLowerCase().includes(normalizedTerm)
    );
  }

  get isFormValid(): boolean {
    if (!this.selectedUser || !this.selectedPortfolio) return false;

    return !!(
      this.selectedUser.documentNumber &&
      this.selectedUser.documentName &&
      `${this.selectedUser.name} ${this.selectedUser.lastName}`.trim()
    );
  }

  onGenerate() {
    if (!this.selectedUser || !this.selectedPortfolio) {
      console.error('Falta usuario o portafolio');
      return;
    }

    const selectedPortfolioData = this.portfolios.find(p => p.id === Number(this.selectedPortfolio));
    console.log('Portafolio seleccionado:', selectedPortfolioData);

    if (!selectedPortfolioData) {
      console.error('Portafolio no encontrado con ID:', this.selectedPortfolio);
      return;
    }

    const userData = {
      customerId: this.selectedUser.idUser,
      nombreCompleto: `${this.selectedUser.name} ${this.selectedUser.lastName}`,
      nacionalidad: 'PERUANA',
      tipoDocumento: 'DNI-DOCUMENTO NACIONAL DE IDENTIDAD',
      nrodocument: this.selectedUser.documentNumber,
      distrito: '',
      pais: 'PERÚ',
      portfolioId: selectedPortfolioData.id.toString(),
      nombrePaquete: selectedPortfolioData.pack?.name || '',
      nombreFamilypackage: selectedPortfolioData.pack?.description || '',
      acciones: selectedPortfolioData.packageDetailResponse?.numberShares || 0,
      idsuscription: selectedPortfolioData.id,
      codigoCertificado: null,
      escalaPago: null,
      familyPackageId: selectedPortfolioData.pack?.idFamilyPackage
    };

    if (this.selectedUser.nationality) userData.nacionalidad = this.selectedUser.nationality;
    if (this.selectedUser.documentType) userData.tipoDocumento = this.selectedUser.documentType;
    if (this.selectedUser.district) userData.distrito = this.selectedUser.district;
    if (this.selectedUser.country) userData.pais = this.selectedUser.country;

    console.log('Cerrando modal con datos:', userData);
    this.activeModal.close(userData);
  }
}