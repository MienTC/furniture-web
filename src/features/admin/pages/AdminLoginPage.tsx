import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { Button } from 'antd';
import { toast } from 'react-toastify';
import {
  IconShieldLock,
  IconEye,
  IconEyeOff,
  IconMail,
  IconLock,
  IconArrowLeft,
  IconSparkles,
} from '@tabler/icons-react';
import { useAuth } from '~/contexts/AuthContext';

interface LoginFormInputs {
  loginName: string;
  password: string;
}

export const AdminLoginPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { loginAsAdmin, adminUser } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (adminUser) {
      navigate('/admin', { replace: true });
    }
  }, [adminUser, navigate]);

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormInputs>({
    defaultValues: {
      loginName: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormInputs) => {
    setLoading(true);
    try {
      const success = await loginAsAdmin(data.loginName.trim(), data.password);
      if (success) {
        toast.success('Đăng nhập quản trị thành công');
        navigate('/admin', { replace: true });
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || err?.message || 'Đăng nhập không thành công');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickFill = () => {
    setValue('loginName', 'admin', { shouldValidate: true });
    setValue('password', 'Admin@123456', { shouldValidate: true });
    toast.info('Đã điền thông tin tài khoản quản trị');
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-[#F7F8F6] text-stone-800 overflow-hidden font-sans px-4">
      {/* Background Decor - Warm Stone & Spruce Green Brand Accents */}
      <div className="absolute inset-0 bg-[radial-gradient(#E2E8E4_1px,transparent_1px)] [background-size:20px_20px] opacity-60" />
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#2B5A50]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Login Card - Executive LuxDecor Architecture */}
      <div className="relative z-10 w-full max-w-md p-8 md:p-9 rounded-2xl bg-white border border-stone-200/90 shadow-xl shadow-stone-200/50 backdrop-blur-sm">
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center mb-7">
          <div className="relative mb-3.5">
            <div className="size-16 rounded-2xl bg-[#EDF5F2] border border-[#D0DBD6] p-2 flex items-center justify-center shadow-xs">
              <img src="/logo1.png" alt="LuxDecor Logo" className="size-full object-contain" />
            </div>
            <div className="absolute -bottom-1 -right-1 size-6 rounded-full bg-[#2B5A50] text-white flex items-center justify-center shadow-xs">
              <IconShieldLock size={14} />
            </div>
          </div>

          <span className="text-[11px] font-bold tracking-wider text-[#2B5A50] uppercase bg-[#EDF5F2] px-3 py-0.5 rounded-full border border-[#D0DBD6] mb-2">
            Hệ Thống Quản Trị v2.0
          </span>
          <h1 className="text-2xl font-bold tracking-tight text-stone-900 m-0">
            LuxDecor Admin
          </h1>
          <p className="text-xs text-stone-500 mt-1 m-0">
            Cổng điều hành trung tâm & Quản lý thương mại điện tử
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-stone-700 flex items-center gap-1.5">
              <IconMail size={14} className="text-stone-400" />
              Tên đăng nhập hoặc Email
            </label>
            <Controller
              name="loginName"
              control={control}
              rules={{ required: 'Vui lòng nhập tên tài khoản hoặc email' }}
              render={({ field }) => (
                <input
                  {...field}
                  type="text"
                  placeholder="admin@luxdecor.vn"
                  className={`w-full rounded-lg border bg-stone-50/50 px-3.5 py-2.5 text-sm text-stone-900 placeholder-stone-400 outline-none transition-all ${
                    errors.loginName
                      ? 'border-rose-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/10'
                      : 'border-stone-300 focus:border-[#2B5A50] focus:ring-2 focus:ring-[#2B5A50]/15'
                  }`}
                />
              )}
            />
            {errors.loginName && (
              <p className="text-[11px] text-rose-500 font-medium m-0">{errors.loginName.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-stone-700 flex items-center gap-1.5">
              <IconLock size={14} className="text-stone-400" />
              Mật khẩu quản trị
            </label>
            <Controller
              name="password"
              control={control}
              rules={{ required: 'Vui lòng nhập mật khẩu' }}
              render={({ field }) => (
                <div className="relative">
                  <input
                    {...field}
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    className={`w-full rounded-lg border bg-stone-50/50 px-3.5 py-2.5 pr-10 text-sm text-stone-900 placeholder-stone-400 outline-none transition-all ${
                      errors.password
                        ? 'border-rose-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/10'
                        : 'border-stone-300 focus:border-[#2B5A50] focus:ring-2 focus:ring-[#2B5A50]/15'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 transition-colors p-0.5 cursor-pointer"
                    title={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                  >
                    {showPassword ? <IconEyeOff size={18} /> : <IconEye size={18} />}
                  </button>
                </div>
              )}
            />
            {errors.password && (
              <p className="text-[11px] text-rose-500 font-medium m-0">{errors.password.message}</p>
            )}
          </div>

          {/* Quick Demo Credentials Box */}
          <div className="p-2.5 rounded-lg bg-stone-50 border border-stone-200/80 flex items-center justify-between text-[11px]">
            <div className="text-stone-500">
              <span className="font-semibold text-stone-700">Tài khoản quản trị:</span> admin / Admin@123456
            </div>
            <button
              type="button"
              onClick={handleQuickFill}
              className="text-[#2B5A50] hover:text-[#20453D] font-bold inline-flex items-center gap-1 hover:underline cursor-pointer"
            >
              <IconSparkles size={13} /> Điền nhanh
            </button>
          </div>

          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            className="w-full !h-11 !rounded-lg !bg-[#2B5A50] hover:!bg-[#20453D] !font-bold !text-sm !shadow-sm !border-none mt-2 cursor-pointer"
          >
            Đăng Nhập Quản Trị
          </Button>
        </form>

        {/* Footer Navigation */}
        <div className="mt-6 pt-5 border-t border-stone-100 text-center">
          <Link
            to="/"
            className="text-xs text-stone-500 hover:text-[#2B5A50] transition-colors inline-flex items-center gap-1.5 font-medium"
          >
            <IconArrowLeft size={14} /> Quay về trang chủ cửa hàng
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;
