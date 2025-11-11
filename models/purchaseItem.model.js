import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const VendorSchema = new Schema({
    vendorName: {
        type: String,
        required: [true, 'Vendor name is required'],
        trim: true
    },
    price: {
        type: Number,
        required: [true, 'Price is required']
    }
}, { _id: false });

const PurchaseItemSchema = new Schema({
    itemName: {
        type: String,
        required: [true, 'Item name is required'],
        trim: true,
    },
    description: {
        type: String,
        trim: true
    },
    itemImage: {
        type: String,
        required: false
    },
    vendors: [VendorSchema]
}, {
    timestamps: true
});

const PurchaseItem = model('PurchaseItem', PurchaseItemSchema);
export default PurchaseItem;