import React, { createContext, useContext, useReducer, useEffect } from 'react';
import toast from 'react-hot-toast';
import { orderService } from '../services/orderService';
import { useAuth } from './AuthContext';

const OrderContext = createContext();

const orderReducer = (state, action) => {
  switch (action.type) {
    case 'SET_ORDERS':
      return {
        ...state,
        orders: action.payload
      };

    case 'ADD_ORDER':
      const newOrders = [action.payload, ...state.orders];
      return {
        ...state,
        orders: newOrders
      };

    case 'UPDATE_ORDER_STATUS':
      const updatedOrders = state.orders.map(order =>
        order._id === action.payload.orderId
          ? { ...order, status: action.payload.status }
          : order
      );
      return {
        ...state,
        orders: updatedOrders
      };

    default:
      return state;
  }
};

export const OrderProvider = ({ children }) => {
  const [state, dispatch] = useReducer(orderReducer, {
    orders: []
  });
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadOrdersFromBackend();
    } else {
      // Load from local storage for guest users
      const savedOrders = localStorage.getItem('campusmart_orders');
      if (savedOrders) {
        dispatch({ type: 'SET_ORDERS', payload: JSON.parse(savedOrders) });
      }
    }
  }, [user]);

  const loadOrdersFromBackend = async () => {
    try {
      const result = await orderService.getUserOrders();
      dispatch({ type: 'SET_ORDERS', payload: result.orders || [] });
    } catch (error) {
      console.error('Error loading orders from backend:', error);
      // Fallback to local storage
      const savedOrders = localStorage.getItem('campusmart_orders');
      if (savedOrders) {
        dispatch({ type: 'SET_ORDERS', payload: JSON.parse(savedOrders) });
      }
    }
  };

  const createOrder = async (orderData) => {
    try {
      const result = await orderService.createOrder(orderData);
      
      if (result.success) {
        dispatch({ type: 'ADD_ORDER', payload: result.order });
        
        if (!user) {
          const savedOrders = localStorage.getItem('campusmart_orders') || '[]';
          const orders = JSON.parse(savedOrders);
          orders.unshift(result.order);
          localStorage.setItem('campusmart_orders', JSON.stringify(orders));
        }
        
        toast.success('Order placed successfully!');
        return { success: true, order: result.order };
      }
    } catch (error) {
      console.error('Create order error:', error);
      const errorMessage = error.response?.data?.message || 'Failed to create order';
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const getOrderById = (orderId) => {
    return state.orders.find(order => order._id === orderId);
  };

  const getUserOrders = () => {
    return state.orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  };

  const getAllOrders = () => {
    return state.orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      await orderService.updateOrderStatus(orderId, status);
      dispatch({
        type: 'UPDATE_ORDER_STATUS',
        payload: { orderId, status }
      });
      toast.success(`Order status updated to ${status}`);
    } catch (error) {
      console.error('Update order status error:', error);
      toast.error('Failed to update order status');
    }
  };

  return (
    <OrderContext.Provider value={{
      orders: state.orders,
      createOrder,
      getOrderById,
      getUserOrders,
      getAllOrders,
      updateOrderStatus
    }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
};