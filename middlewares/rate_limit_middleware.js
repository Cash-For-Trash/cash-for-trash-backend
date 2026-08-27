import rateLimit from "express-rate-limit";

export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again after 15 minutes",
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});


export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 5, 
  message: "Too many login attempts from this IP, please try again after 15 minutes",
  standardHeaders: true,
  legacyHeaders: false, 
});


export const passwordResetLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 5, 
    message: "Too many password reset attempts from this IP, please try again after 15 minutes",
    standardHeaders: true, 
    legacyHeaders: false,
});

export const verificationLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, 
    message: "Too many verification attempts from this IP, please try again after 15 minutes",
    standardHeaders: true, 
    legacyHeaders: false, 
});

export const forgotPasswordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 5, 
    message: "Too many forgot password requests from this IP, please try again after 15 minutes",
    standardHeaders: true, 
    legacyHeaders: false,
});
export const resendOTPLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 3,
  message: "Too many OTP resend attempts, please try again after 15 minutes",
  standardHeaders: true,
  legacyHeaders: false,
});


