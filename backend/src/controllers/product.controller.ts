import { Request, Response } from 'express';
import { ProductModel } from '../models/Product.model.js';
import { ProductImageModel } from '../models/ProductImage.model.js';
import { ProductVariantModel } from '../models/ProductVariant.model.js';
import { ReviewModel } from '../models/Review.model.js';
import { CategoryModel } from '../models/Category.model.js';
import { generateId } from '../utils/generateId.js';
import { sendSuccess, sendError } from '../utils/response.js';

export class ProductController {
  /**
   * Helper: format DB product to match FE Product interface
   */
  private static formatProduct(p: any, images: string[] = [], reviews: any[] = []): any {
    return {
      id: p.s_ID,
      s_ID: p.s_ID,
      name: p.s_Name,
      slug: p.slug,
      categoryId: p.category_id,
      categoryName: p.category_name || '',
      price: p.price,
      originalPrice: p.original_price || undefined,
      discountPercent: p.discount_percent || undefined,
      rating: p.avg_rating || 5.0,
      reviewCount: p.review_count || 0,
      inStock: p.in_stock !== false,
      stockQuantity: p.stock_quantity || 0,
      isNew: p.is_new || false,
      isFeatured: p.is_featured || false,
      images: images,
      dimensions: p.dimensions || '',
      material: p.material || '',
      colorOptions: p.color_options || [],
      origin: p.origin || '',
      warranty: p.warranty || '',
      description: p.description || '',
      specifications: p.specifications || {},
      reviews: reviews.length > 0 ? reviews : undefined,
    };
  }

  /**
   * GET /api/v1/products
   * List products with filtering, search, sorting, and pagination
   */
  static async getProducts(req: Request, res: Response): Promise<any> {
    try {
      const {
        categoryId,
        search,
        minPrice,
        maxPrice,
        materials,
        inStockOnly,
        onSaleOnly,
        sortBy,
        page = 1,
        limit = 12,
      } = req.query;

      const filter: any = { is_active: true };

      // Category filter (match s_ID or slug)
      if (categoryId && categoryId !== 'all') {
        const catStr = String(categoryId);
        const cat = await CategoryModel.findOne({
          $or: [{ slug: catStr }, { s_ID: catStr }],
        }).lean();
        if (cat) {
          filter.$or = [{ category_id: (cat as any).s_ID }, { category_id: (cat as any).slug }];
        } else {
          filter.category_id = catStr;
        }
      }

      // Keyword search
      if (search) {
        const regex = new RegExp(String(search).trim(), 'i');
        filter.$or = [{ s_Name: regex }, { description: regex }, { material: regex }];
      }

      // Price range
      if (minPrice || maxPrice) {
        filter.price = {};
        if (minPrice) filter.price.$gte = Number(minPrice);
        if (maxPrice) filter.price.$lte = Number(maxPrice);
      }

      // Materials filter (comma separated or array)
      if (materials) {
        const matList: string[] = Array.isArray(materials)
          ? (materials as any[]).map(String)
          : String(materials).split(',').map((m) => m.trim());
        filter.material = { $in: matList.map((m) => new RegExp(m, 'i')) };
      }

      // Stock
      if (inStockOnly === 'true') {
        filter.in_stock = true;
        filter.stock_quantity = { $gt: 0 };
      }

      // On sale (discount > 0)
      if (onSaleOnly === 'true') {
        filter.discount_percent = { $gt: 0 };
      }

      // Sorting
      let sortOption: any = { dt_create: -1 };
      switch (sortBy) {
        case 'price-asc':
          sortOption = { price: 1 };
          break;
        case 'price-desc':
          sortOption = { price: -1 };
          break;
        case 'rating':
          sortOption = { avg_rating: -1 };
          break;
        case 'newest':
          sortOption = { dt_create: -1 };
          break;
        case 'featured':
        default:
          sortOption = { is_featured: -1, dt_create: -1 };
          break;
      }

      const pageNum = Math.max(1, Number(page));
      const limitNum = Math.max(1, Number(limit));
      const skip = (pageNum - 1) * limitNum;

      const [products, total] = await Promise.all([
        ProductModel.find(filter).sort(sortOption).skip(skip).limit(limitNum).lean(),
        ProductModel.countDocuments(filter),
      ]);

      // Attach primary images
      const formattedProducts = await Promise.all(
        products.map(async (p) => {
          const imgs = await ProductImageModel.find({ s_product_ID: p.s_ID })
            .sort({ is_primary: -1, sort_order: 1 })
            .lean();
          const imgUrls = imgs.map((img) => img.image_url);
          return ProductController.formatProduct(p, imgUrls);
        })
      );

      return sendSuccess(res, 'Lấy danh sách sản phẩm thành công', formattedProducts, 200, {
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          totalPages: Math.ceil(total / limitNum),
        },
      });
    } catch (error: any) {
      return sendError(res, error.message || 'Lỗi khi lấy danh sách sản phẩm', 500);
    }
  }

  /**
   * GET /api/v1/products/:slug
   * Get single product with full images, variants, and reviews
   */
  static async getProductBySlug(req: Request, res: Response): Promise<any> {
    try {
      const { slug } = req.params;

      const product = await ProductModel.findOne({
        $or: [{ slug }, { s_ID: slug }],
        is_active: true,
      }).lean();

      if (!product) {
        return sendError(res, 'Không tìm thấy sản phẩm', 404);
      }

      // Fetch images
      const images = await ProductImageModel.find({ s_product_ID: product.s_ID })
        .sort({ is_primary: -1, sort_order: 1 })
        .lean();
      const imageUrls = images.map((img) => img.image_url);

      // Fetch reviews
      const reviews = await ReviewModel.find({
        product_id: product.s_ID,
        is_approved: true,
      })
        .sort({ dt_create: -1 })
        .lean();

      const formattedReviews = reviews.map((r) => ({
        id: r.s_ID,
        userName: r.user_name,
        userAvatar: r.user_avatar || undefined,
        rating: r.rating,
        date: r.dt_create ? new Date(r.dt_create).toISOString().split('T')[0] : '',
        comment: r.comment,
        verifiedPurchase: r.verified_purchase,
      }));

      // Fetch variants
      const variants = await ProductVariantModel.find({
        s_product_ID: product.s_ID,
        is_active: true,
      }).lean();

      const formatted = ProductController.formatProduct(product, imageUrls, formattedReviews);
      formatted.variants = variants;

      return sendSuccess(res, 'Lấy chi tiết sản phẩm thành công', formatted);
    } catch (error: any) {
      return sendError(res, error.message || 'Lỗi khi lấy chi tiết sản phẩm', 500);
    }
  }

  /**
   * POST /api/v1/products (Admin)
   */
  static async createProduct(req: Request, res: Response): Promise<any> {
    try {
      const {
        s_Name,
        slug,
        sku,
        category_id,
        price,
        original_price,
        discount_percent,
        dimensions,
        material,
        color_options,
        origin,
        warranty,
        short_description,
        description,
        specifications,
        stock_quantity,
        is_featured,
        is_new,
        is_best_seller,
        images = [],
      } = req.body;

      if (!s_Name || !price || !category_id) {
        return sendError(res, 'Tên sản phẩm, giá và danh mục là bắt buộc', 400);
      }

      const s_ID = generateId('prod');
      const cleanSlug = slug || s_Name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

      // Get category name
      const category = await CategoryModel.findOne({
        $or: [{ s_ID: category_id }, { slug: category_id }],
      });

      const newProduct = new ProductModel({
        s_ID,
        s_Product_ID: s_ID,
        category_id: category ? category.s_ID : category_id,
        category_name: category ? category.s_Name : '',
        s_Name: s_Name.trim(),
        slug: cleanSlug,
        sku: sku || `SKU-${Date.now()}`,
        price: Number(price),
        original_price: original_price ? Number(original_price) : Number(price),
        discount_percent: discount_percent ? Number(discount_percent) : 0,
        dimensions: dimensions || '',
        material: material || '',
        color_options: color_options || [],
        origin: origin || '',
        warranty: warranty || '',
        short_description: short_description || '',
        description: description || '',
        specifications: specifications || {},
        stock_quantity: stock_quantity ? Number(stock_quantity) : 10,
        in_stock: (stock_quantity ? Number(stock_quantity) : 10) > 0,
        is_featured: Boolean(is_featured),
        is_new: Boolean(is_new),
        is_best_seller: Boolean(is_best_seller),
        is_active: true,
      });

      await newProduct.save();

      // Save initial images if provided
      if (Array.isArray(images) && images.length > 0) {
        const imageDocs = images.map((url: string, index: number) => ({
          s_ID: generateId('img'),
          s_product_ID: s_ID,
          image_url: url,
          sort_order: index,
          is_primary: index === 0,
          dt_create: new Date(),
        }));
        await ProductImageModel.insertMany(imageDocs);
      }

      return sendSuccess(res, 'Tạo sản phẩm thành công', newProduct, 201);
    } catch (error: any) {
      return sendError(res, error.message || 'Lỗi khi tạo sản phẩm', 500);
    }
  }

  /**
   * PUT /api/v1/products/:id (Admin)
   */
  static async updateProduct(req: Request, res: Response): Promise<any> {
    try {
      const { id } = req.params;
      const product = await ProductModel.findOne({
        $or: [{ s_ID: id }, { slug: id }],
      });

      if (!product) {
        return sendError(res, 'Không tìm thấy sản phẩm', 404);
      }

      const updates = req.body;
      delete updates.s_ID;
      delete updates.s_Product_ID;

      Object.assign(product, updates);
      if (updates.stock_quantity !== undefined) {
        product.in_stock = Number(updates.stock_quantity) > 0;
      }

      await product.save();
      return sendSuccess(res, 'Cập nhật sản phẩm thành công', product);
    } catch (error: any) {
      return sendError(res, error.message || 'Lỗi khi cập nhật sản phẩm', 500);
    }
  }

  /**
   * DELETE /api/v1/products/:id (Admin)
   */
  static async deleteProduct(req: Request, res: Response): Promise<any> {
    try {
      const { id } = req.params;
      const product = await ProductModel.findOneAndDelete({
        $or: [{ s_ID: id }, { slug: id }],
      });

      if (!product) {
        return sendError(res, 'Không tìm thấy sản phẩm', 404);
      }

      // Cleanup related images and variants
      await Promise.all([
        ProductImageModel.deleteMany({ s_product_ID: product.s_ID }),
        ProductVariantModel.deleteMany({ s_product_ID: product.s_ID }),
      ]);

      return sendSuccess(res, 'Xóa sản phẩm thành công');
    } catch (error: any) {
      return sendError(res, error.message || 'Lỗi khi xóa sản phẩm', 500);
    }
  }

  /**
   * POST /api/v1/products/:id/images
   */
  static async addImage(req: Request, res: Response): Promise<any> {
    try {
      const { id } = req.params;
      const { image_url, alt_text, is_primary, sort_order } = req.body;

      if (!image_url) {
        return sendError(res, 'Vui lòng cung cấp URL ảnh', 400);
      }

      const product = await ProductModel.findOne({ $or: [{ s_ID: id }, { slug: id }] });
      if (!product) {
        return sendError(res, 'Không tìm thấy sản phẩm', 404);
      }

      if (is_primary) {
        await ProductImageModel.updateMany({ s_product_ID: product.s_ID }, { is_primary: false });
      }

      const newImage = new ProductImageModel({
        s_ID: generateId('img'),
        s_product_ID: product.s_ID,
        image_url,
        alt_text: alt_text || '',
        sort_order: sort_order || 0,
        is_primary: Boolean(is_primary),
      });

      await newImage.save();
      return sendSuccess(res, 'Thêm ảnh sản phẩm thành công', newImage, 201);
    } catch (error: any) {
      return sendError(res, error.message || 'Lỗi khi thêm ảnh', 500);
    }
  }

  /**
   * DELETE /api/v1/products/:id/images/:imageId
   */
  static async deleteImage(req: Request, res: Response): Promise<any> {
    try {
      const { imageId } = req.params;
      const deleted = await ProductImageModel.findOneAndDelete({ s_ID: imageId });
      if (!deleted) {
        return sendError(res, 'Không tìm thấy ảnh để xóa', 404);
      }
      return sendSuccess(res, 'Xóa ảnh thành công');
    } catch (error: any) {
      return sendError(res, error.message || 'Lỗi khi xóa ảnh', 500);
    }
  }
}
