export const orderStatus = {
  PENDING: {
    value: 'pending',
    label: 'Pending',
    color: 'yellow',
    description: 'Order has been placed and is awaiting confirmation'
  },
  CONFIRMED: {
    value: 'confirmed',
    label: 'Confirmed',
    color: 'blue',
    description: 'Order has been confirmed and is being processed'
  },
  SHIPPED: {
    value: 'shipped',
    label: 'Shipped',
    color: 'purple',
    description: 'Order has been shipped and is in transit'
  },
  DELIVERED: {
    value: 'delivered',
    label: 'Delivered',
    color: 'green',
    description: 'Order has been successfully delivered'
  },
  CANCELLED: {
    value: 'cancelled',
    label: 'Cancelled',
    color: 'red',
    description: 'Order has been cancelled'
  }
};

export const getStatusInfo = (status) => {
  return orderStatus[status.toUpperCase()] || orderStatus.PENDING;
};

export const getNextStatus = (currentStatus) => {
  const statusFlow = ['pending', 'confirmed', 'shipped', 'delivered'];
  const currentIndex = statusFlow.indexOf(currentStatus);
  return currentIndex < statusFlow.length - 1 ? statusFlow[currentIndex + 1] : null;
};