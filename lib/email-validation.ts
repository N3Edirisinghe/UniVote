// Email domain validation for SLTC
export function isValidSLTCEmail(email: string): boolean {
  const validDomains = ["@sltc.ac.lk", "@sltc.edu"]
  return validDomains.some((domain) => email.toLowerCase().endsWith(domain))
}

export function getEmailValidationError(email: string): string | null {
  if (!email) return "Email is required"
  if (!isValidSLTCEmail(email)) {
    return "Only @sltc.ac.lk and @sltc.edu email addresses are allowed"
  }
  return null
}
