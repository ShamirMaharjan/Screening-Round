import PurchaseItem from '../models/purchaseItem.model.js';

export const getAllPurchaseItems = async (req, res) => {
    try {
        const { search, minPrice, maxPrice, page = 1, limit = 10, sortBy = 'createdAt', order = 'desc' } = req.query;

        const query = {};

        if (search) {
            query.$or = [
                { itemName: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        const priceFilter = {};
        if (minPrice) {
            priceFilter.$gte = parseFloat(minPrice);
        }
        if (maxPrice) {
            priceFilter.$lte = parseFloat(maxPrice);
        }
        if (Object.keys(priceFilter).length > 0) {
            query.vendors = { $elemMatch: { price: priceFilter } };
        }

        const sortOptions = {};
        sortOptions[sortBy] = order === 'asc' ? 1 : -1;

        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const skip = (pageNum - 1) * limitNum;

        const items = await PurchaseItem.find(query)
            .sort(sortOptions)
            .skip(skip)
            .limit(limitNum);

        const totalItems = await PurchaseItem.countDocuments(query);
        const totalPages = Math.ceil(totalItems / limitNum);

        res.status(200).json({
            success: true,
            data: items,
            pagination: {
                totalItems,
                totalPages,
                currentPage: pageNum,
                limit: limitNum
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Server Error: ' + error.message
        });
    }
};

export const getPurchaseItemById = async (req, res) => {
    try {
        const item = await PurchaseItem.findById(req.params.id);
        if (!item) {
            return res.status(404).json({
                success: false,
                error: 'Item not found'
            });
        }
        res.status(200).json({
            success: true,
            data: item
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
};

export const createPurchaseItem = async (req, res) => {
    try {
        const { itemName, description, vendors, itemImage } = req.body;

        const parsedVendors = typeof vendors === 'string' ? JSON.parse(vendors) : vendors;

        const newItem = {
            itemName,
            description,
            vendors: parsedVendors,
            itemImage
        };

        const item = await PurchaseItem.create(newItem);
        res.status(201).json({
            success: true,
            message: 'Item created successfully',
            data: item
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

export const updatePurchaseItem = async (req, res) => {
    try {
        const item = await PurchaseItem.findById(req.params.id);

        if (!item) {
            return res.status(404).json({ success: false, error: 'Item not found' });
        }
        Object.keys(req.body).forEach(key => {
            if (key === 'vendors') {
                item[key] = typeof req.body[key] === 'string'
                    ? JSON.parse(req.body[key])
                    : req.body[key];
            } else {
                item[key] = req.body[key];
            }
        });

        const updatedItem = await item.save();

        res.status(200).json({
            success: true,
            message: 'Item updated successfully',
            data: updatedItem
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

export const deletePurchaseItem = async (req, res) => {
    try {
        const item = await PurchaseItem.findById(req.params.id);
        if (!item) {
            return res.status(404).json({
                success: false,
                error: 'Item not found'
            });
        }
        await PurchaseItem.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: 'Item deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};