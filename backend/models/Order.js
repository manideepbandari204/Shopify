const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  productId:    { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  name:         { type: String, required: true },
  price:        { type: Number, required: true },
  quantity:     { type: Number, required: true, min: 1 },
  image:        { type: String },
});

const orderSchema = new mongoose.Schema(
  {
    items:       { type: [orderItemSchema], required: true },
    totalAmount: { type: Number, required: true },
    status:      { type: String, enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'], default: 'pending' },
    customerName:  { type: String, default: 'Guest' },
    customerEmail: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
