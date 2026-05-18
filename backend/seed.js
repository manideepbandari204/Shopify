require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');

const products = [
  // Women
  { name: 'Floral Summer Dress', price: 45.99, originalPrice: 65.99, category: 'Women', subcategory: 'Dresses', rating: 4.5, reviews: 128, image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=600&q=80', badge: 'Sale', description: 'A beautiful floral dress perfect for summer outings. Made from lightweight breathable fabric that keeps you cool all day long.' },
  { name: 'Elegant Evening Gown', price: 120.00, originalPrice: null, category: 'Women', subcategory: 'Dresses', rating: 4.8, reviews: 64, image: 'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=600&q=80', badge: 'New', description: 'A sophisticated evening gown that makes you shine at any event. Features a flattering silhouette and premium fabric.' },
  { name: 'Women Leather Handbag', price: 89.99, originalPrice: 110.00, category: 'Women', subcategory: 'Accessories', rating: 4.6, reviews: 89, image: 'https://images.unsplash.com/photo-1584916201218-f4242ceb4809?w=600&q=80', badge: 'Sale', description: 'A stylish leather handbag with multiple compartments. Perfect for work or casual outings.' },
  { name: 'Women Summer Hat', price: 24.99, originalPrice: null, category: 'Women', subcategory: 'Accessories', rating: 4.3, reviews: 42, image: 'https://images.unsplash.com/photo-1521369909029-2afed882ba28?w=600&q=80', badge: null, description: 'A chic wide-brim sun hat perfect for beach days and summer adventures. UV protective.' },
  { name: 'Casual Maxi Skirt', price: 38.50, originalPrice: 55.00, category: 'Women', subcategory: 'Bottoms', rating: 4.4, reviews: 73, image: 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=600&q=80', badge: 'Sale', description: 'A flowing maxi skirt in soft fabric. Versatile enough for both casual and semi-formal occasions.' },
  { name: 'Women Boho Blouse', price: 32.00, originalPrice: null, category: 'Women', subcategory: 'Tops', rating: 4.2, reviews: 55, image: 'https://images.unsplash.com/photo-1554568218-0f1715e72254?w=600&q=80', badge: 'New', description: 'A beautiful boho-inspired blouse with intricate embroidery details. Pairs well with jeans or skirts.' },
  { name: 'Women Trench Coat', price: 149.00, originalPrice: 199.00, category: 'Women', subcategory: 'Outerwear', rating: 4.7, reviews: 102, image: 'https://images.unsplash.com/photo-1548624313-0396c75e4b1a?w=600&q=80', badge: 'Sale', description: 'A timeless trench coat that never goes out of style. Water-resistant outer shell with cozy inner lining.' },
  { name: 'Women Yoga Leggings', price: 29.99, originalPrice: null, category: 'Women', subcategory: 'Activewear', rating: 4.6, reviews: 218, image: 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=600&q=80', badge: 'Bestseller', description: 'High-waist yoga leggings with four-way stretch. Moisture-wicking fabric keeps you comfortable during any workout.' },

  // Men
  { name: 'Classic Denim Jacket', price: 59.99, originalPrice: 80.00, category: 'Men', subcategory: 'Outerwear', rating: 4.5, reviews: 97, image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=600&q=80', badge: 'Sale', description: 'A classic denim jacket that never goes out of style. Heavy-duty denim with classic button closure.' },
  { name: 'Men Casual Shirt', price: 34.50, originalPrice: null, category: 'Men', subcategory: 'Shirts', rating: 4.3, reviews: 61, image: 'https://images.unsplash.com/photo-1596755094514-f87e32f85e2c?w=600&q=80', badge: 'New', description: 'A relaxed-fit casual shirt perfect for weekend outings. 100% cotton for breathability.' },
  { name: 'Men Chino Pants', price: 49.50, originalPrice: 65.00, category: 'Men', subcategory: 'Pants', rating: 4.4, reviews: 84, image: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600&q=80', badge: 'Sale', description: 'Smart chino pants in a slim fit. Versatile enough to dress up or down for any occasion.' },
  { name: 'Men Leather Shoes', price: 79.99, originalPrice: null, category: 'Men', subcategory: 'Footwear', rating: 4.7, reviews: 143, image: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=600&q=80', badge: 'Bestseller', description: 'Premium leather Oxford shoes handcrafted from genuine leather. Perfect for formal occasions.' },
  { name: 'Men Slim Fit Suit', price: 199.00, originalPrice: 280.00, category: 'Men', subcategory: 'Formal', rating: 4.8, reviews: 56, image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&q=80', badge: 'Sale', description: 'A sophisticated slim-fit suit in premium wool blend. Includes jacket and trousers.' },
  { name: 'Men Sports Hoodie', price: 44.99, originalPrice: null, category: 'Men', subcategory: 'Activewear', rating: 4.5, reviews: 167, image: 'https://images.unsplash.com/photo-1556821840-3a63f15232d0?w=600&q=80', badge: 'New', description: 'A comfortable pullover hoodie for sports and casual wear. Fleece lining for warmth.' },
  { name: 'Men Running Sneakers', price: 89.00, originalPrice: 115.00, category: 'Men', subcategory: 'Footwear', rating: 4.6, reviews: 203, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80', badge: 'Sale', description: 'Lightweight running sneakers with responsive cushioning. Engineered mesh upper for breathability.' },
  { name: 'Men Polo T-Shirt', price: 29.99, originalPrice: null, category: 'Men', subcategory: 'Shirts', rating: 4.2, reviews: 88, image: 'https://images.unsplash.com/photo-1589310243389-96a5483213a8?w=600&q=80', badge: null, description: 'A classic polo T-shirt in premium pique cotton. Timeless style for casual and smart-casual occasions.' },

  // Kids
  { name: 'Kids Striped T-Shirt', price: 19.99, originalPrice: null, category: 'Kids', subcategory: 'Tops', rating: 4.4, reviews: 76, image: 'https://images.unsplash.com/photo-1519241047957-be31d7379a5d?w=600&q=80', badge: 'New', description: 'A fun striped T-shirt for active kids. Soft cotton fabric that is gentle on sensitive skin.' },
  { name: 'Kids Denim Overalls', price: 29.99, originalPrice: 40.00, category: 'Kids', subcategory: 'Bottoms', rating: 4.5, reviews: 58, image: 'https://images.unsplash.com/photo-1516257984-b1b4d707412e?w=600&q=80', badge: 'Sale', description: 'Adorable denim overalls with adjustable straps. Durable enough for active play every day.' },
  { name: 'Kids Winter Jacket', price: 39.99, originalPrice: 55.00, category: 'Kids', subcategory: 'Outerwear', rating: 4.6, reviews: 92, image: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?w=600&q=80', badge: 'Sale', description: 'A warm and cozy winter jacket with a removable hood. Water-resistant outer shell.' },
  { name: 'Kids Colorful Sneakers', price: 34.99, originalPrice: null, category: 'Kids', subcategory: 'Footwear', rating: 4.7, reviews: 110, image: 'https://images.unsplash.com/photo-1514989940723-e8e51635b782?w=600&q=80', badge: 'Bestseller', description: 'Bright and colorful sneakers that kids love. Non-slip sole for safety and easy velcro closure.' },
  { name: 'Kids Party Dress', price: 35.00, originalPrice: 50.00, category: 'Kids', subcategory: 'Dresses', rating: 4.8, reviews: 47, image: 'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=600&q=80', badge: 'Sale', description: 'A gorgeous party dress with tulle skirt and sparkle details. Perfect for birthdays and special occasions.' },
  { name: 'Kids Cartoon Pajamas', price: 22.99, originalPrice: null, category: 'Kids', subcategory: 'Sleepwear', rating: 4.5, reviews: 134, image: 'https://images.unsplash.com/photo-1471286174890-9c112ffca5b4?w=600&q=80', badge: 'New', description: 'Fun cartoon-print pajama set for cozy nights. Ultra-soft fleece fabric keeps kids warm.' },
  { name: 'Kids School Backpack', price: 27.99, originalPrice: 38.00, category: 'Kids', subcategory: 'Accessories', rating: 4.4, reviews: 89, image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&q=80', badge: 'Sale', description: 'A durable school backpack with multiple compartments and ergonomic padded straps.' },
  { name: 'Kids Graphic Hoodie', price: 31.50, originalPrice: null, category: 'Kids', subcategory: 'Tops', rating: 4.3, reviews: 62, image: 'https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=600&q=80', badge: null, description: 'A warm graphic hoodie featuring playful prints. Kangaroo pocket and soft fleece lining.' },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB Atlas');

    await Product.deleteMany({});
    console.log('🗑️  Cleared existing products');

    const inserted = await Product.insertMany(products);
    console.log(`🌱 Seeded ${inserted.length} products successfully!`);

    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed failed:', err.message);
    process.exit(1);
  }
}

seed();
