import React, { useState } from 'react';
import { Table, Button, Modal, Form, Input, Popconfirm, Rate } from 'antd';
import { IconMessageReply, IconTrash } from '@tabler/icons-react';
import { useAdminReviews } from '~/features/admin/hooks';
import UBreadcrumb from '~/components/ui/ubreadcrumb';
import UAvatar from '~/components/ui/uavatar';
import UBadge from '~/components/ui/ubadge';

export const AdminReviewsPage: React.FC = () => {
  const [replyModalOpen, setReplyModalOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState<any>(null);
  const [form] = Form.useForm();

  // Hook tập trung quản lý reviews
  const {
    reviews,
    isLoading,
    replyReview,
    deleteReview,
    isReplying,
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
      render: (name: string, row: any) => (
        <div className="flex items-center gap-2.5">
          <UAvatar size={32} nickname={name} src={row.user_avatar} />
          <div>
            <p className="font-semibold text-xs text-gray-900">{name}</p>
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
      title: 'Nội Dung & Phản Hồi',
      dataIndex: 'comment',
      render: (comment: string, row: any) => (
        <div className="space-y-1">
          <p className="text-xs text-gray-800 font-medium">{comment}</p>
          {row.admin_reply && (
            <div className="p-2 bg-sky-50 rounded-lg text-[11px] text-sky-800 border border-sky-100">
              <span className="font-bold">CSKH LuxDecor: </span>
              {row.admin_reply}
            </div>
          )}
        </div>
      ),
    },
    {
      title: 'Thao Tác',
      width: 100,
      render: (_: any, record: any) => (
        <div className="flex items-center gap-1">
          <Button
            size="small"
            type="text"
            icon={<IconMessageReply size={16} className="text-sky-500" />}
            onClick={() => handleOpenReply(record)}
          />
          <Popconfirm
            title="Xác nhận xóa đánh giá này?"
            onConfirm={() => deleteReview(record.s_ID)}
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
          >
            <Button size="small" type="text" danger icon={<IconTrash size={16} />} />
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-5 font-sans">
      <UBreadcrumb title="Quản Lý Đánh Giá Khách Hàng" />

      <div className="bg-white rounded-xl border border-gray-200/80 shadow-2xs p-5">
        <Table
          dataSource={reviews}
          rowKey="s_ID"
          columns={columns}
          loading={isLoading}
          pagination={false}
          size="middle"
        />
      </div>

      <Modal
        title="Phản Hồi Đánh Giá"
        open={replyModalOpen}
        onOk={() => form.submit()}
        onCancel={() => setReplyModalOpen(false)}
        confirmLoading={isReplying}
        okText="Gửi phản hồi"
        cancelText="Đóng"
      >
        <div className="p-3 bg-gray-50 rounded-lg text-xs text-gray-600 mb-3">
          <p className="font-semibold text-gray-800 mb-1">Đánh giá của: {selectedReview?.user_name}</p>
          <p>"{selectedReview?.comment}"</p>
        </div>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleReplySubmit}
        >
          <Form.Item name="reply" label="Nội dung phản hồi từ quản trị" rules={[{ required: true, message: 'Nhập nội dung phản hồi' }]}>
            <Input.TextArea rows={4} placeholder="Cảm ơn bạn đã tin tưởng ủng hộ LuxDecor..." />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
