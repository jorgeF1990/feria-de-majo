import express from 'express';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  updateProductStatus
} from '../controllers/productController.js';
import { authMiddleware } from '../middleware/auth.js';
import { uploadMiddleware, handleUploadErrors } from '../middleware/upload.js';

const router = express.Router();

router.get('/', getProducts);
router.get('/:id', getProductById);

router.post(
  '/',
  authMiddleware,
  uploadMiddleware.array('imagenes', 5),
  handleUploadErrors,
  createProduct
);

router.put(
  '/:id',
  authMiddleware,
  uploadMiddleware.array('imagenes', 5),
  handleUploadErrors,
  updateProduct
);

router.delete('/:id', authMiddleware, deleteProduct);
router.patch('/:id/status', authMiddleware, updateProductStatus);

router.post('/auth/login', (req, res) => {
  import('../middleware/auth.js').then(({ adminLogin }) => {
    adminLogin(req, res);
  });
});

export default router;
