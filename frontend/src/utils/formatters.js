export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
};

export const formatCategory = (category) => {
  return category.charAt(0).toUpperCase() + category.slice(1);
};

export const formatOrderStatus = (status) => {
  const statusMap = {
    pending: 'Pending',
    confirmed: 'Confirmed',
    shipped: 'Shipped',
    delivered: 'Delivered',
    cancelled: 'Cancelled'
  };
  return statusMap[status] || status;
};

export const getInitials = (name) => {
  return name
    .split(' ')
    .map(part => part.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
};