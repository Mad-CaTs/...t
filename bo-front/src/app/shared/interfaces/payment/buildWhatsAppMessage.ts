export interface PaymentInfo {
  name: string;
  dueDate: string;
  status: string;
  amount: number;
  membershipName: string;
}

export function buildWhatsAppMessage(payment: PaymentInfo): string {
  return `URGENTE: Evita la suspensión 🚨

Hola, ${payment.name} 👋

Detectamos un problema con tu método de pago del ${payment.dueDate} y tu membresía podría entrar en deuda y quedar en mora. 😟

Detalle del cargo pendiente:
• Membresía ${payment.membershipName} (${payment.status}) – $${payment.amount} / mes
• Fecha de facturación: ${payment.dueDate}

Si necesitas ayuda, escríbenos al soporte soporte.inclub.01@gmail.com

¡Gracias! 🙏
— Equipo Inclub Network`;
}
