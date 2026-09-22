import prisma from "../config/db.js";
import AppError from "../utils/app_error.js";

export const getCustomerPoints = async (userId) => {
  const customer = await prisma.customer.findUnique({
    where: { user_id: userId },
    select: {
      user_id: true,
      points: true,
  
    },
  });

  if (!customer) {
    throw new AppError("Customer profile not found.", 404);
  }
  const pointSetting = await prisma.pointSetting.findFirst({
    where: {
      is_active: true,
    },
  });

  if (!pointSetting) {
    throw new AppError("Point setting not found.", 404);
  }

  const value = 
    (Number(customer.points) * Number(pointSetting.cash_value)) /
    Number(pointSetting.points);
  return {
    user_id: customer.user_id,
    points: Number(customer.points),
    value
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

  return customers.map((customer, index) => ({
    rank: index + 1,
    customer_id: customer.user.user_id,
    name: `${customer.user.first_name} ${customer.user.last_name}`,
    points: Number(customer.points),
  }));
}


