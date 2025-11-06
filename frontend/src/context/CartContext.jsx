import React, { createContext, useContext, useReducer, useEffect } from 'react';
import toast from 'react-hot-toast';
import { cartService } from '../services/cartService';
import { useAuth } from './AuthContext';

const CartContext = createContext();

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'LOAD_CART':
      return {
        ...state,
        items: action.payload || []
      };

    case 'ADD_TO_CART':
      const existingItemIndex = state.items.findIndex(
        item => item.product?._id === action.payload._id || item._id === action.payload._id
      );
      
      if (existingItemIndex >= 0) {
        const updatedItems = state.items.map((item, index) =>
          index === existingItemIndex
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
        return { ...state, items: updatedItems };
      } else {
        const newItems = [...state.items, { 
          product: action.payload, 
          quantity: 1,
          price: action.payload.price,
          _id: action.payload._id 
        }];
        return { ...state, items: newItems };
      }

    case 'UPDATE_QUANTITY':
      const updatedItems = state.items.map(item =>
        (item.product?._id === action.payload.id || item._id === action.payload.id)
          ? { ...item, quantity: action.payload.quantity }
          : item
      );
      return { ...state, items: updatedItems };

    case 'REMOVE_FROM_CART':
      const filteredItems = state.items.filter(item => 
        (item.product?._id !== action.payload && item._id !== action.payload)
      );
      return { ...state, items: filteredItems };

    case 'CLEAR_CART':
      return { ...state, items: [] };

    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, {
    items: []
  });
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadCartFromBackend();
    } else {
      // Load from local storage for guest users
      const savedCart = localStorage.getItem('campusmart_cart');
      if (savedCart) {
        try {
          const cartData = JSON.parse(savedCart);
          dispatch({ type: 'LOAD_CART', payload: cartData });
        } catch (error) {
          console.error('Error parsing cart:', error);
        }
      }
    }
  }, [user]);

  const loadCartFromBackend = async () => {
    try {
      const result = await cartService.getCart();
      dispatch({ type: 'LOAD_CART', payload: result.cart?.items || [] });
    } catch (error) {
      console.error('Error loading cart from backend:', error);
      // Fallback to local storage
      const savedCart = localStorage.getItem('campusmart_cart');
      if (savedCart) {
        try {
          const cartData = JSON.parse(savedCart);
          dispatch({ type: 'LOAD_CART', payload: cartData });
        } catch (error) {
          console.error('Error parsing cart:', error);
        }
      }
    }
  };

  const syncCartToBackend = async (items) => {
    if (!user) return;
    
    try {
      // Clear existing cart and add all items
      await cartService.clearCart();
      for (const item of items) {
        await cartService.addToCart(item.product?._id || item._id, item.quantity);
      }
    } catch (error) {
      console.error('Error syncing cart to backend:', error);
    }
  };

  const addToCart = async (product) => {
    try {
      if (user) {
        await cartService.addToCart(product._id, 1);
      }
      
      dispatch({ type: 'ADD_TO_CART', payload: product });
      
      if (!user) {
        localStorage.setItem('campusmart_cart', JSON.stringify(state.items));
      }
      
      toast.success(`${product.name} added to cart`);
    } catch (error) {
      console.error('Add to cart error:', error);
      const errorMessage = error.response?.data?.message || 'Failed to add item to cart';
      toast.error(errorMessage);
    }
  };

  const removeFromCart = async (productId) => {
    try {
      if (user) {
        // Find the cart item ID from backend
        const cartResult = await cartService.getCart();
        const cartItem = cartResult.cart?.items.find(item => 
          item.product?._id === productId || item._id === productId
        );
        if (cartItem) {
          await cartService.removeFromCart(cartItem._id);
        }
      }
      
      dispatch({ type: 'REMOVE_FROM_CART', payload: productId });
      
      if (!user) {
        localStorage.setItem('campusmart_cart', JSON.stringify(state.items));
      }
      
      toast.success('Item removed from cart');
    } catch (error) {
      console.error('Remove from cart error:', error);
      toast.error('Failed to remove item from cart');
    }
  };

  const updateQuantity = async (productId, quantity) => {
    try {
      if (quantity <= 0) {
        removeFromCart(productId);
        return;
      }

      if (user) {
        const cartResult = await cartService.getCart();
        const cartItem = cartResult.cart?.items.find(item => 
          item.product?._id === productId || item._id === productId
        );
        if (cartItem) {
          await cartService.updateCartItem(cartItem._id, quantity);
        }
      }

      dispatch({ 
        type: 'UPDATE_QUANTITY', 
        payload: { 
          id: productId,
          quantity: quantity 
        } 
      });

      if (!user) {
        localStorage.setItem('campusmart_cart', JSON.stringify(state.items));
      }
    } catch (error) {
      console.error('Update quantity error:', error);
      toast.error('Failed to update quantity');
    }
  };

  const clearCart = async () => {
    try {
      if (user) {
        await cartService.clearCart();
      }
      
      dispatch({ type: 'CLEAR_CART' });
      localStorage.removeItem('campusmart_cart');
      toast.success('Cart cleared');
    } catch (error) {
      console.error('Clear cart error:', error);
      toast.error('Failed to clear cart');
    }
  };

  const getCartTotal = () => {
    return state.items.reduce((total, item) => {
      const price = item.product?.price || item.price;
      return total + (price * item.quantity);
    }, 0);
  };

  const getCartItemsCount = () => {
    return state.items.reduce((total, item) => total + item.quantity, 0);
  };

  const getCartItems = () => {
    return state.items;
  };

  return (
    <CartContext.Provider value={{
      cart: state,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getCartTotal,
      getCartItemsCount,
      getCartItems
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};