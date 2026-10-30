import React, { useState } from 'react';
import { Table, Button, Modal, Form, Input, Rate, Switch, Tooltip } from 'antd';
import { IconMessageReply, IconTrash } from '@tabler/icons-react';
import { useAdminReviews } from '~/features/admin/hooks';
import UBreadcrumb from '~/components/ui/ubreadcrumb';
import UAvatar from '~/components/ui/uavatar';
import UBadge from '~/components/ui/ubadge';
import UAlertDialog from '~/components/ui/ualert-dialog';

export const AdminReviewsPage: React.FC = () => {
  const [replyModalOpen, setReplyModalOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState<any>(null);
  const [form] = Form.useForm();

  const {
    reviews,
    isLoading,
    replyReview,
    toggleReviewStatus,
    deleteReview,
    isReplying,
    isToggling,
  } = useAdminReviews();

  const handleOpenReply = (record: any) => {
    setSelectedReview(record);
    form.setFieldsValue({ reply: record.admin_reply || '' });
    setReplyModalOpen(true);
  };

  const handleReplySubmit = async (val: { reply: string }) => {
    if (selectedReview) {
      await replyReview({ id: selectedReview.s_ID, reply: val.reply });
      setReplyModalOpen(false);
      form.resetFields();
      setSelectedReview(null);
    }
  };

  const columns = [
    {
      title: 'Khách Hàng',
      dataIndex: 'user_name',
      width: 180,
      render: (name: string, row: any) => (
        <div className="flex items-center gap-2.5">
          <UAvatar size={32} nickname={name} src={row.user_avatar} />
          <div>
            <p className="font-semibold text-xs text-gray-900 leading-tight">{name}</p>
            {row.verified_purchase && <UBadge color="green">Đã mua hàng</UBadge>}
          </div>
        </div>
      ),
    },
    {
      title: 'Đánh Giá',
      dataIndex: 'rating',
      width: 130,
      render: (rate: number) => <Rate disabled defaultValue={rate} className="text-xs" />,
    },
    {
      title: 'Nội Dung & Phản Hồi CSKH',
      dataIndex: 'comment',
      render: (comment: string, row: any) => (
        <div className="space-y-1.5 py-1">
          <Tooltip title={comment} placement="topLeft">
            <p className="text-xs text-gray-800 font-normal leading-relaxed line-clamp-2 m-0 cursor-default">
              {comment}
            </p>
          </Tooltip>
          {row.admin_reply && (
            <Tooltip title={`CSKH LuxDecor: ${row.admin_reply}`} placement="topLeft">
              <div className="p-1.5 bg-emerald-50 rounded-lg text-[11px] text-emerald-900 border border-emerald-100/80 line-clamp-1 cursor-default">
                <span className="font-bold">CSKH LuxDecor: </span>
                {row.admin_reply}
              </div>
            </Tooltip>
          )}
        </div>
      ),
    },
    {
      title: 'Hiển Thị Ngoài Web',
      dataIndex: 'is_approved',
      width: 150,
      render: (isApproved: boolean, record: any) => (
        <div className="flex items-center gap-2">
          <Switch
            checked={isApproved}
            checkedChildren="Hiển Thị"
            unCheckedChildren="Đã Ẩn"
            loading={isToggling}
            onChange={() => toggleReviewStatus(record.s_ID)}
            className={isApproved ? '!bg-[#2B5A50]' : ''}
          />
          {!isApproved && (
            <span className="text-[11px] text-rose-500 font-medium">(Đã ẩn)</span>
          )}
        </div>
      ),
    },
    {
      title: 'Thao Tác',
      width: 90,
      render: (_: any, record: any) => (
        <div className="flex items-center gap-1">
          <Tooltip title="Phản hồi đánh giá">
            <Button
              size="small"
              type="text"
              icon={<IconMessageReply size={16} className="text-sky-600" />}
              onClick={() => handleOpenReply(record)}
            />
          </Tooltip>
          <UAlertDialog
            title="Xác nhận xóa đánh giá này?"
            description="Đánh giá không phù hợp sẽ bị xóa vĩnh viễn khỏi hệ thống."
            onDelete={() => deleteReview(record.s_ID)}
            iconChildren={<IconTrash size={16} className="text-rose-500" />}
            titleTooltip="Xóa đánh giá vi phạm"
          />
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-4 font-sans w-full">
      <UBreadcrumb title="Quản Lý Đánh Giá Khách Hàng" />

      <div className="bg-white rounded-xl border border-gray-200/80 shadow-2xs p-4 w-full flex flex-col">
        <Table
          dataSource={reviews}
          rowKey="s_ID"
          columns={columns}
          loading={isLoading}
          pagination={{
            pageSize: 8,
            showSizeChanger: true,
            pageSizeOptions: ['8', '15', '30'],
            showTotal: (t) => `Tổng số ${t} đánh giá`,
          }}
          size="middle"
        />
      </div>

      <Modal
        title="Phản Hồi Đánh Giá Khách Hàng"
        open={replyModalOpen}
        onOk={() => form.submit()}
        onCancel={() => setReplyModalOpen(false)}
        confirmLoading={isReplying}
        okText="Gửi phản hồi"
        cancelText="Đóng"
        destroyOnClose
      >
        <div className="p-3 bg-stone-50 rounded-xl text-xs text-stone-600 mb-3 border border-stone-200">
          <p className="font-semibold text-stone-800 mb-1">
            Đánh giá của: <span className="font-bold text-[#2B5A50]">{selectedReview?.user_name}</span>
          </p>
          <p className="italic m-0">"{selectedReview?.comment}"</p>
        </div>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleReplySubmit}
        >
          <Form.Item
            name="reply"
            label={<span className="font-semibold text-xs text-stone-700">Nội dung phản hồi từ quản trị viên</span>}
            rules={[{ required: true, message: 'Nhập nội dung phản hồi' }]}
          >
            <Input.TextArea
              rows={4}
              placeholder="Cảm ơn quý khách đã tin tưởng và ủng hộ sản phẩm của LuxDecor. Đội ngũ CSKH sẽ liên hệ hỗ trợ thêm cho quý khách..."
              className="!rounded-lg text-xs"
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminReviewsPage;
