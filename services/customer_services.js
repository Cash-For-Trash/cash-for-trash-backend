import prisma from "../config/db.js";
import AppError from "../utils/app_error.js";

export const getCustomerPoints = async (userId) => {
  const customer = await prisma.customer.findUnique({
    where: { user_id: userId },
  });

  if (!customer) {
    throw new AppError("Customer profile not found.", 404);
  }

  return {
    user_id: customer.user_id,
    points: Number(customer.points),
  };
};
