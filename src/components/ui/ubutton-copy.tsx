import { IconCheck, IconCopy } from "@tabler/icons-react";
import { Button, Tooltip } from "antd";
import { useState } from "react";

type Props = {
  value?: string;
  copyValue?: string;
  timeout?: number;
  size?: number;
};

const UCopyButton = ({ value, copyValue, timeout = 2000, size = 16 }: Props) => {
  const [copied, setCopied] = useState(false);
  const textToCopy = copyValue || value || "";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), timeout);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };
  return (
    <Tooltip title={copied ? "Copied" : "Copy"} placement="top">
      <Button
        onClick={handleCopy}
        disabled={copied}
        type="text"
        icon={
          <div>
            {!copied ? (
              <IconCopy size={size} className="text-gray-500" />
            ) : (
              <IconCheck size={size} className="text-green-500" />
            )}
          </div>
        }
      />
    </Tooltip>
  );
};

export default UCopyButton;
