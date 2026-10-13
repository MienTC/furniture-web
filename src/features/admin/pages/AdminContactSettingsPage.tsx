import React, { useEffect } from 'react';
import {
  Form,
  Input,
  Button,
  Card,
  Space,
  Typography,
  Divider,
} from 'antd';
import {
  SaveOutlined,
  PhoneOutlined,
  MessageOutlined,
  EnvironmentOutlined,
  PlusOutlined,
  MinusCircleOutlined,
  QrcodeOutlined,
} from '@ant-design/icons';
import UBreadcrumb from '~/components/ui/ubreadcrumb';
import { useAdminContactSettings } from '~/features/admin/hooks';
import type { ContactSettingsData } from '~/types';

const { Text, Paragraph } = Typography;

export const AdminContactSettingsPage: React.FC = () => {
  const [form] = Form.useForm();
  const { contactSettings, isLoading, updateContactSettings, isUpdating } = useAdminContactSettings();

  useEffect(() => {
    if (contactSettings) {
      form.setFieldsValue({
        hotline: contactSettings.hotline || '',
        hotline2: contactSettings.hotline2 || '',
        address1: contactSettings.address1 || '',
        address2: contactSettings.address2 || '',
        fanpage_url: contactSettings.fanpage_url || '',
        contacts: contactSettings.contacts || [],
      });
    }
  }, [contactSettings, form]);

  const handleFinish = async (values: ContactSettingsData) => {
    await updateContactSettings(values);
  };

  return (
    <div className="flex flex-col gap-5 font-sans w-full min-h-full pb-16">
      <UBreadcrumb
        title="Cấu hình Hotline, Địa chỉ & Danh sách Zalo"
        trailing={
          <Button
            type="primary"
            icon={<SaveOutlined />}
            loading={isUpdating}
            onClick={() => form.submit()}
            className="!bg-brand-coral hover:!bg-[#c95f5f] !h-10 !px-6 !font-bold cursor-pointer"
          >
            Lưu cấu hình
          </Button>
        }
      />
      <Paragraph type="secondary" className="!mb-0 text-xs">
        Quản lý thông tin liên hệ hiển thị tại Header, Footer và hộp chat LuxBot AI. Tuyệt đối 100% dữ liệu động từ Database.
      </Paragraph>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        disabled={isLoading}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
          {/* Hotline & Địa chỉ */}
          <Card
            title={
              <Space>
                <PhoneOutlined className="text-brand-coral" />
                <span>Hotline & Địa Chỉ Showroom</span>
              </Space>
            }
            className="shadow-xs border-stone-200"
          >
            <Form.Item
              label={<span className="font-semibold text-xs uppercase tracking-wider text-stone-700">Hotline chính</span>}
              name="hotline"
              rules={[{ required: true, message: 'Vui lòng nhập Hotline chính' }]}
            >
              <Input placeholder="VD: 0393241003 hoặc 1900 8888" className="!h-10 !w-full" style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item
              label={<span className="font-semibold text-xs uppercase tracking-wider text-stone-700">Hotline phụ (Tùy chọn)</span>}
              name="hotline2"
            >
              <Input placeholder="VD: 0988 888 999" className="!h-10 !w-full" style={{ width: '100%' }} />
            </Form.Item>

            <Divider className="!my-4" />

            <Form.Item
              label={
                <Space>
                  <EnvironmentOutlined className="text-brand-coral" />
                  <span className="font-semibold text-xs uppercase tracking-wider text-stone-700">Showroom 1</span>
                </Space>
              }
              name="address1"
            >
              <Input placeholder="VD: 88 Phố Lý Thường Kiệt, Q. Hoàn Kiếm, Hà Nội" className="!h-10 !w-full" style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item
              label={
                <Space>
                  <EnvironmentOutlined className="text-brand-coral" />
                  <span className="font-semibold text-xs uppercase tracking-wider text-stone-700">Showroom 2 (Tùy chọn)</span>
                </Space>
              }
              name="address2"
            >
              <Input placeholder="VD: 720A Điện Biên Phủ, P. 22, Q. Bình Thạnh, TP.HCM" className="!h-10 !w-full" style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item
              label={<span className="font-semibold text-xs uppercase tracking-wider text-stone-700">Link Fanpage / Facebook</span>}
              name="fanpage_url"
            >
              <Input placeholder="VD: https://facebook.com/luxdecor" className="!h-10 !w-full" style={{ width: '100%' }} />
            </Form.Item>
          </Card>

          {/* Danh sách nhân viên tư vấn Zalo */}
          <Card
            title={
              <Space>
                <MessageOutlined className="text-brand-coral" />
                <span>Nhân viên tư vấn & Mã QR Zalo</span>
              </Space>
            }
            className="shadow-xs border-stone-200"
          >
            <Paragraph type="secondary" className="text-xs !mb-4">
              Danh sách hiển thị trực tiếp trong tab <b>"Hotline & Zalo"</b> của hộp chat AI và popup đăng ký nhận ưu đãi ở Footer.
            </Paragraph>

            <Form.List name="contacts">
              {(fields, { add, remove }) => (
                <div className="space-y-4">
                  {fields.map(({ key, name, ...restField }) => (
                    <div
                      key={key}
                      className="p-3.5 rounded-xl border border-stone-200 bg-stone-50/70 space-y-3 relative group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-stone-700 flex items-center gap-1.5">
                          <QrcodeOutlined className="text-brand-coral" /> Chuyên viên #{name + 1}
                        </span>
                        <Button
                          type="text"
                          danger
                          size="small"
                          icon={<MinusCircleOutlined />}
                          onClick={() => remove(name)}
                          className="cursor-pointer"
                        >
                          Xóa
                        </Button>
                      </div>

                      <Form.Item
                        {...restField}
                        name={[name, 'name']}
                        label={<span className="text-xs text-stone-600 font-medium">Tên hiển thị</span>}
                        rules={[{ required: true, message: 'Nhập tên chuyên viên' }]}
                        className="!mb-2"
                      >
                        <Input placeholder="VD: Kinh doanh 1 / Em Trang Zalo" className="!h-9 text-xs !w-full" style={{ width: '100%' }} />
                      </Form.Item>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <Form.Item
                          {...restField}
                          name={[name, 'phone']}
                          label={<span className="text-xs text-stone-600 font-medium">Số điện thoại</span>}
                          rules={[{ required: true, message: 'Nhập SĐT' }]}
                          className="!mb-0"
                        >
                          <Input placeholder="VD: 0912345678" className="!h-9 text-xs !w-full" style={{ width: '100%' }} />
                        </Form.Item>

                        <Form.Item
                          {...restField}
                          name={[name, 'zaloUrl']}
                          label={<span className="text-xs text-stone-600 font-medium">Link Zalo</span>}
                          rules={[{ required: true, message: 'Nhập link Zalo' }]}
                          className="!mb-0"
                        >
                          <Input placeholder="VD: https://zalo.me/0912345678" className="!h-9 text-xs !w-full" style={{ width: '100%' }} />
                        </Form.Item>
                      </div>
                    </div>
                  ))}

                  <Button
                    type="dashed"
                    onClick={() => add({ name: '', phone: '', zaloUrl: '' })}
                    block
                    icon={<PlusOutlined />}
                    className="!h-10 text-xs font-semibold cursor-pointer border-brand-coral/40 text-brand-coral hover:!border-brand-coral hover:!text-[#c95f5f]"
                  >
                    Thêm chuyên viên tư vấn
                  </Button>
                </div>
              )}
            </Form.List>
          </Card>
        </div>
      </Form>
    </div>
  );
};
