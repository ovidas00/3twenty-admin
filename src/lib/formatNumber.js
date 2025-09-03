export default function formatNumber(value, minDecimals = 0, maxDecimals = 4) {
  if (value == null || value === "") return "0";

  const num = typeof value === "string" ? parseFloat(value) : value;
  if (isNaN(num)) return "0";

  // Fix to max decimals first
  let result = num.toFixed(maxDecimals);

  // Trim unnecessary trailing zeros but keep at least minDecimals
  const [intPart, decPart] = result.split(".");
  const trimmedDec = decPart ? decPart.replace(/0+$/, "") : "";
  const finalDec = trimmedDec.padEnd(minDecimals, "0");

  return finalDec ? `${intPart}.${finalDec}` : intPart;
}
