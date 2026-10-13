import Joi from 'joi';

export const createProductSchema = Joi.object({
  name: Joi.string().min(2).max(255).required().messages({
    'string.empty': 'Tên sản phẩm không được để trống',
  }),
  slug: Joi.string().allow('', null).optional(),
  categoryId: Joi.string().required().messages({
    'string.empty': 'Vui lòng chọn danh mục cho sản phẩm',
  }),
  price: Joi.number().min(0).required().messages({
    'number.base': 'Giá sản phẩm phải là một số',
    'any.required': 'Vui lòng nhập giá sản phẩm',
  }),
  originalPrice: Joi.number().min(0).allow(null).optional(),
  discountPercent: Joi.number().min(0).max(100).allow(null).optional(),
  stockQuantity: Joi.number().integer().min(0).default(0),
  inStock: Joi.boolean().default(true),
  isNew: Joi.boolean().default(false),
  isFeatured: Joi.boolean().default(false),
  images: Joi.array().items(Joi.string()).min(1).required().messages({
    'array.min': 'Sản phẩm phải có ít nhất 1 hình ảnh',
  }),
  dimensions: Joi.string().allow('', null).optional(),
  material: Joi.string().allow('', null).optional(),
  colorOptions: Joi.array().items(Joi.string()).optional(),
  origin: Joi.string().allow('', null).optional(),
  warranty: Joi.string().allow('', null).optional(),
  description: Joi.string().allow('', null).optional(),
  specifications: Joi.object().optional(),
});

export const updateProductSchema = createProductSchema.fork(
  ['name', 'categoryId', 'price', 'images'],
  (schema) => schema.optional()
);

export const updateOrderStatusSchema = Joi.object({
  status: Joi.string().valid('pending', 'processing', 'shipping', 'completed', 'cancelled').optional(),
  paymentStatus: Joi.string().valid('unpaid', 'paid', 'refunded').optional(),
}).or('status', 'paymentStatus').messages({
  'object.missing': 'Cần cung cấp status hoặc paymentStatus để cập nhật',
});

export const toggleUserStatusSchema = Joi.object({
  status: Joi.boolean().required(),
});

export const createCategorySchema = Joi.object({
  name: Joi.string().min(2).required(),
  slug: Joi.string().allow('', null).optional(),
  icon: Joi.string().allow('', null).optional(),
  description: Joi.string().allow('', null).optional(),
});
