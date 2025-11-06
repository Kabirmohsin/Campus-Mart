import mongoose from 'mongoose';
import Product from '../models/Product.js';
import User from '../models/User.js';
import dotenv from 'dotenv';

dotenv.config();

const seedProducts = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Get any user as seller
    const user = await User.findOne();
    if (!user) {
      console.log('❌ No users found. Please register a user first.');
      console.log('💡 Tip: First register a user through frontend');
      process.exit(1);
    }

    console.log(`👤 Using seller: ${user.name} (${user.email})`);

    const products = [
      // Textbooks (8 items)
      {
        name: 'Introduction to Algorithms - 4th Edition',
        description: 'Comprehensive guide to computer algorithms and data structures. Perfect for CS students. Includes all chapters with detailed explanations and practice problems.',
        price: 45.99,
        originalPrice: 55.99,
        category: 'textbook',
        image: 'https://images.meesho.com/images/products/450567245/kvapu_512.webp?width=512',
        condition: 'Like New',
        stock: 5,
        seller: user._id,
        sellerName: user.name,
        rating: 4.8,
        campus: 'University Campus'
      },
      {
        name: 'Calculus: Early Transcendentals - 8th Edition',
        description: 'Latest edition with minimal highlighting. Perfect condition with all practice problems unsolved. Great for calculus courses.',
        price: 35.50,
        originalPrice: 42.50,
        category: 'textbook',
        image: 'https://i.ebayimg.com/images/g/YDIAAOSwPFZlt8cx/s-l1200.jpg',
        condition: 'Good',
        stock: 3,
        seller: user._id,
        sellerName: user.name,
        rating: 4.5,
        campus: 'University Campus'
      },
      {
        name: 'Organic Chemistry - Complete Reference',
        description: 'Complete textbook with practice problems and solutions. Includes reaction mechanisms and laboratory techniques. Barely used.',
        price: 55.00,
        originalPrice: 65.00,
        category: 'textbook',
        image: 'https://grbathla.com/wp-content/uploads/2020/10/organic-chemistry-1-1.jpg',
        condition: 'Like New',
        stock: 2,
        seller: user._id,
        sellerName: user.name,
        rating: 4.7,
        campus: 'University Campus'
      },
      {
        name: 'Principles of Economics - 10th Edition',
        description: 'Latest edition, perfect for econ 101 and 102 courses. Includes current economic case studies and real-world applications.',
        price: 40.00,
        originalPrice: 48.00,
        category: 'textbook',
        image: 'https://media.karousell.com/media/photos/products/2020/6/4/acjc_principles_of_economics_t_1591279263_0ef45b37_progressive.jpg',
        condition: 'Good',
        stock: 4,
        seller: user._id,
        sellerName: user.name,
        rating: 4.6,
        campus: 'University Campus'
      },
      {
        name: 'Physics for Scientists and Engineers',
        description: 'Comprehensive physics textbook with all chapters intact. Includes modern physics topics and engineering applications.',
        price: 60.00,
        originalPrice: 72.00,
        category: 'textbook',
        image: 'https://images.offerup.com/9V_1xWW5I1f5GZH649Q0kjzrxic=/1440x1920/fefc/fefc24109d544d749ec582bc5948574d.jpg',
        condition: 'Good',
        stock: 3,
        seller: user._id,
        sellerName: user.name,
        rating: 4.4,
        campus: 'University Campus'
      },
      {
        name: 'Psychology 101 - Complete Coursebook',
        description: 'Introduction to psychology, barely used. Covers all major theories and includes case studies. Perfect condition.',
        price: 30.00,
        originalPrice: 38.00,
        category: 'textbook',
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ9KAKPvWbDI3ZzGqxr4oHB1qakN38UH7OL9g&s',
        condition: 'Like New',
        stock: 6,
        seller: user._id,
        sellerName: user.name,
        rating: 4.9,
        campus: 'University Campus'
      },
      {
        name: 'Business Statistics & Analytics',
        description: 'Complete guide to business statistics and analytics. Includes data analysis techniques and business applications.',
        price: 42.50,
        originalPrice: 50.00,
        category: 'textbook',
        image: 'https://imgv2-1-f.scribdassets.com/img/document/849721411/original/69359a2b90/1?v=1',
        condition: 'Good',
        stock: 4,
        seller: user._id,
        sellerName: user.name,
        rating: 4.3,
        campus: 'University Campus'
      },
      {
        name: 'World History: Ancient to Modern',
        description: 'Comprehensive world history from ancient civilizations to modern times. Includes maps and historical documents.',
        price: 28.00,
        originalPrice: 35.00,
        category: 'textbook',
        image: 'https://m.media-amazon.com/images/I/81Xgvz69LwL._AC_UF1000,1000_QL80_.jpg',
        condition: 'Good',
        stock: 5,
        seller: user._id,
        sellerName: user.name,
        rating: 4.2,
        campus: 'University Campus'
      },

      // Gadgets (8 items)
      {
        name: 'MacBook Air M1 2020 - 8GB/256GB',
        description: '2020 model in perfect condition. 8GB RAM, 256GB SSD. Includes original box and charger. Battery health 95%.',
        price: 699.00,
        category: 'gadget',
        image: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400&h=500&fit=crop&crop=center',
        condition: 'New',
        stock: 2,
        seller: user._id,
        sellerName: user.name,
        rating: 4.9,
        campus: 'University Campus'
      },
      {
        name: 'iPad Air 4th Gen with Apple Pencil',
        description: 'Like new condition with Apple Pencil support. Perfect for note-taking and digital art. 64GB storage.',
        price: 450.00,
        category: 'gadget',
        image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=500&fit=crop&crop=center',
        condition: 'Like New',
        stock: 1,
        seller: user._id,
        sellerName: user.name,
        rating: 4.7,
        campus: 'University Campus'
      },
      {
        name: 'TI-84 Plus Graphing Calculator',
        description: 'Perfect for math and engineering courses. Includes carrying case and USB cable. All functions working perfectly.',
        price: 80.00,
        category: 'gadget',
        image: 'https://images.unsplash.com/photo-1587145820266-a5951ee6f620?w=400&h=500&fit=crop&crop=center',
        condition: 'Good',
        stock: 4,
        seller: user._id,
        sellerName: user.name,
        rating: 4.8,
        campus: 'University Campus'
      },
      {
        name: 'Sony WH-1000XM4 Noise Cancelling Headphones',
        description: 'Wireless headphones with industry-leading noise cancellation. Perfect for studying in noisy dorms. Includes original case.',
        price: 120.00,
        category: 'gadget',
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=500&fit=crop&crop=center',
        condition: 'Good',
        stock: 3,
        seller: user._id,
        sellerName: user.name,
        rating: 4.5,
        campus: 'University Campus'
      },
      {
        name: 'Dell 24" Full HD Monitor',
        description: '1080p monitor perfect for dual screen setup. Excellent condition with adjustable stand. Great for coding and research.',
        price: 95.00,
        category: 'gadget',
        image: 'https://rukminim2.flixcart.com/image/480/640/xif0q/monitor/a/b/b/-original-imahafuds2gysspu.jpeg?q=90',
        condition: 'Good',
        stock: 2,
        seller: user._id,
        sellerName: user.name,
        rating: 4.6,
        campus: 'University Campus'
      },
      {
        name: 'Casio fx-991EX Scientific Calculator',
        description: 'Like new with original packaging. Advanced scientific functions perfect for engineering and science courses.',
        price: 25.00,
        category: 'gadget',
        image: 'https://images.unsplash.com/photo-1587145820266-a5951ee6f620?w=400&h=500&fit=crop&crop=center',
        condition: 'Like New',
        stock: 8,
        seller: user._id,
        sellerName: user.name,
        rating: 4.9,
        campus: 'University Campus'
      },
      {
        name: 'Anker PowerCore 20000mAh Power Bank',
        description: 'Fast charging power bank for all devices. Includes USB-C and USB-A ports. Perfect for all-day campus use.',
        price: 35.00,
        category: 'gadget',
        image: 'https://rukminim2.flixcart.com/image/480/640/xif0q/power-bank/j/f/4/powercore-20000-mah-fast-charging-20000-powercore-20k-mah-anker-original-imaguj2zsbcywumh.jpeg?q=90',
        condition: 'New',
        stock: 6,
        seller: user._id,
        sellerName: user.name,
        rating: 4.4,
        campus: 'University Campus'
      },
      {
        name: 'Logitech MX Master 3 Wireless Mouse',
        description: 'Ergonomic wireless mouse perfect for long study sessions. Includes USB receiver and charging cable.',
        price: 20.00,
        category: 'gadget',
        image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=500&fit=crop&crop=center',
        condition: 'Like New',
        stock: 5,
        seller: user._id,
        sellerName: user.name,
        rating: 4.7,
        campus: 'University Campus'
      },

      // Notes (6 items)
      {
        name: 'Data Structures & Algorithms Complete Notes',
        description: 'Comprehensive handwritten notes covering all data structures topics. Includes code examples and complexity analysis.',
        price: 15.00,
        category: 'notes',
        image: 'https://s3.ap-south-1.amazonaws.com/rzp-prod-merchant-assets/payment-link/description/post-7-g_09_j2cohgg4tjiota',
        condition: 'Digital',
        stock: 50,
        seller: user._id,
        sellerName: user.name,
        rating: 4.9,
        campus: 'University Campus'
      },
      {
        name: 'Organic Chemistry Complete Study Guide',
        description: 'Digital notes with complete reaction mechanisms and practice problems. Includes spectroscopy and synthesis routes.',
        price: 12.00,
        category: 'notes',
        image: 'https://images.unsplash.com/photo-1581276879432-15e50529f34b?w=400&h=500&fit=crop&crop=center',
        condition: 'Digital',
        stock: 40,
        seller: user._id,
        sellerName: user.name,
        rating: 4.8,
        campus: 'University Campus'
      },
      {
        name: 'Calculus II Complete Solution Manual',
        description: 'Step-by-step solutions and theory explanations for all Calculus II topics. Perfect for exam preparation.',
        price: 10.00,
        category: 'notes',
        image: 'https://m.media-amazon.com/images/I/61zGLxENkUL.jpg_BO30,255,255,255_UF900,850_SR1910,1000,0,C_QL100_.jpg',
        condition: 'Digital',
        stock: 35,
        seller: user._id,
        sellerName: user.name,
        rating: 4.7,
        campus: 'University Campus'
      },
      {
        name: 'Microeconomics Complete Study Package',
        description: 'Complete notes, graphs, and practice questions for microeconomics. Includes real-world economic applications.',
        price: 8.00,
        category: 'notes',
        image: 'https://admin.bookmyassignments.com/assets/images/product_image/35655147.jpg',
        condition: 'Digital',
        stock: 45,
        seller: user._id,
        sellerName: user.name,
        rating: 4.6,
        campus: 'University Campus'
      },
      {
        name: 'Psychology 101 Digital Flash Cards',
        description: 'Comprehensive digital flash cards for all key concepts and theories. Perfect for quick revision and exam prep.',
        price: 6.00,
        category: 'notes',
        image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=500&fit=crop&crop=center',
        condition: 'Digital',
        stock: 60,
        seller: user._id,
        sellerName: user.name,
        rating: 4.5,
        campus: 'University Campus'
      },
      {
        name: 'Computer Applications – Class 9 Book',
        description: 'Explore the fundamentals of Computer Applications for Class 9 students.',
        price: 7.50,
        category: 'notes',
        image: 'http://blueprinteducation.co.in/wp-content/uploads/2024/01/Computer-application-9.jpg',
        condition: 'Digital',
        stock: 25,
        seller: user._id,
        sellerName: user.name,
        rating: 4.4,
        campus: 'University Campus'
      },

      // Additional Products (6 items)
      {
        name: 'Linear Algebra with Applications',
        description: 'Comprehensive linear algebra textbook with practical applications. Includes matrix operations and vector spaces.',
        price: 38.00,
        originalPrice: 45.00,
        category: 'textbook',
        image: 'https://m.media-amazon.com/images/I/71TPXjU3ixL._AC_UF1000,1000_QL80_.jpg',
        condition: 'Good',
        stock: 4,
        seller: user._id,
        sellerName: user.name,
        rating: 4.6,
        campus: 'University Campus'
      },
      {
        name: 'MacBook Pro 13" 2020 - 16GB/512GB',
        description: 'Powerful MacBook Pro for demanding tasks. 16GB RAM, 512GB SSD. Perfect for programming and design work.',
        price: 899.00,
        category: 'gadget',
        image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=500&fit=crop&crop=center',
        condition: 'New',
        stock: 1,
        seller: user._id,
        sellerName: user.name,
        rating: 4.9,
        campus: 'University Campus'
      },
      {
        name: 'Digital Marketing Complete Notes Book',
        description: 'Comprehensive digital marketing strategies and case studies. Perfect for business and marketing students.',
        price: 9.00,
        category: 'notes',
        image: 'https://authorsclick.com/wp-content/uploads/2025/03/1742742975.png',
        condition: 'Digital',
        stock: 30,
        seller: user._id,
        sellerName: user.name,
        rating: 4.7,
        campus: 'University Campus'
      },
      {
        name: 'Mechanical Engineering Handbook',
        description: 'Essential reference for mechanical engineering students. Covers thermodynamics, mechanics, and materials science.',
        price: 52.00,
        originalPrice: 60.00,
        category: 'textbook',
        image: 'https://m.media-amazon.com/images/I/51YBGtP1L0L._AC_UF1000,1000_QL80_.jpg',
        condition: 'Good',
        stock: 3,
        seller: user._id,
        sellerName: user.name,
        rating: 4.5,
        campus: 'University Campus'
      },
      {
        name: 'Wireless Keyboard and Mouse Combo',
        description: 'Logitech wireless keyboard and mouse combo. Perfect for desktop setup. Includes USB receiver.',
        price: 45.00,
        category: 'gadget',
        image: 'https://rukminim2.flixcart.com/image/480/480/juwzf680/computer-acc-combo/r/j/b/2-4g-wireless-backlit-glowing-keyboard-and-mouse-combo-1-retrack-original-imaffvqrcjnb6uha.jpeg?q=90',
        condition: 'Like New',
        stock: 4,
        seller: user._id,
        sellerName: user.name,
        rating: 4.6,
        campus: 'University Campus'
      },
      {
        name: 'Python Programming Complete Notes Book',
        description: 'Comprehensive Python programming notes from beginner to advanced. Includes projects and coding exercises.',
        price: 11.00,
        category: 'notes',
        image: 'https://newtondesk.com/wp-content/uploads/2022/04/python-programming-study-notes.jpg',
        condition: 'Digital',
        stock: 55,
        seller: user._id,
        sellerName: user.name,
        rating: 4.8,
        campus: 'University Campus'
      }
    ];

    // Clear existing products
    await Product.deleteMany({});
    console.log('🗑️ Cleared existing products');
    
    // ✅ FIX: Insert products in batches to avoid size limits
    const batchSize = 10;
    let insertedCount = 0;
    
    for (let i = 0; i < products.length; i += batchSize) {
      const batch = products.slice(i, i + batchSize);
      await Product.insertMany(batch);
      insertedCount += batch.length;
      console.log(`✅ Added batch ${Math.floor(i/batchSize) + 1}: ${batch.length} products`);
    }
    
    console.log('✅ Products seeded successfully!');
    console.log(`📦 Added ${insertedCount} products to database`);
    
    // Show added products
    const addedProducts = await Product.find().populate('seller', 'name email');
    console.log('\n📋 Added Products:');
    addedProducts.forEach((product, index) => {
      console.log(`${index + 1}. ${product.name} - $${product.price} (ID: ${product._id})`);
    });

    // Verify count
    const productCount = await Product.countDocuments();
    console.log(`\n🔢 Total products in database: ${productCount}`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding products:', error);
    process.exit(1);
  }
};

seedProducts();