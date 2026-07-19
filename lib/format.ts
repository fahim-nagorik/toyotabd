// Bangladeshi Taka with lakh/crore digit grouping (৳ 1,55,000).
export const taka = (n: number) => `৳ ${n.toLocaleString("en-IN")}`;
