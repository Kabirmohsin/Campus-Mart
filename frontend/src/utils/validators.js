export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone) => {
  const phoneRegex = /^\+?[\d\s-()]{10,}$/;
  return phoneRegex.test(phone);
};

export const validatePassword = (password) => {
  return password.length >= 6;
};

export const validateName = (name) => {
  return name.trim().length >= 2;
};

export const validateProduct = (product) => {
  const errors = {};

  if (!product.name || product.name.trim().length < 2) {
    errors.name = 'Product name must be at least 2 characters long';
  }

  if (!product.description || product.description.trim().length < 10) {
    errors.description = 'Description must be at least 10 characters long';
  }

  if (!product.price || product.price <= 0) {
    errors.price = 'Price must be greater than 0';
  }

  if (!product.stock || product.stock < 0) {
    errors.stock = 'Stock must be 0 or greater';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};