import { IconCheck, IconCopy } from "@tabler/icons-react";
import { Button, Tooltip } from "antd";
import { useState } from "react";

type Props = {
  value: string;
  timeout?: number;
  size?: number;
};

const UCopyButton = ({ value, timeout = 2000, size = 20 }: Props) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
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
