import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { UserModel } from '../models/User.model.js';
import { generateId } from '../utils/generateId.js';
import { generateTokens, verifyRefreshToken } from '../utils/jwt.js';
import { sendSuccess, sendError } from '../utils/response.js';
import { AuthRequest } from '../types/index.js';

export class AuthController {
  /**
   * POST /api/v1/auth/register
   * Register new user account
   */
  static async register(req: Request, res: Response): Promise<any> {
    try {
      const { s_user, s_PWD, email, phone, avatar_url, role } = req.body;

      if (!s_user || !s_PWD || !email) {
        return sendError(res, 'Vui lòng cung cấp đầy đủ tên đăng nhập, email và mật khẩu', 400);
      }

      // Check username or email existing
      const existingUser = await UserModel.findOne({
        $or: [{ s_user: s_user.trim() }, { email: email.trim().toLowerCase() }],
      });

      if (existingUser) {
        if (existingUser.s_user === s_user.trim()) {
          return sendError(res, 'Tên đăng nhập đã được sử dụng', 400);
        }
        return sendError(res, 'Email đã được đăng ký tài khoản khác', 400);
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(s_PWD, salt);

      // Generate custom s_ID
      const s_ID = generateId('usr');

      // Create user
      const newUser = new UserModel({
        s_ID,
        s_user: s_user.trim(),
        s_PWD: hashedPassword,
        email: email.trim().toLowerCase(),
        phone: phone || '',
        avatar_url: avatar_url || '',
        role: role === 'admin' ? 'admin' : 'customer',
        status: true,
      });

      // Generate initial JWT tokens
      const tokens = generateTokens({
        userId: (newUser._id as any).toString(),
        s_ID: newUser.s_ID,
        email: newUser.email,
        role: newUser.role,
      });

      // Save hashed refresh token or raw refresh token to DB
      newUser.refresh_token = tokens.refresh_token;
      await newUser.save();

      const userJson = newUser.toJSON();

      return sendSuccess(
        res,
        'Đăng ký tài khoản thành công',
        {
          ...tokens,
          user: userJson,
        },
        201
      );
    } catch (error: any) {
      return sendError(res, error.message || 'Lỗi khi đăng ký tài khoản', 500);
    }
  }

  /**
   * POST /api/v1/auth/login
   * Login with username/email & password
   */
  static async login(req: Request, res: Response): Promise<any> {
    try {
      const { loginName, password } = req.body;

      if (!loginName || !password) {
        return sendError(res, 'Vui lòng nhập tên đăng nhập/email và mật khẩu', 400);
      }

      const cleanLogin = loginName.trim();

      // Find user by s_user OR email with password field included
      const user = await UserModel.findOne({
        $or: [{ s_user: cleanLogin }, { email: cleanLogin.toLowerCase() }],
      }).select('+s_PWD');

      if (!user) {
        return sendError(res, 'Tên đăng nhập hoặc mật khẩu không chính xác', 400);
      }

      if (!user.status) {
        return sendError(res, 'Tài khoản của bạn đã bị khóa. Vui lòng liên hệ hỗ trợ', 403);
      }

      // Compare password
      const isMatch = await bcrypt.compare(password, user.s_PWD!);
      if (!isMatch) {
        return sendError(res, 'Tên đăng nhập hoặc mật khẩu không chính xác', 400);
      }

      // Generate tokens
      const tokens = generateTokens({
        userId: (user._id as any).toString(),
        s_ID: user.s_ID,
        email: user.email,
        role: user.role,
      });

      // Update refresh token in DB
      user.refresh_token = tokens.refresh_token;
      await user.save();

      const userJson = user.toJSON();

      return sendSuccess(res, 'Đăng nhập thành công', {
        ...tokens,
        user: userJson,
      });
    } catch (error: any) {
      return sendError(res, error.message || 'Lỗi khi đăng nhập', 500);
    }
  }

  /**
   * POST /api/v1/auth/refresh
   * Refresh expired access token using refresh token
   * Aligned with Pet_Manager `instanceBE.interceptors.response`
   */
  static async refresh(req: Request, res: Response): Promise<any> {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        return sendError(res, 'Vui lòng cung cấp Refresh Token', 400);
      }

      let decoded;
      try {
        decoded = verifyRefreshToken(refreshToken);
      } catch (err: any) {
        return sendError(res, 'Refresh Token không hợp lệ hoặc đã hết hạn', 401);
      }

      // Verify user & matching token in DB
      const user = await UserModel.findOne({ s_ID: decoded.s_ID }).select('+refresh_token');

      if (!user || user.refresh_token !== refreshToken) {
        return sendError(res, 'Phiên đăng nhập đã bị thu hồi hoặc không hợp lệ', 401);
      }

      // Rotate token: generate new pair
      const newTokens = generateTokens({
        userId: (user._id as any).toString(),
        s_ID: user.s_ID,
        email: user.email,
        role: user.role,
      });

      user.refresh_token = newTokens.refresh_token;
      await user.save();

      return sendSuccess(res, 'Làm mới Access Token thành công', newTokens);
    } catch (error: any) {
      return sendError(res, error.message || 'Lỗi khi làm mới token', 500);
    }
  }

  /**
   * POST /api/v1/auth/logout
   */
  static async logout(req: AuthRequest, res: Response): Promise<any> {
    try {
      if (req.user?.s_ID) {
        await UserModel.findOneAndUpdate(
          { s_ID: req.user.s_ID },
          { refresh_token: null }
        );
      }
      return sendSuccess(res, 'Đăng xuất thành công');
    } catch (error: any) {
      return sendError(res, error.message || 'Lỗi khi đăng xuất', 500);
    }
  }

  /**
   * GET /api/v1/auth/me
   */
  static async getMe(req: AuthRequest, res: Response): Promise<any> {
    try {
      const user = await UserModel.findOne({ s_ID: req.user?.s_ID });
      if (!user) {
        return sendError(res, 'Không tìm thấy người dùng', 404);
      }

      return sendSuccess(res, 'Lấy thông tin người dùng thành công', user);
    } catch (error: any) {
      return sendError(res, error.message || 'Lỗi khi lấy thông tin người dùng', 500);
    }
  }

  /**
   * PUT /api/v1/auth/me
   */
  static async updateMe(req: AuthRequest, res: Response): Promise<any> {
    try {
      const { phone, avatar_url, s_user } = req.body;

      const user = await UserModel.findOne({ s_ID: req.user?.s_ID });
      if (!user) {
        return sendError(res, 'Không tìm thấy người dùng', 404);
      }

      if (s_user && s_user.trim() !== user.s_user) {
        const checkExisting = await UserModel.findOne({ s_user: s_user.trim() });
        if (checkExisting) {
          return sendError(res, 'Tên đăng nhập này đã tồn tại', 400);
        }
        user.s_user = s_user.trim();
      }

      if (phone !== undefined) user.phone = phone;
      if (avatar_url !== undefined) user.avatar_url = avatar_url;

      await user.save();

      return sendSuccess(res, 'Cập nhật thông tin cá nhân thành công', user);
    } catch (error: any) {
      return sendError(res, error.message || 'Lỗi khi cập nhật thông tin', 500);
    }
  }

  /**
   * PUT /api/v1/auth/change-password
   */
  static async changePassword(req: AuthRequest, res: Response): Promise<any> {
    try {
      const { oldPassword, newPassword } = req.body;

      if (!oldPassword || !newPassword) {
        return sendError(res, 'Vui lòng nhập mật khẩu cũ và mật khẩu mới', 400);
      }

      const user = await UserModel.findOne({ s_ID: req.user?.s_ID }).select('+s_PWD');
      if (!user) {
        return sendError(res, 'Không tìm thấy người dùng', 404);
      }

      const isMatch = await bcrypt.compare(oldPassword, user.s_PWD!);
      if (!isMatch) {
        return sendError(res, 'Mật khẩu cũ không chính xác', 400);
      }

      const salt = await bcrypt.genSalt(10);
      user.s_PWD = await bcrypt.hash(newPassword, salt);
      user.refresh_token = undefined; // Force re-login on next refresh
      await user.save();

      return sendSuccess(res, 'Đổi mật khẩu thành công. Vui lòng đăng nhập lại');
    } catch (error: any) {
      return sendError(res, error.message || 'Lỗi khi đổi mật khẩu', 500);
    }
  }
}
