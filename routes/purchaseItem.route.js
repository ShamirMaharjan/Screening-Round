import { Router } from 'express';

import {
    getAllPurchaseItems,
    getPurchaseItemById,
    createPurchaseItem,
    updatePurchaseItem,
    deletePurchaseItem
} from '../controllers/purchaseItem.controller.js';
import { authorize } from '../middlewares/auth.middleware.js';

const purchaseRouter = Router();

purchaseRouter.get('/', authorize, getAllPurchaseItems);
purchaseRouter.get('/:id', authorize, getPurchaseItemById);
purchaseRouter.post('/', authorize, createPurchaseItem);
purchaseRouter.patch('/:id', authorize, updatePurchaseItem);
purchaseRouter.delete('/:id', authorize, deletePurchaseItem);

export default purchaseRouter;