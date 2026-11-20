import { Shoe, ShoeColor } from '../types/shoe';

export const WHATSAPP_PHONE = '923008241986'; // +92 300 8241986
export const WHATSAPP_DISPLAY = '+92 300 8241986';

/**
 * Generate a WhatsApp deep-link for ordering a single shoe with selected color and size.
 */
export function getWhatsAppShoeOrderUrl(
  shoe: Shoe,
  color: ShoeColor | string,
  size: number | string,
  city = 'Karachi'
): string {
  const colorName = typeof color === 'string' ? color : color.name;
  const productUrl = `https://thriftandtrend.vercel.app/product/${shoe.slug || shoe.id}`;
  
  const text = `Salam! Mujhe '${shoe.name}' (Color: ${colorName}, Size: ${size}) order karna hai. Cash on Delivery ${city} ke liye total kitna hoga?\n\nProduct Link: ${productUrl}`;
  
  return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(text)}`;
}

/**
 * Generate a WhatsApp deep-link for placing an order for the entire cart.
 */
export function getWhatsAppCartOrderUrl(
  items: Array<{
    shoe: Shoe;
    selectedColor: ShoeColor;
    selectedSize: number;
    quantity: number;
  }>,
  totalAmount: number,
  totalSavings: number,
  customerName?: string,
  customerCity?: string
): string {
  const itemsText = items
    .map(
      (item, idx) =>
        `${idx + 1}. ${item.shoe.name} (Color: ${item.selectedColor.name}, Size: ${item.selectedSize}) x ${item.quantity} = Rs. ${(item.shoe.price * item.quantity).toLocaleString()}`
    )
    .join('\n');

  const greeting = customerName ? `Salam! Main ${customerName} baat kar raha hoon.` : 'Salam!';
  const cityText = customerCity ? `Delivery City: ${customerCity}` : 'Delivery: Cash on Delivery (COD)';

  const text = `${greeting} Mujhe Thrift & Trend se yeh order place karna hai:\n\n${itemsText}\n\nTotal Amount: Rs. ${totalAmount.toLocaleString()} (Thrift Savings: Rs. ${totalSavings.toLocaleString()})\n${cityText}\nPayment Method: Cash on Delivery (COD)\n\nKindly confirm availability aur dispatch timeline bata dein. Shukriya!`;

  return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(text)}`;
}

/**
 * Generate an order confirmation WhatsApp message for the store owner / customer.
 */
export function getWhatsAppOrderConfirmationUrl(order: {
  id: string;
  customerName: string;
  customerPhone?: string;
  totalAmount: number;
  shippingAddress: string;
  city?: string;
  trackingNumber: string;
}): string {
  const cityText = order.city ? `, ${order.city}` : '';
  const text = `Salam! Main ne Thrift & Trend par Order #${order.id} place kiya hai.\nCustomer: ${order.customerName}\nAddress: ${order.shippingAddress}${cityText}\nTotal Due: Rs. ${order.totalAmount.toLocaleString()} (Cash on Delivery)\nTracking: ${order.trackingNumber}\n\nKindly dispatch status confirm kar dein!`;

  return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(text)}`;
}

/**
 * Generate a customer tracking update message for the Admin to send via WhatsApp.
 */
export function getWhatsAppAdminTrackingUpdateUrl(
  customerPhone: string,
  customerName: string,
  orderId: string,
  trackingNumber: string,
  courier = 'TCS / Trax'
): string {
  const cleanedPhone = customerPhone.replace(/\D/g, '');
  const targetPhone = cleanedPhone.startsWith('0') ? '92' + cleanedPhone.slice(1) : cleanedPhone;

  const text = `Salam ${customerName}! Aapka Thrift & Trend Order #${orderId} ${courier} ke zariye dispatch ho chuka hai.\nTracking Number: ${trackingNumber}\nExpected Delivery: 2-3 Working Days.\n\nAap parcel receive hone par Cash on Delivery de sakte hain. Shukriya for shopping with Thrift & Trend!`;

  return `https://wa.me/${targetPhone || WHATSAPP_PHONE}?text=${encodeURIComponent(text)}`;
}
