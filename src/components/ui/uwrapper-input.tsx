import React from "react";
import { Flex, Tooltip, type FlexProps } from "antd";

interface UTextInputProps extends FlexProps {
  label?: React.ReactNode;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
  htmlFor?: string;
  vertical?: boolean;
}

export default function UWrapperInput({
  label,
  error,
  children,
  required,
  htmlFor,
  vertical = true,
  ...flexProps
}: UTextInputProps) {
  return (
    <Flex vertical={vertical} align="start" gap={4} className="w-full" {...flexProps}>
      {label && (
        <div className="flex gap-1.5 items-baseline">
          <label htmlFor={htmlFor} className="text-xs font-semibold text-gray-700 flex-none select-none">
            {label}
            {required && <span className="text-rose-500 ml-0.5">*</span>}
          </label>
          {error && (
            <Tooltip color="red" title={error}>
              <p className="text-rose-500 text-[11px] line-clamp-1 font-normal">{error}</p>
            </Tooltip>
          )}
        </div>
      )}
      <div className="w-full">{children}</div>
    </Flex>
  );
}
