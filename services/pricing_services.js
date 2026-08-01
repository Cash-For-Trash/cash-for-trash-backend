import prisma from "../config/db.js";
import AppError from "../utils/app_error.js";

export const getPricingSettings = async () => {
  let settings = await prisma.pricingSettings.findUnique({
    where: {
      id: 1,
    },
  });

  if (!settings) {
    settings = await prisma.pricingSettings.create({
      data: {
        id: 1,
        worker_percentage: 70,
        monthly_subscription_price: 100,
      },
    });
  }

  return settings;
};

export const updatePricingSettings = async (data) => {
  await getPricingSettings();

  const settings = await prisma.pricingSettings.update({
    where: {
      id: 1,
    },
    data,
  });

  return settings;
};