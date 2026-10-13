import React, { type ReactNode } from "react";
import clsx from "clsx";

export const colorMap = {
  red: "bg-red-50 text-red-500",
  orange: "bg-brand-peach/20 text-brand-coral",
  amber: "bg-brand-peach/30 text-brand-coral",
  yellow: "bg-yellow-50 text-yellow-500",
  lime: "bg-lime-50 text-lime-500",
  green: "bg-green-50 text-green-500",
  emerald: "bg-emerald-50 text-emerald-500",
  teal: "bg-teal-50 text-teal-500",
  cyan: "bg-cyan-50 text-cyan-500",
  sky: "bg-sky-50 text-sky-500",
  blue: "bg-blue-50 text-blue-500",
  indigo: "bg-indigo-50 text-indigo-500",
  violet: "bg-violet-50 text-violet-500",
  purple: "bg-purple-50 text-purple-500",
  fuchsia: "bg-fuchsia-50 text-fuchsia-500",
  pink: "bg-pink-50 text-pink-500",
  rose: "bg-rose-50 text-rose-500",
  slate: "bg-slate-50 text-slate-500",
  gray: "bg-gray-50 text-gray-500",
  zinc: "bg-zinc-50 text-zinc-500",
  neutral: "bg-neutral-50 text-neutral-500",
  stone: "bg-stone-50 text-stone-500",
};

interface Props extends React.ComponentProps<"div"> {
  children: ReactNode;
  color?: keyof typeof colorMap;
  isTable?: boolean;
}

export default function UTag({
  children,
  color = "gray",
  className,
  isTable,
}: Props) {
  return (
    <div
      className={clsx(
        "w-fit px-2 py-0.5 rounded-md font-medium capitalize break-words",
        { "max-w-20 truncate": isTable },
        colorMap[color],
        className
      )}
    >
      {children}
    </div>
  );
}
