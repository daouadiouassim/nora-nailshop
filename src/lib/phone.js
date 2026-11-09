/** Algerian mobile number normalisation and validation. */

export function normalizePhone(input) {
  const raw = String(input || "").replace(/[\s\-().]/g, "");
  if (!raw) return "";
  if (raw.startsWith("+213")) return `0${raw.slice(4)}`;
  if (raw.startsWith("00213")) return `0${raw.slice(5)}`;
  if (raw.startsWith("213") && raw.length >= 11) return `0${raw.slice(3)}`;
  return raw;
}

export function isValidAlgerianPhone(input) {
  const phone = normalizePhone(input);
  return /^0[5-7]\d{8}$/.test(phone);
}

export function phoneError(input) {
  if (!String(input || "").trim()) return "Please enter your phone number.";
  if (!isValidAlgerianPhone(input))
    return "Enter a valid Algerian mobile number (05, 06, 07 followed by 8 digits, or +213…).";
  return "";
}