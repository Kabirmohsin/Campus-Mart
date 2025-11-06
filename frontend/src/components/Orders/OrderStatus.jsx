import React from 'react';
import { CheckCircle, Clock, Truck, XCircle } from 'lucide-react';

const OrderStatus = ({ status }) => {
  const getStatusConfig = (status) => {
    switch (status) {
      case 'pending':
        return {
          color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
          icon: Clock,
          label: 'Pending'
        };
      case 'confirmed':
        return {
          color: 'bg-blue-100 text-blue-800 border-blue-200',
          icon: CheckCircle,
          label: 'Confirmed'
        };
      case 'shipped':
        return {
          color: 'bg-purple-100 text-purple-800 border-purple-200',
          icon: Truck,
          label: 'Shipped'
        };
      case 'delivered':
        return {
          color: 'bg-green-100 text-green-800 border-green-200',
          icon: CheckCircle,
          label: 'Delivered'
        };
      case 'cancelled':
        return {
          color: 'bg-red-100 text-red-800 border-red-200',
          icon: XCircle,
          label: 'Cancelled'
        };
      default:
        return {
          color: 'bg-gray-100 text-gray-800 border-gray-200',
          icon: Clock,
          label: 'Unknown'
        };
    }
  };

  const config = getStatusConfig(status);
  const IconComponent = config.icon;

  return (
    <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full border text-sm font-medium ${config.color}`}>
      <IconComponent className="h-3 w-3" />
      <span>{config.label}</span>
    </div>
  );
};

export default OrderStatus;