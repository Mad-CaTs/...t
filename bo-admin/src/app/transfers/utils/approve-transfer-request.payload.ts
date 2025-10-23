import { ITableTransferRequest } from '@interfaces/transfer.interface';

export function buildApproveTransferRequestPayload(transfer: ITableTransferRequest): any {
	switch (transfer.idTransferType) {
		case 1:
		case 2:
			return {
				username: transfer.username_from,
				transferType: transfer.idTransferType,
				userCustomer: {
					name: transfer.user_to_nombre || '',
					lastName: transfer.user_to_apellido || '',
					birthdate: transfer.user_to_fecha_nacimiento || '',
					gender: transfer.user_to_genero || 'M',
					idNationality: transfer.user_to_nacionalidad || null,
					email: transfer.user_to_correo_electronico || '',
					nroDocument: transfer.user_to_numero_documento || '',
					districtAddress: transfer.user_to_distrito || '',
					address: transfer.user_to_direccion || '',
					nroPhone: transfer.user_to_celular || '',
					idDocument: transfer.user_to_tipo_documento || null,
					idResidenceCountry: transfer.user_to_pais_residencia,
					civilState: transfer.user_to_estado_civil
				},
				...(transfer.idTransferType === 2 && {
					childId: transfer.childId ?? null
				})
			};

		case 3:
		case 4:
			return {
				transferType: transfer.idTransferType,
				newUserId: transfer.idUserTo
			};

		default:
			throw new Error(`Transfer type ${transfer.idTransferType} no soportado`);
	}
}
