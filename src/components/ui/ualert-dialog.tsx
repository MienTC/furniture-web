import React, { useState } from 'react';
import { Button, Modal, Tooltip } from 'antd';

interface UAlertDialogProps {
  children?: React.ReactNode;
  onConfirm?: () => void;
  title?: React.ReactNode;
  icon?: React.ReactNode;
  description?: string;
  okText?: string;
  cancelText?: string;
  okType?: 'primary' | 'danger';
  tooltip?: string;
  buttonProps?: any;
}

export const UAlertDialog: React.FC<UAlertDialogProps> = ({
  children,
  icon,
  onConfirm,
  title = 'Xác nhận hành động',
  description = 'Bạn có chắc chắn muốn thực hiện hành động này? Thao tác không thể hoàn tác.',
  okText = 'Xác nhận',
  cancelText = 'Hủy',
  okType = 'danger',
  tooltip,
  buttonProps,
}) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Tooltip title={tooltip}>
        <Button
          type="text"
          {...buttonProps}
          icon={icon}
          onClick={() => setOpen(true)}
        >
          {children}
        </Button>
      </Tooltip>

      {open && (
        <Modal
          title={title}
          open={open}
          onOk={() => {
            onConfirm?.();
            setOpen(false);
          }}
          onCancel={() => setOpen(false)}
          okText={okText}
          cancelText={cancelText}
          okButtonProps={{ danger: okType === 'danger' }}
          centered
        >
          <p className="text-stone-600 text-sm m-0 py-2">{description}</p>
        </Modal>
      )}
    </>
  );
};

export default UAlertDialog;
