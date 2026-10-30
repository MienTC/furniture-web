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

const { Paragraph } = Typography;

export const AdminContactSettingsPage: React.FC = () => {
  const [form] = Form.useForm();
  const { contactSettings, isLoading, updateContactSettings, isUpdating } = useAdminContactSettings();

  useEffect(() => {
    if (contactSettings) {
      form.setFieldsValue({
        hotline: contactSettings.hotline,
        hotline2: contactSettings.hotline2,
        address1: contactSettings.address1,
        address2: contactSettings.address2,
        fanpage_url: contactSettings.fanpage_url,
        contacts: contactSettings.contacts,
      });
    }
  }, [contactSettings, form]);

  const handleFinish = async (values: ContactSettingsData) => {
    // Tự động tạo link Zalo từ số điện thoại nếu để trống - không bắt buộc user phải nhập
    const sanitizedContacts = (values.contacts || []).map((c) => {
      const rawPhone = (c.phone || '').trim();
      const cleanPhone = rawPhone.replace(/\D/g, '');
      const autoZalo = cleanPhone ? `https://zalo.me/${cleanPhone}` : '';
      return {
        name: (c.name || '').trim(),
        phone: rawPhone,
        zaloUrl: (c.zaloUrl || '').trim() || autoZalo,
      };
    });

    await updateContactSettings({
      ...values,
      contacts: sanitizedContacts,
    });
  };

  return (
    <div className="flex flex-col gap-4 font-sans w-full min-h-full pb-10">
      <UBreadcrumb
        title="Cấu hình Hotline, Địa chỉ & Danh sách Zalo"
        trailing={
          <Button
            type="primary"
            icon={<SaveOutlined />}
            loading={isUpdating}
            onClick={() => form.submit()}
            className="!bg-[#2B5A50] hover:!bg-[#20453D] !h-9 !px-6 !font-bold cursor-pointer"
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 w-full items-start">
          {/* Hotline & Địa chỉ */}
          <Card
            title={
              <Space>
                <PhoneOutlined className="text-[#2B5A50]" />
                <span className="text-sm font-bold">Hotline & Địa Chỉ Showroom</span>
              </Space>
            }
            className="shadow-xs border-stone-200"
            bodyStyle={{ padding: '16px' }}
          >
            <Form.Item
              label={<span className="font-semibold text-xs text-stone-700">Hotline chính *</span>}
              name="hotline"
              rules={[{ required: true, message: 'Vui lòng nhập Hotline chính' }]}
              className="!mb-3"
            >
              <Input placeholder="VD: 0393241003 hoặc 1900 8888" className="!h-9 !w-full" style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item
              label={<span className="font-semibold text-xs text-stone-700">Hotline phụ (Tùy chọn)</span>}
              name="hotline2"
              className="!mb-3"
            >
              <Input placeholder="VD: 0988 888 999" className="!h-9 !w-full" style={{ width: '100%' }} />
            </Form.Item>

            <Divider className="!my-3" />

            <Form.Item
              label={
                <Space>
                  <EnvironmentOutlined className="text-[#2B5A50]" />
                  <span className="font-semibold text-xs text-stone-700">Showroom 1</span>
                </Space>
              }
              name="address1"
              className="!mb-3"
            >
              <Input placeholder="VD: 88 Phố Lý Thường Kiệt, Q. Hoàn Kiếm, Hà Nội" className="!h-9 !w-full" style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item
              label={
                <Space>
                  <EnvironmentOutlined className="text-[#2B5A50]" />
                  <span className="font-semibold text-xs text-stone-700">Showroom 2 (Tùy chọn)</span>
                </Space>
              }
              name="address2"
              className="!mb-3"
            >
              <Input placeholder="VD: 720A Điện Biên Phủ, P. 22, Q. Bình Thạnh, TP.HCM" className="!h-9 !w-full" style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item
              label={<span className="font-semibold text-xs text-stone-700">Link Fanpage / Facebook</span>}
              name="fanpage_url"
              className="!mb-0"
            >
              <Input placeholder="VD: https://facebook.com/luxdecor" className="!h-9 !w-full" style={{ width: '100%' }} />
            </Form.Item>
          </Card>

          {/* Danh sách nhân viên tư vấn Zalo */}
          <Card
            title={
              <Space>
                <MessageOutlined className="text-[#2B5A50]" />
                <span className="text-sm font-bold">Nhân viên tư vấn & Mã QR Zalo</span>
              </Space>
            }
            className="shadow-xs border-stone-200"
            bodyStyle={{ padding: '16px' }}
          >
            <Paragraph type="secondary" className="text-xs !mb-3">
              Chỉ cần nhập Tên & Số điện thoại, hệ thống sẽ tự động tạo liên kết Zalo.
            </Paragraph>

            <Form.List name="contacts">
              {(fields, { add, remove }) => (
                <div className="space-y-3">
                  {fields.map(({ key, name, ...restField }) => (
                    <div
                      key={key}
                      className="p-3 rounded-xl border border-stone-200 bg-stone-50/80 space-y-2.5 relative group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-stone-700 flex items-center gap-1.5">
                          <QrcodeOutlined className="text-[#2B5A50]" /> Chuyên viên #{name + 1}
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
                        label={<span className="text-xs text-stone-600 font-medium">Tên hiển thị *</span>}
                        rules={[{ required: true, message: 'Nhập tên chuyên viên' }]}
                        className="!mb-2"
                      >
                        <Input placeholder="VD: Kinh doanh 1 / Em Trang Zalo" className="!h-9 text-xs !w-full" style={{ width: '100%' }} />
                      </Form.Item>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        <Form.Item
                          {...restField}
                          name={[name, 'phone']}
                          label={<span className="text-xs text-stone-600 font-medium">Số điện thoại *</span>}
                          rules={[{ required: true, message: 'Nhập số điện thoại' }]}
                          className="!mb-0"
                        >
                          <Input placeholder="VD: 0912345678" className="!h-9 text-xs !w-full" style={{ width: '100%' }} />
                        </Form.Item>

                        <Form.Item
                          {...restField}
                          name={[name, 'zaloUrl']}
                          label={<span className="text-xs text-stone-500 font-normal">Link Zalo (Tùy chọn)</span>}
                          className="!mb-0"
                        >
                          <Input placeholder="Tự tạo: https://zalo.me/{SĐT}" className="!h-9 text-xs !w-full" style={{ width: '100%' }} />
                        </Form.Item>
                      </div>
                    </div>
                  ))}

                  <Button
                    type="dashed"
                    onClick={() => add({ name: '', phone: '', zaloUrl: '' })}
                    block
                    icon={<PlusOutlined />}
                    className="!h-9 text-xs font-semibold cursor-pointer border-[#2B5A50]/40 text-[#2B5A50] hover:!border-[#2B5A50] hover:!text-[#20453D]"
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
