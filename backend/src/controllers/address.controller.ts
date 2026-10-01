import { Response } from 'express';
import { AddressModel } from '../models/Address.model.js';
import { generateId } from '../utils/generateId.js';
import { sendSuccess, sendError } from '../utils/response.js';
import { AuthRequest } from '../types/index.js';

export class AddressController {
  /**
   * GET /api/v1/addresses
   * Get all addresses for current user
   */
  static async getMyAddresses(req: AuthRequest, res: Response): Promise<any> {
    try {
      const userId = req.user?.s_ID;
      const addresses = await AddressModel.find({ user_id: userId }).sort({ is_default: -1, dt_create: -1 });

      return sendSuccess(res, 'Lấy danh sách địa chỉ thành công', addresses);
    } catch (error: any) {
      return sendError(res, error.message || 'Lỗi khi lấy danh sách địa chỉ', 500);
    }
  }

  /**
   * POST /api/v1/addresses
   * Add new delivery address
   */
  static async createAddress(req: AuthRequest, res: Response): Promise<any> {
    try {
      const userId = req.user?.s_ID!;
      const { recipient_name, phone, city, district, ward, address_line, is_default } = req.body;

      if (!recipient_name || !phone || !city || !district || !address_line) {
        return sendError(res, 'Vui lòng điền đầy đủ thông tin địa chỉ giao hàng', 400);
      }

      // Check if this is the first address, automatically make it default
      const count = await AddressModel.countDocuments({ user_id: userId });
      const makeDefault = count === 0 ? true : Boolean(is_default);

      // If set as default, reset other addresses
      if (makeDefault) {
        await AddressModel.updateMany({ user_id: userId }, { is_default: false });
      }

      const newAddress = new AddressModel({
        s_ID: generateId('addr'),
        user_id: userId,
        recipient_name: recipient_name.trim(),
        phone: phone.trim(),
        city: city.trim(),
        district: district.trim(),
        ward: ward ? ward.trim() : '',
        address_line: address_line.trim(),
        is_default: makeDefault,
      });

      await newAddress.save();

      return sendSuccess(res, 'Thêm địa chỉ giao hàng thành công', newAddress, 201);
    } catch (error: any) {
      return sendError(res, error.message || 'Lỗi khi tạo địa chỉ', 500);
    }
  }

  /**
   * PUT /api/v1/addresses/:id
   * Update delivery address
   */
  static async updateAddress(req: AuthRequest, res: Response): Promise<any> {
    try {
      const userId = req.user?.s_ID!;
      const addressId = req.params.id;
      const { recipient_name, phone, city, district, ward, address_line, is_default } = req.body;

      const address = await AddressModel.findOne({ s_ID: addressId, user_id: userId });
      if (!address) {
        return sendError(res, 'Không tìm thấy địa chỉ', 404);
      }

      if (is_default) {
        await AddressModel.updateMany({ user_id: userId }, { is_default: false });
        address.is_default = true;
      }

      if (recipient_name) address.recipient_name = recipient_name.trim();
      if (phone) address.phone = phone.trim();
      if (city) address.city = city.trim();
      if (district) address.district = district.trim();
      if (ward !== undefined) address.ward = ward.trim();
      if (address_line) address.address_line = address_line.trim();

      await address.save();

      return sendSuccess(res, 'Cập nhật địa chỉ thành công', address);
    } catch (error: any) {
      return sendError(res, error.message || 'Lỗi khi cập nhật địa chỉ', 500);
    }
  }

  /**
   * DELETE /api/v1/addresses/:id
   */
  static async deleteAddress(req: AuthRequest, res: Response): Promise<any> {
    try {
      const userId = req.user?.s_ID!;
      const addressId = req.params.id;

      const address = await AddressModel.findOneAndDelete({ s_ID: addressId, user_id: userId });
      if (!address) {
        return sendError(res, 'Không tìm thấy địa chỉ để xóa', 404);
      }

      // If deleted address was default, set the latest one as default
      if (address.is_default) {
        const remaining = await AddressModel.findOne({ user_id: userId }).sort({ dt_create: -1 });
        if (remaining) {
          remaining.is_default = true;
          await remaining.save();
        }
      }

      return sendSuccess(res, 'Xóa địa chỉ thành công');
    } catch (error: any) {
      return sendError(res, error.message || 'Lỗi khi xóa địa chỉ', 500);
    }
  }

  /**
   * PATCH /api/v1/addresses/:id/default
   */
  static async setDefaultAddress(req: AuthRequest, res: Response): Promise<any> {
    try {
      const userId = req.user?.s_ID!;
      const addressId = req.params.id;

      const address = await AddressModel.findOne({ s_ID: addressId, user_id: userId });
      if (!address) {
        return sendError(res, 'Không tìm thấy địa chỉ', 404);
      }

      await AddressModel.updateMany({ user_id: userId }, { is_default: false });
      address.is_default = true;
      await address.save();

      return sendSuccess(res, 'Đã đặt làm địa chỉ mặc định', address);
    } catch (error: any) {
      return sendError(res, error.message || 'Lỗi khi đặt địa chỉ mặc định', 500);
    }
  }
}
