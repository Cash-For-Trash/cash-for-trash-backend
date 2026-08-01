import prisma from "../config/db.js";
import AppError from "../utils/app_error.js";

export const getPricingSettings = async () => {
  let settings = await prisma.pricingSettings.findFirst();

  if (!settings) {
    settings = await prisma.pricingSettings.create({
      data: {
        id: 1,
        worker_percentage: 70,
        monthly_subscription_price: 100,
        minimum_collection_weight: 1,
        maximum_collection_weight: 100,
      },
    });
  }

  return settings;
};

export const updatePricingSettings = async (data) => {
  const currentSettings = await getPricingSettings();

  const settings = await prisma.pricingSettings.update({
    where: {
      id: currentSettings.id,
    },
    data,
  });

  return settings;
};