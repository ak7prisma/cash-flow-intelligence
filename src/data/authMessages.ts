export const AUTH_ERRORS: Record<string, string> = {
  // Login & General
  "auth/invalid-email": "Please enter a valid email address.",
  "auth/user-disabled": "This account has been disabled. Contact support for help.",
  "auth/user-not-found": "No account found with this email. Please register first.",
  "auth/wrong-password": "Incorrect password. Please try again or reset your password.",
  "auth/invalid-credential": "Invalid email or password. Please check and try again.",
  "auth/too-many-requests": "Too many failed attempts. Please wait a moment and try again.",
  "auth/network-request-failed": "Network error. Please check your connection and try again.",
  
  // Registration
  "auth/email-already-in-use": "This email is already registered. Try logging in instead.",
  "auth/weak-password": "Password is too weak. Use at least 8 characters.",
  "auth/operation-not-allowed": "Auth provider not enabled. Contact support.",
  
  // Reset Password
  "auth/expired-action-code": "This reset link has expired. Please request a new one.",
  "auth/invalid-action-code": "This reset link is invalid or has already been used.",
  
  // Security
  "auth/requires-recent-login": "Session expired. Please enter your current password to re-authenticate.",
  
  // Default
  "default": "An unexpected error occurred. Please try again."
};

export const getAuthErrorMessage = (code: string): string => {
  return AUTH_ERRORS[code] || AUTH_ERRORS["default"];
};
