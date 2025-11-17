export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(email: string) {
  if (!email) return false;
  return emailRegex.test(email.trim());
}

// Returns true if date is at least `minDays` in the future (relative to today)
export function isDateAtLeastDaysAway(dateString: string | undefined, minDays = 2) {
  if (!dateString) return false;
  const target = new Date(dateString);
  const now = new Date();
  // normalize to local midnight for day-based calculation
  const diffMs = target.getTime() - now.getTime();
  const diffDays = diffMs / (1000 * 60 * 60 * 24);
  return diffDays >= minDays - 0.0001; // slight tolerance
}

export function daysUntil(dateString: string | undefined) {
  if (!dateString) return Infinity;
  const target = new Date(dateString);
  const now = new Date();
  const diffMs = target.getTime() - now.getTime();
  return diffMs / (1000 * 60 * 60 * 24);
}
