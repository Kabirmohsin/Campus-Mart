import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import LoginForm from '../components/Auth/LoginForm';

const Login = () => {
  const [searchParams] = useSearchParams();
  const isSellerIntent = searchParams.get('intent') === 'seller';

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl">CM</span>
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
          {isSellerIntent ? 'Seller Login' : 'Sign in to CampusMart'}
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          {isSellerIntent 
            ? 'Access your seller account to manage products and sales'
            : 'Or '}
          {!isSellerIntent && (
            <Link
              to="/register"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              create a new account
            </Link>
          )}
        </p>
        
        {isSellerIntent && (
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-500">
              New seller?{' '}
              <Link
                to="/register?role=seller"
                className="font-medium text-green-600 hover:text-green-500"
              >
                Create seller account
              </Link>
            </p>
          </div>
        )}
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <LoginForm />
        </div>
      </div>
    </div>
  );
};

export default Login;