export function formatCurrency(value: number, decimals = 0): string {
  return value.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

export function formatNumber(value: number): string {
  return Math.round(value).toLocaleString("en-US");
}
