export const SuccessMessages = {
  OTP_SENT: 'OTP sent successfully',
  LOGIN_SUCCESS: 'Login successful',
  PDF_PROCESSED: 'PDF processed successfully',
  PDF_UPLOADED: 'PDF uploaded successfully',
  PDF_DELETED: 'PDF deleted successfully',
  LOGOUT_SUCCESS: 'Logged out successfully',
  PASSWORD_RESET_SENT: 'Password reset OTP sent successfully',
} as const;

export const ErrorMessages = {
  USER_EXISTS: 'User already exists',
  USER_NOT_FOUND: 'User not found',
  INVALID_OTP: 'Invalid or expired OTP',
  FILE_NOT_FOUND: 'File not found',
  UNAUTHORIZED: 'Unauthorized access',
  FORBIDDEN: 'Forbidden access',
  INTERNAL_SERVER_ERROR: 'Internal server error',
  VALIDATION_ERROR: 'Validation error',
  PDF_PROCESSING_FAILED: 'Failed to process PDF',
  FILE_UPLOAD_FAILED: 'File upload failed',
  INVALID_CREDENTIALS: 'Invalid email or password',
  ACCOUNT_UNVERIFIED: 'Account not verified. Please verify your email.',
  NO_FILE_UPLOADED: 'No file uploaded',
  INVALID_PAGE_INDICES: 'Page indices must be a non-empty array of numbers',
} as const;
