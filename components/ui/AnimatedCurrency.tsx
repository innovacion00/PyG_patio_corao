"use client";

import { useCountUp } from "@/lib/hooks/useCountUp";
import { formatCurrencyCOP } from "@/lib/finance/formatters";

interface AnimatedCurrencyProps {
  value: number;
  className?: string;
}

export function AnimatedCurrency({ value, className }: AnimatedCurrencyProps) {
  const animated = useCountUp(value);
  return <span className={className}>{formatCurrencyCOP(animated)}</span>;
}
