// User Roles

export const ROLES = {
  CUSTOMER: "customer",
  WORKER: "worker",
  ADMIN: "admin",
};

// User Status

export const USER_STATUS = {
  ACTIVE: true,
  INACTIVE: false,
};

// Verification Status

export const VERIFICATION_STATUS = {
  VERIFIED: true,
  NOT_VERIFIED: false,
};

// OTP

export const OTP = {
  LENGTH: 6,
  EXPIRES_IN_MINUTES: 10,
};

// JWT

export const JWT = {
  ACCESS_TOKEN_EXPIRES: "15m",
  REFRESH_TOKEN_EXPIRES: "7d",
};

// Pagination

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
};