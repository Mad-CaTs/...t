

export interface ITransferMessageConfig {
  title: string;
  message: string;
  buttonText: string;
  returnValue: string;   // 👈 cambiar a string
  autoAdvance: boolean;
}

export interface ITransferUserData {
	id_state: number;
	sponsor_id: number;
	sponsor_last_name: string;
	sponsor_name: string;
	sponsor_username: string;
}

export interface IMulticodeData {
  idMultiAccount: number;
  parentId: number;
  childId: number;
  subAccountNumber: number;
  createdAt: string; 
}




export interface TransferRequestData {
  requester_last_name: string;
  dni_receptor_url: string;
  sponsorId: number;
  user_to_apellido: string;
  requester_username: string;
  user_to_nacionalidad: number;
  user_to_tipo_documento: number;
  user_to_pais_residencia: number;
  new_partner_last_name: string;
  user_to_fecha_nacimiento: string; 
  dni_url: string;
  requestDate: string; 
  user_to_nombre: string;
  user_from_last_name: string;
  idUserFrom: number;
  sponsor_name: string;
  requester_name: string;
  user_from_nombre: string;
  user_to_genero: string;
  user_to_celular: string;
  user_to_numero_documento: string;
  user_to_correo_electronico: string;
  sponsor_last_name: string;
  new_partner_username: string;
  sponsor_nombre: string;
  sponsor_username: string;
  idTransferType: number;
  user_to_distrito: string;
  idMembership: number;
  declaration_jurada_url: string;
  idTransferStatus: number;
  user_to_estado_civil: string;
  idTransferRequest: number;
  user_to_provincia: number;
  idUserTo: number;
  new_partner_name: string;
  user_to_direccion: string;
}


export interface ITransferInfo {
  address: string;
  birthDate: Date | string; 
  civilState: number;       
  country: number;
  districtAddress: string;
  email: string;
  gender: number;          
  idDocument: number;       
  lastname: string;
  membership: string;
  name: string;
  nroDocument: string;
  phone: string;
  province: string;
  residenceCountryId: number;
  searchBy: string;
  stepTwoOption: string;
  transferProfileId: string;
}

export interface ITransferDocuments {
  documentoIdentidad: File ;
  declaracionJurada: File ;
  partnerDocument: File ;
  hasPendingConciliations: number;     
  conciliationResponsible: number ;
}

/* export interface ITransferData {
  info: ITransferInfo | null;
  documentos: ITransferDocuments | null;
} */

  export interface ITransferData {
  info: { value: ITransferInfo; valid: boolean } | null;
  documentos: ITransferDocuments | null;
}




