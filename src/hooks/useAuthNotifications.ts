'use client';

import { useNotificationHelpers } from '../components/ui/notification';

export const useAuthNotifications = () => {
  const notifications = useNotificationHelpers();

  return {
    // Login notifications
    loginSuccess: (userName?: string) => {
      const displayName = userName || 'User';
      notifications.success(
        'Welcome Back!',
        `Hello ${displayName}, you have successfully logged in.`,
        { duration: 5000 }
      );
    },

    loginError: (error?: string) => {
      notifications.error(
        'Login Failed',
        error || 'Unable to sign in. Please try again.',
        { duration: 6000 }
      );
    },

    loginRedirect: () => {
      notifications.info(
        'Redirecting...',
        'Taking you to Google for authentication.',
        { duration: 3000 }
      );
    },

    // Logout notifications
    logoutSuccess: () => {
      notifications.success(
        'Logged Out Successfully',
        'You have been safely logged out. See you next time!',
        { duration: 4000 }
      );
    },

    logoutError: (error?: string) => {
      notifications.error(
        'Logout Failed',
        error || 'An error occurred during logout.',
        { duration: 6000 }
      );
    },

    // Session notifications
    sessionExpired: () => {
      notifications.warning(
        'Session Expired',
        'Your session has expired. Please log in again.',
        { duration: 8000, persistent: true }
      );
    },

    sessionRefreshed: () => {
      notifications.info(
        'Session Refreshed',
        'Your session has been automatically renewed.',
        { duration: 3000 }
      );
    },

    // Permission notifications
    accessDenied: () => {
      notifications.error(
        'Access Denied',
        'You do not have permission to access this resource.',
        { duration: 6000 }
      );
    },

    adminRequired: () => {
      notifications.warning(
        'Admin Access Required',
        'This feature requires administrator privileges.',
        { duration: 6000 }
      );
    },

    // General auth notifications
    authError: (error?: string) => {
      notifications.error(
        'Authentication Error',
        error || 'An authentication error occurred.',
        { duration: 6000 }
      );
    },

    authLoading: () => {
      notifications.info(
        'Authenticating...',
        'Please wait while we verify your credentials.',
        { duration: 3000 }
      );
    },

    // Account notifications
    accountCreated: (userName?: string) => {
      const displayName = userName || 'User';
      notifications.success(
        'Account Created!',
        `Welcome ${displayName}! Your account has been created successfully.`,
        { duration: 6000 }
      );
    },

    profileUpdated: () => {
      notifications.success(
        'Profile Updated',
        'Your profile information has been saved.',
        { duration: 4000 }
      );
    },

    // Security notifications
    passwordChanged: () => {
      notifications.success(
        'Password Changed',
        'Your password has been updated successfully.',
        { duration: 5000 }
      );
    },

    securityAlert: (message?: string) => {
      notifications.warning(
        'Security Alert',
        message || 'Unusual activity detected on your account.',
        { duration: 8000, persistent: true }
      );
    },

    // Two-factor authentication
    twoFactorRequired: () => {
      notifications.info(
        'Two-Factor Authentication',
        'Please complete two-factor authentication.',
        { duration: 6000 }
      );
    },

    twoFactorSuccess: () => {
      notifications.success(
        'Two-Factor Verified',
        'Two-factor authentication completed successfully.',
        { duration: 4000 }
      );
    },

    // Email verification
    emailVerificationSent: () => {
      notifications.info(
        'Verification Email Sent',
        'Please check your email and click the verification link.',
        { duration: 8000 }
      );
    },

    emailVerified: () => {
      notifications.success(
        'Email Verified',
        'Your email address has been verified successfully.',
        { duration: 5000 }
      );
    },

    // Password reset
    passwordResetSent: () => {
      notifications.info(
        'Password Reset Email Sent',
        'Check your email for password reset instructions.',
        { duration: 6000 }
      );
    },

    passwordResetSuccess: () => {
      notifications.success(
        'Password Reset Complete',
        'Your password has been reset successfully.',
        { duration: 5000 }
      );
    },
  };
};
