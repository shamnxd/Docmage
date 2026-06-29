/**
 * Email template for account verification OTP.
 */
export function getOtpTemplate(otp: string): string {
  return `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 12px;">
      <h2 style="color: #6C4CF1;">Welcome to DocMage!</h2>
      <p>Thank you for signing up. Please use the following code to verify your account:</p>
      <div style="background-color: #F3EEFF; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 4px; color: #6C4CF1; border-radius: 8px; margin: 20px 0;">
        ${otp}
      </div>
      <p style="color: #6B7280; font-size: 14px;">This code will expire in 5 minutes.</p>
      <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
      <p style="color: #9CA3AF; font-size: 12px;">If you didn't request this code, you can safely ignore this email.</p>
    </div>
  `;
}

/**
 * Email template for resetting password link.
 */
export function getPasswordResetTemplate(resetUrl: string): string {
  return `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 12px;">
      <h2 style="color: #6C4CF1;">Password Reset Request</h2>
      <p>You requested to reset your password. Click the button below to set a new password:</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${resetUrl}" style="background-color: #6C4CF1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Reset Password</a>
      </div>
      <p style="color: #6B7280; font-size: 14px;">This link will expire in 1 hour.</p>
      <p style="color: #6B7280; font-size: 14px;">If you didn't request this, you can safely ignore this email.</p>
      <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
      <p style="color: #9CA3AF; font-size: 12px;">If the button doesn't work, copy and paste this link into your browser: <br/> ${resetUrl}</p>
    </div>
  `;
}
