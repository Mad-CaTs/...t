export interface TransferPayloadParams {
	selectedId: number;
	transferInfo: any;
	documents: any;
	userInfo: any;
	sponsorInfo: any;
	newUserId?: any;
}

export const getTransferPayload = (params: TransferPayloadParams) => {
	const { selectedId, transferInfo, documents, userInfo, sponsorInfo, newUserId } = params;

	return {
		id_transfer_type: selectedId,
		id_membership: transferInfo.membership?.value ?? null,
		id_user_from: userInfo.id,
		id_user_to:
			selectedId === 3
				? newUserId?.id ?? null
				: selectedId === 4
				? transferInfo.searchBy?.value?.value.idUser ?? null
				: null, // tipo 3 y 4 otros null
		sponsor_id:
			selectedId === 3
				? transferInfo.searchBy?.value?.value?.sponsor_id ?? null
				: sponsorInfo.sponsor_id ?? null, // caso 3 y para los otros casos el sponsor de la api que trae los esponsor
		request_date: new Date().toISOString(),
		id_transfer_status: 1, // sIEMPRE EN 1
		dni_solicitante: documents.uploadedUrls?.dni_url,
		declaracion_jurada: documents.uploadedUrls?.declaration_jurada_url,
		dni_receptor: documents.uploadedUrls?.dni_receptor_url,
		user_to_nombre: transferInfo.name,
		user_to_apellido: transferInfo.lastname,
		user_to_numero_documento: transferInfo.nroDocument,
		user_to_tipo_documento: transferInfo.idDocument,
		user_to_genero: String(transferInfo.gender),
		/* user_to_genero: transferInfo.gender */ /* === 1 ? 'M' : transferInfo.gender === 2 ? 'F' : null */
		user_to_fecha_nacimiento: transferInfo.birthDate,
		user_to_estado_civil: transferInfo.civilState,
		user_to_nacionalidad: transferInfo.residenceCountryId,
		user_to_pais_residencia: transferInfo.country,
		user_to_distrito: transferInfo.districtAddress,
		user_to_provincia: transferInfo.province,
		user_to_direccion: transferInfo.address,
		user_to_correo_electronico: transferInfo.email,
		user_to_celular: transferInfo.phone,
		user_from_name: userInfo.name,
		user_from_last_name: userInfo.lastName /* sponsor_name: sponsorInfo.name, */, //mismo caso sponsor_id
		sponsor_name:
			selectedId === 3
				? transferInfo.searchBy?.value?.value?.sponsor_name ?? null
				: sponsorInfo.sponsor_name ?? null, //tipo 3 filtro otros casos api patrocinadores
		sponsor_last_name:
			selectedId === 3
				? transferInfo.searchBy?.value?.value?.sponsor_last_name ?? null
				: sponsorInfo.sponsor_last_name ?? null, //tipo 3 filtro otros casos api patrocinadores
		username_from:
			selectedId === 2 ? transferInfo.transferProfileId?.content ?? null : userInfo.username ?? null,

		/* 		username_from: userInfo.username,
		 */ username_to:
			selectedId === 3
				? newUserId.username ?? null
				: selectedId === 4
				? transferInfo.searchBy?.value?.value.userName ?? null
				: null, //caso 3 y 4 otro null
		childId: transferInfo.transferProfileId?.value ?? null, //id-multicodigo
		sponsor_username:
			selectedId === 3
				? transferInfo.searchBy?.value?.value?.sponsor_username ?? null
				: sponsorInfo.sponsor_username ?? null, //mismo caso sponsor_id
		user_from_email: userInfo.email, //usuario logeado
		name_membership: transferInfo.membership?.content ?? null,
		username_child: transferInfo.transferProfileId?.content ?? null //id-multicodigo//tipo 2
	};
};

export interface RegisterAccountTransferParams {
	transferInfo: any;
}

export const getRegisterAccountTransferPayload = (params: RegisterAccountTransferParams) => {
	const { transferInfo } = params;

	// Convertir birthDate a YYYY-MM-DD si viene como Date
	let birthDateFormatted = transferInfo.birthDate;
	if (transferInfo.birthDate instanceof Date) {
		const d = transferInfo.birthDate;
		birthDateFormatted = `${d.getFullYear()}-${('0' + (d.getMonth() + 1)).slice(-2)}-${(
			'0' + d.getDate()
		).slice(-2)}`;
	}

	return {
		name: transferInfo.name,
		lastName: transferInfo.lastname,
		birthDate: birthDateFormatted,
		gender: transferInfo.gender,
		idNationality: transferInfo.country,
		nroDocument: transferInfo.nroDocument,
		email: transferInfo.email,
		districtAddress: transferInfo.districtAddress,
		address: transferInfo.address,
		idResidenceCountry: transferInfo.residenceCountryId,
		civilState: transferInfo.civilState,
		nroPhone: transferInfo.phone,
		idTypeDocument: transferInfo.idDocument,
		idState: 1
	};
};
