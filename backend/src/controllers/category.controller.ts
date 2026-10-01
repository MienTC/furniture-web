import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { CategoryModel } from '../models/Category.model.js';
import { ProductModel } from '../models/Product.model.js';
import { generateId } from '../utils/generateId.js';
import { sendSuccess, sendError } from '../utils/response.js';

export class CategoryController {
  /**
   * GET /api/v1/categories
   * Get all active categories with product count
   */
  static async getCategories(_req: Request, res: Response): Promise<any> {
    try {
      const categories = await CategoryModel.find({ is_active: true }).lean();

      // Recalculate item count for accuracy
      const categoriesWithCount = await Promise.all(
        categories.map(async (cat) => {
          const count = await ProductModel.countDocuments({
            $or: [{ category_id: cat.s_ID }, { category_id: cat.slug }],
            is_active: true,
          });
          let catImage = cat.image_url;
          if (!catImage) {
            const firstProduct = await ProductModel.findOne({
              $or: [{ category_id: cat.s_ID }, { category_id: cat.slug }],
              is_active: true,
            }).lean();
            if (firstProduct) {
              const primaryImg = await mongoose.model('LS_ProductImages').findOne({
                s_product_ID: firstProduct.s_ID,
              }).sort({ is_primary: -1, sort_order: 1 }).lean();
              if (primaryImg && (primaryImg as any).image_url) {
                catImage = (primaryImg as any).image_url;
              }
            }
          }

          return {
            id: cat.slug, // Friendly for FE
            s_ID: cat.s_ID,
            parentId: cat.s_parent_category_id,
            name: cat.s_Name,
            slug: cat.slug,
            description: cat.description,
            image: catImage || '',
            itemCount: count,
          };
        })
      );

      return sendSuccess(res, 'Lấy danh mục thành công', categoriesWithCount);
    } catch (error: any) {
      return sendError(res, error.message || 'Lỗi khi lấy danh mục', 500);
    }
  }

  /**
   * GET /api/v1/categories/:slug
   */
  static async getCategoryBySlug(req: Request, res: Response): Promise<any> {
    try {
      const { slug } = req.params;
      const category = await CategoryModel.findOne({
        $or: [{ slug }, { s_ID: slug }],
        is_active: true,
      });

      if (!category) {
        return sendError(res, 'Không tìm thấy danh mục', 404);
      }

      const count = await ProductModel.countDocuments({
        $or: [{ category_id: category.s_ID }, { category_id: category.slug }],
        is_active: true,
      });

      return sendSuccess(res, 'Lấy chi tiết danh mục thành công', {
        id: category.slug,
        s_ID: category.s_ID,
        name: category.s_Name,
        slug: category.slug,
        description: category.description,
        image: category.image_url,
        itemCount: count,
      });
    } catch (error: any) {
      return sendError(res, error.message || 'Lỗi khi lấy chi tiết danh mục', 500);
    }
  }

  /**
   * POST /api/v1/categories (Admin)
   */
  static async createCategory(req: Request, res: Response): Promise<any> {
    try {
      const { s_Name, slug, description, image_url, s_parent_category_id } = req.body;

      if (!s_Name || !slug) {
        return sendError(res, 'Tên danh mục và slug là bắt buộc', 400);
      }

      const existing = await CategoryModel.findOne({ slug: slug.trim() });
      if (existing) {
        return sendError(res, 'Slug danh mục này đã tồn tại', 400);
      }

      const newCategory = new CategoryModel({
        s_ID: generateId('cat'),
        s_parent_category_id: s_parent_category_id || null,
        s_Name: s_Name.trim(),
        slug: slug.trim(),
        description: description || '',
        image_url: image_url || '',
        is_active: true,
      });

      await newCategory.save();
      return sendSuccess(res, 'Tạo danh mục thành công', newCategory, 201);
    } catch (error: any) {
      return sendError(res, error.message || 'Lỗi khi tạo danh mục', 500);
    }
  }

  /**
   * PUT /api/v1/categories/:id (Admin)
   */
  static async updateCategory(req: Request, res: Response): Promise<any> {
    try {
      const { id } = req.params;
      const { s_Name, slug, description, image_url, is_active } = req.body;

      const category = await CategoryModel.findOne({
        $or: [{ s_ID: id }, { slug: id }],
      });

      if (!category) {
        return sendError(res, 'Không tìm thấy danh mục', 404);
      }

      if (s_Name) category.s_Name = s_Name.trim();
      if (slug) category.slug = slug.trim();
      if (description !== undefined) category.description = description;
      if (image_url !== undefined) category.image_url = image_url;
      if (is_active !== undefined) category.is_active = is_active;

      await category.save();
      return sendSuccess(res, 'Cập nhật danh mục thành công', category);
    } catch (error: any) {
      return sendError(res, error.message || 'Lỗi khi cập nhật danh mục', 500);
    }
  }

  /**
   * DELETE /api/v1/categories/:id (Admin)
   */
  static async deleteCategory(req: Request, res: Response): Promise<any> {
    try {
      const { id } = req.params;
      const category = await CategoryModel.findOneAndDelete({
        $or: [{ s_ID: id }, { slug: id }],
      });

      if (!category) {
        return sendError(res, 'Không tìm thấy danh mục để xóa', 404);
      }

      return sendSuccess(res, 'Xóa danh mục thành công');
    } catch (error: any) {
      return sendError(res, error.message || 'Lỗi khi xóa danh mục', 500);
    }
  }
}
