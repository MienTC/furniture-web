import React, { useState } from 'react';
import { Modal, Form, Input, Button, Tabs, message } from 'antd';
import { User, Lock, Mail, Phone, Sparkles } from 'lucide-react';
import { useAuth } from '~/contexts/AuthContext';

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
  defaultTab?: 'login' | 'register';
}

export const AuthModal: React.FC<AuthModalProps> = ({ open, onClose, defaultTab = 'login' }) => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>(defaultTab);
  const [loading, setLoading] = useState(false);
  const { loginWithCredentials, register } = useAuth();
  const [loginForm] = Form.useForm();
  const [registerForm] = Form.useForm();

  React.useEffect(() => {
    setActiveTab(defaultTab);
  }, [defaultTab, open]);

  const handleLogin = async (values: { loginName: string; password: string }) => {
    setLoading(true);
    const success = await loginWithCredentials(values.loginName.trim(), values.password);
    setLoading(false);
    if (success) {
      loginForm.resetFields();
      onClose();
    }
  };

  const handleRegister = async (values: { s_user: string; email: string; password: string; phone?: string }) => {
    setLoading(true);
    const success = await register({
      s_user: values.s_user.trim(),
      email: values.email.trim(),
      s_PWD: values.password,
      phone: values.phone?.trim() || '',
    });
    setLoading(false);
    if (success) {
      registerForm.resetFields();
      onClose();
    }
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      centered
      width={420}
      className="auth-modal"
      destroyOnClose
    >
      <div className="text-center pt-2 pb-4">
        <div className="w-12 h-12 rounded-2xl bg-amber-900 text-amber-200 mx-auto flex items-center justify-center mb-3 shadow-md">
          <Sparkles size={24} />
        </div>
        <h3 className="text-xl font-bold text-stone-900">
          {activeTab === 'login' ? 'Đăng Nhập Tài Khoản' : 'Đăng Ký Tài Khoản'}
        </h3>
        <p className="text-xs text-stone-500 mt-1">
          Trải nghiệm mua sắm nội thất cao cấp cùng LuxDecor
        </p>
      </div>

      <Tabs
        activeKey={activeTab}
        onChange={(k) => setActiveTab(k as 'login' | 'register')}
        centered
        className="mb-4"
        items={[
          { key: 'login', label: 'Đăng Nhập' },
          { key: 'register', label: 'Đăng Ký' },
        ]}
      />

      {activeTab === 'login' ? (
        <Form form={loginForm} layout="vertical" onFinish={handleLogin}>
          <Form.Item
            name="loginName"
            rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập hoặc email' }]}
          >
            <Input
              prefix={<User size={15} className="text-stone-400 mr-1" />}
              placeholder="Tên đăng nhập hoặc Email"
              className="!py-2.5 !rounded-xl"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu' }]}
          >
            <Input.Password
              prefix={<Lock size={15} className="text-stone-400 mr-1" />}
              placeholder="Mật khẩu"
              className="!py-2.5 !rounded-xl"
            />
          </Form.Item>

          <div className="flex justify-between items-center text-xs text-stone-500 mb-4 px-1">
            <span>Tài khoản thử: <b>customer</b> / <b>Customer@123456</b></span>
          </div>

          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            block
            className="!h-11 !rounded-xl !bg-amber-900 hover:!bg-amber-800 font-bold text-sm tracking-wide shadow-md"
          >
            Đăng Nhập
          </Button>

          <p className="text-center text-xs text-stone-500 mt-4">
            Chưa có tài khoản?{' '}
            <button
              type="button"
              onClick={() => setActiveTab('register')}
              className="text-amber-900 font-bold hover:underline"
            >
              Đăng ký ngay
            </button>
          </p>
        </Form>
      ) : (
        <Form form={registerForm} layout="vertical" onFinish={handleRegister}>
          <Form.Item
            name="s_user"
            rules={[
              { required: true, message: 'Vui lòng nhập tên đăng nhập' },
              { min: 3, message: 'Tối thiểu 3 ký tự' },
            ]}
          >
            <Input
              prefix={<User size={15} className="text-stone-400 mr-1" />}
              placeholder="Tên đăng nhập (viết liền không dấu)"
              className="!py-2.5 !rounded-xl"
            />
          </Form.Item>

          <Form.Item
            name="email"
            rules={[
              { required: true, message: 'Vui lòng nhập email' },
              { type: 'email', message: 'Email không đúng định dạng' },
            ]}
          >
            <Input
              prefix={<Mail size={15} className="text-stone-400 mr-1" />}
              placeholder="Địa chỉ Email"
              className="!py-2.5 !rounded-xl"
            />
          </Form.Item>

          <Form.Item
            name="phone"
            rules={[{ pattern: /^[0-9]{9,11}$/, message: 'Số điện thoại gồm 9-11 chữ số' }]}
          >
            <Input
              prefix={<Phone size={15} className="text-stone-400 mr-1" />}
              placeholder="Số điện thoại (tùy chọn)"
              className="!py-2.5 !rounded-xl"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              { required: true, message: 'Vui lòng nhập mật khẩu' },
              { min: 6, message: 'Mật khẩu tối thiểu 6 ký tự' },
            ]}
          >
            <Input.Password
              prefix={<Lock size={15} className="text-stone-400 mr-1" />}
              placeholder="Mật khẩu"
              className="!py-2.5 !rounded-xl"
            />
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            block
            className="!h-11 !rounded-xl !bg-amber-900 hover:!bg-amber-800 font-bold text-sm tracking-wide shadow-md"
          >
            Tạo Tài Khoản
          </Button>

          <p className="text-center text-xs text-stone-500 mt-4">
            Đã có tài khoản?{' '}
            <button
              type="button"
              onClick={() => setActiveTab('login')}
              className="text-amber-900 font-bold hover:underline"
            >
              Đăng nhập
            </button>
          </p>
        </Form>
      )}
    </Modal>
  );
};
