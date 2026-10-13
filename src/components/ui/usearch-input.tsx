import { IconSearch } from "@tabler/icons-react";
import { Input, type InputProps } from "antd";

const USearchInput = ({ ...props }: InputProps) => {
  return (
    <Input
      className="border border-neutral-300 "
      placeholder="Search..."
      prefix={<IconSearch size={16} className="text-neutral-400" />}
      {...props}
    />
  );
};

export default USearchInput;
