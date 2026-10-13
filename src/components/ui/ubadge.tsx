import React, { type ReactNode } from "react";
import clsx from "clsx";

export const colorMap = {
  green: {
    text: "text-green-500",
    bg: "bg-green-100",
    dot: "bg-green-400",
  },
  orange: {
    text: "text-brand-coral",
    bg: "bg-brand-peach/30",
    dot: "bg-brand-peach",
  },
  red: {
    text: "text-rose-500",
    bg: "bg-rose-100",
    dot: "bg-rose-400",
  },
  indigo: {
    text: "text-indigo-500",
    bg: "bg-indigo-100",
    dot: "bg-indigo-400",
  },
  blue: {
    text: "text-sky-500",
    bg: "bg-sky-100",
    dot: "bg-sky-400",
  },
  gray: {
    text: "text-gray-500",
    bg: "bg-gray-100",
    dot: "bg-gray-400",
  },
};

interface Props extends React.ComponentProps<"div"> {
  children: ReactNode;
  color?: keyof typeof colorMap;
  isTable?: boolean;
}

export default function UBadge({
  children,
  color = "gray",
  className,
  isTable,
}: Props) {
  return (
    <div
      className={clsx(
        "w-fit px-2 h-5 items-center flex gap-1 rounded-sm font-medium capitalize break-words",
        { "max-w-20 truncate": isTable },
        colorMap[color].bg,
        className
      )}
    >
      <div className={clsx("h-1.5 w-1.5 rounded-xs", colorMap[color].dot)} />
      <p
        className={clsx("text-xs/4 font-medium truncate", colorMap[color].text)}
      >
        {children}
      </p>
    </div>
  );
}
