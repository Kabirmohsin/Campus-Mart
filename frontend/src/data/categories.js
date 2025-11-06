export const categories = [
  {
    id: 'textbook',
    name: 'Textbooks',
    description: 'Academic textbooks and course materials',
    icon: '📚',
    color: 'blue'
  },
  {
    id: 'gadget',
    name: 'Gadgets',
    description: 'Electronics and tech accessories',
    icon: '💻',
    color: 'green'
  },
  {
    id: 'notes',
    name: 'Notes',
    description: 'Study materials and lecture notes',
    icon: '📝',
    color: 'purple'
  }
];

export const getCategoryById = (id) => {
  return categories.find(category => category.id === id);
};

export const getCategoryColor = (categoryId) => {
  const category = getCategoryById(categoryId);
  return category ? category.color : 'gray';
};