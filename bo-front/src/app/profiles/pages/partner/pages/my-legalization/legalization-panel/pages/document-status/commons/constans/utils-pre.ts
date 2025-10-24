function darkenHex(hex: string, factor: number): string {
  const r = Math.round(parseInt(hex.slice(1, 3), 16) * factor);
  const g = Math.round(parseInt(hex.slice(3, 5), 16) * factor);
  const b = Math.round(parseInt(hex.slice(5, 7), 16) * factor);
  return `rgb(${r}, ${g}, ${b})`;
}

export function getStatusColorPre(colorFromApi?: string) {
  const colorHex = colorFromApi || '#000000';

  return {
    textColor: darkenHex(colorHex, 0.6),      
    backgroundColor: hexToRgbaPrev(colorHex, 0.4) 
  };
}

export function hexToRgbaPrev(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
