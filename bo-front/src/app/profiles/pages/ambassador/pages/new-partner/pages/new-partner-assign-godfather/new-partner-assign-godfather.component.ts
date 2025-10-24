import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { DialogService } from 'primeng/dynamicdialog';
import { finalize } from 'rxjs';
import { environment } from '@environments/environment';

import { GodfatherService } from './commons/services/godfather.service';
import { 
  AscendingLineUser, 
  GodfatherSelectionData, 
  GodfatherUser, 
  GodfatherValidationResponse 
} from './commons/interfaces/godfather.interface';
import { ModalNoGodfatherComponent } from './commons/modals/modal-no-godfather/modal-no-godfather.component';
import { ModalGodfatherConfirmationComponent } from './commons/modals/modal-godfather-confirmation/modal-godfather-confirmation.component';

@Component({
  selector: 'app-new-partner-assign-godfather',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatIconModule
  ],
  providers: [DialogService],
  templateUrl: './new-partner-assign-godfather.component.html',
  styles: [`
    .search-result-item {
      transition: background-color 0.2s ease;
    }
    
    .search-result-item:hover {
      background-color: #f8f9fa !important;
    }
    
    .cursor-pointer {
      cursor: pointer;
    }
  `]
})
export class NewPartnerAssignGodfatherComponent implements OnInit {
  @Input() sponsorId!: number;
  @Output() submit = new EventEmitter<GodfatherSelectionData>();
  @Output() prevState = new EventEmitter<void>();
  @Output() skipGodfather = new EventEmitter<void>();

  private dialogService = inject(DialogService);
  private godfatherService = inject(GodfatherService);

  // Form
  searchForm = new FormGroup({
    searchTerm: new FormControl('', [Validators.required, Validators.minLength(3)]),
    godfatherSelect: new FormControl(null)
  });

  // Data
  ascendingLineUsers: AscendingLineUser[] = [];
  ascendingLineOptions: any[] = []; // Opciones para el select
  selectedGodfather: GodfatherUser | null = null;
  validationResult: GodfatherValidationResponse | null = null;

  // UI States
  isLoadingLine = false;
  isSearching = false;
  isValidating = false;
  showAscendingLine = true; // ⚠️ Abierto por defecto en desarrollo ⚠️
  searchError: string | null = null;

  // Autocomplete
  searchInput = new FormControl('');
  searchResults: AscendingLineUser[] = [];
  showSearchResults = false;
  searchTimeout: any;

  ngOnInit(): void {
    
    // Verificar si sponsorId está disponible, si no, esperar un poco
    if (this.sponsorId) {
      this.loadAscendingLine();
    } else {
      console.warn('⚠️ Sponsor ID no disponible, reintentando en 100ms...');
      setTimeout(() => {
        console.log('🔄 Reintentando con sponsorId:', this.sponsorId);
        this.loadAscendingLine();
      }, 100);
    }
  }

  /**
   * Carga la línea ascendente del patrocinador
   */
  private loadAscendingLine(): void {    
    if (!this.sponsorId) {
      console.error('❌ Sponsor ID no proporcionado');
      return;
    }
    this.isLoadingLine = true;
    
    this.godfatherService.getAscendingLine(this.sponsorId)
      .pipe(finalize(() => {
        this.isLoadingLine = false;
      }))
      .subscribe({
        next: (users) => {
          this.ascendingLineUsers = users;
          this.ascendingLineOptions = this.convertToSelectOptions(this.ascendingLineUsers);
        },
        error: (error) => {
          console.error('❌ Error al cargar línea ascendente:', error);
          console.error('❌ Detalles del error:', error.message, error.status, error.url);
          this.ascendingLineUsers = [];
          this.ascendingLineOptions = [];
        }
      });
  }

  /**
   * ⚠️ SOLO PARA DESARROLLO - Retorna datos mockeados de línea ascendente ⚠️
   */
  private getMockAscendingLineUsers(): AscendingLineUser[] {
    return [
            {
        idUser: 108,
        name: 'Daniel',
        lastName: 'Villar Rodriguez',
        username: 'danielvillar',
        email: 'daniel.villar@example.com',
        level: 8,
        idRange: 2,
        rangeName: 'Inicial'
      },
      {
        idUser: 107,
        name: 'Juan Carlos',
        lastName: 'Sifuentes',
        username: 'juancarlossifuentes',
        email: 'juancarlos.sifuentes@example.com',
        level: 7,
        idRange: 5,
        rangeName: 'Oro'
      },
      {
        idUser: 106,
        name: 'Alexandra',
        lastName: 'Vera Cervero',
        username: 'alexandravera',
        email: 'alexandra.vera@example.com',
        level: 6,
        idRange: 3,
        rangeName: 'Bronce'
      },
      {
        idUser: 105,
        name: 'Rodrigo',
        lastName: 'Santisteban Pachari',
        username: 'rodrigosantisteban',
        email: 'rodrigo.santisteban@example.com',
        level: 5,
        idRange: 4,
        rangeName: 'Plata'
      },
      {
        idUser: 104,
        name: 'Fabrizio',
        lastName: 'Molina',
        username: 'fabriziomolina',
        email: 'fabrizio.molina@example.com',
        level: 4,
        idRange: 2,
        rangeName: 'Inicial'
      },
      {
        idUser: 103,
        name: 'Johsnatan',
        lastName: 'Bolo Varga',
        username: 'johsnatanbolo',
        email: 'johsnatan.bolo@example.com',
        level: 3,
        idRange: 3,
        rangeName: 'Bronce'
      },
      {
        idUser: 102,
        name: 'Erick',
        lastName: 'Lozano Gomez',
        username: 'ericklozano',
        email: 'erick.lozano@example.com',
        level: 2,
        idRange: 4,
        rangeName: 'Plata'
      },
      {
        idUser: 101,
        name: 'Emilia',
        lastName: 'Flores Baez Perez',
        username: 'emiliaflores',
        email: 'emilia.flores@example.com',
        level: 1,
        idRange: 5,
        rangeName: 'Oro'
      }
    ];
  }

  /**
   * Busca un usuario por username
   */
  onSearchGodfather(): void {
    if (this.searchForm.invalid) {
      this.searchError = 'Ingrese al menos 3 caracteres';
      return;
    }

    const searchTerm = this.searchForm.value.searchTerm?.trim();
    if (!searchTerm) return;

    this.isSearching = true;
    this.searchError = null;

    this.godfatherService.searchUserByUsername(searchTerm)
      .pipe(finalize(() => this.isSearching = false))
      .subscribe({
        next: (user) => {
          if (user) {
            this.validateAndSelectGodfather(user);
          } else {
            this.searchError = 'Usuario no encontrado';
            this.selectedGodfather = null;
            this.validationResult = null;
          }
        },
        error: (error) => {
          console.error('Error al buscar usuario:', error);
          this.searchError = 'Error al buscar usuario';
          this.selectedGodfather = null;
          this.validationResult = null;
        }
      });
  }

  /**
   * Selecciona un padrino desde la línea ascendente
   */
  selectFromAscendingLine(user: AscendingLineUser): void {
    const godfatherUser: GodfatherUser = {
      idUser: user.idUser,
      name: user.name,
      lastName: user.lastName,
      username: user.username,
      email: user.email,
      level: user.level,
      isInLine: true
    };

    this.selectedGodfather = godfatherUser;
    this.validationResult = {
      isInLine: true,
      level: user.level
    };

    // Limpiar formulario de búsqueda
    this.searchForm.reset();
    this.searchError = null;
  }

  /**
   * Valida y selecciona un padrino buscado (validación local)
   */
  private validateAndSelectGodfather(user: GodfatherUser): void {
    
    // Buscar el usuario en la línea ascendente ya cargada
    const ascendingUser = this.ascendingLineUsers.find(ascendingUser => ascendingUser.idUser === user.idUser);
    
    if (ascendingUser) {
      // El usuario está en la línea ascendente
      this.selectedGodfather = {
        ...user,
        level: ascendingUser.level,
        isInLine: true
      };
      this.validationResult = {
        isInLine: true,
        level: ascendingUser.level
      };
    } else {
      // El usuario NO está en la línea ascendente
      this.selectedGodfather = {
        ...user,
        level: undefined,
        isInLine: false
      };
      this.validationResult = {
        isInLine: false,
        level: null
      };
    }
  }

  /**
   * Limpia la selección del padrino
   */
  clearSelection(): void {
    this.selectedGodfather = null;
    this.validationResult = null;
    this.searchForm.reset();
    this.searchError = null;
    this.searchInput.setValue('');
    this.showSearchResults = false;
    this.searchResults = [];
  }

  /**
   * Alterna la visualización de la línea ascendente
   */
  toggleAscendingLine(): void {
    this.showAscendingLine = !this.showAscendingLine;
  }

  /**
   * Convierte usuarios a opciones para el app-select
   */
  private convertToSelectOptions(users: AscendingLineUser[]): any[] {
    return users.map(user => ({
      content: `Nivel ${user.level} - ${user.name} ${user.lastName}`,
      value: user.idUser,
      userData: user
    }));
  }

  /**
   * Maneja la selección del select
   */
  onSelectGodfatherFromDropdown(selectedItem: any): void {
    if (!selectedItem) return;    
    // Extraer el ID del usuario (el app-select emite el objeto completo)
    const userId = selectedItem.value;
    
    // Primero verificar si está en la línea ascendente
    const user = this.ascendingLineUsers.find(u => u.idUser === userId);
    if (user) {
      this.selectFromAscendingLine(user);
      return;
    }
    
    // Si no está en la línea ascendente, es un usuario externo
    this.selectExternalGodfather(userId, selectedItem.content);
  }

  /**
   * Selecciona un padrino externo (no en la línea ascendente)
   */
  private selectExternalGodfather(userId: number, fullName: string): void {
    // ⚠️ MODO DESARROLLO: Simular usuario externo ⚠️
    // Extraer nombre del content (ej: "Rodrigalvarez Alessandro (Externo)")
    const cleanName = fullName.replace(' (Externo)', '').trim();
    const nameParts = cleanName.split(' ');
    const firstName = nameParts[0] || 'Usuario';
    const lastName = nameParts.slice(1).join(' ') || 'Externo';
    
    const externalUser: GodfatherUser = {
      idUser: userId,
      name: firstName,
      lastName: lastName,
      username: firstName.toLowerCase(),
      email: `${firstName.toLowerCase()}@example.com`,
      level: undefined, // No tiene nivel en la línea ascendente
      isInLine: false // NO está en la línea ascendente
    };

    this.selectedGodfather = externalUser;
    this.validationResult = {
      isInLine: false,
      level: null
    };
  }

  /**
   * Maneja el botón "Omitir" (sin padrino)
   */
  onSkip(): void {
    const dialogRef = this.dialogService.open(ModalNoGodfatherComponent, {
      header: '',
      width: '500px',
      modal: true,
      dismissableMask: true
    });

    dialogRef.onClose.subscribe((confirmed: boolean) => {
      if (confirmed) {
        const emptyData: GodfatherSelectionData = {
          idGodfather: null,
          godfatherLevel: null,
          isInAscendingLine: null
        };
        this.submit.emit(emptyData);
      }
    });
  }

  /**
   * Maneja el botón "Siguiente" (con padrino)
   */
  onSubmit(): void {
    if (!this.selectedGodfather || !this.validationResult) {
      this.searchError = 'Debe seleccionar un padrino o continuar sin padrino';
      return;
    }

    const dialogRef = this.dialogService.open(ModalGodfatherConfirmationComponent, {
      header: '',
      width: '550px',
      modal: true,
      dismissableMask: true,
      data: {
        godfatherName: `${this.selectedGodfather.name} ${this.selectedGodfather.lastName}`,
        godfatherUsername: this.selectedGodfather.username,
        level: this.validationResult.level,
        isInLine: this.validationResult.isInLine
      }
    });

    dialogRef.onClose.subscribe((confirmed: boolean) => {
      if (confirmed && this.selectedGodfather && this.validationResult) {
        const data: GodfatherSelectionData = {
          idGodfather: this.selectedGodfather.idUser,
          godfatherLevel: this.validationResult.level,
          isInAscendingLine: this.validationResult.isInLine,
          godfatherName: `${this.selectedGodfather.name} ${this.selectedGodfather.lastName}`,
          godfatherUsername: this.selectedGodfather.username
        };
        this.submit.emit(data);
      }
    });
  }

  /**
   * Vuelve al paso anterior
   */
  onBack(): void {
    this.prevState.emit();
  }

  /**
   * Obtiene el mensaje de validación del padrino
   */
  get validationMessage(): string {
    if (!this.validationResult) return '';

    if (this.validationResult.isInLine) {
      if (this.validationResult.level === 15) {
        return 'Este usuario está en el nivel 15 de tu línea ascendente';
      }
      return `Este usuario está en el nivel ${this.validationResult.level} de tu línea ascendente`;
    }

    return 'Este usuario NO está en tu línea ascendente';
  }

  /**
   * Determina si el mensaje de validación es una advertencia
   */
  get isValidationWarning(): boolean {
    return this.validationResult ? !this.validationResult.isInLine : false;
  }

  // ==================== MÉTODOS DE AUTOCOMPLETE ====================

  /**
   * Maneja el input de búsqueda con debounce
   */
  onSearchInput(event: any): void {
    const searchTerm = event.target.value.trim();
    
    // Limpiar timeout anterior
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }

    if (searchTerm.length < 2) {
      this.showSearchResults = false;
      this.searchResults = [];
      return;
    }

    // Debounce de 300ms
    this.searchTimeout = setTimeout(() => {
      this.performSearch(searchTerm);
    }, 300);
  }

  /**
   * Realiza la búsqueda en el árbol
   */
  private performSearch(searchTerm: string): void {
    this.isSearching = true;
    this.showSearchResults = true;

    this.godfatherService.searchUsersInTree(searchTerm)
      .pipe(finalize(() => this.isSearching = false))
      .subscribe({
        next: (users) => {
          this.searchResults = users;
        },
        error: (error) => {
          console.error('❌ Error en búsqueda:', error);
          this.searchResults = [];
        }
      });
  }

  /**
   * Maneja el foco del input
   */
  onSearchFocus(): void {
    if (this.searchInput.value && this.searchInput.value.trim().length >= 2) {
      this.showSearchResults = true;
    }
  }

  /**
   * Maneja el blur del input con delay para permitir clicks
   */
  onSearchBlur(): void {
    setTimeout(() => {
      this.showSearchResults = false;
    }, 200);
  }

  /**
   * Selecciona un usuario de los resultados de búsqueda
   */
  selectFromSearchResults(user: AscendingLineUser): void {
    
    // Convertir a GodfatherUser
    const godfatherUser: GodfatherUser = {
      idUser: user.idUser,
      name: user.name,
      lastName: user.lastName,
      username: user.username || '',
      email: user.email || '',
      nroDocument: ''
    };

    this.selectedGodfather = godfatherUser;
    this.searchInput.setValue('');
    this.showSearchResults = false;
    this.searchResults = [];

    // Validar si está en la línea ascendente (validación local)
    this.validateGodfatherLocally(godfatherUser);
  }


  /**
   * Valida si un padrino está en la línea ascendente (validación local)
   */
  private validateGodfatherLocally(godfatherUser: GodfatherUser): void {
    
    // Buscar el usuario en la línea ascendente ya cargada
    const ascendingUser = this.ascendingLineUsers.find(user => user.idUser === godfatherUser.idUser);
    
    if (ascendingUser) {
      // El usuario está en la línea ascendente
      this.validationResult = {
        isInLine: true,
        level: ascendingUser.level
      };
    } else {
      // El usuario NO está en la línea ascendente
      this.validationResult = {
        isInLine: false,
        level: null
      };
    }
  }

  /**
   * TrackBy function para optimizar el rendering
   */
  trackByUserId(index: number, user: AscendingLineUser): number {
    return user.idUser;
  }
}

