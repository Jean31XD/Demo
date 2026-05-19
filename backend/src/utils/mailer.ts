import fs from 'fs';
import path from 'path';

export async function sendOrderConfirmationEmail(order: any, customer: any, products: any[]) {
  const emailDir = path.join(process.cwd(), 'emails');
  if (!fs.existsSync(emailDir)) {
    fs.mkdirSync(emailDir, { recursive: true });
  }

  const itemsHtml = order.items.map((item: any) => {
    const prod = products.find(p => p.id === item.productId);
    return `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">${prod?.name || 'Producto'}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">RD$${item.unitPrice.toLocaleString()}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">RD$${(item.quantity * item.unitPrice).toLocaleString()}</td>
      </tr>
    `;
  }).join('');

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Confirmación de Orden #${order.id}</title>
      </head>
      <body style="font-family: sans-serif; color: #333; background: #f9f9f9; padding: 20px;">
        <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
          <div style="background: linear-gradient(135deg, #DC2626 0%, #991B1B 100%); padding: 30px; text-align: center; color: white;">
            <h1 style="margin: 0; font-size: 24px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em;">La Tremenda Ferretería</h1>
            <p style="margin: 5px 0 0 0; opacity: 0.85; font-size: 14px;">¡Confirmación de Compra!</p>
          </div>
          <div style="padding: 30px;">
            <h2 style="margin-top: 0; color: #111827;">Hola, ${customer.name}</h2>
            <p>Gracias por tu compra. Hemos recibido tu pedido y lo estamos procesando.</p>
            
            <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 15px; margin: 20px 0;">
              <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
                <tr>
                  <td style="font-weight: bold; color: #475569; width: 120px;">Orden ID:</td>
                  <td style="color: #0f172a; font-family: monospace;">${order.id}</td>
                </tr>
                <tr>
                  <td style="font-weight: bold; color: #475569;">Fecha:</td>
                  <td style="color: #0f172a;">${new Date(order.createdAt).toLocaleString('es-MX')}</td>
                </tr>
                <tr>
                  <td style="font-weight: bold; color: #475569;">Estado:</td>
                  <td style="color: #16a34a; font-weight: bold;">Confirmada / Pagada</td>
                </tr>
                <tr>
                  <td style="font-weight: bold; color: #475569;">Dirección:</td>
                  <td style="color: #0f172a;">${order.shippingAddr || 'Retiro en tienda'}</td>
                </tr>
              </table>
            </div>

            <h3 style="color: #111827; border-bottom: 2px solid #f1f5f9; padding-bottom: 8px;">Detalles de la Orden</h3>
            <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
              <thead>
                <tr style="background: #f8fafc;">
                  <th style="padding: 10px; text-align: left; font-weight: bold; color: #475569;">Producto</th>
                  <th style="padding: 10px; text-align: center; font-weight: bold; color: #475569;">Cant.</th>
                  <th style="padding: 10px; text-align: right; font-weight: bold; color: #475569;">Precio</th>
                  <th style="padding: 10px; text-align: right; font-weight: bold; color: #475569;">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
              </tbody>
              <tfoot>
                <tr>
                  <td colspan="3" style="padding: 15px 10px 10px; text-align: right; font-weight: bold; color: #475569;">Total:</td>
                  <td style="padding: 15px 10px 10px; text-align: right; font-weight: bold; color: #111827; font-size: 16px;">RD$${order.total.toLocaleString()}</td>
                </tr>
              </tfoot>
            </table>

            <div style="margin-top: 30px; text-align: center; border-top: 1px solid #e2e8f0; padding-top: 20px; font-size: 12px; color: #64748b;">
              <p>Si tienes alguna pregunta, contáctanos a soporte@latremendaferreteria.com o llámanos al (809) 801-1234.</p>
              <p>&copy; ${new Date().getFullYear()} La Tremenda Ferretería & Hogar. Todos los derechos reservados.</p>
            </div>
          </div>
        </div>
      </body>
    </html>
  `;

  const filePath = path.join(emailDir, `order-${order.id}.html`);
  fs.writeFileSync(filePath, html);
  console.log(`[MAILER] Email de confirmación guardado exitosamente en: ${filePath}`);
}
