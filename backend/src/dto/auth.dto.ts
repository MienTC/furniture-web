import Joi from 'joi';

export const registerSchema = Joi.object({
  s_user: Joi.string().min(3).max(50).optional(),
  name: Joi.string().min(2).max(50).optional(),
  username: Joi.string().min(3).max(50).optional(),
  s_PWD: Joi.string().min(6).optional(),
  password: Joi.string().min(6).optional(),
  email: Joi.string().email().required().messages({
    'string.email': 'Email không đúng định dạng',
    'string.empty': 'Email không được để trống',
  }),
  phone: Joi.string().allow('', null).optional(),
  avatar_url: Joi.string().allow('', null).optional(),
  role: Joi.string().valid('customer', 'admin').default('customer'),
}).or('s_user', 'name', 'username').or('s_PWD', 'password');

export const loginSchema = Joi.object({
  loginName: Joi.string().required().messages({
    'string.empty': 'Vui lòng cung cấp tên đăng nhập hoặc email',
  }),
  password: Joi.string().required().messages({
    'string.empty': 'Vui lòng nhập mật khẩu',
  }),
});

export const refreshTokenSchema = Joi.object({
  refreshToken: Joi.string().required().messages({
    'string.empty': 'Refresh token không được để trống',
  }),
});
