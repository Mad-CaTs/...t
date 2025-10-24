const PUNTO_1 = `
  <strong>1.</strong>
  En caso de que esté tramitando la legalización de un contrato, haya declarado contar con la
  disponibilidad de acercarse a la Notaría Herrera Carrera en Miraflores, Lima-Perú y durante el periodo
  correspondiente no acuda a la firma de su contrato conforme al calendario de legalizaciones, se
  asumirá como un trámite a distancia y se legalizará únicamente con la firma del CEO Omar Urteaga,
  confiriendo así lo expresado en el contrato a favor del accionista sin necesidad de la firma de este
  segundo.
  <br /><br />
`;

const PUNTO_2_LOCAL = `
  <strong>2.</strong>
  Todo contrato y/o certificado permanecerá por un periodo de 3 meses en el lugar de recojo indicado por
  el socio en el presente formulario. Si posteriormente al periodo mencionado, el socio no acude a su
  oportuno recojo, el contrato y/o certificado será enviado al archivo del Club Resort Ribera del Río.
`;

const PUNTO_2_PROVINCIA = `
  <strong>2.</strong>
  Todo documento entregado a SERPOST emite un código de registro para su respectivo seguimiento.
  Una vez que le entreguemos el código de registro, usted será el único responsable en el seguimiento
  y recojo de la solicitud en la agencia de SERPOST asignada. En caso que no haya acudido al recojo
  de su legalización de forma oportuna, la solicitud será anulada y tendrá que volver a generar su
  solicitud de legalización con envío a provincia.
`;

const PUNTO_2_EXTRANJERO = `
  <strong>2.</strong>
   Todo documento entregado a SERPOST emite un
  código de registro para su respectivo seguimiento. Una vez que le entreguemos el código de registro,
  usted será el único responsable en el seguimiento y recepción de sus documentos en la dirección
  consignada en la presente solicitud. En caso que no haya logrado recibir la legalización de forma
  oportuna, puede comunicarse a SERPOST con su número de seguimiento para obtener mayor
  información. Si el pedido no fue entregado por no ubicar la dirección entregada o no se pudo
  comunicar al número registrado, la solicitud será anulada y tendrá que volver a generar el trámite
  de legalización con envío al extranjero.
`;

export function getLegalizationNoticeMessage(isForeign: number): string {
	switch (isForeign) {
		case 2:
			return PUNTO_1 + PUNTO_2_PROVINCIA;
		case 3:
			return PUNTO_1 + PUNTO_2_EXTRANJERO;
		default:
			return PUNTO_1 + PUNTO_2_LOCAL;
	}
}

export const LEGALIZATION_ALERT_MESSAGE = `
Por favor, asegúrate de que la persona que vaya a recoger la legalización lleve consigo la <strong>carta poder</strong> impresa junto con su <strong>DNI físico</strong>. Estos documentos son indispensables para completar el trámite.
`;

export const LEGALIZATION_ALERT_MESSAGE_GENERA = `
Por favor, genera primero el documento y verifica que los datos sean correctos antes de proceder con la legalización.`;
