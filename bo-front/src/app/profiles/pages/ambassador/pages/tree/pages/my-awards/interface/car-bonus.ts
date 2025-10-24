export interface ICarBonus {
  id: number;
  titulo: string;
  precio: number;
  progreso: number;
  rango: string;
  detalles: string;
  detalles2: string;
  imagenAuto: string;
  imagenInsignia: string;
  puntoInicial: number;
  puntoFinal: number;
  activo: boolean;
  skewed?: boolean;
}