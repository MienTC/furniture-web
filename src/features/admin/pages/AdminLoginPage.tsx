import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { Button, Space } from 'antd';
import { toast } from 'react-toastify';
import { IconShieldLock, IconEye, IconEyeOff } from '@tabler/icons-react';
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
      const success = await loginAsAdmin(data.loginName, data.password);
      if (success) {
        navigate('/admin');
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || err?.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-neutral-950 text-white overflow-hidden font-sans">
      {/* Background Decor */}
      <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-25" />
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-brand-coral/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-brand-peach/10 rounded-full blur-3xl pointer-events-none" />

      {/* Card Form - Copy style từ tev-fe-admin/LoginPage.tsx DesktopLayout */}
      <div className="relative z-10 w-full max-w-md mx-4 p-8 rounded-2xl bg-neutral-900/90 border border-neutral-800 shadow-2xl backdrop-blur-md">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="size-14 rounded-2xl bg-sky-500 flex items-center justify-center text-white shadow-lg shadow-sky-500/20 mb-4">
            <IconShieldLock size={32} />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Đăng Nhập Quản Trị</h1>
          <p className="text-sm text-neutral-400 mt-1">Truy cập bảng điều khiển hệ thống LuxDecor</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-neutral-300">Tên đăng nhập hoặc Email</label>
            <Controller
              name="loginName"
              control={control}
              rules={{ required: 'Vui lòng nhập tên tài khoản' }}
              render={({ field }) => (
                <input
                  {...field}
                  type="text"
                  placeholder="admin@luxdecor.vn"
                  className="w-full rounded-lg border border-neutral-700 bg-neutral-800/80 px-3.5 py-2.5 text-sm text-white placeholder-neutral-500 outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all"
                />
              )}
            />
            {errors.loginName && <p className="text-xs text-rose-400">{errors.loginName.message}</p>}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-neutral-300">Mật khẩu</label>
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
                    className="w-full rounded-lg border border-neutral-700 bg-neutral-800/80 px-3.5 py-2.5 text-sm text-white placeholder-neutral-500 outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white transition-colors"
                  >
                    {showPassword ? <IconEyeOff size={18} /> : <IconEye size={18} />}
                  </button>
                </div>
              )}
            />
            {errors.password && <p className="text-xs text-rose-400">{errors.password.message}</p>}
          </div>

          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            className="w-full !h-11 !rounded-lg !bg-sky-500 hover:!bg-sky-400 !font-semibold !text-sm !shadow-md !shadow-sky-500/20 !border-none mt-2"
          >
            Đăng Nhập Hệ Thống
          </Button>
        </form>

        <div className="mt-8 pt-6 border-t border-neutral-800 text-center">
          <a
            href="/"
            className="text-xs text-neutral-400 hover:text-sky-400 transition-colors inline-flex items-center gap-1"
          >
            ← Quay về trang chủ cửa hàng
          </a>
        </div>
      </div>
    </div>
  );
};
