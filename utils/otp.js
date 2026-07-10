import otpGenerator from "otp-generator";
import { OTP } from "./constants.js";


export const generateOTP = () => {
  return otpGenerator.generate(OTP.LENGTH, {
    upperCaseAlphabets: false,
    lowerCaseAlphabets: false,
    specialChars: false,
    digits: true,
  });
};


export const generateOTPExpiration = () => {
  const expiresAt = new Date();

  expiresAt.setMinutes(
    expiresAt.getMinutes() + OTP.EXPIRES_IN_MINUTES
  );

  return expiresAt;
};


export const isOTPExpired = (expirationDate) => {
  return new Date() > expirationDate;
};