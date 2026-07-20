import prisma from "../config/db.js";
import jwt from "jsonwebtoken";
import AppError from "../utils/app_error.js";

import { hashPassword, comparePassword } from "../utils/hash.js";

import {
  generateOTP,
  generateOTPExpiration,
} from "../utils/otp.js";

import { isOTPExpired } from "../utils/otp.js";

import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/jwt.js";

import { sendEmail } from "../utils/mail.js";

import { verifyEmailTemplate, resetPasswordTemplate } from "../view/mail_template.js";

import { ROLES } from "../utils/constants.js";

export const register = async (data) => {

  // 1. Destructure Request Body
  const {
    first_name,
    last_name,
    email,
    password,
    mobile,
    role,
    national_id,
  } = data;

  // 2. Check Email Exists
  const existingUser = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (existingUser) {
    throw new AppError("Email already exists.", 409);
  }

  // 3. Validate Role
  if (role !== ROLES.CUSTOMER && role !== ROLES.WORKER) {
    throw new AppError("Invalid role.", 403);
  }

  // 4. Hash Password
  const hashedPassword = await hashPassword(password);

  // 5. Generate OTP
  const otp = generateOTP();
  const otpExpiresAt = generateOTPExpiration();

  // check if role = worker is the national id already exists
  if (role === ROLES.WORKER && national_id) {
    const existingWorker = await prisma.worker.findUnique({
      where: {
        national_id,
      },
    });

    if (existingWorker) {
      throw new AppError("National ID already exists.", 409);
    }
  }

  // 6. Create User & Role Record
  const user = await prisma.$transaction(async (tx) => {

    const user = await tx.user.create({
      data: {
        first_name,
        last_name,
        email,
        password: hashedPassword,
        mobile,
        role,
        otp,
        otp_expires_at: otpExpiresAt,
      },
    });

    if (role === ROLES.CUSTOMER) {
      await tx.customer.create({
        data: {
          user_id: user.user_id,
        },
      });
    }

    if (role === ROLES.WORKER) {
      await tx.worker.create({
        data: {
          user_id: user.user_id,
          national_id: national_id || null,
        },
      });
    }

    return user;
  });

  // 7. Send Verification Email
  let emailSent = true;

  try {
    await sendEmail({
      to: user.email,
      subject: "Verify Your Email",
      html: verifyEmailTemplate(user.first_name, otp),
    });
  } catch (error) {
    console.error(error);
    emailSent = false;
  }

  // 8. Return Response
  return {
    user: {
      user_id: user.user_id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      role: user.role,
      is_verified: user.is_verified,
    },
    emailSent,
  };
};

export const verifyOTP = async (data) => {
  const { email, otp } = data;

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    throw new AppError("User not found.", 404);
  }

  if (user.is_verified) {
    throw new AppError(
      "Email is already verified.",
      400
    );
  }

  if (user.otp !== otp) {
    throw new AppError(
      "Invalid OTP.",
      400
    );
  }

  if (isOTPExpired(user.otp_expires_at)) {
    throw new AppError(
      "OTP has expired.",
      400
    );
  }

  const verifiedUser = await prisma.user.update({
    where: {
      user_id: user.user_id,
    },

    data: {
      is_verified: true,
      otp: null,
      otp_expires_at: null,
    },
  });

  return {
    user: {
      user_id: verifiedUser.user_id,
      first_name: verifiedUser.first_name,
      last_name: verifiedUser.last_name,
      email: verifiedUser.email,
      role: verifiedUser.role,
    },
  };
};

export const resendOTP = async (data) => {
  const { email } = data;

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    throw new AppError("User not found.", 404);
  }

  if (user.is_verified) {
    throw new AppError(
      "Email is already verified.",
      400
    );
  }

  const otp = generateOTP();
  const otpExpiresAt = generateOTPExpiration();

  await prisma.user.update({
    where: {
      user_id: user.user_id,
    },
    data: {
      otp,
      otp_expires_at: otpExpiresAt,
    },
  });

  await sendEmail({
    to: user.email,
    subject: "Verify Your Email",
    html: verifyEmailTemplate(user.first_name, otp),
  });

  return {
    email: user.email,
  };
};

export const login = async (data) => {

  const { email, password } = data;

  const user = await prisma.user.findUnique({
    where: { email }
  });

  if (!user) {
    throw new AppError(
      "Invalid email or password.",
      401
    );
  }

  if (!user.is_verified) {
    throw new AppError(
      "Please verify your email first.",
      403
    );
  }

  const isPasswordValid =
    await comparePassword(
      password,
      user.password
    );

  if (!isPasswordValid) {
    throw new AppError(
      "Invalid email or password.",
      401
    );
  }

  const accessToken =
    generateAccessToken({
      user_id: user.user_id,
      role: user.role,
    });

  const refreshToken =
    generateRefreshToken({
      user_id: user.user_id,
    });

  let isApproved = null;

  if (user.role === ROLES.WORKER) {
    const worker = await prisma.worker.findUnique({
      where: {
        user_id: user.user_id,
      },
      select: {
        is_approved: true,
      },
    });

    isApproved = worker.is_approved;
  }

  return {
    accessToken,
    refreshToken,

    user: {
      user_id: user.user_id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      role: user.role,
      ...(user.role === ROLES.WORKER && {
        is_approved: isApproved,
      }),
    }
  };

};


//  refresh token 
export const refreshToken = async (data) => {

  const { refreshToken } = data;

  let payload;

  try {

    payload = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET
    );

  } catch {

    throw new AppError(
      "Invalid refresh token.",
      401
    );

  }

  const user = await prisma.user.findUnique({
    where: {
      user_id: payload.user_id,
    },
  });

  if (!user) {
    throw new AppError(
      "User not found.",
      404
    );
  }

  if (!user.is_active) {
    throw new AppError(
      "Account is inactive.",
      403
    );
  }

  const newAccessToken = generateAccessToken({
    user_id: user.user_id,
    role: user.role,
  });

  const newRefreshToken = generateRefreshToken({
    user_id: user.user_id,
  });

  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
  };

};

export const forgotPassword = async (data) => {

  const { email } = data;

  const user = await prisma.user.findUnique({
    where: {
      email
    }
  });

  if (!user) {
    throw new AppError(
      "User not found.",
      404
    );
  }

  const otp = generateOTP();

  const otpExpiresAt =
    generateOTPExpiration();

  await prisma.user.update({

    where: {
      user_id: user.user_id
    },

    data: {

      reset_password_otp: otp,

      reset_password_otp_expires_at:
        otpExpiresAt

    }

  });

  await sendEmail({

    to: user.email,

    subject: "Reset Password",

    html: resetPasswordTemplate(
      user.first_name,
      otp
    )

  });

  return {
    email: user.email
  };

};

export const verifyResetPasswordOTP = async (data) => {

  const { email, otp } = data;

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    throw new AppError("User not found.", 404);
  }

  if (user.reset_password_otp !== otp) {
    throw new AppError("Invalid OTP.", 400);
  }

  if (
    isOTPExpired(
      user.reset_password_otp_expires_at
    )
  ) {
    throw new AppError(
      "OTP has expired.",
      400
    );
  }

  return {
    email: user.email,
  };
};

export const resetPassword = async (data) => {

  const {
    email,
    otp,
    new_password,
  } = data;

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    throw new AppError(
      "User not found.",
      404
    );
  }

  if (user.reset_password_otp !== otp) {
    throw new AppError(
      "Invalid OTP.",
      400
    );
  }

  if (
    isOTPExpired(
      user.reset_password_otp_expires_at
    )
  ) {
    throw new AppError(
      "OTP has expired.",
      400
    );
  }

  const hashedPassword =
    await hashPassword(new_password);

  await prisma.user.update({

    where: {
      user_id: user.user_id,
    },

    data: {

      password: hashedPassword,

      reset_password_otp: null,

      reset_password_otp_expires_at: null,

    },

  });

  return {
    email: user.email,
  };

};