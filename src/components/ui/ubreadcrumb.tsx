import { IconChevronLeft } from "@tabler/icons-react";
import { Button, Flex } from "antd";
import React from "react";
import { useNavigate } from "react-router-dom";

export type BreadcrumbProps = {
  title: string;
  trailing?: React.ReactNode;
  children?: React.ReactNode;
  showBack?: boolean;
  onBack?: () => void;
  backUrl?: string;
};

const UBreadcrumb: React.FC<BreadcrumbProps> = ({
  title,
  trailing,
  children,
  showBack = true,
  onBack,
  backUrl,
}) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBack) {
      onBack();
      return;
    }
    if (backUrl) {
      navigate(backUrl);
      return;
    }
    // Chuyển hướng an toàn về trang tổng quan quản trị thay vì bị đẩy ra màn hình đăng nhập
    navigate('/admin');
  };

  return (
    <Flex vertical gap={12} className="w-full!">
      <div className="w-full flex justify-between items-center">
        <Flex gap={12} align="center">
          {showBack && (
            <Button
              onClick={handleBack}
              variant="filled"
              color="default"
              icon={
                <div>
                  <IconChevronLeft size={18} />
                </div>
              }
            />
          )}
          <h3 className="text-lg font-bold text-gray-900 m-0">{title}</h3>
        </Flex>
        <Flex gap={12} align="center">
          {trailing}
        </Flex>
      </div>
      {children}
    </Flex>
  );
};

export default UBreadcrumb;
