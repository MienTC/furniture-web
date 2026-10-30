import React, { useEffect } from 'react';
import { Modal, Form, Input, Row, Col, Button, Space } from 'antd';
import { IconPrinter, IconDeviceFloppy } from '@tabler/icons-react';
import { useAdminInvoiceSettings } from '~/features/admin/hooks';
import type { InvoiceCompanyInfo } from '~/common/utils/printInvoice';

interface InvoiceCustomizeModalProps {
  open: boolean;
  onClose: () => void;
  initialValues: InvoiceCompanyInfo;
  onPrint: (customInfo: InvoiceCompanyInfo) => void;
}

export const InvoiceCustomizeModal: React.FC<InvoiceCustomizeModalProps> = ({
  open,
  onClose,
  initialValues,
  onPrint,
}) => {
  const [form] = Form.useForm<InvoiceCompanyInfo>();
  const { invoiceSettings, updateInvoiceSettings, isUpdating } = useAdminInvoiceSettings();

  useEffect(() => {
    if (open) {
      // Ưu tiên nạp cấu hình đã lưu trong DB, nếu chưa có thì dùng initialValues
      const activeData = {
        ...initialValues,
        ...(invoiceSettings || {}),
      };
      form.setFieldsValue(activeData);
    }
  }, [open, initialValues, invoiceSettings, form]);

  const handleSaveOnly = async () => {
    try {
      const values = await form.validateFields();
      await updateInvoiceSettings(values);
    } catch {
      // validate failed
    }
  };

  const handleSaveAndPrint = async () => {
    try {
      const values = await form.validateFields();
      await updateInvoiceSettings(values);
      onPrint(values);
      onClose();
    } catch {
      // validate failed
    }
  };

  return (
    <Modal
      title="Tùy Chỉnh & Lưu Thông Tin Mẫu Hóa Đơn (A4)"
      open={open}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose} disabled={isUpdating}>
          Đóng
        </Button>,
        <Button
          key="save"
          icon={<IconDeviceFloppy size={16} />}
          loading={isUpdating}
          onClick={handleSaveOnly}
        >
          Lưu Vào Hệ Thống
        </Button>,
        <Button
          key="print"
          type="primary"
          icon={<IconPrinter size={16} />}
          loading={isUpdating}
          onClick={handleSaveAndPrint}
          className="!bg-[#2B5A50]"
        >
          Lưu & Xuất Hóa Đơn
        </Button>,
      ]}
      width={560}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        className="pt-2 font-sans"
      >
        <Form.Item
          label="Tên Đơn Vị Bán Hàng"
          name="companyName"
          rules={[{ required: true, message: 'Vui lòng nhập tên công ty' }]}
        >
          <Input placeholder="Tên công ty / thương hiệu..." />
        </Form.Item>
        <Form.Item
          label="Địa Chỉ Trụ Sở / Kho Hàng"
          name="address"
          rules={[{ required: true, message: 'Vui lòng nhập địa chỉ' }]}
        >
          <Input placeholder="Địa chỉ hiển thị trên hóa đơn..." />
        </Form.Item>
        <Row gutter={12}>
          <Col span={12}>
            <Form.Item
              label="Hotline Bán Hàng"
              name="hotline"
              rules={[{ required: true, message: 'Vui lòng nhập hotline' }]}
            >
              <Input placeholder="Số hotline..." />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Mã Số Thuế (MST)" name="taxCode">
              <Input placeholder="Mã số thuế..." />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={12}>
          <Col span={12}>
            <Form.Item label="Email Liên Hệ" name="email">
              <Input placeholder="Email liên hệ..." />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Website Doanh Nghiệp" name="website">
              <Input placeholder="Website..." />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default InvoiceCustomizeModal;
