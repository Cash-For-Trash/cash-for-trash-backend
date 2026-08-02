import prisma from "../config/db.js";
import AppError from "../utils/app_error.js";

// create redemption request
export const makeRewardRedeemRequestService = async (userId, rewardId) => {
  try {
    // Check customer
    const customer = await prisma.customer.findUnique({
      where: {
        user_id: userId,
      },
    });

    if (!customer) {
      throw new AppError("Customer not found.", 404);
    }

    // Check reward
    const reward = await prisma.reward.findUnique({
      where: {
        reward_id: rewardId,
      },
    });

    if (!reward) {
      throw new AppError("Reward not found.", 404);
    }

    // Check points
    if (Number(customer.points) < Number(reward.required_points)) {
      throw new AppError("You don't have enough points.", 400);
    }

    // Check pending request
    const existingRequest = await prisma.rewardRedemption.findFirst({
      where: {
        user_id: userId,
        reward_id: rewardId,
        status: "PENDING",
      },
    });

    if (existingRequest) {
      throw new AppError(
        "You already have a pending redemption request.",
        400
      );
    }

    // Transaction
    const redemption = await prisma.$transaction(async (tx) => {
      const request = await tx.rewardRedemption.create({
        data: {
          user_id: userId,
          reward_id: rewardId,
          points_spent: reward.required_points,
          status: "PENDING",
        },
      });

      // Deduct points
      await tx.customer.update({
        where: {
          user_id: userId,
        },
        data: {
          points: {
            decrement: reward.required_points,
          },
        },
      });

      await tx.pointsTransaction.create({
        data: {
          user_id: userId,
          points: -Number(reward.required_points),
          reason: `Reward Redemption - ${reward.name}`,
        },
      });

      return request;
    });

    return redemption;
  } catch (error) {
    throw new AppError("Failed to create redemption request.", 500);
  }
};
// get all redemption requests
export const getAllRedemptionRequestsService = async () => {
  try {
    const redemptions = await prisma.rewardRedemption.findMany({
      include: {
        reward: true,
        customer: {
          include: {
            user: {
              select: {
                user_id: true,
                first_name: true,
                last_name: true,
                email: true,
                mobile: true,
              },
            },
          },
        },
      },
      orderBy: {
        created_at: "desc",
      },
    });

    return redemptions;
  } catch (error) {
    throw new AppError("Failed to fetch redemption requests.", 500);
  }
};


// accept redemption request
export const approveRedemptionRequestService = async (redemptionId) => {
  try {
    const redemption = await prisma.rewardRedemption.findUnique({
      where: {
        redemption_id: redemptionId,
      },
      include: {
        reward: true,
        customer: {
          include: {
            user: {
              select: {
                first_name: true,
                last_name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    if (!redemption) {
      throw new AppError("Redemption request not found.", 404);
    }

    if (redemption.status !== "PENDING") {
      throw new AppError("This request has already been processed.", 400);
    }

    const updatedRedemption = await prisma.rewardRedemption.update({
      where: {
        redemption_id: redemptionId,
      },
      data: {
        status: "APPROVED",
      },
    })

    return updatedRedemption;
  } catch (error) {
    throw new AppError("Failed to approve redemption request.", 500);
  }
};

// reject redemption request
export const rejectRedemptionRequestService = async (redemptionId) => {
  try {
    const redemption = await prisma.rewardRedemption.findUnique({
      where: {
        redemption_id: redemptionId,
      },
      include: {
        reward: true,
      },
    });

    if (!redemption) {
      throw new AppError("Redemption request not found.", 404);
    }

    if (redemption.status !== "PENDING") {
      throw new AppError("This request has already been processed.", 400);
    }

    const result = await prisma.$transaction(async (tx) => {
      // Update redemption status
      const updatedRedemption = await tx.rewardRedemption.update({
        where: {
          redemption_id: redemptionId,
        },
        data: {
          status: "REJECTED",
        },
      });

      // Return points to customer
      await tx.customer.update({
        where: {
          user_id: redemption.user_id,
        },
        data: {
          points: {
            increment: redemption.points_spent,
          },
        },
      });

      // Save transaction
      await tx.pointsTransaction.create({
        data: {
          user_id: redemption.user_id,
          points: Number(redemption.points_spent),
          reason: `Refund for rejected reward: ${redemption.reward.name}`,
        },
      });

      return updatedRedemption;
    });

    return result;
  } catch (error) {
    throw new AppError("Failed to reject redemption request.", 500);
  }
};


//get my redemptions
export const getMyRedemptionsService = async (userId) => {
  try {
    const redemptions = await prisma.rewardRedemption.findMany({
      where: {
        user_id: userId,
      },
      include: {
        reward: true,
      },
      orderBy: {
        created_at: "desc",
      },
    });
    return redemptions;
  } catch (error) {
    throw new AppError("Failed to fetch redemption requests.", 500);
  }
};


// history of points transaction

export const getPointsTransactionHistoryService = async (userId) => {
  try {
    const transactions = await prisma.pointsTransaction.findMany({
      where: {
        user_id: userId,
      },
      
      orderBy: {
        created_at: "desc",
      },
    });
    return transactions;
  } catch (error) {
    throw new AppError("Failed to fetch points transaction history.", 500);
  }
};





