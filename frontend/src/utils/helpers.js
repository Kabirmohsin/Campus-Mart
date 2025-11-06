export const formatPrice = (price) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(price);
};

export const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const truncateText = (text, maxLength) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export const generateOrderId = () => {
  return 'CM' + Date.now().toString().slice(-6);
};

export const calculateOrderTotal = (items, taxRate = 0.08, shippingFee = 5) => {
  const subtotal = items.reduce((total, item) => total + (item.price * item.quantity), 0);
  const tax = subtotal * taxRate;
  const shipping = subtotal > 0 ? shippingFee : 0;
  const total = subtotal + tax + shipping;
  
  return {
    subtotal: parseFloat(subtotal.toFixed(2)),
    tax: parseFloat(tax.toFixed(2)),
    shipping: parseFloat(shipping.toFixed(2)),
    total: parseFloat(total.toFixed(2))
  };
};