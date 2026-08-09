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


export const getCustomerLeaderboard= async () => {
  const customers = await prisma.customer.findMany({
    orderBy: {
      points: "desc",
    },
    select: {
      points: true,
      user: {
        select: {
          user_id: true,
          first_name: true,
          last_name: true,
        },
      },
    },
  });

  return customers;
};

