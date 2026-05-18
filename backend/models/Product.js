const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name:          { type: String, required: true, trim: true },
    price:         { type: Number, required: true, min: 0 },
    originalPrice: { type: Number, default: null },
    category:      { type: String, required: true, enum: ['Women', 'Men', 'Kids'] },
    subcategory:   { type: String, required: true },
    rating:        { type: Number, default: 0, min: 0, max: 5 },
    reviews:       { type: Number, default: 0 },
    image:         { type: String, required: true },
    badge:         { type: String, default: null },
    description:   { type: String, default: '' },
    inStock:       { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);
