import React from 'react';
import { CreditCard, DollarSign } from 'lucide-react';

const PaymentMethod = ({ selectedMethod, onMethodChange }) => {
  const paymentMethods = [
    {
      id: 'cod',
      name: 'Cash on Delivery',
      description: 'Pay when you receive your items',
      icon: DollarSign
    }
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-800">Payment Method</h3>
      
      <div className="space-y-3">
        {paymentMethods.map((method) => {
          const IconComponent = method.icon;
          const isSelected = selectedMethod === method.id;

          return (
            <div
              key={method.id}
              onClick={() => onMethodChange(method.id)}
              className={`border-2 rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                isSelected
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    isSelected
                      ? 'border-blue-500 bg-blue-500'
                      : 'border-gray-400'
                  }`}
                >
                  {isSelected && (
                    <div className="w-2 h-2 rounded-full bg-white"></div>
                  )}
                </div>
                
                <IconComponent
                  className={`h-6 w-6 ${
                    isSelected ? 'text-blue-600' : 'text-gray-400'
                  }`}
                />
                
                <div className="flex-1">
                  <h4 className="font-medium text-gray-800">{method.name}</h4>
                  <p className="text-sm text-gray-600">{method.description}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* COD Notice */}
      {selectedMethod === 'cod' && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h4 className="font-semibold text-yellow-800 text-sm mb-2">
            Cash on Delivery Instructions
          </h4>
          <ul className="text-yellow-700 text-sm space-y-1">
            <li>• Have exact cash ready when the delivery arrives</li>
            <li>• You can inspect the items before payment</li>
            <li>• Delivery usually within 2-3 business days on campus</li>
            <li>• Contact support if you need to change delivery time</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default PaymentMethod;