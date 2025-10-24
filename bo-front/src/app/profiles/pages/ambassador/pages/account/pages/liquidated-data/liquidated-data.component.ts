import { CommonModule } from '@angular/common';
import { Component,ChangeDetectorRef} from '@angular/core';

import { LiquidatedService } from './services/liquidated-service.service';
import { UserInfoService } from 'src/app/profiles/commons/services/user-info/user-info.service';
import { LiquidatedTableComponent } from './commons/liquidated-table/liquidated-table.component';

@Component({
  selector: 'app-liquidated-data',
  standalone: true,
  imports: [CommonModule,LiquidatedTableComponent],
  templateUrl: './liquidated-data.component.html',
  styleUrl: './liquidated-data.component.scss'
})
export  class LiquidatedDataComponent {
  userId: any;
  Liquidated: any[] = [];
  error: string = '';
  public isLoading: boolean = false;

  ngOnInit(): void {
    this.getBeneficiary();
  }
    constructor(private liquidatedService: LiquidatedService, private userInfoService: UserInfoService
      , private cdr: ChangeDetectorRef
    ) {
      this.userId= this.userInfoService.userInfo.id;
      console.log("userInfo",this.userId)
    }

    getBeneficiary(): void {
      this.isLoading = true;
      this.liquidatedService.findBeneficiaryById(this.userId).subscribe(
        (response) => {
          if (response && response.data && Array.isArray(response.data) && response.data.length > 0) {
            this.Liquidated = response.data;  
            console.log("Liquidated", this.Liquidated);
          } else {
            this.error = 'Datos del beneficiario no válidos o vacíos';
            console.error('Error: response.data no es un array válido', response.data);
          }
          this.isLoading = false; 
        },
        (error) => {
          this.error = 'Error al obtener los datos del beneficiario';
          console.error(error);
          this.isLoading = false; 
        }
      );
    }
    
    
    
    

/*   getBeneficiary(): void {
    this.liquidatedService.findBeneficiaryById(this.userId).subscribe(
      (data) => {
        this.Liquidated = data;
        console.log("Liquidated",this.Liquidated);  
      },
      (error) => {
        this.error = 'Error al obtener los datos del beneficiario';
        console.error(error);
      }
    );
  } */

}
