import React, { useState } from 'react';
import { Button, Modal, Tooltip } from 'antd';

interface UAlertDialogProps {
  children?: React.ReactNode;
  onConfirm?: () => void;
  onDelete?: () => void;
  title?: React.ReactNode;
  icon?: React.ReactNode;
  iconChildren?: React.ReactNode;
  description?: string;
  okText?: string;
  cancelText?: string;
  okType?: 'primary' | 'danger';
  tooltip?: string;
  titleTooltip?: string | null;
  buttonProps?: any;
  loading?: boolean;
}

export const UAlertDialog: React.FC<UAlertDialogProps> = ({
  children,
  icon,
  iconChildren,
  onConfirm,
  onDelete,
  title = 'Xác nhận hành động',
  description = 'Bạn có chắc chắn muốn thực hiện hành động này? Thao tác không thể hoàn tác.',
  okText = 'Xác nhận',
  cancelText = 'Hủy',
  okType = 'danger',
  tooltip,
  titleTooltip,
  buttonProps,
  loading = false,
}) => {
  const [open, setOpen] = useState(false);

  const handleAction = () => {
    if (onDelete) {
      onDelete();
    } else if (onConfirm) {
      onConfirm();
    }
    setOpen(false);
  };

  const displayIcon = iconChildren ? <div>{iconChildren}</div> : icon;
  const displayTooltip = titleTooltip || tooltip;

  return (
    <>
      <Tooltip title={displayTooltip}>
        <Button
          type="text"
          {...buttonProps}
          icon={displayIcon}
          onClick={() => setOpen(true)}
          loading={loading}
        >
          {children}
        </Button>
      </Tooltip>

      {open && (
        <Modal
          title={title}
          open={open}
          onOk={handleAction}
          onCancel={() => setOpen(false)}
          okText={okText}
          cancelText={cancelText}
          okButtonProps={{ danger: okType === 'danger', loading }}
          cancelButtonProps={{
            variant: "filled",
            color: "default",
          }}
          destroyOnClose
        >
          <p className="text-sm text-gray-600 m-0">{description}</p>
        </Modal>
      )}
    </>
  );
};

export default UAlertDialog;
