import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Spin, Empty, Tooltip, Modal, Form } from 'antd';
import {
  IconArrowLeft,
  IconPrinter,
  IconEdit,
  IconDeviceFloppy,
  IconX,
  IconSettings,
} from '@tabler/icons-react';
import UBreadcrumb from '~/components/ui/ubreadcrumb';
import {
  useAdminOrderDetail,
  useAdminContactSettings,
  useAdminInvoiceSettings,
} from '~/features/admin/hooks';
import {
  OrderDetailInfoCard,
  OrderDetailItemsTable,
  OrderDetailSummary,
  InvoiceCustomizeModal,
} from '~/features/admin/components/orders';
import { ProductPickerModal, type ProductItem } from '~/components/shared/ProductPickerModal';
import { printInvoiceA4, type InvoiceCompanyInfo } from '~/common/utils/printInvoice';
import type { AdminOrderItem, AdminUpdateOrderPayload } from '~/types';

export const AdminOrderDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { order, isLoading, updateOrder, isUpdatingOrder } = useAdminOrderDetail(id);
  const { contactSettings } = useAdminContactSettings();
  const { invoiceSettings } = useAdminInvoiceSettings();

  const [orderForm] = Form.useForm<AdminUpdateOrderPayload>();

  // State chế độ chỉnh sửa đơn hàng (theo chuẩn Ticket / SellingTab của tev-fe-admin)
  const [isEditing, setIsEditing] = useState(false);
  const [editableItems, setEditableItems] = useState<AdminOrderItem[]>([]);
  const [editableShippingFee, setEditableShippingFee] = useState<number>(0);
  const [editableDiscount, setEditableDiscount] = useState<number>(0);
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);

  // Cấu hình thông tin in mặc định từ contactSettings & invoiceSettings đã lưu trong DB
  const mergedCompanyInfo: InvoiceCompanyInfo = useMemo(
    () => ({
      companyName:
        invoiceSettings?.companyName ||
        'CÔNG TY TNHH KIẾN TRÚC & NỘI THẤT LUXDECOR',
      address:
        invoiceSettings?.address ||
        contactSettings?.address1 ||
        'Tòa nhà Detech Tower, Số 8 Tôn Thất Thuyết, Mỹ Đình 2, Cầu Giấy, Hà Nội',
      hotline:
        invoiceSettings?.hotline ||
        contactSettings?.hotline ||
        '1900 8888 - 0988 888 888',
      taxCode: invoiceSettings?.taxCode || '0108998899',
      email: invoiceSettings?.email || 'contact@luxdecor.vn',
      website: invoiceSettings?.website || 'www.luxdecor.vn',
    }),
    [contactSettings, invoiceSettings]
  );

  // Đồng bộ dữ liệu khi order thay đổi
  useEffect(() => {
    if (order) {
      setEditableItems(order.items || []);
      setEditableShippingFee(order.shippingFee || 0);
      setEditableDiscount(order.discountAmount || 0);
      orderForm.setFieldsValue({
        recipient_name: order.recipient_name,
        phone: order.phone,
        email: order.email,
        address_line: order.address_line,
        district: order.district,
        city: order.city,
        status: order.status,
        paymentStatus: order.paymentStatus,
        paymentMethod: order.paymentMethod,
        paymentTransactionId: order.paymentTransactionId,
        voucherCode: order.voucherCode,
        discountAmount: order.discountAmount || 0,
        shippingFee: order.shippingFee || 0,
        note: order.note || '',
      });
    }
  }, [order, orderForm]);

  // Tính toán tài chính realtime (Sử dụng useMemo theo Rule 3)
  const currentSubtotal = useMemo(() => {
    return editableItems.reduce(
      (sum, it) => sum + (Number(it.unitPrice) || 0) * (Number(it.quantity) || 1),
      0
    );
  }, [editableItems]);

  const currentTotal = useMemo(() => {
    return Math.max(0, currentSubtotal - editableDiscount + (Number(editableShippingFee) || 0));
  }, [currentSubtotal, editableDiscount, editableShippingFee]);

  // Các handlers memoized bằng useCallback theo Rule 3
  const handleStartEdit = useCallback(() => {
    if (order) {
      setEditableItems(order.items || []);
      setEditableShippingFee(order.shippingFee || 0);
      setEditableDiscount(order.discountAmount || 0);
      orderForm.setFieldsValue({
        recipient_name: order.recipient_name,
        phone: order.phone,
        email: order.email,
        address_line: order.address_line,
        district: order.district,
        city: order.city,
        status: order.status,
        paymentStatus: order.paymentStatus,
        paymentMethod: order.paymentMethod,
        paymentTransactionId: order.paymentTransactionId,
        voucherCode: order.voucherCode,
        discountAmount: order.discountAmount || 0,
        shippingFee: order.shippingFee || 0,
        note: order.note || '',
      });
      setIsEditing(true);
    }
  }, [order, orderForm]);

  const handleCancelEdit = useCallback(() => {
    if (order) {
      setEditableItems(order.items || []);
      setEditableShippingFee(order.shippingFee || 0);
      setEditableDiscount(order.discountAmount || 0);
      orderForm.resetFields();
    }
    setIsEditing(false);
  }, [order, orderForm]);

  const handleSaveOrder = useCallback(async () => {
    if (!order) return;
    try {
      const values = await orderForm.validateFields();
      await updateOrder({
        ...values,
        shippingFee: editableShippingFee,
        discountAmount: editableDiscount,
        items: editableItems,
      });
      setIsEditing(false);
    } catch {
      // Form validation failed
    }
  }, [order, orderForm, updateOrder, editableShippingFee, editableDiscount, editableItems]);

  const handleQuantityChange = useCallback((itemId: string, qty: number | null) => {
    const validQty = Math.max(1, qty || 1);
    setEditableItems((prev) =>
      prev.map((it) =>
        (it.id || it.productId) === itemId
          ? { ...it, quantity: validQty, lineTotal: validQty * (it.unitPrice || 0) }
          : it
      )
    );
  }, []);

  const handlePriceChange = useCallback((itemId: string, price: number | null) => {
    const validPrice = Math.max(0, price || 0);
    setEditableItems((prev) =>
      prev.map((it) =>
        (it.id || it.productId) === itemId
          ? { ...it, unitPrice: validPrice, lineTotal: (it.quantity || 1) * validPrice }
          : it
      )
    );
  }, []);

  const handleRemoveItem = useCallback((itemId: string) => {
    setEditableItems((prev) => {
      if (prev.length <= 1) {
        Modal.warning({
          title: 'Không thể xóa',
          content: 'Đơn hàng cần có ít nhất 1 sản phẩm.',
          okText: 'Đã hiểu',
        });
        return prev;
      }
      return prev.filter((it) => (it.id || it.productId) !== itemId);
    });
  }, []);

  const handleAddPickedProducts = useCallback(
    (_: string[], selectedProducts: ProductItem[]) => {
      setEditableItems((prev) => {
        const updated = [...prev];
        selectedProducts.forEach((prod) => {
          const prodId = prod.s_ID || prod.id || '';
          const existingIdx = updated.findIndex((it) => it.productId === prodId);
          if (existingIdx >= 0) {
            const cur = updated[existingIdx];
            const newQty = (cur.quantity || 1) + 1;
            updated[existingIdx] = {
              ...cur,
              quantity: newQty,
              lineTotal: newQty * (cur.unitPrice || 0),
            };
          } else {
            const unitPrice = prod.price || 0;
            updated.push({
              id: `item_${Date.now()}_${Math.random()}`,
              productId: prodId,
              productName: prod.name,
              selectedColor: '',
              imageUrl: prod.images?.[0] || '',
              unitPrice: unitPrice,
              quantity: 1,
              lineTotal: unitPrice,
            });
          }
        });
        return updated;
      });
      setIsPickerOpen(false);
    },
    []
  );

  const handlePrint = useCallback(
    (customInfo?: InvoiceCompanyInfo) => {
      if (order) {
        printInvoiceA4(order, { ...mergedCompanyInfo, ...customInfo });
      }
    },
    [order, mergedCompanyInfo]
  );

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center font-sans">
        <Spin size="large" tip="Đang tải dữ liệu đơn hàng..." />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="p-8 font-sans">
        <UBreadcrumb
          title="Không Tìm Thấy Đơn Hàng"
          trailing={
            <Button
              icon={<IconArrowLeft size={16} />}
              onClick={() => navigate('/admin/orders')}
            >
              Quay lại danh sách
            </Button>
          }
        />
        <div className="mt-8">
          <Empty description="Không tìm thấy thông tin đơn hàng này trong hệ thống" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 flex flex-col gap-4 font-sans h-full overflow-y-auto">
      <Form form={orderForm} layout="vertical" component={false}>
        <div className="w-full flex p-4 bg-white rounded-md shadow flex-col gap-4 border border-slate-200/80">
          <UBreadcrumb
            title={`Chi Tiết Đơn Hàng #${order.id}`}
            trailing={
              <div className="flex items-center gap-2">
                <Button
                  icon={<IconArrowLeft size={16} />}
                  onClick={() => navigate('/admin/orders')}
                >
                  Quay lại
                </Button>

                {!isEditing ? (
                  <>
                    <Tooltip title="Tùy chỉnh và lưu vĩnh viễn thông tin công ty / hotline trên hóa đơn">
                      <Button
                        icon={<IconSettings size={16} />}
                        onClick={() => setIsInvoiceModalOpen(true)}
                      >
                        Mẫu Hóa Đơn
                      </Button>
                    </Tooltip>

                    <Button
                      icon={<IconPrinter size={16} />}
                      onClick={() => handlePrint()}
                      className="!font-semibold cursor-pointer"
                    >
                      Xuất Hóa Đơn PDF / In
                    </Button>

                    <Button
                      type="primary"
                      icon={<IconEdit size={16} />}
                      onClick={handleStartEdit}
                      className="!bg-[#2B5A50] hover:!bg-[#20453D] !font-bold cursor-pointer"
                    >
                      Chỉnh Sửa Đơn Hàng
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      icon={<IconX size={16} />}
                      onClick={handleCancelEdit}
                      disabled={isUpdatingOrder}
                    >
                      Hủy Bỏ
                    </Button>

                    <Button
                      type="primary"
                      icon={<IconDeviceFloppy size={16} />}
                      loading={isUpdatingOrder}
                      onClick={handleSaveOrder}
                      className="!bg-[#2B5A50] hover:!bg-[#20453D] !font-bold cursor-pointer"
                    >
                      Lưu Toàn Bộ Đơn Hàng
                    </Button>
                  </>
                )}
              </div>
            }
          />

          {/* Khối Thông Tin Khách Hàng, Giao Nhận & Trạng Thái (Cho phép sửa toàn bộ) */}
          <OrderDetailInfoCard
            order={order}
            isEditing={isEditing}
          />

          {/* Bảng Danh Sách Sản Phẩm Đặt Mua (Cho phép thêm/bớt/sửa giá/sửa số lượng) */}
          <OrderDetailItemsTable
            items={isEditing ? editableItems : order.items || []}
            isEditing={isEditing}
            onQuantityChange={handleQuantityChange}
            onPriceChange={handlePriceChange}
            onRemoveItem={handleRemoveItem}
            onOpenPicker={() => setIsPickerOpen(true)}
          />

          {/* Khối Tổng Hợp Tài Chính (Cho phép sửa phí vận chuyển và giảm giá) */}
          <OrderDetailSummary
            subtotal={isEditing ? currentSubtotal : order.subtotal || 0}
            discountAmount={isEditing ? editableDiscount : order.discountAmount || 0}
            shippingFee={isEditing ? editableShippingFee : order.shippingFee || 0}
            totalAmount={isEditing ? currentTotal : order.totalAmount || 0}
            isEditing={isEditing}
            onShippingFeeChange={setEditableShippingFee}
            onDiscountChange={setEditableDiscount}
          />
        </div>
      </Form>

      {/* Modal Chọn Sản Phẩm Bổ Sung Vào Đơn Hàng */}
      {isPickerOpen && (
        <ProductPickerModal
          open={isPickerOpen}
          onCancel={() => setIsPickerOpen(false)}
          onOk={handleAddPickedProducts}
          title="Chọn Sản Phẩm Bổ Sung Vào Đơn Hàng"
        />
      )}

      {/* Modal Tùy Chỉnh & Lưu Thông Tin Mẫu Hóa Đơn Vĩnh Viễn Vào DB */}
      <InvoiceCustomizeModal
        open={isInvoiceModalOpen}
        onClose={() => setIsInvoiceModalOpen(false)}
        initialValues={mergedCompanyInfo}
        onPrint={handlePrint}
      />
    </div>
  );
};

export default AdminOrderDetailPage;
