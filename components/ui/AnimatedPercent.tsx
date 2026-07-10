"use client";

import { useCountUp } from "@/lib/hooks/useCountUp";
import { formatPercent } from "@/lib/finance/formatters";

interface AnimatedPercentProps {
  value: number;
  className?: string;
}

export function AnimatedPercent({ value, className }: AnimatedPercentProps) {
  const animated = useCountUp(value);
  return <span className={className}>{formatPercent(animated)}</span>;
}
