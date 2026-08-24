/**
 * Cinefil Application Configuration
 */
export const APP_CONFIG = {
  // Set to true to require payment flow (Razorpay / Receipt) during membership application.
  // Set to false to allow direct submission without payment, granting Associate Member status immediately.
  REQUIRE_MEMBERSHIP_PAYMENT: import.meta.env.VITE_REQUIRE_MEMBERSHIP_PAYMENT === 'true' || false,
};
