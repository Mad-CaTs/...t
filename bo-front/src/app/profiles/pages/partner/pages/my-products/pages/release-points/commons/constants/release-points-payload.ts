export const getReleasePointsPayload = ({ idUsuario, idSuscription, pointsReleased }: any) => ({
	idUser: idUsuario,
	idSuscription: idSuscription,
	pointsToRelease: pointsReleased
});

export const formatDateManually = (dateString: string): string => {
	return dateString
		.replace(/\b[a-zñáéíóú]+\b/gi, (match) => match.charAt(0).toUpperCase() + match.slice(1)) // Capitalizar mes
		.replace(/\bp\. m\.\b/gi, 'P.M')
		.replace(/\ba\. m\.\b/gi, 'A.M');
};

export const filterTransactions = (
	transactions: any[],
	searchText: string,
	selectedDate: string,
	maxVisibleRows?: number
): any[] => {
	let filtered = [...transactions];

	if (searchText) {
		const lowerSearchText = searchText.toLowerCase().trim();
		filtered = filtered.filter(
			(item) =>
				item.description.toLowerCase().includes(lowerSearchText) ||
				item.membership.toLowerCase().includes(lowerSearchText)
		);
	}
	if (selectedDate) {
		const formattedSelectedDate = formatDateForComparison(selectedDate);
		filtered = filtered.filter((item) => {
			const formattedItemDate = formatDateForComparison(item.date);
			return formattedItemDate === formattedSelectedDate;
		});
	}
	if (maxVisibleRows) return filtered.slice(0, maxVisibleRows);
	return filtered;
};

export const formatDateForComparison = (dateInput: any): string => {
	if (dateInput instanceof Date) {
		const year = dateInput.getFullYear();
		const month = (dateInput.getMonth() + 1).toString().padStart(2, '0');
		const day = dateInput.getDate().toString().padStart(2, '0');

		return `${year}-${month}-${day}`;
	}

	const regexSpanish = /(\d{1,2}) (\w+) (\d{4})/;
	const matchSpanish = dateInput.match(regexSpanish);

	if (matchSpanish) {
		const months: { [key: string]: string } = {
			enero: '01',
			febrero: '02',
			marzo: '03',
			abril: '04',
			mayo: '05',
			junio: '06',
			julio: '07',
			agosto: '08',
			septiembre: '09',
			octubre: '10',
			noviembre: '11',
			diciembre: '12'
		};

		const day = matchSpanish[1].padStart(2, '0');
		const month = months[matchSpanish[2].toLowerCase()];
		const year = matchSpanish[3];

		return `${year}-${month}-${day}`;
	}

	return '';
};
