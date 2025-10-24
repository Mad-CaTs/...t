 export class PartnerListResponseDTO {
    idUser: number;
    fullName: string;
    userName: string;
    idState: number;
    createDate: string | null;
    sponsorLevel: number;
    residualLevel: number;
    branch: number;
    branchName: string;
    puntajeGrupal?: number;
    puntajeIndividual?: number;
    suscriptions: any[];
    rangeName: string;
    nextExpiration: Date | '' | string;

    rango?: string;
    isLoadingRango?: boolean;
    puntajeDeLaMembresia?: number;
    isLoading?: boolean;
    flagColor: boolean;
}
 
export interface ITablePromotional {
  readonly id: number;
  readonly name: string;
  readonly lastName: string;
  readonly gender: string;
  readonly email: string;
  readonly fileName: string;
}