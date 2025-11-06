import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import RegisterForm from '../components/Auth/RegisterForm';

const Register = () => {
  const [searchParams] = useSearchParams();
  const isSellerRegistration = searchParams.get('role') === 'seller';

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl">CM</span>
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
          {isSellerRegistration ? 'Become a Seller' : 'Create your account'}
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          {isSellerRegistration 
            ? 'Start selling to campus students'
            : 'Or '}
          {!isSellerRegistration && (
            <Link
              to="/login"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              sign in to your existing account
            </Link>
          )}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <RegisterForm />
        </div>
      </div>
    </div>
  );
};

export default Register;