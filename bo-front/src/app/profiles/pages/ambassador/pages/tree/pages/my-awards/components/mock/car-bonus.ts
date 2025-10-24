import { ICarBonus } from "../../interface/car-bonus";

export const carBonus: ICarBonus[] = [
    {
      id: 1,
      titulo: 'Auto Standard',
      precio: 12990.666,
      progreso: 3550,
      rango: 'Rango Esmeralda',
      detalles: '$ 2 000 + $250M',
      detalles2: '75 socios / 13 500 PV',
      imagenAuto: 'assets/images/auto/PLATA-DOS5.svg',
      imagenInsignia: 'Esmeralda',
      puntoInicial: 3550,
      puntoFinal: 13500,
      activo: true,
      skewed: true
    },
    {
      id: 2,
      titulo: 'Auto Familiar',
      precio: 30990,
      progreso: 0,
      rango: 'Rango Diamante',
      detalles: '$ 7 000 + $550M',
      detalles2: '375 socios / 67 500 PV',
      imagenAuto: 'assets/images/auto/PLATA-DOS4.svg',
      imagenInsignia: 'DIAMANTE',
      puntoInicial: 0,
      puntoFinal: 67500,
      activo: true,
      skewed: true
    },
    {
      id: 3,
      titulo: 'Porsche Cayenne',
      precio: 90990,
      progreso: 0,
      rango: 'Rango Triple Diamante',
      detalles: '$ 25 000 + $1 500M',
      detalles2: '1 875 socios / 337 500 PV',
      imagenAuto: 'assets/images/auto/PLATA-DOS4.svg',
      imagenInsignia: 'DIAMANTE NEGRO',
      puntoInicial: 0,
      puntoFinal: 337500,
      activo: false,
      skewed: false
    },
    {
      id: 4,
      titulo: 'Porsche Cayenne',
      precio: 90990,
      progreso: 0,
      rango: 'Rango Triple Diamante',
      detalles: '$ 25 000 + $1 500M',
      detalles2: '1 875 socios / 337 500 PV',
      imagenAuto: 'assets/images/auto/PLATA-DOS4.svg',
      imagenInsignia: 'DIAMANTE CORONA',
      puntoInicial: 3,
      puntoFinal: 25432,
      activo: false,
      skewed: false
    },
    {
      id: 5,
      titulo: 'Porsche Cayenne',
      precio: 90990,
      progreso: 452,
      rango: 'Rango Triple Diamante',
      detalles: '$ 25 000 + $1 500M',
      detalles2: '1 875 socios / 337 500 PV',
      imagenAuto: 'assets/images/auto/PLATA-DOS4.svg',
      imagenInsignia: 'Diamante Imperial',
      puntoInicial: 45,
      puntoFinal: 453622,
      activo: true,
      skewed: true
    }
  ];