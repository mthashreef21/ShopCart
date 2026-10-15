export const USD_TO_INR = 88;

export function toINR(amountInUSD) {
  return Math.round(Number(amountInUSD || 0) * USD_TO_INR);
}

export function formatPrice(amountInUSD) {
  return `₹${toINR(amountInUSD).toLocaleString("en-IN")}`;
}

export function getDiscountedPrice(price, discountPercentage) {
  const discounted = Number(price || 0) * (1 - Number(discountPercentage || 0) / 100);
  return formatPrice(discounted);
}

export function discountedValue(price, discountPercentage) {
  return Number(price || 0) * (1 - Number(discountPercentage || 0) / 100);
}
