import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types/index.js';
import { verifyAccessToken } from '../utils/jwt.js';
import { sendError } from '../utils/response.js';
import { UserModel } from '../models/User.model.js';

/**
 * Middleware: Verify JWT Access Token
 * Returns 401 when token is missing, expired, or invalid.
 * FE intercepts 401 to trigger automatic token refresh!
 */
export const verifyToken = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return sendError(res, 'Vui lòng đăng nhập để tiếp tục (Thiếu Access Token)', 401);
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return sendError(res, 'Token không hợp lệ', 401);
    }

    let decoded;
    try {
      decoded = verifyAccessToken(token);
    } catch (err: any) {
      if (err.name === 'TokenExpiredError') {
        return sendError(res, 'Access Token đã hết hạn', 401);
      }
      return sendError(res, 'Access Token không hợp lệ hoặc đã bị chỉnh sửa', 401);
    }

    // Verify user still exists & is active
    const user = await UserModel.findOne({ s_ID: decoded.s_ID });
    if (!user) {
      return sendError(res, 'Tài khoản không tồn tại trong hệ thống', 401);
    }

    if (!user.status) {
      return sendError(res, 'Tài khoản đã bị tạm khóa, vui lòng liên hệ CSKH', 403);
    }

    // Attach decoded user payload to request
    req.user = decoded;
    next();
  } catch (error: any) {
    return sendError(res, error.message || 'Lỗi xác thực người dùng', 500);
  }
};

/**
 * Middleware: Enforce Specific Role (e.g. 'admin')
 */
export const requireRole = (allowedRole: 'customer' | 'admin') => {
  return (req: AuthRequest, res: Response, next: NextFunction): any => {
    if (!req.user) {
      return sendError(res, 'Chưa xác thực danh tính người dùng', 401);
    }

    if (req.user.role !== allowedRole) {
      return sendError(res, 'Bạn không có quyền thực hiện thao tác này', 403);
    }

    next();
  };
};

/**
 * Shorthand for Admin check
 */
export const requireAdmin = requireRole('admin');
