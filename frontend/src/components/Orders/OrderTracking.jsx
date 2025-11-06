import React from 'react';
import { CheckCircle, Circle } from 'lucide-react';

const OrderTracking = ({ status }) => {
  const steps = [
    { key: 'pending', label: 'Order Placed' },
    { key: 'confirmed', label: 'Confirmed' },
    { key: 'shipped', label: 'Shipped' },
    { key: 'delivered', label: 'Delivered' }
  ];

  const getCurrentStepIndex = () => {
    switch (status) {
      case 'pending': return 0;
      case 'confirmed': return 1;
      case 'shipped': return 2;
      case 'delivered': return 3;
      default: return 0;
    }
  };

  const currentStepIndex = getCurrentStepIndex();

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="flex justify-between items-center relative">
        {/* Progress line */}
        <div className="absolute top-4 left-0 right-0 h-0.5 bg-gray-200 -z-10">
          <div
            className="h-full bg-blue-600 transition-all duration-300"
            style={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
          ></div>
        </div>

        {steps.map((step, index) => {
          const isCompleted = index <= currentStepIndex;
          const isCurrent = index === currentStepIndex;

          return (
            <div key={step.key} className="flex flex-col items-center relative z-10">
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                  isCompleted
                    ? 'bg-blue-600 border-blue-600 text-white'
                    : isCurrent
                    ? 'border-blue-600 bg-white text-blue-600'
                    : 'border-gray-300 bg-white text-gray-400'
                }`}
              >
                {isCompleted ? (
                  <CheckCircle className="w-4 h-4" />
                ) : (
                  <Circle className="w-4 h-4" />
                )}
              </div>
              <span
                className={`text-xs mt-2 font-medium ${
                  isCompleted || isCurrent
                    ? 'text-blue-600'
                    : 'text-gray-500'
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OrderTracking;