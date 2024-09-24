import React from "react";

import { cn } from "@/utils/cn";

export const BentoGrid = ({ className, children }: { className?: string; children?: React.ReactNode }) => {
  return (
    <div className={cn("grid md:auto-rows-[18rem] grid-cols-1 md:grid-cols-3 gap-4 max-w-7xl mx-auto ", className)}>
      {children}
    </div>
  );
};

export const BentoGridItem = ({
  className,
  header,
  cta,
  title,
}: {
  className?: string;
  header?: React.ReactNode;
  cta?: React.ReactNode;
  title?: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "row-span-1 rounded-xl group/bento hover:shadow-xl transition duration-200 shadow-input dark:shadow-none p-4 dark:bg-black dark:border-white/[0.2] bg-white border border-black/[0.2] space-y-4 flex flex-col",
        className,
      )}
    >
      {header}
      <div className="font-sans font-bold text-neutral-600 dark:text-neutral-200 flex flex-row justify-between items-center">
        {title}
        {cta}
      </div>
    </div>
  );
};
