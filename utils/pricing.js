import prisma from "../config/db.js";

export const calculateWorkerShare = async (servicePrice) => {
  let pricing = await prisma.pricingSettings.findFirst();

  if (!pricing) {
    pricing = await prisma.pricingSettings.create({
      data: {
        id: 1,
        worker_percentage: 70,
        monthly_subscription_price: 100,
        minimum_collection_weight: 1,
        maximum_collection_weight: 100,
      },
    });
  }

  const percentage = Number(pricing.worker_percentage || 70);

  return Number((servicePrice * percentage) / 100);
};

export const calculatePayment = (paymentMethod, servicePrice) => {
  if (paymentMethod === "MONTHLY") {
    return 0;
  }
  return servicePrice;
};