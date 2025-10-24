 export function hexToRgba(hex: string, alpha: number): string {
	const r = parseInt(hex.slice(1, 3), 16);
	const g = parseInt(hex.slice(3, 5), 16);
	const b = parseInt(hex.slice(5, 7), 16);
	return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export const STATUS_COLOR_MAP: { [key: string]: string } = {
	'Validado': '#16A34A',
	'Completado': '#16A34A',
	'Sin validar': '#000000',
  'Observado':'#FF9800'
};

export function getStatusColor(
	status?: string,
	colorFromApi?: string
): { textColor: string; backgroundColor: string } {
	const colorHex = colorFromApi || STATUS_COLOR_MAP[status || ''] || '#000000';

	const textColor = colorHex === '#000000' ? '#FFFFFF' : colorHex;

	return {
		textColor,
		backgroundColor: hexToRgba(colorHex, 0.4)
	};
}
 


