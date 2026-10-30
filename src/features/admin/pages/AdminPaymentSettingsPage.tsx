import React, { useEffect } from 'react';
import {
  Form,
  Input,
  Switch,
  Button,
  Card,
  Alert,
  Divider,
  Select,
} from 'antd';
import {
  SaveOutlined,
  CopyOutlined,
  CheckCircleOutlined,
  BankOutlined,
} from '@ant-design/icons';
import { toast } from 'react-toastify';
import UBreadcrumb from '~/components/ui/ubreadcrumb';
import { useAdminPaymentSettings } from '~/features/admin/hooks';
import { APP_ENV } from '~/common/com-env';

export const AdminPaymentSettingsPage: React.FC = () => {
  const [form] = Form.useForm();
  const { settings, isLoading, updateSettings, isUpdating } = useAdminPaymentSettings();

  useEffect(() => {
    if (settings) {
      form.setFieldsValue({
        cod_enabled: settings.cod_enabled !== undefined ? settings.cod_enabled : true,
        bank_transfer_enabled: settings.bank_transfer_enabled !== undefined ? settings.bank_transfer_enabled : true,
        bank_name: settings.bank_name,
        bank_account_number: settings.bank_account_number,
        bank_account_holder: settings.bank_account_holder,
        bank_branch: settings.bank_branch,
        sepay_enabled: settings.sepay_enabled !== undefined ? settings.sepay_enabled : true,
        sepay_merchant_id: settings.sepay_merchant_id,
        sepay_api_key: settings.sepay_api_key,
      });
    }
  }, [settings, form]);

  const handleFinish = async (values: any) => {
    await updateSettings(values);
  };

  return (
    <div className="flex flex-col gap-4 font-sans w-full min-h-full pb-16">
      <UBreadcrumb
        title="Cấu Hình Phương Thức Thanh Toán"
        trailing={
          <Button
            type="primary"
            icon={<SaveOutlined />}
            loading={isUpdating}
            onClick={() => form.submit()}
            className="!bg-[#2B5A50] hover:!bg-[#20453D] !font-semibold !shadow-xs !h-9 !px-5"
          >
            Lưu cấu hình thanh toán
          </Button>
        }
      />

      <div className="w-full">
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFinish}
          disabled={isLoading}
          className="space-y-6 w-full"
        >

          {/* Card Cấu hình Chuyển khoản ngân hàng (VietQR) */}
          <Card
            title={
              <div className="flex items-center gap-2 text-indigo-600 font-bold">
                <BankOutlined style={{ fontSize: 20 }} />
                <span>Chuyển Khoản Ngân Hàng Trực Tiếp (VietQR Quét Mã Nhận Tiền Ngay)</span>
              </div>
            }
            extra={
              <Form.Item name="bank_transfer_enabled" valuePropName="checked" className="!mb-0">
                <Switch checkedChildren="Đang Bật" unCheckedChildren="Tạm Ẩn" />
              </Form.Item>
            }
            className="border-gray-200/80 shadow-2xs rounded-xl"
          >
            <Alert
              type="success"
              showIcon
              className="!mb-4 !rounded-lg text-xs"
              message={<span className="font-bold text-emerald-900">Tài khoản ngân hàng của bạn nhận tiền trực tiếp</span>}
              description="Khi khách đặt hàng và chọn Chuyển khoản ngân hàng, hệ thống sẽ tự động tạo mã VietQR Napas 24/7 chứa STK và số tiền chính xác. Khách hàng dùng bất kỳ ứng dụng ngân hàng nào (MB, Vietcombank, Techcombank, Momo...) quét mã là tiền sẽ chuyển thẳng vào tài khoản của bạn."
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Form.Item
                name="bank_name"
                label={<span className="font-semibold text-gray-700">Tên ngân hàng</span>}
                rules={[{ required: true, message: 'Vui lòng chọn ngân hàng' }]}
              >
                <Select
                  showSearch
                  placeholder="Chọn ngân hàng của bạn"
                  className="w-full !h-9"
                  style={{ width: '100%' }}
                  options={[
                    { value: 'MB Bank', label: 'MB Bank (Ngân hàng Quân Đội)' },
                    { value: 'Vietcombank', label: 'Vietcombank (VCB)' },
                    { value: 'Techcombank', label: 'Techcombank (TCB)' },
                    { value: 'VietinBank', label: 'VietinBank (CTG)' },
                    { value: 'BIDV', label: 'BIDV (Đầu tư & Phát triển)' },
                    { value: 'ACB', label: 'ACB (Á Châu)' },
                    { value: 'VPBank', label: 'VPBank (Việt Nam Thịnh Vượng)' },
                    { value: 'TPBank', label: 'TPBank (Tiên Phong)' },
                    { value: 'Sacombank', label: 'Sacombank' },
                    { value: 'VIB', label: 'VIB (Quốc Tế)' },
                    { value: 'HDBank', label: 'HDBank' },
                    { value: 'SHB', label: 'SHB' },
                    { value: 'MSB', label: 'MSB (Hàng Hải)' },
                    { value: 'OCB', label: 'OCB (Phương Đông)' },
                  ]}
                />
              </Form.Item>

              <Form.Item
                name="bank_account_number"
                label={<span className="font-semibold text-gray-700">Số tài khoản ngân hàng</span>}
                rules={[{ required: true, message: 'Vui lòng nhập số tài khoản' }]}
              >
                <Input placeholder="Ví dụ: 0987654321..." className="!rounded-lg !py-1.5 font-mono text-sm !w-full" style={{ width: '100%' }} />
              </Form.Item>

              <Form.Item
                name="bank_account_holder"
                label={<span className="font-semibold text-gray-700">Tên chủ tài khoản</span>}
                rules={[{ required: true, message: 'Vui lòng nhập tên chủ tài khoản' }]}
              >
                <Input placeholder="Ví dụ: NGUYEN VAN A..." className="!rounded-lg !py-1.5 uppercase font-medium text-sm !w-full" style={{ width: '100%' }} />
              </Form.Item>
            </div>

            <Divider className="!my-4" />

            {/* Mục SePay Tự Động Xác Nhận Chuyển Khoản */}
            <div className="rounded-xl border border-blue-200 bg-blue-50/60 p-4 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <CheckCircleOutlined className="text-blue-600 text-lg" />
                  <div>
                    <span className="font-bold text-sm text-blue-950">
                      Tự Động Xác Nhận Đơn Hàng Qua Webhook SePay (Khuyên Dùng)
                    </span>
                    <p className="text-xs text-blue-800 m-0">
                      Khách vừa quét VietQR chuyển tiền xong 1-3 giây &rarr; Web tự động chuyển đơn sang <b>&quot;Đã thanh toán&quot;</b>.
                    </p>
                  </div>
                </div>
                <Form.Item name="sepay_enabled" valuePropName="checked" className="!mb-0">
                  <Switch checkedChildren="Tự động bật" unCheckedChildren="Tắt" />
                </Form.Item>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                <div>
                  <Form.Item
                    name="sepay_merchant_id"
                    label={<span className="font-semibold text-xs text-blue-900">Merchant ID (Mã định danh)</span>}
                    help="Lấy tại SePay (VD: SP-TEST-...)"
                    className="!mb-2"
                  >
                    <Input
                      placeholder="VD: SP-TEST-NNB8274B"
                      className="!rounded-lg !py-1.5 font-mono text-xs !w-full"
                      style={{ width: '100%' }}
                    />
                  </Form.Item>
                </div>

                <div>
                  <Form.Item
                    name="sepay_api_key"
                    label={<span className="font-semibold text-xs text-blue-900">Secret Key / API Token</span>}
                    help="Secret Key (VD: spsk_test_...)"
                    className="!mb-2"
                  >
                    <Input.Password
                      placeholder="Nhập Secret Key / Token..."
                      className="!rounded-lg !py-1.5 font-mono text-xs !w-full"
                      style={{ width: '100%' }}
                    />
                  </Form.Item>
                </div>

                <div>
                  <label className="font-semibold text-xs text-blue-900 block mb-1.5">
                    Đường dẫn Webhook SePay (Dán vào SePay.vn):
                  </label>
                  {(() => {
                    const webhookUrl = APP_ENV.apiUrl.startsWith('http')
                      ? `${APP_ENV.apiUrl}/payment/sepay/webhook`
                      : `${window.location.origin.replace(':5173', ':5000')}/api/v1/payment/sepay/webhook`;
                    return (
                      <div className="flex gap-2">
                        <Input
                          readOnly
                          value={webhookUrl}
                          className="!rounded-lg font-mono text-xs !bg-white !w-full"
                          style={{ width: '100%' }}
                        />
                        <Button
                          icon={<CopyOutlined />}
                          onClick={() => {
                            navigator.clipboard.writeText(webhookUrl);
                            toast.success('Đã sao chép link SePay Webhook!');
                          }}
                          className="cursor-pointer"
                        >
                          Copy
                        </Button>
                      </div>
                    );
                  })()}
                </div>
              </div>

              <div className="text-[11px] text-blue-700 bg-white/80 p-2.5 rounded-lg border border-blue-100">
                💡 <b>Hướng dẫn kích hoạt trong 2 phút</b>: Đăng ký tài khoản miễn phí tại <a href="https://sepay.vn" target="_blank" rel="noreferrer" className="underline font-bold text-blue-600">sepay.vn</a> &gt; Thêm tài khoản ngân hàng của bạn &gt; Tạo Webhook dán đường dẫn ở trên vào &gt; Nhập API Key vào đây và bấm Lưu.
              </div>
            </div>
          </Card>

          {/* Card Cấu hình COD */}
          <Card
            title={
              <div className="flex items-center gap-2 text-[#2B5A50] font-bold">
                <CheckCircleOutlined style={{ fontSize: 20 }} />
                <span>Thanh Toán Khi Nhận Hàng (COD)</span>
              </div>
            }
            extra={
              <Form.Item name="cod_enabled" valuePropName="checked" className="!mb-0">
                <Switch checkedChildren="Đang Bật" unCheckedChildren="Tạm Ẩn" />
              </Form.Item>
            }
            className="border-gray-200/80 shadow-2xs rounded-xl"
          >
            <p className="text-sm text-gray-500 m-0">
              Khách hàng đặt hàng và thanh toán bằng tiền mặt trực tiếp cho nhân viên giao vận khi nhận hàng tại nhà.
            </p>
          </Card>
        </Form>
      </div>
    </div>
  );
};

export default AdminPaymentSettingsPage;
